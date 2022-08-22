import type { NextPage } from 'next'
import { PageContainer } from '../../../components/PageContainer';

const OrderForm: NextPage = () => {
  return (
    <PageContainer>
      <div className="mt-4">
        <h2 className="text-center font-bold text-3xl mb-2">Payment Successful</h2>
        <p className="text-center">
          We have received your form submission. We will send a confirmation email after we have verified your payment within the <b>next 24 hours</b>. Please keep an eye on your inbox for the confirmation email. Thank you and see you at <b>InDome Roof Rave 2022</b>!
        </p>
      </div>
    </PageContainer>
  )
}

export default OrderForm
