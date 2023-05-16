import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import Applayout from "../../components/Applayout/Applayout"
import clientPromise from "../../lib/mongodb"
import { ObjectId } from "mongodb"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHashtag } from "@fortawesome/free-solid-svg-icons"
import { getAppProps } from "../../utils/getAppProps"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import PostsContext from "../../context/postContext"


export default function PostDetails(props) {
  // console.log(props,"props")
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { deletePost } = useContext(PostsContext)

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/deletePost`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ postId: props.postId }),
      })
      const json = await response.json()
      if (json.success) {
        deletePost(props.postId)
        console.log("post deleted")
        router.replace(`/post/new`)
      }
    } catch (e) {
      console.log(e , "something went wrong deleting a post")
    }
  }
  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-[#FAFAFA] rounded-sm">
          SEO Title and meta description
        </div>
        <div className="p-4 my-2 border boder-[#FAFAFA] rounded-md">
          <div className="text-[#073b4c] text-2xl font-bold">
            {props.title}{" "}
          </div>
          <div className="mt-2 ">{props.metaDescription}</div>
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-[#FAFAFA] rounded-sm">
          Keywords
        </div>
        <div className="flex flex-wrap pt-2 gap-1">
          {props.keywords.split(",").map((keyword, i) => {
            return (
              <div key={i} className="p-2 rounded-full bg-[#0081a7] text-white">
                <FontAwesomeIcon icon={faHashtag} className="mr-1" />
                {keyword}
              </div>
            )
          })}
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-[#FAFAFA] rounded-sm">
          Blog Post
        </div>
        <div dangerouslySetInnerHTML={{ __html: props.postContent || "" }} />
        <div className="my-4">
          {!showDeleteConfirm && (
            <button
              className="btn bg-red-600 hover:bg-red-700"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete post
            </button>
          )}
          {!!showDeleteConfirm && (
            <div>
              <p className="p-2 bg-red-300 text-center">
                Are you sure you want to delete this post? This action is
                irreversible
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn bg-stone-600 hover:bg-stone-700"
                >
                  cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="btn bg-red-600 hover:bg-red-700"
                >
                  confirm delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

PostDetails.getLayout = function getLayout(page, pageProps) {
  return <Applayout {...pageProps}>{page}</Applayout>
}
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx)
    const userSession = await getSession(ctx.req, ctx.res)
    const client = await clientPromise
    const db = client.db("blogAi")
    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub,
    })
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id,
    })
    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      }
    }
    return {
      props: {
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        postCreated: post.created.toString(),
        ...props,
      },
    }
  },
})
