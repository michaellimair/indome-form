import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FC } from "react";
import { createOrder } from "../utils/order";
import { Button } from "./Button";

export const CreateOrderSection: FC = () => {
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
      <Button onClick={() => createOrderMutation.mutate()} disabled={createOrderMutation.isLoading}>
        Proceed to Purchase
      </Button>
      {createOrderMutation.isError && (
        <p className="text-red-600 mt-2">Unable to proceed to purchase, please try again</p>
      )}
    </div>
  )
};
