import "../styles/globals.css"
import { UserProvider } from "@auth0/nextjs-auth0/client"
import { Outfit, Spectral } from "@next/font/google"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
import { PostsProvider } from "../context/postContext"
config.autoAddCss = false

const outfit = Outfit({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: ["--font-outfit"],
})

const spectral = Spectral({
  weight: ["600"],
  subsets: ["latin"],
  variable: ["--font-spectral"],
})

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <UserProvider>
      <PostsProvider>
        <main className={`${outfit.variable} ${spectral.variable} font-body`}>
          {getLayout(<Component {...pageProps} />, pageProps)}
        </main>
      </PostsProvider>
    </UserProvider>
  )
}

export default MyApp
