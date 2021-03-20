import { AssertionError } from 'assert';

export function isObject(a: unknown): a is object {
  return typeof a === 'object' && a !== null;
}

function isValidDate(str: string) {
  const date = new Date(str);
  return date instanceof Date && !isNaN(+date);
}

export type Ticket = {
  id: string;
  title: string;
  price: number;
};

export type Order = {
  id: string;
  expiresAt: string;
  ticket: Ticket;
  status: string;
};

export function isTicket(x: unknown): x is Ticket {
  if (!isObject(x)) return false;

  const xTicket = x as Ticket;

  return (
    typeof xTicket.id === 'string' &&
    typeof xTicket.title === 'string' &&
    typeof xTicket.price === 'number'
  );
}

export function isOrder(x: unknown): x is Order {
  if (!isObject(x)) return false;

  const xOrder = x as Order;

  return (
    typeof xOrder.id === 'string' &&
    typeof xOrder.expiresAt === 'string' &&
    isValidDate(xOrder.expiresAt) &&
    isTicket(xOrder.ticket) &&
    typeof xOrder.status === 'string'
  );
}

export function assert<T>(
  isT: (x: unknown) => x is T,
  x: unknown,
): asserts x is T {
  if (!isT(x)) {
    console.error('Value is not expected type');
    throw new AssertionError({ message: 'Value is not expected type' });
  }
}

export function assertEvery<T>(
  isT: (x: unknown) => x is T,
  xs: unknown[],
): asserts xs is T[] {
  if (!Array.isArray) throw new AssertionError({ message: 'Not an array' });
  if (!xs.every(isT))
    throw new AssertionError({
      message: 'Not all array members are of expected type',
    });
}
