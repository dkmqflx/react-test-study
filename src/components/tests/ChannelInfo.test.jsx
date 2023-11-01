import { screen, render } from "@testing-library/react";
import { Route } from "react-router-dom";
import { withAllContexts, withRouter } from "../../tests/utils";
import ChannelInfo from "../ChannelInfo";

describe("ChannelInfo", () => {
  it("renders correctly", async () => {
    // ChannelInfo 컴포넌트의 useQuery에서
    // () => youtube.channelImageURL(id)를 사용하고 있으므로 해당 부분만 mocking 해주면 된다
    const fakeYoutube = {
      channelImageURL: jest.fn(),
    };

    afterEach(() => fakeYoutube.channelImageURL.mockReset());
    fakeYoutube.channelImageURL.mockImplementation(() => "url");

    render(
      withAllContexts(
        withRouter(
          <Route
            path="/"
            element={<ChannelInfo id="id" name="channel"></ChannelInfo>}
          ></Route>
        ),
        fakeYoutube
      )
    );

    await screen.findByText("channel");

    // 여기까지만 하고 테스트 하면 axios를 찾을 수 없다는 에러 나타난다
    // axios를 테스트 라이브러리에서 사용하면 이러한 에러가 나타난다
  });
});
