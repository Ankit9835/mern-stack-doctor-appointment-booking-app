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

module.exports = router