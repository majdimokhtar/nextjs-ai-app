import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Applayout from "../components/Applayout/Applayout"
import { getAppProps } from "../utils/getAppProps"

export default function TokenTopUp() {
  const handleClick = async () => {
    await fetch(`/api/addTokens`, {
      method: "POST",
    })
    // const json = await result.json()
    // console.log("RESULT: ", json)
    // window.location.href = json.session.url
  }
  return (
    <div>
      <h1>this is the token topup</h1>
      <button className="btn" onClick={handleClick}>
        Add tokens
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
