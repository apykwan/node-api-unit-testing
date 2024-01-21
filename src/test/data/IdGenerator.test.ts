import { generateRandomId } from '../../app/data/IdGenerator';

describe('IDGenerator test suite', () => {
  it('shoudl return a random string', () => {
    const randomId = generateRandomId();
    expect(randomId.length).toBe(20);
  });
});