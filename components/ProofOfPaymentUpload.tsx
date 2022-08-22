import axios from 'axios';
import { Button } from './Button';
import { useRouter } from 'next/router';
import { FC, useCallback, useMemo, useState } from 'react';
import { FileUpload } from './FileUpload';
import { PaymentMethod } from '../constants';

export const ProofOfPaymentUpload: FC<{ selectedMethod: PaymentMethod }> = ({
  selectedMethod,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const router = useRouter();
  const orderId = router.query.orderId! as string;

  const imageUrl = useMemo(() => {
    if (!file) {
      return null;
    }
    return URL.createObjectURL(file);
  }, [file]);

  const uploadProofOfPayment = useCallback(async () => {
    if (!file) {
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('paymentMethod', selectedMethod.name);
      formData.append('file', file);
      await axios.put(`/api/orders/${router.query.orderId! as string}/payment`, formData);
      router.push(`/orders/${orderId}/success`);
    } catch (e) {
      console.error(e);
      if (axios.isAxiosError(e) &&( e.response?.data as any)?.message) {
        alert((e.response?.data as any)?.message);
      }
    } finally {
      setIsUploading(false);
    }
  }, [file, selectedMethod.name]);

  return (
    <div className="mt-4 w-full">
      <p className="font-bold mb-2">Please upload a screenshot of the proof of payment below.</p>
      {imageUrl ? (
        <>
          <img className='w-64 block mt-4' src={imageUrl}></img>
          <Button onClick={() => setFile(undefined)} className="mt-4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete Image</Button>
        </>
      ) : (
        <FileUpload name="proofOfPayment" onUpload={setFile} />
      )}
      <div className='mt-2'>
        <Button disabled={!file || isUploading} onClick={uploadProofOfPayment}>
          Complete Payment
        </Button>
        {isError && (
          <p className='mt-2 text-error'>Unable to complete payment process!</p>
        )}
      </div>
    </div>
  )
};