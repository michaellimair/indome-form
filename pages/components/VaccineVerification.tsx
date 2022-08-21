import Link from 'next/link';
import { FC, useCallback, useMemo, useState } from 'react';
import { Button } from './Button';
// import Jimp from 'jimp';
import jsQR from 'jsqr';
import axios from 'axios';
import { useRouter } from 'next/router';
import { VacCase, VerifyVaccineResult } from '../../customTypes';
import { FileUpload } from './FileUpload';

function convertURIToImageData(uri: string) {
  return new Promise<{ imageData: ImageData; width: number; height: number; }>(function(resolve, reject) {
    if (uri == null) return reject();

    var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    image = new Image();
    image.addEventListener('load', function() {
      canvas.width = image.width;
      canvas.height = image.height;
      context?.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve({
        imageData: context?.getImageData(0, 0, canvas.width, canvas.height)!,
        width: image.width,
        height: image.height,
      });
    }, false);
    image.src = uri;
  });
}

const VaccineVerification: FC = () => {
  const [file, setFile] = useState<File>();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const imageUrl = useMemo(() => {
    if (!file) {
      return null;
    }
    return URL.createObjectURL(file);
  }, [file]);
  const { orderId } = router.query;

  const verifyVaccineInBackend = useCallback(async () => {
    if (!file || !imageUrl) {
      return;
    }
    setIsVerifying(true);
    try {
      const { imageData, width, height } = await convertURIToImageData(imageUrl);
      const qr = jsQR(imageData.data, width, height);
      if (!qr) {
        setIsError(true);
        setIsVerifying(false);
        return;
      }
      const result = await axios.post<VerifyVaccineResult>('/api/verify-vaccine', { qrString: qr.data });
      setIsVerifying(false);
      if (result.data.vaccinationStatus === VacCase.VP_SUCCESS) {
        router.push(`/orders/${orderId}/payment`);
      }
    } catch (e) {
      setIsError(true);
      setIsVerifying(false);
    }
  }, [file, imageUrl]);

  return (
    <div className="mt-4 w-full">
      <p className="font-bold">Please upload a QR code of your HKSAR vaccination record or vaccine pass for verification purposes.</p>
      <div className="mt-2">
        {imageUrl ? (
          <>
            <img className='w-64 block mt-4' src={imageUrl}></img>
            <Button onClick={() => setFile(undefined)} className="mt-4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete Image</Button>
          </>
        ) : (
          <FileUpload onUpload={setFile} name="vaccinePass" />
        )}
      </div>
      <p className="mt-4">We will not store your QR code in our server. The image of the QR code will only be kept temporarily for verification purposes and will be deleted immediately after verification.</p>
      <div className='mt-2'>
        <Button disabled={!file || isVerifying} onClick={verifyVaccineInBackend}>
          Verify Vaccination
        </Button>
        {isError && (
          <p className='mt-2 text-error'>Unable to verify your vaccination record!</p>
        )}
      </div>
    </div>
  )
}

export default VaccineVerification
