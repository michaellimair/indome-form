import mongoose, { Model } from 'mongoose';
import { IWaitlist } from '../global';

const WaitlistSchema = new mongoose.Schema<IWaitlist>({
  name: String,
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
}, {
  timestamps: true,
})

const Waitlist = mongoose.models.Waitlist as Model<IWaitlist> || mongoose.model<IWaitlist>('Waitlist', WaitlistSchema);

export default Waitlist;
