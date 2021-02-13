import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@earbtickets/common';

import { postPaymentRouter } from './routes/post-payment';

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

app.use(postPaymentRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
