import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Spinner } from 'flowbite-react';
import type { NextPage } from 'next'
import { CreateOrderSection } from '../components/CreateOrderSection';
import { EventDescription } from '../components/EventDescription';
import { PageContainer } from '../components/PageContainer';

const Home: NextPage = () => {
  const status = useQuery(['status'], () => axios.get<{ orderCount: number; available: boolean; waitlist: boolean; firstReleaseAvailable: boolean; secondReleaseAvailable: boolean }>('/api/status').then((r) => r.data), {
    cacheTime: 0,
  })
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
          <CreateOrderSection />
        </>
      )}
      {!status.isFetching && !status?.data?.available && status?.data?.waitlist && (
        <div className="flex items-center justify-center flex-col">
          <p className="text-center font-bold pt-4">You are currently in the waitlist to obtain InDome tickets, refresh the status by clicking the button below.</p>
          <Button style={{ marginTop: 16 }} onClick={() => status.refetch()}>Refresh</Button>
        </div>
      )}
      {!status.isFetching && !status?.data?.available && !status?.data?.waitlist && (
        <p className="text-center font-bold pt-4">We are sorry, there are no more online tickets for InDome 2022. Please proceed to walk-in starting from 6pm.</p>
      )}
    </PageContainer>
  )
}

export default Home
