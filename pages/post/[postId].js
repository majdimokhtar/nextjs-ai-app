import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Home() {
    return <div >post</div>;
  }
  

  export const getServerSideProps = withPageAuthRequired(() => {
    return {
      props: {}, // will be passed to the page component as props
    }
  })