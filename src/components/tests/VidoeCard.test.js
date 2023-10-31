import { render, screen } from "@testing-library/react";
import { Route, useLocation } from "react-router-dom";
import { formatAgo } from "../../util/date";
import VideoCard from "../VideoCard";
import userEvent from "@testing-library/user-event";

import { withRouter } from "../../tests/utils";
import { fakeVideo as video } from "../../tests/videos";

// 테스트 코드 보면 video 처럼 데이터를 준비해야 되는 것도 있고
// 매번 MemoryRouter도 선언해주어야 하니까
// 테스트 하는 함수는 두개 밖에 없는데 너무 길어지기 때문에 간략하게 리팩토링 해준다
// video 객체는 다른 컴포넌트에서도 사용될 수 있기 때문에 tests/video로 빼준다

describe("VideoCard", () => {
  const { title, channelTitle, publishedAt, thumbnails } = video.snippet;

  it("renders video item", () => {
    render(
      withRouter(<Route path="/" element={<VideoCard video={video} />} />)
    );

    // 확인하고 싶은 것 아래에 작성
    const image = screen.getByRole("img"); // img 태그 가져온다
    expect(image.src).toBe(thumbnails.medium.url);
    expect(image.alt).toBe(title);
    expect(screen.getByText(title)).toBeInTheDocument();

    // title을 가진 요소가, toBeInTheDocument : 문서 안에 있어야 한다
    expect(screen.getByText(channelTitle)).toBeInTheDocument();
    expect(screen.getByText(formatAgo(publishedAt))).toBeInTheDocument();
  });

  // navigate하는 것 테스트
  it("navigates to detailed video page with video state when clicked", async () => {
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

    // 그 다음 검증하는 코드 작성한다

    const card = screen.getByRole("listitem");
    // 컴포넌트는 li 태그로 감싸져 있는데, li 태그는 listitem이라는 role을 가지고 있다.
    // react testing 라이브러리에서 role로 검색하면 각각의 role을 확인할 수 있다.

    // 클릭 호출 되었을 때
    userEvent.click(card);

    // LocationStateDisplay 컴포넌트로 이동하므로,
    // 컴포넌트의 pre태그 안에 있는 텍스트가 화면에 보이는지 확인해야 한다

    // 아래처럼 코드 작성하면 테스트가 실패해서 아래처럼 waitFor을 사용하도록 코드를 수정해주었다.
    // expect(screen.getByText(JSON.stringify({ video }))).toBeInTheDocument();

    // 아래 코드가 린트 적용이 되면 최종적으로 아래 코드로 변환이 된다
    // await waitFor(() => expect(screen.getByText(JSON.stringify({ video }))).toBeInTheDocument();)
    await screen.findByText(JSON.stringify({ video }));
  });
});
