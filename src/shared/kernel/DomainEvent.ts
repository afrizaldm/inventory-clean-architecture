export interface DomainEvent {
  readonly occurredOn: Date;
  readonly eventId: string;
}
