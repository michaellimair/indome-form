import type { NextPage } from 'next'
import Head from 'next/head'
import { EventDescription } from './components/EventDescription';
import { EventForm } from './components/EventForm';
import { PageContainer } from './components/PageContainer';

const Home: NextPage = () => {
  return (
    <PageContainer>
      <EventDescription />
      <EventForm />
    </PageContainer>
  )
}

export default Home
