import { MemoryRouter, Routes } from "react-router-dom";

// 대부분의 컴포넌트가 라우트를 사용하기 때문에 아래처럼 만들어준다.
export function withRouter(routes, initialEntry = "/") {
  return (
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>{routes}</Routes>
    </MemoryRouter>
  );
}
