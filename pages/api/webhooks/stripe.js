import Cors from "micro-cors"
import stripeInit from "stripe"
import clientPromise from "../../../lib/mongodb"

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
})

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY)

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { paymentIntentId, metadata } = req.body
    try {
      // Retrieve the payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      )

      // Process the payment and update your database accordingly
      const client = await clientPromise
      const db = client.db("blogAi")
      const auth0Id = metadata.sub
      console.log("AUTH0 ID:", auth0Id)
      const userProfile = await db.collection("users").updateOne(
        {
          auth0Id,
        },
        {
          $inc: {
            availableTokens: 10,
          },
          $setOnInsert: {
            auth0Id,
          },
        },
        {
          upsert: true,
        }
      )

      // Return a success response
      res.status(200).json({ success: true })
    } catch (error) {
      console.log("Error processing payment:", error)
      res.status(500).json({ error: "Payment processing failed" })
    }
  } else {
    res.status(405).end() // Method Not Allowed
  }
}

export default cors(handler)
