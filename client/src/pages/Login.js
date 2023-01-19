import { Button, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector,useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";



function Login() {
const navigate = useNavigate()
const dispatch = useDispatch()
const {loading} = useSelector(state => state.alerts)

const onFinish = async (values) => {
    try{
      dispatch(showLoading())
      const response = await axios.post('/api/login', values)
      console.log(response)
      dispatch(hideLoading())
      if(response.data.status){
        toast.success(response.data.message)
        localStorage.setItem('token',response.data.data)
        navigate('/home')
      } else {
        dispatch(hideLoading())
        toast.error(response.data.message)
      }
    } catch(err){
      dispatch(hideLoading())
      toast.error(err.message)
    }
}
 

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Welcome Back</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>

          
          <Button className="primary-button my-2 full-width-button" htmlType="submit">
            LOGIN
          </Button>

          <Link to="/register" className="anchor mt-2">
            CLICK HERE TO REGISTER
          </Link>
         
        </Form>
      </div>
    </div>
  );
}

export default Login;