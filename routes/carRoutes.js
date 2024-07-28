import express from 'express';
import { addCar, getAvailableCars, bookCar, getBookedCars, editCar, getCar, removeCar } from '../controllers/carController.js';
import { protect, agencyProtect } from '../middleware/authMiddleware.js';
const router = express.Router();
import {storage} from '../cloudConfig.js';
import multer from "multer";

const upload=multer({storage:storage});

router.post('/cars',upload.single('car_img'), protect, agencyProtect, addCar);
router.get('/cars', getAvailableCars);
router.post('/rent/:carId', protect, bookCar);
router.get('/booked-cars', protect, agencyProtect, getBookedCars);
router.get('/car/edit/:carid',getCar);
router.put('/car/edit/:carid', protect, agencyProtect, editCar);
router.delete(`/car/remove/:carid`,protect, agencyProtect, removeCar)
export default router;
