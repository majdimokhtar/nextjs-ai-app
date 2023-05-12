import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { Configuration, OpenAIApi } from "openai"
import clientPromise from "../../lib/mongodb"

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = getSession(req, res)
  const client = await clientPromise
  const db = client.db("blogAi")
  const userProfile = await db.collection("users").updateOne({
    auth0Id: user.sub,
  })
  if (!userProfile?.availableTokens) {
    res.status(401)
    return
  }
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openAi = new OpenAIApi(config)
  const { topic, keywords } = req.body
  const postContentResponse = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "You are a blog post generator",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
        The response should be formatted in SEO-friendly HTML, 
        limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`,
      },
      // {
      //   role: "assistant",
      //   content: "generate me a blog post",
      // },
    ],
  })
  const postContent = postContentResponse.data.choices[0]?.message.content || ""

  const titleResponse = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a blog post generator.",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
      The response should be formatted in SEO-friendly HTML, 
      limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content: "Generate appropriate title tag text for the above blog post",
      },
    ],
    temperature: 0,
  })

  const metaDescriptionResponse = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a blog post generator.",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
      The response should be formatted in SEO-friendly HTML, 
      limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content:
          "Generate SEO-friendly meta description content for the above blog post",
      },
    ],
    temperature: 0,
  })
  const title = titleResponse.data.choices[0]?.message.content || ""
  const metaDescription =
    metaDescriptionResponse.data.choices[0]?.message.content || ""

  console.log("POST CONTENT: ", postContent)
  console.log("TITLE: ", title)
  console.log("META DESCRIPTION: ", metaDescription)

  await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -1,
      },
    }
  )
  const parsed = JSON.parse(response.data.choices[0]?.text.split("\n").join(""))
  const post = await db.collection("posts").insertOne({
    postContent: parsed?.postContent,
    title: parsed?.title,
    metaDescription: parsed?.metaDescription,
    topic,
    keywords,
    userId: userProfile._id,
    created: new Date(),
  })

  // const response = await openAi.createCompletion({
  //   model: "text-davinci-003",
  //   temperature: 0,
  //   max_tokens: 3600,
  //   prompt: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
  //   The content should be formatted in SEO-friendly HTML.
  //   The response must also include appropriate HTML title and meta description content.
  //   The return format must be stringified JSON in the following format:
  //   {
  //     "postContent": post content here
  //     "title": title goes here
  //     "metaDescription": meta description goes here
  //   }`,
  // })
  // console.log("response", postContentResponse.data.choices[0]?.message.content)
  res.status(200).json({
    post: JSON.parse(response.data.choices[0]?.text.split("\n").join("")),
  })
  // res.status(200).json({
  //   post: {
  //     postContent,
  //     title,
  //     metaDescription,
  //   },
  // })
})
