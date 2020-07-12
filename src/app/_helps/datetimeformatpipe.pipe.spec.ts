import { DatetimeformatpipePipe } from './datetimeformatpipe.pipe';
import { Constants } from '../util/constants';

describe('DatetimeformatpipePipe', () => {
  it('create an instance', () => {
    const pipe = new DatetimeformatpipePipe('dd/MM/yyy HH:mm');
    expect(pipe).toBeTruthy();
  });
});
