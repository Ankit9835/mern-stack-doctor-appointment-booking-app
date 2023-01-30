const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../models/userModel')
const Doctor = require('../models/doctorModel')
const Appointment = require('../models/appointmentModel')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/authMiddleware')
const moment = require('moment')

router.post('/register', async (req,res) => {
    try{
       // console.log(req.body)
        const {email,name,password} = req.body
       if(!email || !name || !password){
        res.send({
            message:'please provide all values',
            status:false
        })
       }
       const emailExists = await User.findOne({email})
       console.log(emailExists)
       if(emailExists){
        return res.send({
            message:'Try another Email',
            status:false
        })
       }
        //console.log('tes')
        const newPassword = password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword,salt)
       
        const user = await User.create({name,email,password:hashedPassword})
       return  res.send({
            message:'User created successfully',
            status:true
        })
    } catch(err){
        return res.send({
            message:'test',
            data:err,
            status:false
        })
    }
})

router.post('/login', async (req,res) => {
    const {email,password} = req.body
    if(!email || !password){
        return res.status(200).json({
            message:'Please provide all values',
            status:false,
        })
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(200).json({
            message:'User does not exists with this email',
            status:false,
        })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(200).json({
            message:'Password does not matched,please try again',
            status:false,
        })
    }
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'})
    res.status(200).json({
        message:'User succefully login',
        status:true,
        data: token
    })
})

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.userId });
      user.password = undefined;
      if (!user) {
        return res
          .status(200)
          .send({ message: "User does not exist", success: false });
      } else {
        res.status(200).send({
          success: true,
          data: user
        });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error getting user info", success: false, error });
    }
  });

  router.post('/apply-doctor-account', async (req,res) => {
    try{
    
      const newDoctor = new Doctor(req.body)
      await newDoctor.save()
      const adminUser = await User.findOne({isAdmin:true})
      const unseenNotification = adminUser.unseenNotification
      unseenNotification.push({
        type:'New Doctor Request',
        message:`${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor`,
        data:{
            doctorId: newDoctor._id,
            name: newDoctor.firstName + " " + newDoctor.lastName
        },
        onClickPath:'/admin/doctorlist'
      })
      await User.findByIdAndUpdate(adminUser._id, { unseenNotification })
      res.status(200).send({
        success: true,
        message: "Doctor account applied successfully",
      });
    } catch(err){
        return res.send({
            message:err,
            data:err,
            status:false
        })
    }
})


router.post('/mark-all-read', authMiddleware, async(req,res) => {
    try{
        const user = await User.findOne({_id:req.body.userId})
        const unseenNotification = user.unseenNotification
        const seenNotification = user.seenNotification
        seenNotification.push(...unseenNotification)
        user.unseenNotification = []
        user.seenNotification = seenNotification
        const updateUser = await user.save()
        updateUser.password = undefined
        console.log(user)
        return res.status(200).json({
            success:true,
            message:'All Notifications marked as read',
            data:updateUser
        })
    } catch(err){
        return res.status(400).json({
            status:false,
            message:err
        })
    }
})

router.post('/remove-all-notifications', authMiddleware, async (req,res) => {
    try{
        const user = await User.findOne({_id:req.body.userId})
        const unseenNotification = user.unseenNotification
        const seenNotification = user.seenNotification
        user.unseenNotification = []
        user.seenNotification = []
        const updateUser = await user.save()
        updateUser.password = undefined
        console.log(updateUser)
        return res.status(200).json({
            success:true,
            message:'All notifications removed successfully',
            data:updateUser
        })
    } catch(error){
        console.log(error)
        return res.status(400).json({
            success:false,
            message:error
        })
    }
})

router.get('/get-approved-doctors', authMiddleware, async (req,res) => {
    try{
        const doctors = await Doctor.find({status:'approved'})
        if(doctors){
            return res.status(200).json({
                success:true,
                message:'Doctor fetched',
                data:doctors
            })
        }
    } catch(error){
        return res.status(400).json({
            success:false,
            message:error,
          
        })
    }
})

router.post('/book-appointment', authMiddleware, async (req,res) => {
    try{
        req.body.status = 'pending'
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString()
        console.log(req.body.date)
        req.body.time = moment(req.body.time, "HH:mm").format('HH:mm');
        const appointment = new Appointment(req.body)
        await appointment.save()
        const doctor = await User.findOne({_id:req.body.doctorInfo.userId})
        doctor.unseenNotification.push({
            type:'A new appointment is available',
            message:`A new patient - ${req.body.userInfo.name} is booked `
        })
        await doctor.save()
        return res.status(200).json({
            success:true,
            message:'Appointment booked successfully'
        })
    } catch(error){
        return res.status(400).json({
            success:false,
            message:error
        })
    }
})

router.post('/check-booking', async (req,res) => {
    try{
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString()
        const fromTime = moment(req.body.time, "HH::mm").subtract(1, "hours").format('HH:mm')
        const toTime = moment(req.body.time, "HH::mm").add(1, "hours").format('HH:mm')
        const from = moment(req.body.time, "HH::mm").format('HH:mm')
        const to = moment(req.body.time, "HH::mm").format('HH:mm')
        console.log('from',from)
        console.log('to',to)
       // console.log(toTime)
        const doctorId = req.body.doctorId
        const appointments = await Appointment.find({
            doctorId,
            date,
            time: { $gte: fromTime, $lte: toTime },
          });
          console.log(appointments.length)
          const doctor = await Doctor.findOne({_id:doctorId})
         
        const check = await Doctor.find({
             _id:doctorId,
             timings: {$gte: from, $lte: to}
        })

        console.log('test',check)

        if(check.length == 0){
            return res.status(200).send({
                message: "Appointments not available",
                success: false,
              });
        }
         else if (appointments.length > 0) {
            return res.status(200).send({
              message: "Appointments not available",
              success: false,
            });
          } else {
            return res.status(200).send({
              message: "Appointments available",
              success: true,
            });
          }
    } catch(error){
        console.log(error)
        return res.status(400).json({
            success:false,
            message:'Error'
        })
    }
})

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
    try {
      const appointments = await Appointment.find({ userId: req.body.userId });
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
  });
module.exports = router