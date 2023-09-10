import { FC } from "react";
import { ExternalLink } from "./ExternalLink";
import { eventDate, eventTime, venueAddress, venueLink, venueName } from "../constants";
import { EventStatus } from "../customTypes";
import clsx from "clsx";

export const EventDescription: FC<{
  status: EventStatus;
}> = ({
  status
}) => {
  return (
    <div className="mt-4 w-full">
      <p className="mb-2">Embrace the night and step into the moonlit realm</p>

      <p className="mb-4 font-bold text-2xl">Indome and Kroma present Lunar Fiesta, a Mid-Autumn live music special</p>
      <p><span className="w-8 font-bold inline-block text-center" aria-label="Date">🗓</span> {eventDate}</p>
      <p><span className="w-8 font-bold inline-block text-center" aria-label="Time">🕥</span> {eventTime}</p>
      <p className="mb-4"><span className="w-8 font-bold inline-block text-center" aria-label="Venue">📍</span> <b>{venueName}</b> ({venueAddress}) [<ExternalLink rel="noopener noreferrer" target="_blank" href={venueLink}>View in Google Maps</ExternalLink>]</p>

      <p>Performance by Filosopi Tipsy band and Michael Lim ✨</p>

      <p className="mt-4">Ticket Price (includes 1 drink):</p>
      <ul className="list-disc ml-5 mb-4">
        {status.tierInfo.map(({ tier, isSalesStarted, pendingAvailable, title, price }) => {
          // If ticket sales is not started yet, show as available
          const soldOut = isSalesStarted && !pendingAvailable;
          return (
            <li key={tier}>
              <span className={clsx({ ['line-through']: soldOut })}>{title}: {price / 100} HKD</span> {soldOut && <b className="text-red-800 dark:text-red-400">SOLD OUT</b>}
            </li>
          );
        })}
        {/* Hardcoding walk in, whatever... */}
        <li><span>Walk-in: 300 HKD</span></li>
      </ul>

      <p className="font-bold mb-4"><a className="underline" href="https://ig.me/m/indome.hk" target="_blank" rel="noppener noreferrer">DM us on Instagram</a> for table reservation!</p>

      <p>* Places are limited, so <span className="font-bold">grab your spot fast</span>! Your price will be allocated automatically on a first-come-first-serve basis.</p>
    </div>
  );
}
