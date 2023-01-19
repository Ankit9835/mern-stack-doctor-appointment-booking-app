import React, { useEffect } from 'react'
import axios from 'axios'
import { useSelector,useDispatch } from "react-redux";

const Home = () => {
    const {loading} = useSelector(state => state.alerts)
    const getData = async () => {
        console.log(loading)
        const response = await axios.post('/api/get-user-info-by-id',{}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              }
        })
    }

    useEffect(() => {
        getData()
    },[])
  return (
    <div>
        Home
    </div>
  )
}

export default Home
