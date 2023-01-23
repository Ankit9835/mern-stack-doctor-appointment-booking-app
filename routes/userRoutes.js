const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/authMiddleware')

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

module.exports = router