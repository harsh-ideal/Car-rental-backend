import Car from '../models/Car.js';
import User from '../models/User.js';
import {storage} from '../cloudConfig.js';




export const addCar = async (req, res) => {
  const { model, number, capacity, rentPerDay } = req.body;
  let url=req.file.path;
    let filename=req.file.filename;
  console.log(url+" "+filename);
  console.log("add kr to rhe hai hai"+model+number+capacity+rentPerDay);
  try {
    const newCar = await Car.create({
      model,
      number,
      capacity,
      rentPerDay,
      image:{
        filename,
        url
      },
      agency: req.user._id,
    });
    await newCar.save()
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const editCar = async (req, res) => {
  const { model, number, capacity, rentPerDay } = req.body;
  const id=req.params.carid;
  console.log("yha");
  console.log(model);
  try {
    const car = await Car.findByIdAndUpdate(
      id,
      {
        model,
        number,
        capacity,
        rentPerDay,
      },
      { new: true } // This option returns the updated document
    );

    console.log(car);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCar = async (req, res) => {
  const id=req.params.carid;
  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeCar = async (req, res) => {
  const id=req.params.carid;
  try {
    const car = await Car.findByIdAndDelete(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAvailableCars = async (req, res) => {
  console.log(process.env.CLOUD_API_KEY);
  try {
    const cars = await Car.find().populate('agency','name email');
    console.log(cars);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const bookCar = async (req, res) => {
  const { carId } = req.params;
  const userId=req.user._id;
  let { startDate, days } = req.body;
  const dateObject = new Date(startDate);
  startDate = dateObject.toISOString().split('T')[0];
  try {
    console.log('-1');
    const car = await Car.findById(carId);
    console.log("-2");
    const user = await User.findById(userId);
    console.log('-3');
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("-4");
    car.bookings.push({ customer: userId, startDate, days });
    console.log("1");
    await user.bookings.push({bookCar:carId,startDate,days});
    console.log("2");
    await car.save();
    console.log('3');
    await user.save();
    console.log('4');

    res.status(200).json({ message: 'Car booked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBookedCars = async (req, res) => {
  try {
    const cars = await Car.find({ agency: req.user._id }).populate('bookings.customer', 'name email');
    console.log(cars[0].bookings);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const myBookedCars = async (req, res) => {
  try {
   
    const user = await User.findById(req.user._id).populate('bookings.bookCar', 'model capacity rentPerDay number agency');
   
   
      user.bookings.map(async (booking)=>{
        let id=booking.bookCar.agency;
        const agen=await User.findById(id);
        booking.bookCar.agency=agen.name;
        booking.bookCar.agencyemail=agen.email;
      })
     
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



