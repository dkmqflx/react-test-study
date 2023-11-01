import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";
import { Route } from "react-router-dom";
import SearchHeader from "../SearchHeader";
import { withRouter } from "../../tests/utils";

// 1. 잘 보여지고 있는지 스냅샷 테스트를 통해서 정적인 상태를 확인해보겠다.
// 2. 검색 버튼을 클릭하면 해당 경로로 이동하는지 확인하겠다.
// 3. param으로 전달된 키워드가 input에 제대로 있는지 확인해본다

describe("SearchHeader", () => {
  // 1. 스냅샷 테스트 작성
  it("renders correctly", () => {
    const component = renderer.create(
      withRouter(<Route path="/" element={<SearchHeader />} />)
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  // 3. param으로 전달된 키워드가 입력 폼 안에 bts라는 키워드가 있는지 확인한다
  it("renders with keyword correctly", async () => {
    render(
      withRouter(<Route path="/:keyword" element={<SearchHeader />} />, "/bts")
    );
    expect(screen.getByDisplayValue("bts")).toBeInTheDocument();
  });

  // 2. 키
  it("navigates to results page on search button click", () => {
    const searchKeyword = "fake-keyword";

    render(
      withRouter(
        <>
          <Route path="/home" element={<SearchHeader />} />
          <Route
            path={`/videos/${searchKeyword}`}
            element={<p>{`Search result for ${searchKeyword}`}</p>}
          />
        </>,
        "/home"
      )
    );

    const searchButton = screen.getByRole("button");
    const searchInput = screen.getByRole("textbox");

    userEvent.type(searchInput, searchKeyword);
    userEvent.click(searchButton);

    expect(
      screen.getByText(`Search result for ${searchKeyword}`)
    ).toBeInTheDocument();
  });
});
