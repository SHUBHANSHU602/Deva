import { useEffect, useState } from "react";
import { getAttempts } from "../lib/storage";
import type { LocalAttempt } from "../types";

export function useAttempts(): LocalAttempt[] {
  const [attempts, setAttempts] = useState<LocalAttempt[]>(() => getAttempts());

  useEffect(() => {
    const refresh = () => setAttempts(getAttempts());
    window.addEventListener("storage", refresh);
    window.addEventListener("deva-attempts-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("deva-attempts-updated", refresh);
    };
  }, []);

  return attempts;
}
