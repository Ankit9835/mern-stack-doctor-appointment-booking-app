import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { hideLoading, showLoading } from '../redux/alertsSlice'
import { setUser } from '../redux/userSlice'



const ProtectedRoute = (props) => {
  const {user} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getData = async () => {
    try{
      dispatch(showLoading())
      const response = await axios.post('/api/get-user-info-by-id', 
      {token:localStorage.getItem('token')},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    dispatch(hideLoading())
   // console.log(response)
    if(response.data.success){
      dispatch(setUser(response.data.data));
    } else {
      localStorage.clear()
      navigate('/login')
    }
    } catch(err){
      dispatch(hideLoading())
      console.log(err)
    }
  }

  useEffect(() => {
    if(!user){
      getData()
    }
  },[])
  if(localStorage.getItem('token')){
    return props.children
  } else {
    return <Navigate to='/login' />
  }
}

export default ProtectedRoute
