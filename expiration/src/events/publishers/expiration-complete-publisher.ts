import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@fstickets/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
