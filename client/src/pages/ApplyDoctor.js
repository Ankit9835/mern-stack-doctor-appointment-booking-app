import React from 'react'
import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApplyDoctor = () => {
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.user)
    const navigate = useNavigate()
    const onFinish = async (values) => {
        try{
            console.log(values)
            dispatch(showLoading())
            const response = await axios.post('/api/apply-doctor-account',{
                ...values,
                userId:user._id
            },{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            console.log(response)
            dispatch(hideLoading())
            if(response.data.success){
                toast.success(response.data.message)
                navigate('/')
            } else {
                toast.error(response.data.error)
            }
        } catch(err){
            dispatch(hideLoading())
            toast.error("Something went wrong");
        }
    }

  return (
    <Layout>
            <Form
        layout="vertical"
        onFinish={onFinish}
        >
        <h1 className="card-title mt-3">Personal Information</h1>
        <Row gutter={20}>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
                required
                label="First Name"
                name="firstName"
                rules={[{ required: true }]}
            >
                <Input placeholder="First Name" />
            </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
                required
                label="Last Name"
                name="lastName"
                rules={[{ required: true }]}
            >
                <Input placeholder="Last Name" />
            </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
                required
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true }]}
            >
                <Input placeholder="Phone Number" />
            </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
                required
                label="Website"
                name="website"
                rules={[{ required: true }]}
            >
                <Input placeholder="Website" />
            </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
                required
                label="Address"
                name="address"
                rules={[{ required: true }]}
            >
                <Input placeholder="Address" />
            </Form.Item>
            </Col>
        </Row>
        <hr />
        <h1 className="card-title mt-3">Professional Information</h1>
        <Row gutter={20}>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
                required
                label="Specialization"
                name="specialization"
                rules={[{ required: true }]}
            >
                <Input placeholder="Specialization" />
            </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
                required
                label="Experience"
                name="experience"
                rules={[{ required: true }]}
            >
                <Input placeholder="Experience" type="number" />
            </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
                required
                label="Fee Per Cunsultation"
                name="feePerCunsultation"
                rules={[{ required: true }]}
            >
                <Input placeholder="Fee Per Cunsultation" type="number" />
            </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
                required
                label="Timings"
                name="timings"
                rules={[{ required: true }]}
            >
                <TimePicker.RangePicker format="HH:mm A" />
            </Form.Item>
            </Col>
        </Row>

        <div className="d-flex justify-content-end">
            <Button className="primary-button" htmlType="submit">
            SUBMIT
            </Button>
        </div>
        </Form>
    </Layout>
  )
}

export default ApplyDoctor
