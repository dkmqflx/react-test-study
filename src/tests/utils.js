import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes } from "react-router-dom";
import { YoutubeApiContext } from "../context/YoutubeApiContext";

// 대부분의 컴포넌트가 라우트를 사용하기 때문에 아래처럼 만들어준다.
export function withRouter(routes, initialEntry = "/") {
  return (
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>{routes}</Routes>
    </MemoryRouter>
  );
}

// 아래 블로그 참고해서 설정해주면 테스팅하기 좋다
// https://tkdodo.eu/blog/testing-react-query

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ turns retries off
        retry: false,
      },
      logger: {
        log: console.log,
        warn: console.warn,
        error: () => {},
      },
    },
  });
}

// App.js보면 youtubeApiContext.Provider 로 감싸져 있는 것을 알 수 있다
// youtubeApiContext.Provider는 유투브를 사용할 수 있도록 인스턴스를 제공하는 역할
// 테스트할 때 이런 유투브 구현 사항까지 의존하지 않도록 한다
// 단위테스트 이기 때문에 컴포넌트 자체만 테스트 하도록, 나머지 의존 사항은 mocking 해준다

// youtube를 사용할 수 있도록 인스턴스를 제공하는 Provider
// 외부에서 가짜 mock 상태의 youtube를 전달받을 수 있도록 한다
export function withAllContexts(children, youtube) {
  const testClient = createTestQueryClient();
  return (
    <YoutubeApiContext.Provider value={{ youtube }}>
      <QueryClientProvider client={testClient}>{children}</QueryClientProvider>
    </YoutubeApiContext.Provider>
  );
}
