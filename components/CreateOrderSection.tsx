import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FC } from "react";
import { createOrder } from "../utils/order";
import { Button } from "./Button";
import { EventStatus } from "../customTypes";

export const CreateOrderSection: FC<{ status: EventStatus }> = ({
  status,
}) => {
  const router = useRouter();
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
      {(status.firstReleaseOpen || status.secondReleaseOpen) ? (
        <Button onClick={() => createOrderMutation.mutate()} disabled={createOrderMutation.isLoading}>
          Proceed to Purchase
        </Button>
      ) : (
        <p>First release ticket sales is now closed, tickets for the second release will be available from Sunday, 23 April 2023, 6:00pm.</p>
      )}
      {createOrderMutation.isError && (
        <p className="text-red-600 mt-2">Unable to proceed to purchase, please try again</p>
      )}
    </div>
  )
};
