import { useMutation } from "@tanstack/react-query";
import { Button } from "flowbite-react";
import { useRouter } from "next/router";
import { FC } from "react";
import { cancelOrder } from "../utils/order";

export const CancelOrderSection: FC<{ orderId: string }> = ({
  orderId,
}) => {
  const router = useRouter();
  const cancelOrderMutation = useMutation(
    ['orders', 'cancel', orderId],
    () => cancelOrder(orderId),
    {
      onSuccess: () => {
        router.push('/');
      }
    }
  );

  return (
    <div className="mt-4">
      <Button color="failure" onClick={() => {
        if (!window.confirm('Are you sure you want to cancel the order?')) {
          return;
        }
        cancelOrderMutation.mutate();
      }} disabled={cancelOrderMutation.isLoading}>
        Cancel Order
      </Button>
    </div>
  )
};
