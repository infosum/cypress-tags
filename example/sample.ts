/// <reference types='../' />
// sample start
describe('No tag tests', () => {
  it('I am a regular test', () => {});
});

describe(['wip'], 'WIP tests', () => {
  it('I will become a wip test', () => {});
  it(['feature'], 'I will also become a wip test', () => {});
  it(['wip'], 'I am already a wip test', () => {});
});
// sample end
