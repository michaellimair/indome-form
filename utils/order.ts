import axios from "axios";
import { IEventForm, IOrder, IWaitlist } from "../global";

export const createOrder = async (): Promise<Pick<IOrder, '_id' | 'expiresAt'>> => {
  const result = await axios.post<Pick<IOrder, '_id' | 'expiresAt'>>('/api/orders');

  return result.data;
}

export const updateOrder = async (orderId: string, form: IEventForm) => {
  const result = await axios.patch<IOrder>(`/api/orders/${orderId}`, form);

  return result.data;
}

export const cancelOrder = async (orderId: string) => {
  await axios.delete(`/api/orders/${orderId}`);
}

export const createWaitlist = async (input: Omit<IWaitlist, '_id'> & { recaptchaKey: string }): Promise<IWaitlist> => {
  const result = await axios.post<IWaitlist>('/api/waitlist', input);

  return result.data;
}
