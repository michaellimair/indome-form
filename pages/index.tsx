import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import type { NextPage } from 'next'
import { EventDescription } from '../components/EventDescription';
import { PageContainer } from '../components/PageContainer';
import { HomeRefreshButton } from '../components/HomeRefreshButton';
import { EventStatus } from '../customTypes';
import { FC, useMemo } from "react";
import { eventName } from '../constants';
import { Button } from "../components/Button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { createOrder } from "../utils/order";
import { TicketTier, eventSalesOpenTime } from '../ticket-tiers';
import { formatDate } from '../utils/date';

const ProceedToPurchase: FC<{ status: EventStatus }> = ({
  status: { available }
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

  if (!available) {
    return null;
  }

  return (
    <>
      <Button className="mt-6" onClick={() => createOrderMutation.mutate()} disabled={createOrderMutation.isLoading}>
        Proceed to Purchase
      </Button>
      {createOrderMutation.isError && (
        <p className="text-red-600 mt-2">Unable to proceed to purchase, please refresh this page!</p>
      )}
    </>
  )
}

const OrderMessage: FC<{ status: EventStatus }> = ({
  status
}) => {
  const text = useMemo(() => {
    const currentDateTime = new Date();
    const earlyBirdTier = status.tierInfo.find(({ tier }) => tier === TicketTier.EARLY_BIRD)!;
    const firstReleaseTier = status.tierInfo.find(({ tier }) => tier === TicketTier.FIRST_RELEASE)!;

    if (currentDateTime < eventSalesOpenTime) {
      return 'Ticket sales is not yet available, check back later!';
    }

    if (earlyBirdTier.isInWindow && !earlyBirdTier.available && !earlyBirdTier.pendingAvailable) {
      return `Sorry, early bird tickets are now sold out. Sales for main release tickets will begin ${formatDate(firstReleaseTier.openTime)}.`;
    }

    // In the period between early bird and main release, show a different message
    if (!earlyBirdTier.isInWindow && new Date() < firstReleaseTier.openTime) {
      return `Sorry, sales for early bird tickets are now closed. Sales for main release tickets will begin ${formatDate(firstReleaseTier.openTime)}.`;
    }

    if (!status.available && !status.pendingAvailable) {
      return `We are sorry, there are no more online tickets for ${eventName}, please proceed to walk-in.\nSee you there!`;
    }

    return null;
  }, [status]);

  return text ? (
    <p className="text-center font-bold mt-6" style={{ whiteSpace: "pre-wrap" }}>{text}</p>
  ) : null;
}

const WaitlistRefreshButton: FC<{ status: EventStatus; refetch: () => any }> = ({
  status,
  refetch,
}) => {
  if (!status.available && status.pendingAvailable) {
    return (
      <div className="flex items-center justify-center flex-col">
        <p className="text-center font-bold pt-4">You are currently in the waitlist to obtain InDome tickets, refresh the status by clicking the button below.</p>
        <HomeRefreshButton onRefresh={() => refetch()} />
      </div>
    );
  }

  return null;
}

const Home: NextPage = () => {
  const status = useQuery(['status'], () => axios.get<EventStatus>('/api/status').then((r) => {
    const { data } = r;

    data.tierInfo.forEach((info) => {
      // Manually casting as date object
      info.openTime = new Date(info.openTime);
      info.closeTime = new Date(info.closeTime);
    })

    return data;
  }), {
    cacheTime: 0,
  });

  return (
    <PageContainer>
      {status.isFetching && (
        <div className="flex items-center justify-center p-4">
          <Spinner color="info" />
        </div>
      )}
      {!status.isFetching && status?.data && (
        <>
          <EventDescription status={status.data} />
          <OrderMessage status={status.data} />
          <ProceedToPurchase status={status.data} />
          <WaitlistRefreshButton status={status.data} refetch={status.refetch} />
        </>
      )}
    </PageContainer>
  )
}

export default Home
