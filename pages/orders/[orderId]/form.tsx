import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { Countdown } from '../../../components/Countdown';
import { EventForm } from '../../../components/EventForm';
import { PageContainer } from '../../../components/PageContainer';
import { IOrder } from '../../../global';
import { CancelOrderSection } from '../../../components/CancelOrderSection';

const OrderForm: NextPage = () => {
  const router = useRouter();
  const orderId = router.query.orderId;

  const { data: order } = useQuery(['order', orderId], () => axios.get<IOrder>(`/api/orders/${orderId}`).then((r) => r.data), {
    enabled: !!orderId,
  });
  
  return (
    <PageContainer>
      {order && (
        <>
          <Countdown order={order} />
          <EventForm />
          <CancelOrderSection orderId={order._id} />
        </>
      )}
    </PageContainer>
  )
}

export default OrderForm
