import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import { formatAgo } from "../../util/date";
import VideoCard from "../VideoCard";
import userEvent from "@testing-library/user-event";

describe("VideoCard", () => {
  // prop으로 전달하는 데이터
  const video = {
    id: 1,
    snippet: {
      title: "title",
      channelId: "1",
      channelTitle: "channelTitle",
      publishedAt: new Date(),
      thumbnails: {
        medium: {
          url: "http://image/",
        },
      },
    },
  };
  const { title, channelTitle, publishedAt, thumbnails } = video.snippet;

  it("renders video item", () => {
    render(
      // VideoCard 컴포넌트 보면 li 태그 클릭 했을 때 다른 곳으로 이동하는 것 확인할 수 있다.
      // useNavigate를 사용하기 때문에 MemoryRouter로 감싸주어야 한다
      // react-router-dom 공식문서 Testing 항목에서 확인할 수 있다
      <MemoryRouter>
        <VideoCard video={video} />
      </MemoryRouter>
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
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<VideoCard video={video} />} />
          <Route
            path={`/videos/watch/${video.id}`}
            element={<LocationStateDisplay />}

            // 여기서는 VideoCard 컴포넌트를 테스트하고 단위 테스트 이므로
            // 실제 컴포넌트 클릭해서 navigate로 이동하게 되는 page/VideoDetail 컴포넌트가 아니라
            // 검증하기 위한 컴포넌트를 만들어준다
            // 컴포넌트가 보여지는 것 까지 테스트할 필요가 없기 때문이다
            // 즉, li태그의 onClick 함수를 보면 어떠한 컴포넌트로 이동해야 하는지에 대한 정보가 없기 때문에
            // 어떤 경로로 이동하고, 어떤 값이 전달되어서 보여져야 하는지만 확인하면 된다
          />
        </Routes>
      </MemoryRouter>
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
