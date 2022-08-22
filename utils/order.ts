import axios from "axios";
import { IEventForm, IOrder } from "../global";

export const createOrder = async (): Promise<Pick<IOrder, '_id' | 'expiresAt'>> => {
  const result = await axios.post<Pick<IOrder, '_id' | 'expiresAt'>>('/api/orders');

  return result.data;
}

export const updateOrder = async (orderId: string, form: IEventForm) => {
  const result = await axios.patch<IOrder>(`/api/orders/${orderId}`, form);

  return result.data;
}
