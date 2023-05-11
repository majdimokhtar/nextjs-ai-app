import { UserProvider } from "@auth0/nextjs-auth0/client"
import "../styles/globals.css"
import { Outfit, Spectral } from "@next/font/google"

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
      <main className={`${outfit.variable} ${spectral.variable} font-body`}>
        {getLayout(<Component {...pageProps} />, pageProps)}
      </main>
    </UserProvider>
  )
}

export default MyApp
