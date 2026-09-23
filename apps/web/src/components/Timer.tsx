import { Clock3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function Timer({ deadline, onExpire }: { deadline: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(() => deadline - Date.now());
  const onExpireRef = useRef(onExpire);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    hasExpiredRef.current = false;
    const update = () => {
      const next = deadline - Date.now();
      setRemaining(next);
      if (next <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpireRef.current();
      }
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [deadline]);

  const urgency = remaining <= 5 * 60_000 ? "danger" : remaining <= 15 * 60_000 ? "warning" : "safe";
  return (
    <div className={`timer timer-${urgency}`} aria-live="polite">
      <Clock3 size={17} />
      <span>{formatTime(remaining)}</span>
    </div>
  );
}
