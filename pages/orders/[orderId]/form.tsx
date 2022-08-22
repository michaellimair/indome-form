import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { EventDescription } from '../../../components/EventDescription';
import { EventForm } from '../../../components/EventForm';
import { PageContainer } from '../../../components/PageContainer';
import { IOrder } from '../../../global';

const OrderForm: NextPage = () => {
  const router = useRouter();
  const orderId = router.query.orderId;

  const { data: order } = useQuery(['order', orderId], () => axios.get<IOrder>(`/api/orders/${orderId}`).then((r) => r.data));
  
  return (
    <PageContainer>
      <EventForm />
    </PageContainer>
  )
}

export default OrderForm
