import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { IOrder } from '../../../global'
import { PageContainer } from '../../../components/PageContainer'
import Payment from '../../../components/Payment'

const PaymentPage: NextPage = () => {
  const router = useRouter();
  const orderId = router.query.orderId;

  const { data: order } = useQuery(['order', orderId], () => axios.get<IOrder>(`/api/orders/${orderId}`).then((r) => r.data));

  return (
    <PageContainer>
      {!!order && <Payment order={order} />}
    </PageContainer>
  )
}

export default PaymentPage
