import { FC } from "react";
import { ExternalLink } from "./ExternalLink";
import { eventDate, eventTime, venueAddress, venueLink, venueName } from "../constants";

export const EventDescription: FC<{
  firstReleaseAvailable: boolean;
  secondReleaseAvailable: boolean;
  available: boolean;
}> = ({
  firstReleaseAvailable,
  secondReleaseAvailable,
  available,
}) => {
  return (
    <div className="mt-4 w-full">
      <p className="mb-2">Get ready to spring into the euphoric night of your life!</p>

      <p className="mb-4 font-bold text-2xl">InDome and Social Room presents Euphoria</p>
      <p>Bring your move</p>
      <p>Step into the groove</p>
      <p>Let the beat move your feet</p>
      <p className="mb-2">And euphoria take the lead</p>
      <p><span className="w-4 font-bold inline">Date:</span> {eventDate}</p>
      <p><span className="w-4 font-bold inline">Time:</span> {eventTime}</p>
      <p><span className="w-4 font-bold inline">Venue:</span> <ExternalLink rel="noopener noreferrer" target="_blank" href={venueLink}><b>{venueName}</b> ({venueAddress})</ExternalLink></p>

      <p className="mt-4">Ticket Price (includes 1 drink):</p>
      <ul className="list-disc ml-5 mb-4">
        <li><span className={!firstReleaseAvailable ? 'line-through' : ''}>First Release: 200 HKD</span> {!firstReleaseAvailable && <b>SOLD OUT</b>}</li>
        <li><span className={!secondReleaseAvailable ? 'line-through' : ''}>Second Release: 225 HKD</span> {!secondReleaseAvailable && <b>SOLD OUT</b>}</li>
        <li><span>Walk-in: 250 HKD</span></li>
      </ul>

      <p className="font-bold">* Places are limited, so grab your spot fast! Your price will be allocated automatically on a first-come-first-serve basis.</p>
    </div>
  );
}
