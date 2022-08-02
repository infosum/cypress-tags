/// <reference path='../../dist/index.d.ts' />

// sample start
const foo = 'bar';

describe(`Run tests with no tags ${foo}`, () => {
  it(`I am a regular test`, () => { });
  it(`I am a regular test ${foo}`, () => { });
  it('smoke', `I am a smoke test ${foo}`, () => { });
  it('wip', `I am a wip test ${foo}`, () => { });
});

describe('wip', `Run tests with wip tag ${foo}`, () => {
  it(`I am a regular test ${foo}`, () => { });
  it('smoke', `I am a smoke test ${foo}`, () => { });
  it('wip', `I am a wip test ${foo}`, () => { });
});
// sample end
