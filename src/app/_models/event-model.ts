import{Lot} from './lot'
import {SocialNetwork} from './social-network';
import {Speaker} from './speaker';
export class EventModel {
  constructor() { }

  id: number;
  local: string;
  eventDate: Date;
  theme: string;
  qtPeoples: number;
  imagemUrl: string;
  tel: string;
  email: string;
  lots: Lot[];
  socialNetworks: SocialNetwork[];
  speakersEvents: Speaker[];
}
