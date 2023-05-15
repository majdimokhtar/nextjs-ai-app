import React, { useCallback, useState } from "react"

const PostsContext = React.createContext({})

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    setPosts(postsFromSSR)
  }, [])
  const getPosts = useCallback(async ({ lastPostDate }) => {
    const results = await fetch("/api/getPosts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ lastPostDate }),
    })
    const json = await results.json()
    const porsResults = json.posts || []
    console.log(porsResults)
    setPosts((value) => {
      const newPosts = [...value]
      porsResults.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id)
        if (!exists) {
          newPosts.push(post)
        }
      })
      return newPosts
    })
  }, [])
  return (
    <PostsContext.Provider value={{ posts, setPostsFromSSR, getPosts }}>
      {children}
    </PostsContext.Provider>
  )
}

export default PostsContext
