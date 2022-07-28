// sample start
describe('Unskipped describe', () => {
  it.skip('Skipped test', () => { });
  it.skip('smoke', 'Skipped test', () => { });

  it('Unskipped test', () => { });
  it('smoke', 'Tagged test', () => { });
});

describe.skip('smoke', 'Skipped describe', () => {
  it.skip('Skipped test', () => { });
  it.skip('wip', 'Skipped test', () => { });

  it('Unskipped test', () => { });
  it('wip', 'Tagged test', () => { });
});
// sample end
