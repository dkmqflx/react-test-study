/// <reference types="cypress" />
// 이렇게 작성해주어야지 타입 정보를 확인할 수 있따

import "@testing-library/cypress/add-commands";

// yarn start 하고
// yarn cypress 명령어 실행해서 확인해준다

describe("Youtube App", () => {
  beforeEach(() => {
    // 인터셉트해준다
    // mostPopular 라는 키워드가 들어가는 요청에 한해서는 실제 네트워크 통신하지 말고
    // 내가 정의해돈 fixture를 사용한다
    cy.intercept("GET", /(mostPopular)/g, {
      fixture: "popular.json",
    });
    cy.intercept("GET", /(search)/g, {
      fixture: "search.json",
    });

    // 뷰포트를 설정해서 화면을 넓혀서 볼수 있다
    cy.viewport(1200, 800);

    cy.visit("/"); // base url 설정해주었으므로 최상위 경로라는 것만 명시
  });

  it("renders", () => {
    cy.findByText("Youtube").should("exist");
  });

  it("shows popluar video first", () => {
    cy.findByText("Popular Video").should("exist");
  });

  // 키워드로 검색하는 경우
  it("searches by keyword", () => {
    cy.findByPlaceholderText("Search...").type("bts"); // bts라고 type을 한다
    cy.findByRole("button").click(); // 버튼의 역할을 하고 있는 것을 가져와서 클릭한다
    cy.findByText("Search Result1").should("exist");
  });

  // 디테일 페이지로 잘 가는지 확인
  it("goes to detail page", () => {
    cy.findAllByRole("listitem").first().click();
    cy.findByTitle("Popular Video").should("exist");
    cy.findByText("Popular Video").should("exist");
    cy.findByText("Search Result1").should("exist");
  });
});

/**
 * 이전 영상 까지는 e2e 테스트를 위한 cypress 작성
 *
 * 키워드로 검색했을 때 키워드에 대한 결과 잘 나오는지
 * 비디오 카드 클릭 했을 때 상세페이지로 잘 이동하는지 확인하고 싶다
 * 이를 확인하기 위해서는 똑같은 인풋에 대해 동일한 결과가 나오는지 확인해야 한다
 *
 * 하지만 지금은 실제 유투브 api를 사용하니까 동일한 인풋이 될 수 없기 때문에 결과가 계속 변경되고
 * 실제 네트워크 요청을 하기 때문에 flickier 하다
 * 즉, 유투부 서버가 불안정하면 우리의 테스트도 불안정해진다
 *
 * fixiture를 활용해서 이를 해결할 수 있다
 * 이 폴더에 우리의 mock 데이터를 추가해준다
 */
