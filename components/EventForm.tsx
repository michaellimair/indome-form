import { useRouter } from "next/router";
import { FC, useCallback, FormEventHandler } from "react";
import { Controller, useForm } from "react-hook-form";
import { IEventForm, IOrder } from "../global";
import { ExternalLink } from "./ExternalLink";
import { TextInput } from "./TextInput";
import validator from 'validator';
import { useMutation } from "@tanstack/react-query";
import { updateOrder } from "../utils/order";
import { Button } from "./Button";
import axios from "axios";

export const EventForm: FC = () => {
  const { register, handleSubmit, control, formState } = useForm<IEventForm>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      acknowledgeAgeRequirement: false,
    },
  });
  const router = useRouter();
  const orderId = router.query.orderId;
  const inputDataMutation = useMutation(
    ['orders', orderId, 'update'],
    (data: IEventForm) => updateOrder(orderId! as string, data),
    {
      onError: (err) => {
        if (axios.isAxiosError(err) && err.response?.status === 410) {
          alert('Your order is expired! Please start a new purchase');
          router.replace('/');
        }
      },
      onSuccess: () => {
        router.push(`/orders/${orderId}/payment`);
      }
    }
  )
  const onSubmit = useCallback((data: IEventForm) => {
    inputDataMutation.mutate(data);
  }, [router]);

  return (
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
                  <TextInput type="email" value={field.value} onChange={field.onChange} placeholder="john.doe@company.com" required />
                  <p className="mt-2 text-sm">One email can only be used for one purchase.</p>
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
                <TextInput type="text" value={field.value} onChange={field.onChange} placeholder="John Doe" required />
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
                <TextInput value={field.value} onChange={field.onChange} type="tel" placeholder="Phone number" pattern="\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$" required />
              </>
            )}
          />
        </div>
      </div>
      <div className="flex items-start mb-6">
        <div className="flex items-center">
          <Controller
            control={control}
            name="acknowledgeAgeRequirement"
            render={({ field }) => (
              <>
                <input id={field.name} name={field.name} type="checkbox" checked={field.value} className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required onChange={field.onChange} />
                <label htmlFor={field.name} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                I hereby confirm that I am 18 or above.
              </label>
              </>
            )}
          />
        </div>
      </div>
      <Button disabled={inputDataMutation.isLoading} type="submit">
        Next Step
      </Button>
    </form>
  )
}