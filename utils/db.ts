import { FilterQuery } from "mongoose";
import { IOrder } from "../global";

export const getPendingQuery: () => FilterQuery<IOrder> = () => ({
  filled: false,
  expiresAt: {
    $gt: new Date()
  },
});

export const getCompletedQuery: () => FilterQuery<IOrder> = () => ({
  filled: true,
});
