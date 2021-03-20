import { GetInitialPropsArg } from '../../types/nextExtensions';
import { assertEvery, isOrder, Order } from '../../types/main';

type Props = {
  orders: Order[];
};

export default function OrderIndex({ orders }: Props) {
  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

OrderIndex.getInitialProps = async ({ isoAxios }: GetInitialPropsArg) => {
  const { data } = await isoAxios.get('/api/orders');
  assertEvery(isOrder, data);

  return { orders: data };
};
