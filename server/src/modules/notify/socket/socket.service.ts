import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { INotifySocketEvent } from '@common/types';

@Injectable()
export class NotifySocketService {
  private events = new Subject<INotifySocketEvent>();

  public emitEvent<T>(
    name: string,
    data: unknown,
    options: INotifySocketEvent['options'] = {},
  ) {
    this.events.next({ name, data, options });
  }

  public getEventsToEmit() {
    return this.events;
  }
}
