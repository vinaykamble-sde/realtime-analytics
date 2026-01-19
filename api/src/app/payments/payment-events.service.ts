import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { PaymentEvent } from '@org/shared-types';

@Injectable()
export class PaymentEventsService {
  private readonly events$ = new Subject<PaymentEvent>();

  emit(event: PaymentEvent): void {
    this.events$.next(event);
  }

  get stream$() {
    return this.events$.asObservable();
  }
}
