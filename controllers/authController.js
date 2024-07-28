import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const { userType } = req.params;
  console.log("yha aa rha hai ");
  console.log(name + email + password + userType);
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, userType });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await user.save()
    res.status(201).json({ token, userType: user.userType,userid:user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;


  try {
    console.log(email);
    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user || !(await user.matchPassword(password))) {
      console.log("Invalid Password");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(token+user.userType);
    res.status(201).json({ token:token, userType: user.userType });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const authen=async(req,res)=>{
  try {
    const { user } = req;
    res.status(200).json({
      userType: user.userType,
      userid: user._id,
    });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
}