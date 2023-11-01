import NotFound from "../NotFound";
import renderer from "react-test-renderer";
import { withRouter } from "../../tests/utils";
import { Route } from "react-router-dom";

// 우리가 지정한 경로 이외로 갔을 때 테스트를 하는 것은 우리 코드를 테스트하는 것이 아니라
// react router 자체를 테스트 하는 것 같다
// 즉, 라이브러리의 역할이다
// 그래서 해당 컴포넌트 내용을 검증하는 테스트만 작성했다.
describe("NotFound", () => {
  it("renders  correctly", () => {
    const component = renderer.create(
      withRouter(<Route path="/" element={<NotFound />} />)
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
