import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Alert, Button, Spinner } from "flowbite-react";
import { FC } from "react";
import { IOrder } from "../global";

export const AttendeeCheckIn: FC<{ code: string; clearCode: () => void; token: string }> = ({
  code,
  clearCode,
  token,
}) => {
  const { data: order, isFetching, refetch } = useQuery(['order', 'qr-lookup', code], () => {
    return axios.post<IOrder>('/api/admin/orders/qr-lookup', { code }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => r.data);
  }, {
    cacheTime: 0,
  });

  const { isLoading: isCheckingIn, mutate } = useMutation(['order', 'checkin', order?._id], () => {
    if (!order) {
      throw new Error();
    }
    return axios.post<IOrder>(`/api/admin/orders/${order!._id}/checkin`, { code }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => r.data);
  }, {
    cacheTime: 0,
    onSuccess: () => {
      refetch();
    }
  });

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner size="xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-4">
        <p className="text-red">Unable to fetch order from the provided QR code!</p>
        <div className="mt-4">
          <Button onClick={() => refetch()} size="xl" style={{ width: '100%', marginBottom: 16 }}>
            Try Again
          </Button>
          <Button onClick={() => clearCode()} size="xl" style={{ width: '100%' }}>
            Scan Another Code
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-center font-bold text-2xl">Order</h2>
      {order.checkedIn && (
        <div className="mt-2 mb-4">
          <Alert
            color="warning"
          >
            <span>
              <span className="font-medium">
                This user has previously checked in! Please manually verify their identity to continue.
              </span>
            </span>
          </Alert>
        </div>
      )}
      <p><span className="font-bold w-20 inline-block">ID:</span> {order._id}</p>
      <p><span className="font-bold w-20 inline-block">Name:</span> {order.name}</p>
      <p><span className="font-bold w-20 inline-block">Email:</span> {order.email || '-'}</p>
      <p><span className="font-bold w-20 inline-block">Phone:</span> {order.phone || '-'}</p>
      {!order.checkedIn && (
        <div className="mt-4">
          <Button onClick={() => mutate()} disabled={isCheckingIn} color="success" size="xl" style={{ width: '100%' }}>
            Check In
          </Button>
        </div>
      )}
      <div className="mt-4">
        <Button onClick={() => clearCode()} size="xl" style={{ width: '100%' }}>
          Scan Another Code
        </Button>
      </div>
    </div>
  )
}