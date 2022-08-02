export enum Tag {
  'WIP' = 0,
  'REGRESSION' = 1,
  'SMOKE' = 2,
  'FEATURE' = 3,
};

// sample start
describe('Run tests with no tags', () => {
  it('I am a regular test', () => {});
});

describe([Tag.WIP], 'Run tests with tagged describe block', () => {
  it('I will become a wip test', () => {});
  it([Tag.FEATURE], 'I will also become a wip test', () => {});
  it([Tag.WIP], 'I am already a wip test', () => {});
  it.skip('I should always be skipped', () => {});
});

describe('Run tests with tagged it statements', () => {
  it([Tag.WIP], 'I am a wip test', () => {});
  it([Tag.REGRESSION, Tag.SMOKE], 'I am a smoke & regression test', () => {});
  it([Tag.REGRESSION], 'I am a regression test', () => {});
  it([Tag.SMOKE], 'I am a smoke test', () => {});
  it([Tag.SMOKE, Tag.WIP], 'I am a wip smoke test', () => {});
  it.skip([Tag.SMOKE, Tag.WIP, Tag.REGRESSION], 'I have tags and should always be skipped', () => {});
});
// sample end
