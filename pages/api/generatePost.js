import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { Configuration, OpenAIApi } from "openai"
import clientPromise from "../../lib/mongodb"

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res)
  const client = await clientPromise
  const db = client.db("blogAi")
  const userProfile = await db.collection("users").findOne({
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
  if (!topic || !keywords) {
    res.status(422)
    return
  }
  if (topic.length > 40 || keywords.length > 40) {
    res.status(422)
    return
  }
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
        content: `Write a brief short SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
        The response should be formatted in SEO-friendly HTML, 
        limited to the following HTML tags: p, h1, h2, i, ul, li.`,
      },
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
        content: `Write a brief short SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
      The response should be formatted in SEO-friendly HTML, 
      limited to the following HTML tags: p, h1, h2, i, ul, li.`,
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
        content: `Write a brief short SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
      The response should be formatted in SEO-friendly HTML, 
      limited to the following HTML tags: p, h1, h2, i, ul, li.`,
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
  const post = await db.collection("posts").insertOne({
    postContent: postContent,
    title: title,
    metaDescription: metaDescription,
    topic,
    keywords,
    userId: userProfile._id,
    created: new Date(),
  })
  res.status(200).json({
    postId: post.insertedId,
  })
})
