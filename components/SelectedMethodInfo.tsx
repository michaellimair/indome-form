import { Button, Tooltip } from "flowbite-react";
import { FC, Fragment, useCallback, useMemo, useState } from "react";
import { AccountInfo, AccountInfoType, PaymentMethod } from "../constants";
import { ExternalLink } from "./ExternalLink";
import { OpenBankApp } from "./OpenBankApp";

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

const CopyButton: FC<{ value: string; label: string }> = ({
  value,
  label,
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const copyAccountNumber = useCallback(() => {
    navigator.clipboard.writeText(value);
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2500);
  }, [value]);

  return (
    <div>
      <Tooltip content={<span>{showTooltip ? 'Copied' : 'Copy'}</span>}>
        <Button style={{ marginTop: 2 }} onClick={copyAccountNumber}>
          {label}
        </Button>
      </Tooltip>
    </div>
  );
};

const FPSQRCodeDisplay: FC<SelectedMethodInfoProps> = ({
  price,
  method,
}) => {
  const imageSrc = useMemo(() => {
    if (price === 20000) {
      return '/qrcode_200hkd.png';
    }
    if (price === 22500) {
      return '/qrcode_225hkd.png';
    }
    return '/qrcode_250hkd.png';
  }, [price]);

  return (
    <div>
      <img
        src={imageSrc}
        className="w-84"
      />
      <CopyButton value={method.accountInfo[0].value.replace('+852-', '')} label="Copy Phone Number" />
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
      <p>Receiver Name: {method.receiverName}</p>
      <p>Amount: HKD {(price / 100).toFixed(2)}</p>
      {method.bank && <p>Bank: {method.bank}</p>}
      {method.accountInfo.map(({ type, value, image }) => (
        <Fragment key={type}>
          <p>{getLabelByAccountInfoType(type)}: <AccountInfoValue type={type} value={value} /></p>
          {image && (
            <img
              src={image}
              className="w-96"
            />
          )}
          {method.name === 'bank_transfer' && (
            <div className="mt-3">
              <CopyButton value={value.replace(/-/gi, '')} label="Copy Account Number" />
            </div>
          )}
        </Fragment>
      ))}
      {method.name === 'fps' && (
        <FPSQRCodeDisplay price={price} method={method} />
      )}
      {(method.name === 'fps' || method.name === 'bank_transfer') && (
        <OpenBankApp />
      )}
    </div>
  )
}