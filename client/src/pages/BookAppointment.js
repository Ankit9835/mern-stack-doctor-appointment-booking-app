import Layout from "../components/Layout";
import { Button, Col, DatePicker, Form, Input, Row, TimePicker } from "antd";
import moment from "moment";
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";


const BookAppointment = () => {
 const params = useParams()
 const [isAvailable,setIsAvailable] = useState(false)
 const [date,setDate] = useState()
 const [time,setTime] = useState()
 const [doctor,setDoctor] = useState([])
 const dispatch = useDispatch()
 const {user} = useSelector((state) => state.user)
 const navigate = useNavigate()
 const getDoctorsData = async () => {
    try{
        const response = await axios.post('/api/doctor/getdoctor-info-id', {
            doctorId:params.doctorId
        },{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log(response.data.data.timings[1])
        if(response.data.success){
            setDoctor(response.data.data)
        }
        } catch(error){
            toast.error(error)
        }
 }

 const checkAvaibality = async () => {
    try{
      dispatch(showLoading())
      console.log(time)
      const response = await axios.post('/api/check-booking',{
        doctorId:params.doctorId,
        date,
        time
      },{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      console.log(response)
      if(response.data.success){
        toast.success(response.data.message)
        setIsAvailable(true)
      } else{
        toast.error(response.data.message)
      }
    } catch(error){
       console.log(error)
       toast.error(error)
    }
 }

 const bookNow = async () => {
  setIsAvailable(false);
  try {
    dispatch(showLoading());
    const response = await axios.post(
      "/api/book-appointment",
      {
        doctorId: params.doctorId,
        userId: user._id,
        doctorInfo: doctor,
        userInfo: user,
        date: date,
        time: time,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    dispatch(hideLoading());
    if (response.data.success) {
      
      toast.success(response.data.message);
      //navigate('/appointments')
    }
  } catch (error) {
    toast.error("Error booking appointment");
    dispatch(hideLoading());
  }
};

 useEffect(() => {
    getDoctorsData()
 },[])

  return (
    <Layout>
          {doctor && (
        <div>
          <h1 className="page-title">
            {doctor.firstName} {doctor.lastName}
          </h1>
          <hr />
          <Row gutter={20} className="mt-5" align="middle">

            <Col span={8} sm={24} xs={24} lg={8}>
              <img
                src="https://thumbs.dreamstime.com/b/finger-press-book-now-button-booking-reservation-icon-online-149789867.jpg"
                alt=""
                width="100%"
                height='400'
              />
            </Col>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Timings : {doctor.timings} </b> 
              </h1>
              <p>
                <b>Phone Number : </b>
                {doctor.phoneNumber}
              </p>
              <p>
                <b>Address : </b>
                {doctor.address}
              </p>
              <p>
                <b>Fee per Visit : </b>
                {doctor.feePerCunsultation}
              </p>
              <p>
                <b>Website : </b>
                {doctor.website}
              </p>
              <div className="d-flex flex-column pt-2 mt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    
                    setIsAvailable(false)
                    setDate(moment(value.$d).format("DD-MM-YYYY"));
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    console.log(value.$d)
                    setTime(moment(value.$d).format("HH:mm"));
                   
                  }}
                />
              {!isAvailable &&   <Button
                  className="primary-button mt-3 full-width-button"
                  onClick={checkAvaibality}
                >
                  Check Availability
                </Button>}

                {isAvailable && (
                  <Button
                    className="primary-button mt-3 full-width-button"
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>
                )}
              </div>
            </Col>
           
          </Row>
        </div>
      )}
    </Layout>
  )
}
export default BookAppointment
