const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router()
const Doctor = require('../models/doctorModel')
const { route } = require('./adminRoutes')

router.get('/get-doctor-by-id', authMiddleware,async (req,res) => {
    try{
        console.log(req.body.test)
        const doctor = await Doctor.findOne({userId:req.userId})
        if(doctor){
            return res.status(200).json({
                success:true,
                message:'Doctor founds',
                data:doctor
            })
        } else {
            return res.status(400).json({
                success:true,
                message:'Doctor not found',
                data:null
            })
        }
    } catch(error){
        return res.status(400).json({
            success:false,
            message: error,
        })
    }
})

router.post('/update-profile', authMiddleware, async (req,res) => {
    try{
        console.log(req.body.userId)
        const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
       // console.log(doctor)
        if(doctor){
            //console.log(req.userId)
            return res.status(200).json({
                success:true,
                message:'Doctor updated successfully',
                data:doctor
            })
        }
    } catch(error){
        return res.status(400).json({
            success:false,
            message:error
        })
    }
})

router.post('/getdoctor-info-id', authMiddleware, async(req,res) => {
    try{
        const doctor = await Doctor.findOne({_id:req.body.doctorId})
        if(doctor){
            return res.status(200).json({
                success:true,
                message:'doctor fetched',
                data:doctor
            })
        }
    } catch(error){
        return res.status(400).json({
            success:false,
            message:error,
        })
    }
})

router.get(
    "/get-appointments-by-doctor-id",
    authMiddleware,
    async (req, res) => {
      try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        const appointments = await Appointment.find({ doctorId: doctor._id });
        res.status(200).send({
          message: "Appointments fetched successfully",
          success: true,
          data: appointments,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          message: "Error fetching appointments",
          success: false,
          error,
        });
      }
    }
  );

  router.post("/change-appointment-status", authMiddleware, async (req, res) => {
    try {
      const { appointmentId, status } = req.body;
      const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
        status,
      });
  
      const user = await User.findOne({ _id: appointment.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "appointment-status-changed",
        message: `Your appointment status has been ${status}`,
        onClickPath: "/appointments",
      });
  
      await user.save();
  
      res.status(200).send({
        message: "Appointment status updated successfully",
        success: true
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error changing appointment status",
        success: false,
        error,
      });
    }
  });
  

module.exports = router