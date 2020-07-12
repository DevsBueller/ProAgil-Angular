export interface Lot {
  id: number;
  name: string;
  Price: number;
  beginDate?: Date;
  finalDate: Date;
  quantity: number;
  eventId: number;
}
