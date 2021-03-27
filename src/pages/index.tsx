import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { SignInButton } from '../components/SignInButton';
import { SubscribeButton } from '../components/SubscribeButton';

import { stripe } from '../services/stripe';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product: { priceId, amount } }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>🎉️ Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>from {amount} / month</span>
          </p>

          <SubscribeButton priceId={priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { id, unit_amount } = await stripe.prices.retrieve(
    'price_1IZPE8Lffh4gxGTgPcAv3TfN'
  );

  const product = {
    priceId: id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(unit_amount / 100),
  };

  return {
    props: {
      product,
    },
  };
};
