/// <reference path='../../dist/index.d.ts' />

import fixture from "../fixtures/example.json";

describe("Uses fixtures", () => {
  beforeEach(() => {
    cy.fixture("example").as("fixture");
  });

  it("should load fixture", function () {
    expect(this.fixture.foo).to.equal("bar");
    expect(fixture.foo).to.equal("bar");
  });

  it(["wip"], "should load fixture when filtered", function () {
    expect(this.fixture.foo).to.equal("bar");
    expect(fixture.foo).to.equal("bar");
  });
});
