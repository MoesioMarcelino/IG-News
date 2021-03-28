import { useSession, signIn } from 'next-auth/client';
import { getStripeJS } from '../../services/stripe-js';

import { api } from '../../services/api';

import styles from './styles.module.scss';
import Stripe from 'stripe';

interface SubscribeButtonProps {
  priceId: string;
}

interface StripeResponse extends Stripe.Response<Stripe.Checkout.Session> {
  sessionId: string;
}

export function SubscribeButton({}: SubscribeButtonProps) {
  const [session] = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    try {
      const {
        data: { sessionId },
      } = await api.post<StripeResponse>('/subscribe');

      const stripe = await getStripeJS();

      await stripe.redirectToCheckout({ sessionId });
    } catch ({ message }) {
      alert(message);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
