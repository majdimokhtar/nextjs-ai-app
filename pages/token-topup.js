import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Applayout from "../components/Applayout/Applayout"
import { getAppProps } from "../utils/getAppProps"

export default function TokenTopUp() {
  const handleClick = async () => {
    const result = await fetch(`/api/addTokens`, {
      method: "POST",
    })
    const json = await result.json()
    console.log("RESULT: ", json)
    window.location.href = json.session.url
  }
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Token Top-up</h1>
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
