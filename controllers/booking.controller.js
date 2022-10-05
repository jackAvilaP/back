
// Models
const { Booking } = require('../models/booking.model');
const { User } = require('../models/user.model');
const { Scenery } = require('../models/scenery.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

//middleware


const createBooking = catchAsync(async( req, res, next ) => {
    const { price, bookingDate, bookingTime,  sceneryId, fildId, status } = req.body;

    const { sessionUser } = req;
    
    const user = await User.findById(sessionUser._id);
    //Verificar bug
    const bookingExist = await Booking.findOne({bookingTime });
    
    const sceneryExist = await Scenery.findOne({ sceneryId });


    if(bookingExist){
        return next(new AppError('busy booking date',400));
    }
    
    if( !sceneryExist ){
        return next(new AppError('dont exist scenery',404));
    }
    user.password = undefined;
    
    const newBooking = await Booking.create({
        userId:user,
        sceneryId,
        bookingTime,
        bookingDate,
        price,
        status,
    });
    
    res.status(201).json({
        status: 'success',
        newBooking,
      });
});

const updateBooking = catchAsync(async (req, res, next) => {
    
    const { booking } = req;
    
     const { sceneryId, bookingDate, bookingTime, price, status } = req.body;

     await booking.updateOne({ sceneryId, bookingDate, bookingTime, price, status });

    res.status(204).json({ status: 'success' });
  });

  const deleteBooking = catchAsync(async (req, res, next) => {
    const { booking } = req;
  
    await booking.update({ status: 'deleted' });
  
    res.status(204).json({ status: 'success' });
  });

module.exports = { createBooking, updateBooking, deleteBooking };