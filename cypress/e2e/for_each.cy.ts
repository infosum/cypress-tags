/// <reference path='../../dist/index.d.ts' />

describe('forEach', 'Uses a forEach', () => {
  let keys = [1, 2, 3];

  keys.forEach((key, i) => {
    it('forEach', `should get key ${key}`, () => {
      expect(key).to.equal(keys[i]);
    });
  });

  const testObject = {
    foo: 'bar',
    fizz: 'buzz',
  };
  let objectKeys = Object.keys(testObject);

  objectKeys.forEach((key) => {
    it(`should get key ${key}`, () => {
      expect(objectKeys).to.include(key);
    });
  });
});
