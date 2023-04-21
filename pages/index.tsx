import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import type { NextPage } from 'next'
import { CreateOrderSection } from '../components/CreateOrderSection';
import { EventDescription } from '../components/EventDescription';
import { PageContainer } from '../components/PageContainer';
import { HomeRefreshButton } from '../components/HomeRefreshButton';
import { EventStatus } from '../customTypes';

const Home: NextPage = () => {
  const status = useQuery(['status'], () => axios.get<EventStatus>('/api/status').then((r) => r.data), {
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
          <EventDescription firstReleaseAvailable={status?.data?.firstReleaseAvailable} secondReleaseAvailable={status?.data?.secondReleaseAvailable} available={status?.data?.available} />
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
        <p className="text-center font-bold mt-3">We are sorry, there are no more online tickets for InDome 2023 - Euphoria.</p>
      )}
    </PageContainer>
  )
}

export default Home
