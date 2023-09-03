import { Mongoose } from "mongoose";
import { TicketTier } from "./constants";

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

export interface IStatistics {
  totalAttendees: number;
  checkedInAttendees: number;
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
  paymentMethod: string;
  paymentProofFileName: string;
  price: number;
  tier: TicketTier;
  imageToken?: string;
  checkedIn?: boolean;
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
}
