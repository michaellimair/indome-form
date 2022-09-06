import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AttendeeCheckIn } from "../../../components/AttendeeCheckIn";
import { TokenInput } from "../../../components/TokenInput";
const QRScanner = dynamic(() => import('../../../components/QRScanner'), {
  ssr: false,
});

const AdminCheckinPage: NextPage = () => {
  const [token, setToken] = useState<string>();
  const [scannedCode, setScannedCode] = useState<string>();
  return (
    <div className="py-3 max-w-7xl mx-auto">
      <h1 className="text-center font-bold text-3xl">Event Check In Portal</h1>
      <TokenInput
        onChange={(t) => {
          setToken(t);
        }}
      />
      {token && !scannedCode && <QRScanner onScan={setScannedCode} />}
      {token && !!scannedCode && (
        <AttendeeCheckIn code={scannedCode} token={token} clearCode={() => setScannedCode(undefined)} />
      )}
    </div>
  );
}

export default AdminCheckinPage;
