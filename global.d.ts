import { Mongoose } from "mongoose";

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

export interface IOrder {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  filled: boolean;
  confirmed: boolean;
  expiresAt: Date;
  acknowledgeAgeRequirement: boolean;
  acknowledgeVaccineRequirement: boolean;
  paymentMethod: string;
  paymentProofFileName: string;
  price: number;
}

export interface IWaitlist {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface IEventForm {
  name: string;
  email: string;
  phone: string;
  acknowledgeAgeRequirement: boolean;
  acknowledgeVaccineRequirement: boolean;  
}
