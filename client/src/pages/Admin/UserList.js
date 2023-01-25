
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import  Layout  from '../../components/Layout'
import { hideLoading, showLoading } from '../../redux/alertsSlice'
import moment from "moment";
import { Table } from 'antd'



const UserList = () => {
  
  const [user,setUser] = useState([])
  const dispatch = useDispatch()

  const getUserData = async () => {
      try{
        dispatch(showLoading())
        const response = await axios.get('/api/admin/all-users',{
          headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        console.log(response)
        dispatch(hideLoading())
        if(response.data.success){
           setUser(response.data.data)
        } else {
          toast.error('something went wrong')
        }
      } catch(error){
        console.log(error)
      }
  }

  useEffect(()=>{
    getUserData()
  },[])

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record , text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <h1 className="anchor">Block</h1>
        </div>
      ),
    },
  ];
  return (
    <Layout>
      UserList
      <hr />
      <Table columns={columns} dataSource={user}/>
    </Layout>
  )
}

export default UserList
