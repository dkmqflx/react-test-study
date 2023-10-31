import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { formatAgo } from "../../util/date";
import VideoCard from "../VideoCard";

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
});
