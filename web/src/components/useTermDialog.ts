import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function useTermDialog() {
  const [, setSearchParams] = useSearchParams();

  return useCallback(
    (termId: string) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.set("term", termId);
        return next;
      });
    },
    [setSearchParams],
  );
}
