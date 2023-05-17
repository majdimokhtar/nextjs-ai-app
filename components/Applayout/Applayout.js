
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCoins } from "@fortawesome/free-solid-svg-icons"
import Logo from "../Logo/Logo"
import { useContext, useEffect } from "react"
import PostsContext from "../../context/postContext"

const Applayout = ({
  children,
  availableTokens,
  posts: postsFromSSR,
  postId,
  postCreated,
}) => {
  const { user } = useUser()

  const { setPostsFromSSR, posts, getPosts, noMorePosts } =
    useContext(PostsContext)

  useEffect(() => {
    setPostsFromSSR(postsFromSSR)
    if (postId) {
      const exists = postsFromSSR.find((post) => post._id === postId)
      if (!exists) {
        getPosts({ getNewerPosts: true, lastPostDate: postCreated })
      }
    }
  }, [postsFromSSR, setPostsFromSSR, postId, postCreated, getPosts])
  // console.log("posts:", posts)

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-[#0081a7] px-2 ">
          <Logo />
          <Link href="/post/new" className="btn">
            New Post
          </Link>
          <Link href="/token-topup" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">{availableTokens} tokens availble</span>
          </Link>
        </div>
        <div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-[#0081a7] to-[#00afb9]">
          {posts &&
            posts.map((post) => {
              return (
                <Link
                  key={post._id}
                  href={`/post/${post._id}`}
                  className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${
                    postId === post._id ? "bg-white/20 border-white" : ""
                  }`}
                >
                  {post.topic}
                </Link>
              )
            })}
          {!noMorePosts && posts.length >= 5 && (
            <div
              onClick={() => {
                getPosts({ lastPostDate: posts[posts.length - 1]?.created })
              }}
              className="hover:underline text-sm text-slate-700 text-center cursor-pointer mt-4 font-bold"
            >
              Load more posts
            </div>
          )}
        </div>
        <div className="bg-[#00afb9] flex items-center gap-2 border-t border-white/30 h-20 px-2">
          {!!user ? (
            <>
              <div className="min-w-[50px]">
                <Image
                  priority={true}
                  src={user.picture}
                  width={50}
                  height={50}
                  alt={user.name}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <div>
              <Link href="/api/auth/login">Login</Link>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

export default Applayout
