import Layout from "../components/Layout";
import { Button, Col, DatePicker, Form, Input, Row, TimePicker } from "antd";
import moment from "moment";
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'


const BookAppointment = () => {
 const params = useParams()
 const [isAvailable,setIsAvailable] = useState(false)
 const [date,setDate] = useState()
 const [time,setTime] = useState()
 const [doctor,setDoctor] = useState([])
 const getDoctorsData = async () => {
    try{
        const response = await axios.post('/api/doctor/getdoctor-info-id', {
            doctorId:params.doctorId
        },{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if(response.data.success){
            setDoctor(response.data.data)
        }
        } catch(error){
            toast.error(error)
        }
 }

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
                <b>Timings :</b> 
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
                    setDate(moment(value).format("DD-MM-YYYY"));
                    setIsAvailable(false);
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(moment(value).format("HH:mm"));
                  }}
                />
              {!isAvailable &&   <Button
                  className="primary-button mt-3 full-width-button"
                  
                >
                  Check Availability
                </Button>}

                {isAvailable && (
                  <Button
                    className="primary-button mt-3 full-width-button"
                   
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
