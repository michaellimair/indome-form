import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";
import { createOrder } from "../utils/order";
import { Button } from "./Button";
import { EventStatus } from "../customTypes";
import { TicketTier, eventSalesCloseTime, eventSalesOpenTime } from "../ticket-tiers";
import { formatDate } from "../utils/date";

const useCreateOrder = (status: EventStatus) => {
  const enabled = useMemo(() => status.tierInfo.find((e) => e.available), [status]);
  const disabledMessage = useMemo(() => {
    const currentDateTime = new Date();
    const earlyBirdTier = status.tierInfo.find(({ tier }) => tier === TicketTier.EARLY_BIRD)!;
    const firstReleaseTier = status.tierInfo.find(({ tier }) => tier === TicketTier.FIRST_RELEASE)!;
    const secondReleaseTier = status.tierInfo.find(({ tier }) => tier === TicketTier.SECOND_RELEASE)!;

    if (currentDateTime < eventSalesOpenTime) {
      return 'Ticket sales is not yet available, check back later!';
    }

    if (earlyBirdTier.isInWindow && !earlyBirdTier.available) {
      return `Sorry, early bird tickets are now sold out. Sales for main release tickets will begin ${formatDate(firstReleaseTier.openTime)}.`;
    }

    // In the period between early bird and main release, show a different message
    if (!earlyBirdTier.isInWindow && new Date() < firstReleaseTier.openTime) {
      return `Sorry, sales for early bird tickets are now closed. Sales for main release tickets will begin ${formatDate(firstReleaseTier.openTime)}.`;
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
