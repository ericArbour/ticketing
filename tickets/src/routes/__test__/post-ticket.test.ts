import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { getAuthCookie } from '../../test/utils';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const cookie = getAuthCookie();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  const cookie = getAuthCookie();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: '', price: 10 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ price: 10 })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  const cookie = getAuthCookie();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'asdf', price: -10 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'asdf' })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  const cookie = getAuthCookie();
  const title = 'asdf';
  const price = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(201);

  expect(response.body.price).toEqual(price);
  expect(response.body.title).toEqual(title);
  expect(response.body.userId).toBeTruthy();
  expect(response.body.id).toBeTruthy();

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].title).toEqual(title);
});

it('publishes an event', async () => {
  const cookie = getAuthCookie();
  const title = 'asdf';
  const price = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
