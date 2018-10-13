import { getNames } from './names';

describe('names', () => {
  it('should format 4 names', () => {
    const data = [
      ['code', 'Keiran', 'Yes', 'SpecialDiet', 'special text', 'song'],
      ['code', 'David', 'No'],
      ['code', 'Ruby', 'No'],
      ['code', 'Peter', 'No'],
    ];
    expect(getNames(data)).toEqual('Keiran, David, Ruby & Peter');
  });
  it('should format 1 name', () => {
    const data = [
      ['code', 'Keiran', 'Yes', 'SpecialDiet', 'special text', 'song'],
    ];
    expect(getNames(data)).toEqual('Keiran');
  });
  it('should format 2 names', () => {
    const data = [
      ['code', 'Keiran', 'Yes', 'SpecialDiet', 'special text', 'song'],
      ['code', 'David', 'No'],
    ];
    expect(getNames(data)).toEqual('Keiran & David');
  });
});
