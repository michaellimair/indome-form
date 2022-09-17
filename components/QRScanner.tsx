import { FC, useRef, useEffect, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Spinner } from "flowbite-react";

const qrcodeRegionId = "html5qr-code-full-region";

const QRScanner: FC<{ onScan: (value: string) => void; code?: string }> = ({
  code,
  onScan
}) => {
  const [scannedCode, setScannedCode] = useState<string>();
  const [scanner, setScanner] = useState<Html5QrcodeScanner>();

  useEffect(() => {
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
        if (!code) {
          setScannedCode(dt);
          onScan(dt);  
        }
      },
      (e) => {});

    return () => {
      scanner?.clear();
    }
  }, [scanner]);

  return (
    <div className="p-4">
      <div id={qrcodeRegionId} />
    </div>
  )
}

export default QRScanner;
