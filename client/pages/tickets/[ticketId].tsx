import Router from 'next/router';

import { GetInitialPropsArg } from '../../types/nextExtensions';
import { isTicket, isOrder, assert, Ticket } from '../../types/main';
import useRequest from '../../hooks/use-request';

type Props = {
  ticket: Ticket;
};

export default function TicketShow({ ticket }: Props) {
  const { doRequest, error } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order: unknown) => {
      assert(isOrder, order);
      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    },
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h3>Price: {ticket.price}</h3>
      {error}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
}

TicketShow.getInitialProps = async ({
  query,
  isoAxios,
}: GetInitialPropsArg) => {
  const { ticketId } = query;
  const { data } = await isoAxios.get(`/api/tickets/${ticketId}`);
  assert(isTicket, data);

  return { ticket: data };
};
