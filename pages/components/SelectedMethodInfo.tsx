import { FC, useMemo } from "react";
import { AccountInfo, AccountInfoType, PaymentMethod } from "../../constants";
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

const FPSQRCodeDisplay: FC<{ price: number }> = ({
  price,
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
    <img
      src={imageSrc}
      className="w-84"
    />
  );
};

export const SelectedMethodInfo: FC<{ method: PaymentMethod; price: number }> = ({
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
        <FPSQRCodeDisplay price={price} />
      )}
    </div>
  )
}