import { SocialNetwork } from './social-network';
import { EventModel } from './event-model';
export class Speaker {
  id: number;
  name: string;
  miniCurriculum: string;
  imageUrl: string;
  tel: string;
  email: string;
  socialNetwork: SocialNetwork[];
  speakersEvents: EventModel[];
}
