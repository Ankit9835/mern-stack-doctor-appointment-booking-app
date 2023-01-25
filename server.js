const express = require('express')
require('dotenv').config()
const dbConfig = require("./config/dbConfig");
const app = express()
app.use(express.json())
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
app.use('/api', userRoutes)
app.use('/api/admin', adminRoutes)
const port = 5000
app.listen(port, () => {
    console.log(`server listening to ${port} no`)
})