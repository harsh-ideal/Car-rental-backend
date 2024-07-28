import  mongoose from'mongoose';

const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  rentPerDay: { type: Number, required: true },
  image:{
    filename:String,
    url:String
  },
  agency: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookings: [
    {
      customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      startDate: { type: Date, required: true },
      days: { type: Number, required: true },
    },
  ],
});

const Car = mongoose.model('Car', carSchema);

export default Car;
