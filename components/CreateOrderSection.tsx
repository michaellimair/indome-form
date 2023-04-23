import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";
import { createOrder } from "../utils/order";
import { Button } from "./Button";
import { EventStatus } from "../customTypes";

const useCreateOrder = (status: EventStatus) => {
  const enabled = useMemo(() => status.firstReleaseOpen || status.secondReleaseOpen, [status]);
  const disabledMessage = useMemo(() => {
    if (status.available && !status.firstReleaseOpen) {
      return "First release ticket sales is now closed, tickets for the second release will be available from Sunday, 23 April 2023, 6:00pm.";
    }

    return null;
  }, [enabled]);

  return { enabled, disabledMessage };
}

export const CreateOrderSection: FC<{ status: EventStatus }> = ({
  status,
}) => {
  const router = useRouter();
  const { enabled, disabledMessage } = useCreateOrder(status);
  const createOrderMutation = useMutation(
    ['orders', 'create'],
    () => createOrder(),
    {
      onSuccess: (order) => {
        router.push(`/orders/${order._id}/form`);
      }
    }
  );

  return (
    <div className="mt-4">
      {enabled ? (
        <Button onClick={() => createOrderMutation.mutate()} disabled={createOrderMutation.isLoading}>
          Proceed to Purchase
        </Button>
      ) : (
        <p>{disabledMessage}</p>
      )}
      {createOrderMutation.isError && (
        <p className="text-red-600 mt-2">Unable to proceed to purchase, please try again</p>
      )}
    </div>
  )
};
