import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import GuessInput from '@components/GuessInput'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Who's 57?</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Who's 57?" />
        <p className="description">
          Guess who's 57 years old to win.
        </p>
        <GuessInput />
      </main>

      <Footer />
    </div>
  )
}
