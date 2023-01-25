
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import  Layout  from '../../components/Layout'
import { hideLoading, showLoading } from '../../redux/alertsSlice'
import moment from "moment";
import { Table } from 'antd'
const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const resposne = await axios.get("/api/admin/all-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (resposne.data.success) {
        setDoctors(resposne.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const changeDoctorStatus = async (record,status) => {
    try{
      const response = await axios.post('/api/admin/change-doctor-status',{
        doctorId:record._id, userId:record.userId, status:status
      },{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        } 
      })
      if(response.data.success){
        toast.success(response.data.message)
        getDoctorsData()
      }
    } catch(error){
      toast.error(error)
      console.log(error)
    }
  }

  useEffect(() => {
    getDoctorsData()
  },[])

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record , text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record,'approved')}
            >
              Approve
            </h1>
          )}
          {record.status === "approved" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record,'pending')}
            >
              Block
            </h1>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      DoctorList
      <hr />
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  )
}

export default DoctorList
