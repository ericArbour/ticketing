import Link from 'next/link';

import { GetInitialPropsArg } from '../types/nextExtensions';
import { assertEvery, isTicket, Ticket } from '../types/main';

type Props = {
  tickets: Ticket[];
};

export default function Index({ tickets }: Props) {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
}

Index.getInitialProps = async ({ isoAxios }: GetInitialPropsArg) => {
  const { data } = await isoAxios.get('/api/tickets');
  assertEvery(isTicket, data);

  return { tickets: data };
};
