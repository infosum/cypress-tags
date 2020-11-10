/// <reference types='../' />
// sample start
describe('Run tests with no tags', () => {
  it('I am a regular test', () => {});
});

describe(['wip'], 'Run tests with tagged describe block', () => {
  it('I will become a wip test', () => {});
  it(['feature'], 'I will also become a wip test', () => {});
  it(['wip'], 'I am already a wip test', () => {});
  it.skip('I should always be skipped', () => {});
});

describe('Run tests with tagged it statements', () => {
  it(['wip'], 'I am a wip test', () => {});
  it(['regression', 'smoke'], 'I am a smoke & regression test', () => {});
  it(['regression'], 'I am a regression test', () => {});
  it(['smoke'], 'I am a smoke test', () => {});
  it(['smoke', 'wip'], 'I am a wip smoke test', () => {});
  it.skip(['smoke', 'wip', 'regression'], 'I have tags and should always be skipped', () => {});
});
// sample end
