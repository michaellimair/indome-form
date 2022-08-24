import { Button, Tooltip } from "flowbite-react";
import { FC, useCallback, useMemo, useState } from "react";
import { AccountInfo, AccountInfoType, PaymentMethod } from "../constants";
import { ExternalLink } from "./ExternalLink";

const getLabelByAccountInfoType = (type: AccountInfoType) => {
  if (type === AccountInfoType.MOBILE_NUMBER) {
    return 'Mobile Number';
  }
  return 'Account Number';
}

const AccountInfoValue: FC<AccountInfo> = ({ type, value }) => {
  if (type === AccountInfoType.LINK) {
    return <ExternalLink href={value} rel="noopener noreferrer" target="_blank">{value}</ExternalLink>
  }
  return <>{value}</>
}

interface SelectedMethodInfoProps { method: PaymentMethod; price: number }

const FPSQRCodeDisplay: FC<SelectedMethodInfoProps> = ({
  price,
  method,
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const imageSrc = useMemo(() => {
    if (price === 20000) {
      return '/qrcode_200hkd.png';
    }
    if (price === 22500) {
      return '/qrcode_225hkd.png';
    }
    return '/qrcode_250hkd.png';
  }, [price]);

  const copyPhone = useCallback(() => {
    navigator.clipboard.writeText(method.accountInfo[0].value.replace('+852-', ''));
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2500);
  }, [method]);

  return (
    <div>
      <img
        src={imageSrc}
        className="w-84"
      />
      <Tooltip content={<span>{showTooltip ? 'Copied' : 'Copy'}</span>}>
        <Button style={{ marginTop: 2 }} onClick={copyPhone}>
          Copy Phone Number
        </Button>
      </Tooltip>
    </div>
  );
};

export const SelectedMethodInfo: FC<SelectedMethodInfoProps> = ({
  method,
  price,
}) => {
  return (
    <div className="mt-4">
      <p className="font-bold">{method.label}</p>
      <p>Amount: HKD {(price / 100).toFixed(2)}</p>
      <p>Receiver Name: {method.receiverName}</p>
      {method.accountInfo.map(({ type, value, image }) => (
        <>
          <p>{getLabelByAccountInfoType(type)}: <AccountInfoValue type={type} value={value} /></p>
          {image && (
            <img
              src={image}
              className="w-96"
            />
          )}
        </>
      ))}
      {method.name === 'fps' && (
        <FPSQRCodeDisplay price={price} method={method} />
      )}
    </div>
  )
}