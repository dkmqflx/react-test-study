import React from "react";
import { useYoutubeApi } from "../context/YoutubeApiContext";
import { useQuery } from "@tanstack/react-query";

export default function ChannelInfo({ id, name }) {
  const { youtube } = useYoutubeApi();
  const { data: url } = useQuery(
    ["channel", id],
    () => youtube.channelImageURL(id),
    { staleTime: 1000 * 60 * 5 }
  );
  // 리액트 쿼리 사용해서 외부에서 네트워크 통신해서 데이터 받아오고 있다
  // 유닛 테스트 할 때 이런 네트워크 통신 하는 것 좋지 않다.
  // 리액트 쿼리로 테스트 하는 방법으 공식문서의 testing 항목을 참조한다
  // https://tanstack.com/query/v4/docs/react/guides/testing
  return (
    <div className="flex my-4 mb-8 items-center">
      {url && <img className="w-10 h-10 rounded-full" src={url} alt={name} />}
      <p className="text-lg font-medium ml-2">{name}</p>
    </div>
  );
}
