import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import { IOrder } from "../global";
import { AttendeeCheckInModal } from "./AttendeeCheckInModal";

export const AttendeeQRCheckIn: FC<{ code?: string; clearCode: () => void; token: string; email?: string; phone?: string }> = ({
  code,
  clearCode,
  token,
}) => {
  const { data: order, isFetching: isLoadingAttendee, refetch } = useQuery(['order', 'qr-lookup', code], () => {
    return axios.post<IOrder>('/api/admin/orders/qr-lookup', { code }, {
      headers: { authorization: `Bearer ${token}` }
    }).then((r) => r.data);
  }, {
    cacheTime: 0,
    enabled: !!code,
    retry: false,
  });

  return (
    <AttendeeCheckInModal
      onDismiss={clearCode}
      show={!!code}
      onCheckIn={refetch}
      token={token}
      order={order}
      errorMessage="Unable to fetch order from the provided QR code!"
      isLoadingAttendee={isLoadingAttendee}
      refetch={refetch}
    />
  )
}