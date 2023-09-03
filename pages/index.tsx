import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import type { NextPage } from 'next'
import { CreateOrderSection } from '../components/CreateOrderSection';
import { EventDescription } from '../components/EventDescription';
import { PageContainer } from '../components/PageContainer';
import { HomeRefreshButton } from '../components/HomeRefreshButton';
import { EventStatus } from '../customTypes';
import { eventName } from '../constants';

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
          <CreateOrderSection status={status.data} />
        </>
      )}
      {!status.isFetching && !status?.data?.available && status?.data?.pendingAvailable && (
        <div className="flex items-center justify-center flex-col">
          <p className="text-center font-bold pt-4">You are currently in the waitlist to obtain InDome tickets, refresh the status by clicking the button below.</p>
          <HomeRefreshButton onRefresh={() => status.refetch()} />
        </div>
      )}
      {!status.isFetching && !status?.data?.available && !status?.data?.pendingAvailable && (
        <>
          <p className="text-center font-bold mt-6">We are sorry, there are no more online tickets for {eventName}, please proceed to walk-in.</p>
          <p className="text-center font-bold">See you there!</p>
        </>
      )}
    </PageContainer>
  )
}

export default Home
