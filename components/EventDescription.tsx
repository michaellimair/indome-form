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
      <p className="mb-2 font-bold text-3xl">INDOME is back!</p>
      <p className="mb-2">Get ready to spring into the euphoric night of your life!</p>

      <p className="mb-4 font-bold text-2xl">Indome and Social Room presents Euphoria</p>
      <p>Bring your move</p>
      <p>Step into the groove</p>
      <p className="mb-2">This is the night of delight</p>
      <p><span className="w-4 font-bold inline">Date:</span> {eventDate}</p>
      <p><span className="w-4 font-bold inline">Time:</span> {eventTime}</p>
      <p><span className="w-4 font-bold inline">Venue:</span> <ExternalLink rel="noopener noreferrer" target="_blank" href={venueLink}><b>{venueName}</b> ({venueAddress})</ExternalLink></p>

      <p className="mt-4">Ticket Price (includes 1 drink):</p>
      <ul className="list-disc ml-5 mb-4">
        <li><span className={!firstReleaseAvailable ? 'line-through' : ''}>Early Bird (limited tickets): 200 HKD</span> {!firstReleaseAvailable && <b>SOLD OUT</b>}</li>
        <li><span className={!secondReleaseAvailable ? 'line-through' : ''}>Main Round (limited tickets): 225 HKD</span> {!secondReleaseAvailable && <b>SOLD OUT</b>}</li>
        <li><span className={!available ? 'line-through' : ''}>Walk-in: 250 HKD</span> {!available && <b>SOLD OUT</b>}</li>
      </ul>

      <p className="font-bold">* Places are limited, so grab your spot fast! Your price will be allocated automatically on a first-come-first-serve basis.</p>
    </div>
  );
}