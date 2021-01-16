import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@earbtickets/common';

import { postOrderRouter } from './routes/post-order';
import { getOrderRouter } from './routes/get-order';
import { getOrdersRouter } from './routes/get-orders';
import { deleteOrderRouter } from './routes/delete-order';

const app = express();
// Needed so express will trust secure traffic behind ingress nginx proxy
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    // Do not encrypt cookie (though it will be base64 encoded)
    signed: false,
    // Require https
    secure: process.env.NODE_ENV !== 'test',
  }),
);
app.use(currentUser);

app.use(postOrderRouter);
app.use(getOrderRouter);
app.use(getOrdersRouter);
app.use(deleteOrderRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
