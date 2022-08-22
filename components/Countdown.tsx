import { FC, useEffect, useMemo, useState } from "react";
import { IOrder } from "../global";

export const Countdown: FC<{ order: IOrder }> = ({ order }) => {
  const [remaining, setRemaining] = useState<number>(new Date(order.expiresAt).valueOf() - new Date().valueOf());

  const secs = useMemo(() => Math.floor(remaining / 1000) % 60, [remaining]);
  const mins = useMemo(() => Math.floor(remaining / 1000 / 60), [secs]);

  useEffect(() => {
    const interval = setInterval(() => {
      const remainMs = new Date(order.expiresAt).valueOf() - new Date().valueOf();
      if (remainMs > 0) {
        setRemaining(remainMs);
      } else {
        window.location.replace('/');
      }
    }, 250);
    return () => clearInterval(interval);
  }, [order.expiresAt])

  return (
    <div className="w-full justify-between flex flex-row py-4">
      <div className="font-bold">
        Time Left:
      </div>
      <div className="font-bold">
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </div>
    </div>
  )
}