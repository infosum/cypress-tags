/// <reference path='../../dist/index.d.ts' />

// sample start
describe('Unskipped describe', () => {
  xit('Skipped test', () => { });
  xit('smoke', 'Skipped test', () => { });

  it('Unskipped test', () => { });
  it('smoke', 'Tagged test', () => { });
});

xdescribe('smoke', 'Skipped describe', () => {
  xit('Skipped test', () => { });
  xit('wip', 'Skipped test', () => { });

  it('Unskipped test', () => { });
  it('wip', 'Tagged test', () => { });
});
// sample end
