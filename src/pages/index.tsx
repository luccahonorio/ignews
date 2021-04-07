import { GetStaticProps } from 'next'
import Head from 'next/head'
import styles from './home.module.scss'
import SubscribeButton from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

const formatPrice = (number) => new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
}).format(number)

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Ig.News</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>🐱‍🏍 Hey, welcome</span>
          <h1>News about <br /> the <span>React</span> world.</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {formatPrice(product.amount)} / month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1IbRevHazHqb4lkpEBkZebUD", {
    expand: ["product"]
  })

  const product = {
    priceId: price.id,
    amount: price.unit_amount / 100
  }

  return ({
    props: {
      product
    },
    revalidate: 60* 60 * 24 // 24 hours
  })
}