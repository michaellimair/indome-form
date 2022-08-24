import { Button } from "flowbite-react";
import { FC, useCallback } from "react";

export const OpenBankApp: FC = () => {
  const openHangSengBankApp = useCallback(() => {
    window.location.assign("haserbapp://open")
  }, []);
  
  const openMoxBankApp = useCallback(() => {
    window.location.assign("mox://")
  }, []);

  const openZABankApp = useCallback(() => {
    window.location.assign("zabank://")
  }, []);

  return (
    <div className="mt-5 mb-1 flex space-y-2 flex-col">
      <p>Open one of the bank apps below:</p>
      <Button color="success" style={{ backgroundColor: '#34a344' }} onClick={openHangSengBankApp}>
        Open in Hang Seng Bank
      </Button>
      <Button color="success" style={{ backgroundColor: 'black' }} onClick={openMoxBankApp}>
        Open in Mox Bank
      </Button>
      <Button color="success" style={{ backgroundColor: '#02ce9e' }} onClick={openZABankApp}>
        Open in ZA Bank
      </Button>
      <p className="text-sm">Note: Other banks are also supported, the buttons above are only provided for convenience</p>
    </div>
  )
}