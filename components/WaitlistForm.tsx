import { useMutation } from "@tanstack/react-query";
import { FC, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { IWaitlist } from "../global";
import { createWaitlist } from "../utils/order";
import validator from 'validator';
import { Button, TextInput } from "flowbite-react";
import { GoogleReCaptcha } from 'react-google-recaptcha-v3';

export const WaitlistForm: FC = () => {
  const { handleSubmit, control, setValue } = useForm<Omit<IWaitlist, '_id'> & { recaptchaKey: string }>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      recaptchaKey: '',
    },
  });

  const createWaitlistMutation = useMutation(
    ['waitlist', 'create'],
    (data: Omit<IWaitlist, '_id'> & { recaptchaKey: string }) => createWaitlist(data),
  );

  const onSubmit = useCallback((data: Omit<IWaitlist, '_id'> & { recaptchaKey: string }) => {
    createWaitlistMutation.mutate(data);
  }, [createWaitlistMutation]);

  return (
    <>
      <p className="text-center font-bold mt-3">We are sorry, there are no more online tickets for InDome 2022.</p>
      <p className="text-center mt-2">However, drop your contact below and we will notify you if we release more tickets in the future!</p>
      {!createWaitlistMutation.isSuccess ? (
        <form className="w-full mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full">
            <div className="mb-6">
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) => {
                      if (!validator.isEmail(value)) {
                        return 'Email is not valid!';
                      }
                    }
                  }}
                  name="email"
                  render={({ field }) => (
                    <>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email address *</label>
                      <TextInput autoComplete="email" name={field.name} type="email" value={field.value} onChange={field.onChange} placeholder="john.doe@company.com" required />
                    </>
                  )}
                />
            </div>
            <div className="mb-6">
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                name="name"
                render={({ field }) => (
                  <>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Name *</label>
                    <TextInput autoComplete="name" name={field.name} type="text" value={field.value} onChange={field.onChange} placeholder="John Doe" required />
                  </>
                )}
              />
            </div>
            <div className="mb-6">
              <Controller
                control={control}
                rules={{
                  required: true,
                  validate: (value) => {
                    if (!validator.isMobilePhone(value)) {
                      return 'Phone number is not valid!';
                    }
                  }
                }}
                name="phone"
                render={({ field }) => (
                  <>
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Phone number (International Format, e.g. +85255551234) *</label>
                    <TextInput autoComplete="tel" name={field.name} value={field.value} onChange={field.onChange} type="tel" placeholder="Phone number" pattern="\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$" required />
                  </>
                )}
              />
            </div>
          </div>
          <GoogleReCaptcha
            onVerify={token => {
              setValue('recaptchaKey', token);
            }}
          />
          <Button disabled={createWaitlistMutation.isLoading} style={{ marginTop: 8 }} type="submit">
            Add to Waitlist
          </Button>
          {createWaitlistMutation.isError && (
            <p className="text-red-600 mt-2">Unable to create waitlist!</p>
          )}
        </form>
      ) : (
        <p className="font-bold mt-4 text-center text-xl">Thank you for adding your contact, we will notify you once more tickets are available!</p>
      )}
    </>
  )
}