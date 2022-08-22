import mongoose, { Model } from 'mongoose';
import { IOrder } from '../global';

const OrderSchema = new mongoose.Schema<IOrder>({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
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
}, {
  timestamps: true,
})

const Order = mongoose.models.Order as Model<IOrder> || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
