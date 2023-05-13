import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCoins } from "@fortawesome/free-solid-svg-icons"
import Logo from "../Logo/Logo"

const Applayout = ({ children, availableTokens, posts, postId }) => {
  const { user } = useUser()
  console.log("user:", user)
  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2 ">
          <Logo />
          <Link href="/post/new" className="btn">
            New Post
          </Link>
          <Link href="/token-topup" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">{availableTokens} tokens availble</span>
          </Link>
        </div>
        <div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          {posts.map((post) => {
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
        </div>
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-white/30 h-20 px-2">
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
