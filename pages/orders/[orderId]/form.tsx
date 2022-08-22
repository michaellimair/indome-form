import type { NextPage } from 'next'
import { EventDescription } from '../../../components/EventDescription';
import { EventForm } from '../../../components/EventForm';
import { PageContainer } from '../../../components/PageContainer';

const OrderForm: NextPage = () => {
  return (
    <PageContainer>
      <EventForm />
    </PageContainer>
  )
}

export default OrderForm
