import * as React from "react";
import "@testing-library/jest-dom";
import { screen, render } from "@testing-library/react";
import { withRouter } from "../../tests/utils";
import VideoDetail from "../VideoDetail";
import { Route } from "react-router-dom";
import ChannelInfo from "../../components/ChannelInfo";
import RelatedVideos from "../../components/RelatedVideos";
import { fakeVideo } from "../../tests/videos";

// page 안에 있는 컴포넌트 테스트
// 통합 테스트라고도 할 수 있다

// 테스팅 라이브러리는 shalow rendering이 없기 때문에 jest를 이용해서 mock을 해주어야 한다
jest.mock("../../components/ChannelInfo");
jest.mock("../../components/RelatedVideos");

describe("VideoDetail", () => {
  // 테스트가 끝날 때 마다 mock을 reset 해준다
  afterEach(() => {
    ChannelInfo.mockReset();
    RelatedVideos.mockReset();
  });

  it("renders video item details", () => {
    render(
      withRouter(<Route path="/" element={<VideoDetail />} />, {
        pathname: "/",
        state: { video: fakeVideo },
        key: "fake-key",
      })
    );

    const { title, channelId, channelTitle } = fakeVideo.snippet;
    expect(screen.getByTitle(title)).toBeInTheDocument();

    // 컴포넌트에 정확히 prop이 전달되었는지 검증하는 테스트
    // 스냅샷 테스트로 대체 가능하며 정답은 없다
    expect(RelatedVideos.mock.calls[0][0]).toStrictEqual({ id: fakeVideo.id });
    expect(ChannelInfo.mock.calls[0][0]).toStrictEqual({
      id: channelId,
      name: channelTitle,
    });
  });
});

/**
 *
 * Q.
 * 2:16에 ' ... snapshot test로 대체할 수 있다'는 말씀을 하시는데,
 * 이 부분은 RelatedVideos와 ChannelInfo 컴포넌트를 mocking하지 않고,
 *  VideoDetail 전체를 snapshot test로 대체할 수 있다고 말씀하신 거겠죠?
 * 맞다면, 이 때는 RelatedVideos와 ChannelInfo도 정상적으로 렌더링 되어야 하니,
 * fakeVideo와 fakeChannelInfo 정보를 각 컴포넌트로 보내주고 렌더링되는 것을 확인해야할 것 같은데,
 * 그럼 결국 RelatedVideos와 ChannelInfo의 렌더링 여부 테스트를 포함한 '통합 테스트'로 보는 것이 맞을까요?
 *
 * A.
 * mocking한 데이터를 사용해도 컴포넌트에서 어떤 UI (엄밀히 말하면 HTML)로 렌더링 되어야 하는지
 * 상세한 UI 테스트 (어떤 태그를 쓰고, 어떤 요소들이 HTML 태그로 표기 되어야 하는지)는 snapshot 테스트로 확인할 수 있다는 말이예요.
 * 제가 말한, 스탭샷 테스트는 이때 실제 사용자가 사용하는 환경에서,
 * 그러니깐 브라우저에서 렌더링 되는 UI를 확인하는 통합 테스트가 아닌,
 * HTML 태그로 어떻게 나오는지 문자열을 확인하는 테스트니 엄밀히 말하면 Unit Test로 보는게 더 적합할 것 같아요
 */
