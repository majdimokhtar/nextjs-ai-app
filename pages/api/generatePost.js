import { Configuration, OpenAIApi } from "openai"

export default async function handler(req, res) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openAi = new OpenAIApi(config)
  const { topic, keywords } = req.body
  const postContentResponse = await openAi.createCompletion({
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
        limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol..`,
      },
      // {
      //   role: "assistant",
      //   content: "generate me a blog post",
      // },
    ],
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
  console.log("response", postContentResponse.data.choices[0]?.message.content)
  // res.status(200).json({
  //   post: JSON.parse(response.data.choices[0]?.text.split("\n").join("")),
  // })
}
