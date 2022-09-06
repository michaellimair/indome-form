import { FC, useRef, useEffect, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Spinner } from "flowbite-react";

const qrcodeRegionId = "html5qr-code-full-region";

const QRScanner: FC<{ onScan: (value: string) => void }> = ({
  onScan
}) => {
  const [scannedCode, setScannedCode] = useState<string>();
  const [scanner, setScanner] = useState<Html5QrcodeScanner>();

  useEffect(() => {
    if (!!scannedCode) {
      return;
    }
    if (!scanner) {
      setScanner(new Html5QrcodeScanner(
        qrcodeRegionId, {
          fps: 8,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
        }, false));  
      return;
    }
    scanner.render(
      (dt) => {
        setScannedCode(dt);
        onScan(dt);
      },
      (e) => {});

    return () => {
      scanner?.clear();
    }
  }, [scanner, scannedCode]);

  useEffect(() => {
    if (!!scannedCode) {
      scanner?.clear();
    }
  }, [scannedCode]);

  if (!!scannedCode) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Spinner
          size="xl"
        />
      </div>
    )
  }

  return (
    <div className="p-4">
      <div id={qrcodeRegionId} />
    </div>
  )
}

export default QRScanner;
