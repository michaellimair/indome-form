import { FC, useState, useEffect } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { addSeconds, differenceInSeconds } from 'date-fns';

export const HomeRefreshButton: FC<{ onRefresh: () => void }> = ({
  onRefresh
}) => {
  const [nextRefreshTime] = useState<Date>(addSeconds(new Date(), 5));
  const [timeDisplay, setTimeDisplay] = useState<string>();

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(differenceInSeconds(nextRefreshTime, new Date()), 0);
      if (diff <= 0) {
        onRefresh();
      }
      setTimeDisplay(`${diff} seconds`)
    }, 100);

    return () => clearInterval(interval);
  }, [nextRefreshTime, onRefresh]);

  return (
    <Button style={{ marginTop: 16 }} onClick={onRefresh}>Refreshing in {timeDisplay}</Button>
  );
}
