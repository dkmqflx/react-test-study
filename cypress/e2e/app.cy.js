/// <reference types="cypress" />
// 이렇게 작성해주어야지 타입 정보를 확인할 수 있따

import "@testing-library/cypress/add-commands";

// yarn start 하고
// yarn cypress 명령어 실행해서 확인해준다

describe("Youtube App", () => {
  beforeEach(() => {
    cy.visit("/"); // base url 설정해주었으므로 최상위 경로라는 것만 명시
  });

  it("renders", () => {
    cy.findByText("Youtube").should("exist");
  });
});
