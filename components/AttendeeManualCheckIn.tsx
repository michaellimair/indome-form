import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import { IOrder } from "../global";
import { AttendeeCheckInModal } from "./AttendeeCheckInModal";

export const AttendeeManualCheckIn: FC<{ resetData: () => void; token: string; email?: string; phone?: string }> = ({
  email,
  phone,
  resetData,
  token,
}) => {
  const { data: order, isFetching: isLoadingAttendee, refetch } = useQuery(['order', 'lookup', email, phone], () => {
    const params: { phone?: string; email?: string } = {};
    if (phone && phone.length === 8) {
      params.phone = `+852${phone.trim()}`;
    } else if (phone) {
      params.phone = phone.trim();
    } else if (email) {
      params.email = email.trim();
    }
    return axios.post<IOrder>('/api/admin/orders/lookup', params, {
      headers: { authorization: `Bearer ${token}` }
    }).then((r) => r.data);
  }, {
    cacheTime: 0,
    enabled: !!email || !!phone,
    retry: false,
  });

  return (
    <AttendeeCheckInModal
      onDismiss={resetData}
      show={!!email || !!phone}
      onCheckIn={refetch}
      token={token}
      order={order}
      isLoadingAttendee={isLoadingAttendee}
      refetch={refetch}
    />
  )
}