import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Applayout from "../../components/Applayout/Applayout"

export default function NewPost() {
  return <div>new post</div>
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <Applayout {...pageProps}>{page}</Applayout>
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}, // will be passed to the page component as props
  }
})
