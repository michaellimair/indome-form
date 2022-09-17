import { Button } from "flowbite-react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState, useCallback } from "react";
import { AttendeeManualCheckIn } from "../../../components/AttendeeManualCheckIn";
import { AttendeeQRCheckIn } from "../../../components/AttendeeQRCheckIn";
import { ManualInputForm } from "../../../components/ManualInputForm";
import { TokenInput } from "../../../components/TokenInput";
const QRScanner = dynamic(() => import('../../../components/QRScanner'), {
  ssr: false,
});

enum LookupMethod {
  QR_CODE,
  MANUAL_INPUT,
}

const AdminCheckinPage: NextPage = () => {
  const [token, setToken] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [scannedCode, setScannedCode] = useState<string>();
  const [lookupMethod, setLookupMethod] = useState<LookupMethod>(LookupMethod.QR_CODE);

  const resetData = useCallback(() => {
    setEmail(undefined);
    setPhone(undefined);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <div className="mt-3">
        <h1 className="text-center font-bold text-3xl">Event Check In Portal</h1>
        {!token && (
            <TokenInput
              onChange={(t) => {
                setToken(t);
              }}
            />
        )}
      </div>
      {token && (
        <div className="p-3">
          <h2 className="mb-2 font-bold text-xl">Input Mode</h2>
          <div className="flex flex-row">
            <Button color={lookupMethod === LookupMethod.QR_CODE ? 'info' : 'gray'} style={{ flex: 1, marginRight: 16 }} onClick={() => setLookupMethod(LookupMethod.QR_CODE)}>
              QR Code Scan
            </Button>
            <Button color={lookupMethod === LookupMethod.MANUAL_INPUT ? 'info' : 'gray'} style={{ flex: 1 }} onClick={() => setLookupMethod(LookupMethod.MANUAL_INPUT)}>
              Manual Input
            </Button>
          </div>
        </div>
      )}
      {token && lookupMethod === LookupMethod.QR_CODE && <QRScanner code={scannedCode} onScan={setScannedCode} />}
      {token && lookupMethod === LookupMethod.QR_CODE && (
        <AttendeeQRCheckIn code={scannedCode} token={token} clearCode={() => setScannedCode(undefined)} />
      )}
      {token && lookupMethod === LookupMethod.MANUAL_INPUT && (
        <ManualInputForm setEmail={setEmail} setPhone={setPhone} />
      )}
      {token && lookupMethod === LookupMethod.MANUAL_INPUT && (
        <AttendeeManualCheckIn
          resetData={resetData}
          token={token}
          email={email}
          phone={phone}
        />
      )}
    </div>
  );
}

export default AdminCheckinPage;
