import {Lot} from './Lot';
import {SocialNetwork} from './SocialNetwork';
import {Speaker} from './Speaker';
export interface Event {
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
