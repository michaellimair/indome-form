import { FC } from "react";
import { ExternalLink } from "./ExternalLink";
import { TextInput } from "./TextInput";

export const EventForm: FC = () => {
  return (
    <form className="w-full mt-4" action="/orders/:orderId/upload-vaccine" method="post">
      <div className="w-full">
        <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email address *</label>
            <TextInput type="email" id="email" placeholder="john.doe@company.com" required />
        </div>
        <div className="mb-6">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Name *</label>
            <TextInput type="text" id="name" placeholder="John Doe" required />
        </div>
        <div className="mb-6">
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Phone number (International Format, e.g. +85255551234) *</label>
            <TextInput type="tel" id="phone" placeholder="+85255881234" pattern="\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$" required />
        </div>
      </div>
      <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
          <input id="remember" type="checkbox" value="" className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
        </div>
        <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-400">
          I hereby confirm that I am 18 or above and have been fully vaccinated according to the <ExternalLink rel="noopener noreferrer" target="_blank" href="https://www.coronavirus.gov.hk/pdf/vp_t1_ENG.pdf">guidelines of the HKSAR Government</ExternalLink>
        </label>
      </div>
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Next Step
      </button>
    </form>
  )
}