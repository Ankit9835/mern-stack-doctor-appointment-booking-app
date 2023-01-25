const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const Doctor = require('../models/doctorModel')
const User = require('../models/userModel')

router.get('/all-doctors', authMiddleware, async (req,res) => {
    try{
        const doctors = await Doctor.find({})
        return res.status(200).json({
            success:true,
            message:'Doctor fetched successfully',
            data:doctors
        })
    } catch(error) {
        return res.status(400).json({
            success:false,
            message: error
        })
    }
})

router.get('/all-users', authMiddleware, async (req,res) => {
    try{
        const users = await User.find({})
        return res.status(200).json({
            success:true,
            message:'Doctor fetched successfully',
            data:users
        })
    } catch(error) {
        return res.status(400).json({
            success:false,
            message: error
        })
    }
})

router.post('/change-doctor-status', authMiddleware, async (req,res) => {
    try{
        const {doctorId,status} = req.body
        const doctor = await Doctor.findOne({_id:doctorId})
        doctor.status = status
        await doctor.save()
       
        const {userId} = doctor
        const user = await User.findOne({_id:userId})
        const unseenNotification = user.unseenNotification
        unseenNotification.push({
            type:'Notification from Admin, For Your Request',
            message:`Admin has ${status} your request`,
            onClickPath:'/navigations'
        })
        await user.save()
        return res.status(200).json({
            success:true,
            message:'Status changed successfully',
        })
    } catch(error){
        console.log(error)
        return res.status(400).json({
            success:false,
            message:error,
        })
    }
})

module.exports = router