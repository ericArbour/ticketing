import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@earbtickets/common';

import { postTicketRouter } from './routes/post-ticket';
import { getTicketRouter } from './routes/get-ticket';
import { getTicketsRouter } from './routes/get-tickets';
import { putTicketRouter } from './routes/put-ticket';

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

app.use(postTicketRouter);
app.use(getTicketRouter);
app.use(getTicketsRouter);
app.use(putTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
