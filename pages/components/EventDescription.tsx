import { FC } from "react";
import { ExternalLink } from "./ExternalLink";

export const EventDescription: FC = () => {
  return (
    <div className="mt-4 w-full">
      <p className="mb-2">Good music only!</p>
      <p className="mb-2">Enjoy the best of Indonesian and international music this Christmas.</p>

      <p className="mb-4">Everyone is welcome! Whether you are Indonesian or not, spend this night like it's back in Indonesia.</p>
      <p><span className="w-4 font-bold inline">Date:</span> 17 September 2022</p>
      <p><span className="w-4 font-bold inline">Time:</span> 4:00 pm - 10:00 pm</p>
      <p><span className="w-4 font-bold inline">Venue:</span> <ExternalLink rel="noopener noreferrer" target="_blank" href="https://g.page/thehivelaichikok?share">The Hive Lai Chi Kok</ExternalLink></p>

      <p className="mt-4">Ticket Price (includes 2 drinks):</p>
      <ul className="list-disc ml-5 mb-4">
        <li>First Release (limited tickets): 200 HKD</li>
        <li>Second Release: 220 HKD</li>
        <li>Final Release: 250 HKD</li>
        <li>Walk-in (17 Sep): 300 HKD</li>
      </ul>

      <p>* Places are limited, so grab your spot fast!</p>
      <p>** You must provide a negative RAT result and be vaccinated three times in order to enter the venue. Failure to present a vaccination record will result in being denied entry and no refund will be provided.</p>
      <p>*** Walk-in starts from 7:00pm. For those who registered online, we cannot guarantee your spot after 7:00 pm as places are limited.</p>
    </div>
  );
}