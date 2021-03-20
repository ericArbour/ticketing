import { useState, useEffect, useRef } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';

import { GetInitialPropsArg } from '../../types/nextExtensions';
import { isOrder, assert, Order } from '../../types/main';
import { useUserContext } from '../../contexts/user-context';
import useRequest from '../../hooks/use-request';

type Props = {
  order: Order;
};

function getSecondsLeft(expiresAt: string): number {
  const then = new Date(expiresAt).getTime();
  const now = new Date().getTime();
  return Math.round((then - now) / 1000);
}

export default function OrderShow({ order }: Props) {
  const currentUser = useUserContext();
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getSecondsLeft(order.expiresAt),
  );
  const intervalIdRef = useRef<NodeJS.Timeout>();
  const { doRequest, error } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setSecondsLeft(getSecondsLeft(order.expiresAt));
    }, 1000);

    return () => {
      if (intervalIdRef.current) clearInterval();
    };
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0 && intervalIdRef.current)
      clearInterval(intervalIdRef.current);
  }, [secondsLeft]);

  if (secondsLeft <= 0) return <div>Order expired</div>;

  return (
    <div>
      Time left to pay: {secondsLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_kVD7xQGyewrAL4uu6uR77qpc"
        amount={order.ticket.price * 100}
        email={currentUser?.email}
      />
      {error}
    </div>
  );
}

OrderShow.getInitialProps = async ({ query, isoAxios }: GetInitialPropsArg) => {
  const { orderId } = query;
  const { data } = await isoAxios.get(`/api/orders/${orderId}`);
  assert(isOrder, data);

  return { order: data };
};
