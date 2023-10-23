export interface INotifySocketEvent {
  name: string;
  data: unknown;
  options?: {
    room?: string | string[];
  };
}
