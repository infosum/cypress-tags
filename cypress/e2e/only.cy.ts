// sample start
describe('Describe block', () => {
  it.only('Run this test without tag', () => { });
  it.only('smoke', 'Run this test with tag', () => { });

  it('Skip this test without tag', () => { });
  it('smoke', 'Skip this test without tag', () => { });
});

describe.only('smoke', 'Only run this describe', () => {
  it.only('Run this test without tag', () => { });
  it.only('wip', 'Run this test with tag', () => { });

  it('Skip this test without tag', () => { });
  it('wip', 'Skip this test without tag', () => { });
});
// sample end
