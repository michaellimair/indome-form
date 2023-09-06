export const eventName = 'InDome 2023 - Lunar Fiesta';

export const venueLink = "https://goo.gl/maps/fNgrFAmj7j4bCeWW6";
export const venueAddress = "29 Lan Kwai Fong, 29 Wyndham Street, Central";
export const venueName = "Hold On";
export const eventDate = "Saturday, 30 September 2023";
export const eventTime = "9:30 pm - 3 am";
export const domain = "https://indome23.michaellimair.me"
export const bannerUrl = `${domain}/lunar-fiesta-banner-v2.png`;

export enum AccountInfoType {
  MOBILE_NUMBER,
  LINK,
  ACCOUNT_NUMBER,
}

export interface AccountInfo {
  type: AccountInfoType;
  value: string;
  image?: string;
}

export interface PaymentMethod {
  name: string;
  label: string;
  receiverName: string;
  accountInfo: AccountInfo[];
  bank?: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    name: 'fps',
    label: 'FPS',
    receiverName: 'PRATAMA NICKY',
    accountInfo: [{
      type: AccountInfoType.MOBILE_NUMBER,
      value: '+852-91460594',  
    }],
    bank: 'Mox Bank Limited (389)',
  },
  {
    name: 'payme',
    label: 'PayMe',
    receiverName: 'PRATAMA NICKY',
    accountInfo: [{
      type: AccountInfoType.LINK,
      value: 'https://payme.hsbc/npratama',
      image: '/payme_code.jpeg',
    }],
  },
  {
    name: 'bank_transfer',
    label: 'Bank Transfer',
    receiverName: 'PRATAMA NICKY',
    bank: 'Hang Seng Bank (024)',
    accountInfo: [{
      type: AccountInfoType.ACCOUNT_NUMBER,
      value: '361-373921-882',
    }],
  },
];

export const confirmationMessage = `I hereby confirm that I am 18 or above.

I will be able to present my proof of identity upon entry upon request.

I understand that failure to do so will result in being denied entry and no refund will be provided.`;

export const adminSecret = process.env.INDOME_ADMIN_SECRET!;
