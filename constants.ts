export const eventName = 'InDome Roof Rave - 2022';

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

export const confirmationMessage = `I hereby confirm that I am 18 or above and have been fully vaccinated according to the [guidelines of the HKSAR Government](https://www.coronavirus.gov.hk/pdf/vp_t1_ENG.pdf).

I will be able to present my identity and proof of vaccination upon entry.

I understand that failure to do so will result in being denied entry and no refund will be provided.`;
