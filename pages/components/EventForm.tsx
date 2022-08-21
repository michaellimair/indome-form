import { useRouter } from "next/router";
import { FC, useCallback, FormEventHandler } from "react";
import { ExternalLink } from "./ExternalLink";
import { TextInput } from "./TextInput";

export const EventForm: FC = () => {
  const router = useRouter();
  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    e.preventDefault();
    router.push('/orders/:orderId/vaccine-verification');
  }, [router]);

  return (
    <form className="w-full mt-4" onSubmit={onSubmit}>
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
            <label htmlFor="phoneCountryCode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Phone number (International Format, e.g. +85255551234) *</label>
            <div className="flex flex-row">
              <TextInput className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-16 mr-2" type="tel" autoComplete="tel-country-code" id="phoneCountryCode" placeholder="852" defaultValue={852} pattern="\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$" required />
              <TextInput type="tel" autoComplete="tel-national" id="phoneNumber" placeholder="Phone number" pattern="\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$" required />
            </div>
        </div>
      </div>
      <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
          <input id="acknowledgement" type="checkbox" value="" className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
        </div>
        <label htmlFor="acknowledgement" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-400">
          I hereby confirm that I am 18 or above and have been fully vaccinated according to the <ExternalLink rel="noopener noreferrer" target="_blank" href="https://www.coronavirus.gov.hk/pdf/vp_t1_ENG.pdf">guidelines of the HKSAR Government</ExternalLink>
        </label>
      </div>
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Next Step
      </button>
    </form>
  )
}