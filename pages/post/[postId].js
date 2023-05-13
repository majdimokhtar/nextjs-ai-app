import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import Applayout from "../../components/Applayout/Applayout"
import clientPromise from "../../lib/mongodb"
import { ObjectId } from "mongodb"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHashtag } from "@fortawesome/free-solid-svg-icons"
import { getAppProps } from "../../utils/getAppProps"

export default function PostDetails(props) {
  console.log(props)
  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-[#FAFAFA] rounded-sm">
          SEO Title and meta description
        </div>
        <div className="p-4 my-2 border boder-[#FAFAFA] rounded-md">
          <div className="text-teal-800 text-2xl font-bold">{props.title} </div>
          <div className="mt-2 ">{props.metaDescription}</div>
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-[#FAFAFA] rounded-sm">
          Keywords
        </div>
        <div className="flex flex-wrap pt-2 gap-1">
          {props.keywords.split(",").map((keyword, i) => {
            return (
              <div key={i} className="p-2 rounded-full bg-slate-800 text-white">
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
        ...props,
      },
    }
  },
})
