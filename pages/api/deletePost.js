import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import clientPromise from "../../lib/mongodb"
import { ObjectId } from "mongodb"

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const {
      user: { sub },
    } = await getSession(req, res)
    const client = await clientPromise
    const db = client.db("blogAi")
    const userProfile = await db.collection("users").findOne({
      auth0Id: sub,
    })

    const { postId } = req.body
    // console.log(req.body,"id")

    await db.collection("posts").deleteOne({
      userId: userProfile._id,
      _id: new ObjectId(postId),
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.log("ERROR TRYING TO DELETE A POST: ", error)
    res.status(500).json({ error: "Error occurred while deleting the post" })
  }
})
