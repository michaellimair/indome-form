import mongoose, { Model } from 'mongoose';
import jsonwebtoken from 'jsonwebtoken';
import { IOrder } from '../global';

const OrderSchema = new mongoose.Schema<IOrder>({
  name: String,
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  filled: {
    type: Boolean,
    default: false,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  expiresAt: Date,
  acknowledgeAgeRequirement: {
    type: Boolean,
    default: false,
  },
  acknowledgeVaccineRequirement: {
    type: Boolean,
    default: false,
  },
  paymentMethod: String,
  paymentProofFileName: String,
  price: Number,
  checkedIn: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Order = mongoose.models.Order as Model<IOrder> || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
