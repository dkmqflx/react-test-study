import { screen, render } from "@testing-library/react";
import { Route } from "react-router-dom";
import { withAllContexts, withRouter } from "../../tests/utils";
import ChannelInfo from "../ChannelInfo";

describe("ChannelInfo", () => {
  // 오브젝트 인스턴스를 흉내내는 가짜 오브젝트
  const fakeYoutube = {
    channelImageURL: jest.fn(),
  };

  // 각각의 it이 실행된 다음 호출된다
  // mock을 reset 해준다
  afterEach(() => fakeYoutube.channelImageURL.mockReset());

  it("renders correctly", async () => {
    fakeYoutube.channelImageURL.mockImplementation(() => "url");

    render(
      withAllContexts(
        withRouter(
          <Route path="/" element={<ChannelInfo id="id" name="channel" />} />
        ),
        fakeYoutube
      )
    );

    // await waitFor(() => screen.getByText('channel'));
    await screen.findByText("channel");
  });
});

/**
 * withAllContexts의 내부에 있는 YoutubeApiContext.Provider를 사용하면
 * YoutubeClient 인스턴스를 만들게 되므로
 * 불가피하게 axios를 사용하게 되면서 나타는 에러
 * 그렇기 때문에 context에서 provider를 분리해준다
 */
