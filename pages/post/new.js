import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Applayout from "../../components/Applayout/Applayout"
import { useState } from "react"
import { useRouter } from "next/router"
import { getAppProps } from "../../utils/getAppProps"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBrain } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"

export default function NewPost() {
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [generating, setGenerating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGenerating(true)
    try {
      const response = await axios.post(
        "/api/generatePost",
        { topic, keywords },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const json = response.data
      console.log("res", json)
      if (json?.postId) {
        router.push(`/post/${json.postId}`)
      }
      // setPostContent(json.post.postContent)
    } catch (error) {
      setGenerating(false)
      console.log("There is an error while generating a post:", error)
    }
  }

  return (
    <div className="h-full overflow-hidden">
      {generating && (
        <div className="text-[#38a3a5] flex h-full animate-pulse w-fluss flex-col justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6>Generating...</h6>
        </div>
      )}
      {!generating && (
        <div className="w-full h-full flex flex-col overflow-auto">
          <form
            onSubmit={handleSubmit}
            className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200"
          >
            <div>
              <label>
                <strong>Generate a blog post on the topic of:</strong>
              </label>
              <textarea
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={80}
              />
            </div>
            <div>
              <label>
                <strong>Targeting the following keywords:</strong>
              </label>
              <textarea
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                maxLength={80}
              />
              <small className="block mb-2">
                Separate keywords with a comma
              </small>
            </div>
            <button
              type="submit"
              className="btn"
              disabled={!topic.trim() || !keywords.trim()}
            >
              Generate
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <Applayout {...pageProps}>{page}</Applayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx)
    if (!props.availableTokens) {
      return {
        redirect: {
          destination: "/token-topup",
          permanent: false,
        },
      }
    }
    return {
      props,
    }
  },
})
