import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Alert, Button, Spinner, Modal } from "flowbite-react";
import { FC, useCallback, useEffect } from "react";
import { IOrder } from "../global";

export const AttendeeCheckInModal: FC<{ order?: IOrder; onCheckIn: () => any; onDismiss: () => void; token: string; show: boolean; isLoadingAttendee: boolean; refetch: () => void }> = ({
  order,
  onCheckIn,
  onDismiss,
  token,
  show,
  isLoadingAttendee,
  refetch,
}) => {
  const { isLoading: isCheckingIn, mutate, isSuccess, reset } = useMutation(['order', 'checkin', order?._id], async () => {
    if (!order) {
      throw new Error();
    }
    await axios.post<IOrder>(`/api/admin/orders/${order!._id}/checkin`, {}, {
      headers: { authorization: `Bearer ${token}` }
    }).then((r) => r.data);
    await onCheckIn();
  }, {
    cacheTime: 0,
  });

  useEffect(() => {
    if (order && !order.checkedIn) {
      mutate();
    }
  }, [order]);

  const handleClose = useCallback(() => {
    onDismiss();
    reset();
  }, [onDismiss, reset])

  return (
    <Modal
      show={show}
      onClose={handleClose}
    >
      <Modal.Header>
        Order
      </Modal.Header>
      <Modal.Body>
        {(isLoadingAttendee || isCheckingIn) && (
          <div className="flex items-center justify-center p-4">
            <Spinner size="xl" />
          </div>
        )}
        {!isLoadingAttendee && !order && (
          <Alert
            color="error"
          >
            <span>
              <span className="font-medium">
                Unable to fetch order from the provided QR code!
              </span>
            </span>
          </Alert>
        )}
        {!!order && (
          <>
            {order.checkedIn && !isSuccess && (
              <Alert
                color="warning"
              >
                <span>
                  <span className="font-medium">
                    This user has previously checked in! Please manually verify their identity to continue.
                  </span>
                </span>
              </Alert>
            )}
            {isSuccess && (
              <div className="mb-4">
                <Alert
                  color="success"
                >
                  <span>
                    <span className="font-medium">
                      Check in successful!
                    </span>
                  </span>
                </Alert>
              </div>
            )}
            <p><span className="font-bold w-20 inline-block">ID:</span> {order._id}</p>
            <p><span className="font-bold w-20 inline-block">Name:</span> {order.name}</p>
            <p><span className="font-bold w-20 inline-block">Email:</span> {order.email || '-'}</p>
            <p><span className="font-bold w-20 inline-block">Phone:</span> {order.phone || '-'}</p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!isLoadingAttendee && !order && (
          <Button onClick={() => refetch()} size="xl">
            Try Again
          </Button>
        )}
        {order && !order.checkedIn && (
          <Button onClick={() => mutate()} disabled={isCheckingIn} color="success" size="xl">
            {isCheckingIn ? <Spinner size="xs" /> : "Check In"}
          </Button>
        )}
        <Button onClick={handleClose} size="xl">
          Scan Another Code
        </Button>
      </Modal.Footer>
    </Modal>
  )
}