import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector,useDispatch } from "react-redux";
import  Layout  from '../components/Layout';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import Doctor from '../components/Doctor';
import { Col, Row } from "antd";


const Home = () => {
    const dispatch = useDispatch()
    const [doctors,setDoctor] = useState([])
    const getData = async () => {
        try{
          dispatch(showLoading())
          const response = await axios.get('api/get-approved-doctors', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              }
          })
          dispatch(hideLoading())
          if(response.data.success){
            setDoctor(response.data.data)
          } else {
            toast.error('Something went wrong')
          }
        } catch(error){
          toast.error(error)
          console.log(error)
        }
       
    }

    useEffect(() => {
        getData()
    },[])
  return (
    <Layout>
        <Row gutter={20}>
        {doctors.map((doctor) => (
          <Col span={8} xs={24} sm={24} lg={8}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Layout>
  )
}

export default Home
