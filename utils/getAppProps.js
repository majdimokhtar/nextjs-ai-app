import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "../lib/mongodb"

export const getAppProps = async (ctx) => {
  const userSession = await getSession(ctx.req, ctx.res)
  const client = await clientPromise
  const db = client.db("blogAi")
  const user = await db.collection("users").findOne({
    auth0Id: userSession.user.sub,
  })

  // If user doesn't exist, create a new user with availableTokens set to 10
  if (!user) {
    const newUser = {
      auth0Id: userSession.user.sub,
      availableTokens: 5,
    }
    await db.collection("users").insertOne(newUser)

    return {
      availableTokens: newUser.availableTokens,
      posts: [],
    }
  }

  const posts = await db
    .collection("posts")
    .find({
      userId: user._id,
    })
    .limit(5)
    .sort({
      created: -1,
    })
    .toArray()

  return {
    availableTokens: user.availableTokens,
    posts: posts.map(({ created, _id, userId, ...rest }) => ({
      _id: _id.toString(),
      created: created.toString(),
      ...rest,
    })),
    postId: ctx.params?.postId || null,
  }
}
