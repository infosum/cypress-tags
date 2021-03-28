// sample start
describe('Unskipped describe', () => {
  it.skip('Skipped test', () => { });
  it.skip('smoke', 'Skipped test', () => { });

  it('Unskipped test', () => { });
  it('smoke', 'Tagged test', () => { });
});

describe.skip('Skipped describe', () => {
  it.skip('Skipped test', () => { });
  it.skip('smoke', 'Skipped test', () => { });

  it('Unskipped test', () => { });
  it('smoke', 'Tagged test', () => { });
});
// sample end
