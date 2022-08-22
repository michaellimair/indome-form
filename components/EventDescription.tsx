import { FC } from "react";
import { ExternalLink } from "./ExternalLink";

export const EventDescription: FC<{
  firstReleaseAvailable: boolean;
  secondReleaseAvailable: boolean;
}> = ({
  firstReleaseAvailable,
  secondReleaseAvailable,
}) => {
  return (
    <div className="mt-4 w-full">
      <p className="mb-2 font-bold text-3xl">INDOME is back!</p>
      <p className="mb-2">Enjoy the best of Indonesian and international music under the Autumn skies over a Hong Kong rooftop.</p>

      <p className="mb-4">Everyone is welcome! Whether you are Indonesian or not, spend this night like it's back in Indonesia.</p>
      <p><span className="w-4 font-bold inline">Date:</span> 17 September 2022</p>
      <p><span className="w-4 font-bold inline">Time:</span> 4:00 pm - 10:00 pm</p>
      <p><span className="w-4 font-bold inline">Venue:</span> <ExternalLink rel="noopener noreferrer" target="_blank" href="https://goo.gl/maps/GWkoo3fxLca3Sm7o8">13F, Tai Cheong (Liberal) Factory Building, 3 Wing Ming Street, Cheung Sha Wan, Hong Kong</ExternalLink></p>

      <p className="mt-4">Ticket Price (includes 2 drinks):</p>
      <ul className="list-disc ml-5 mb-4">
        <li className={!firstReleaseAvailable ? 'line-through' : ''}>First Release (limited tickets): 200 HKD</li>
        <li className={!secondReleaseAvailable ? 'line-through' : ''}>Second Release: 225 HKD</li>
        <li>Final Release: 250 HKD</li>
        <li>Walk-in: 300 HKD</li>
      </ul>

      <p className="font-bold">* Places are limited, so grab your spot fast! Your price will be allocated automatically on a first-come-first-serve basis.</p>
      <p>** You must provide a negative RAT result and be vaccinated three times in order to enter the venue. Failure to present a vaccination record will result in being denied entry and no refund will be provided.</p>
      <p>*** Walk-in starts from 6:00pm. For those who <b>registered online</b>, we <b>cannot guarantee your spot after 6:00 pm</b> as places are limited.</p>
    </div>
  );
}