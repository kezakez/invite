import { getNames } from './names';

describe('names', () => {
  it('should format names', () => {
    const data = [
      ['code', 'Keiran', 'Yes', 'SpecialDiet', 'special text', 'song'],
      ['code', 'David', 'No'],
      ['code', 'Ruby', 'No'],
      ['code', 'Peter', 'No'],
    ];
    expect(getNames(data)).toEqual('Keiran, David, Ruby and Peter');
  });
});
