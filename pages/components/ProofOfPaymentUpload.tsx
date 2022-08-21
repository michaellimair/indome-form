import axios from 'axios';
import { Button } from 'flowbite-react';
import { FC, useCallback, useState } from 'react';
import { FileUpload } from './FileUpload';

export const ProofOfPaymentUpload: FC = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

  const uploadProofOfPayment = useCallback(async () => {
    if (!file) {
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await axios.post('/api/payment', formData);
      console.log(result.data)
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  }, [file]);

  return (
    <div className="mt-4 w-full">
      <p className="font-bold">Please upload a screenshot of the proof of payment below.</p>
      <FileUpload name="proofOfPayment" onUpload={setFile} />
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