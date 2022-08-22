import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { NextPage } from 'next'
import Head from 'next/head'
import { CreateOrderSection } from './components/CreateOrderSection';
import { EventDescription } from './components/EventDescription';
import { EventForm } from './components/EventForm';
import { PageContainer } from './components/PageContainer';

const Home: NextPage = () => {
  const status = useQuery(['status'], () => axios.get<{ orderCount: number; available: boolean }>('/api/status'), {
    cacheTime: 0,
  })
  return (
    <PageContainer>
      {!status.isFetching && status?.data?.data?.available && (
        <>
          <EventDescription />
          <CreateOrderSection />
        </>
      )}
      {!status.isFetching && !status?.data?.data?.available && (
        <p className="text-center font-bold pt-4">We are sorry, there are no more tickets for InDome 2022. Thank you for your interest!</p>
      )}
    </PageContainer>
  )
}

export default Home
