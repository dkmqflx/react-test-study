import { render, screen, waitFor } from "@testing-library/react";
import { Route } from "react-router-dom";
import { withAllContexts, withRouter } from "../../tests/utils";
import ChannelInfo from "../ChannelInfo";

describe("ChannelInfo", () => {
  const fakeYoutube = {
    channelImageURL: jest.fn(),
  };

  afterEach(() => fakeYoutube.channelImageURL.mockReset());

  // 스냅샷 테스트로 변경해주었다.
  it("renders correctly", async () => {
    fakeYoutube.channelImageURL.mockImplementation(() => "url");
    const { asFragment } = renderChannelInfo();

    // 바로 스냅샷 테스트 진행하면, 위의 url 받아오는 부분이 비동기이기 때문에
    // url이 없어서 이름만 나온다
    // url이 있을때 까지 기다려야 하기 때문에 render를 먼저 하고

    // 이미지가 나타날 때 까지 기다렸다가
    await screen.findByRole("img");

    // 반환 받은 fragment로 스냅샷을 만든다
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders without URL", () => {
    fakeYoutube.channelImageURL.mockImplementation(() => {
      throw new Error("error");
    });
    renderChannelInfo();

    expect(screen.queryByRole("img")).toBeNull();
  });

  // 정적 테스트인 스냅샷 테스트를 위해서 해주지만
  // 명시적으로 나타내고 싶다면 테스트 추가해주어도 된다
  it("renders with URL", async () => {
    fakeYoutube.channelImageURL.mockImplementation(() => "url");

    renderChannelInfo();

    await screen.findByRole("img");
  });

  function renderChannelInfo() {
    return render(
      withAllContexts(
        withRouter(
          <Route path="/" element={<ChannelInfo id="id" name="channel" />} />
        ),
        fakeYoutube
      )
    );
  }
});
