import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  console.log("protect")
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    console.log("yha aya");
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    console.log("yha gadbadi hai");
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const agencyProtect = (req, res, next) => {
  console.log("agencyProtect");
  if (req.user.userType === 'agency') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

export const auth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  console.log(token+"0000000");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};
