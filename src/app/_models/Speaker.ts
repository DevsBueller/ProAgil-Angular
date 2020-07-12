import {SocialNetwork} from './SocialNetwork';
import {Event} from './Event';
export interface Speaker {
      id: number;
      name: string;
      miniCurriculum: string;
      imageUrl: string;
      tel: string;
      email: string;
      socialNetwork: SocialNetwork[];
      speakersEvents: Event[];
}