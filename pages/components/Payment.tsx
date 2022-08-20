import { FC, useMemo, useState } from 'react'
import { paymentMethods } from '../../constants';
import { ProofOfPaymentUpload } from './ProofOfPaymentUpload';
import { SelectedMethodInfo } from './SelectedMethodInfo';

const Payment: FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>();
  const price = 22500;
  const selectedMethod = useMemo(() => paymentMethods.find((method) => method.name === paymentMethod), [paymentMethods, paymentMethod]);

  return (
    <div className='mt-4 w-full'>
      <p className='font-bold'>Select a Payment Method</p>
      <div className='flex-col md:flex-row flex w-full md:space-x-4'>
        {paymentMethods.map((method) => (
          <button onClick={() => {
            setPaymentMethod(method.name)
          }} className="block flex-1 text-left pl-4 py-4 rounded border border-gray-200 dark:border-gray-700 mt-3" key={method.name}>
            <input checked={paymentMethod === method.name} onChange={() => {
              setPaymentMethod(method.name)
            }} id={`payment-method-${method.name}`} type="radio" value="" name="paymentMethod" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label htmlFor={`payment-method-${method.name}`} className="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">
              {method.label}
            </label>
        </button>
        ))}
      </div>
      {selectedMethod && (
        <SelectedMethodInfo method={selectedMethod} price={price} />
      )}
      {!!selectedMethod && (
        <ProofOfPaymentUpload />
      )}
    </div>
  )
}

export default Payment
