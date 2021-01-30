import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@earbtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject = Subjects.ExpirationComplete as const;
}
