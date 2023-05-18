import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Applayout from "../components/Applayout/Applayout"
import { getAppProps } from "../utils/getAppProps"
import axios from "axios"

export default function TokenTopUp() {
  const handleClick = async () => {
    try {
      const response = await axios.post("/api/addTokens")
      const json = response.data
      console.log("RESULT:", json)
      window.location.href = json.session.url
    } catch (error) {
      // Handle any error that occurs during the request
      console.error("Error adding tokens:", error)
    }
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Upgrade Your Token Balance</h1>
      <p className="text-gray-600 mb-8 text-xl">
        Add tokens to your account to unlock premium features and enhance your
        experience.
      </p>
      <button
        className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
        onClick={handleClick}
      >
        Add Tokens
      </button>
    </div>
  )
}

TokenTopUp.getLayout = function getLayout(page, pageProps) {
  return <Applayout {...pageProps}>{page}</Applayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx)
    return {
      props,
    }
  },
})
