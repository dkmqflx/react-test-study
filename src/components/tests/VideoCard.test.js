import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";
import { Route, useLocation } from "react-router-dom";
import { withRouter } from "../../tests/utils";
import { fakeVideo as video } from "../../tests/videos";
import { formatAgo } from "../../util/date";
import VideoCard from "../VideoCard";

describe("VideoCard", () => {
  const { title, channelTitle, publishedAt, thumbnails } = video.snippet;

  // 아무런 타입을 명시하지 않았을 때
  it("renders grid type correctly", () => {
    const component = renderer.create(
      // 라우터 환경이므로 라우터로 감싸준다
      withRouter(<Route path="/" element={<VideoCard video={video} />} />)
    );

    expect(component.toJSON()).toMatchSnapshot();
    // 처음에는 작성 스냅샷된 파일이 없기 때문에 생성을 해준다
  });

  // 이렇게 하면 스냅샷이 생성되고, 만약 컴포넌트를 수정하면 테스트가 실패하는 것을 확인할 수 있다
  // 실제로 컴포넌트가 수정되어야 한다면 u를 눌러서 스냅샷을 업데이트를 시켜준다

  // 타입을 명시하지 않았을 때
  it("renders list type correctly", () => {
    const component = renderer.create(
      withRouter(
        <Route path="/" element={<VideoCard video={video} type="list" />} />
      )
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  // 위의 스냅샷 테스팅 하지 않고 아래처럼 type이 전달되도록 작성하면 커버리지가 100%이 되지만 이는 좋지 않은 방법
  // 왜냐하면 type이 list일때, list이지 않을 때를 검사해야 하는데.
  // expect 부분 보면 단순히 요소들이 보이는지만 확인하고 있기 때문이다
  // it("renders video item list type", () => {
  //   render(
  //     withRouter(
  //       <Route path="/" element={<VideoCard video={video} type="list" />} />
  //     )
  //   );

  //   const image = screen.getByRole("img");
  //   expect(image.src).toBe(thumbnails.medium.url);
  //   expect(image.alt).toBe(title);
  //   expect(screen.getByText(title)).toBeInTheDocument();
  //   expect(screen.getByText(channelTitle)).toBeInTheDocument();
  //   expect(screen.getByText(formatAgo(publishedAt))).toBeInTheDocument();
  // });

  // 스냅샷 테스트도 하고 아래와 같은 테스트도 함께 해줄 것인지는 선택사항
  it("renders video item", () => {
    render(
      withRouter(<Route path="/" element={<VideoCard video={video} />} />)
    );

    const image = screen.getByRole("img");
    expect(image.src).toBe(thumbnails.medium.url);
    expect(image.alt).toBe(title);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(channelTitle)).toBeInTheDocument();
    expect(screen.getByText(formatAgo(publishedAt))).toBeInTheDocument();
  });

  it("navigates to detailed video page with video state when clicked", () => {
    function LocationStateDisplay() {
      return <pre>{JSON.stringify(useLocation().state)}</pre>;
    }
    render(
      withRouter(
        <>
          <Route path="/" element={<VideoCard video={video} />} />
          <Route
            path={`/videos/watch/${video.id}`}
            element={<LocationStateDisplay />}
          />
        </>
      )
    );

    const card = screen.getByRole("listitem");
    userEvent.click(card);

    expect(screen.getByText(JSON.stringify({ video }))).toBeInTheDocument();
  });
});
