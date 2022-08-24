import { FilterQuery } from "mongoose";
import { IOrder } from "../global";

export const pendingQuery: FilterQuery<IOrder> = {
  filled: false,
  expiresAt: {
    $gt: new Date()
  },
};

export const completedQuery: FilterQuery<IOrder> = {
  filled: true,
};
