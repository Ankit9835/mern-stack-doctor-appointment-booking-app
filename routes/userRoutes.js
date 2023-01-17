const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../models/userModel')

router.post('/register', async (req,res) => {
    try{
       // console.log(req.body)
        const {email,name,password} = req.body
       if(!email || !name || !password){
        res.status(200).send({
            message:'please provide all values',
            status:false
        })
       }
       const emailExists = await User.findOne({email})
       if(emailExists){
        res.status(200).send({
            message:'Try another Email',
            status:false
        })
       }
        //console.log('tes')
        const newPassword = password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword,salt)
       
        const user = await User.create({name,email,password:hashedPassword})
        res.status(200).send({
            message:'User created successfully',
            status:true
        })
    } catch(err){
        res.status(500).send({
            message:err.message,
            status:false
        })
    }
})

router.post('/login', async (req,res) => {
    
})

module.exports = router