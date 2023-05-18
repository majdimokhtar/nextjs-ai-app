import axios from "axios"
import React, { useCallback, useReducer, useState } from "react"

const PostsContext = React.createContext({})

function postsReducer(state, action) {
  switch (action.type) {
    case "addPosts": {
      const newPosts = [...state]
      action.posts.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id)
        if (!exists) {
          newPosts.push(post)
        }
      })
      return newPosts
    }
    case "deletePost": {
      const newPosts = []
      state.forEach((post) => {
        if (post._id !== action.postId) {
          newPosts.push(post)
        }
      })
      return newPosts
    }
    default:
      return state
  }
}

export const PostsProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postsReducer, [])
  const [noMorePosts, setNoMorePosts] = useState(false)

  const deletePost = useCallback((postId) => {
    dispatch({
      type: "deletePost",
      postId,
    })
  }, [])

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    dispatch({
      type: "addPosts",
      posts: postsFromSSR,
    })
  }, [])

  const getPosts = useCallback(
    async ({ lastPostDate, getNewerPosts = false }) => {
      try {
        const response = await axios.post(
          "/api/getPosts",
          {
            lastPostDate,
            getNewerPosts,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        const postsResult = response.data.posts || []
        if (postsResult.length < 5) {
          setNoMorePosts(true)
        }
        dispatch({
          type: "addPosts",
          posts: postsResult,
        })
      } catch (error) {
        // Handle any error that occurs during the request
        console.error("Error fetching posts:", error)
      }
    },
    []
  )

  return (
    <PostsContext.Provider
      value={{ posts, setPostsFromSSR, getPosts, noMorePosts, deletePost }}
    >
      {children}
    </PostsContext.Provider>
  )
}
export default PostsContext
