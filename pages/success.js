import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Applayout from "../components/Applayout/Applayout"
import { getAppProps } from "../utils/getAppProps"

export default function Success() {
  return (
    <div className="text-center mt-8">
      <h1 className="text-3xl font-bold">Thank you for your purchase!</h1>
    </div>
  )
}

Success.getLayout = function getLayout(page, pageProps) {
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
