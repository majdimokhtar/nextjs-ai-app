import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Applayout from "../../components/Applayout/Applayout"
import { useState } from "react"

export default function NewPost() {
  const [postContent, setPostContent] = useState("")
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [generating, setGenerating] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch("/api/generatePost", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ topic, keywords }),
    })
    const json = await response.json()
    console.log("res", json.post.postContent)
    setPostContent(json.post.postContent)
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
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
          <small className="block mb-2">Separate keywords with a comma</small>
        </div>
        <div></div>
        <button type="submit" className="btn">
          Generate
        </button>
      </form>

      <div
        dangerouslySetInnerHTML={{ __html: postContent }}
        className="max-w-screen-sm p-10"
      />
    </>
  )
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <Applayout {...pageProps}>{page}</Applayout>
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}, // will be passed to the page component as props
  }
})
