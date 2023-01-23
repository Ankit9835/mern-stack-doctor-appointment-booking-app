import React, { useEffect } from 'react'
import axios from 'axios'
import { useSelector,useDispatch } from "react-redux";
import  Layout  from '../components/Layout';

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
    <Layout>
        Home
    </Layout>
  )
}

export default Home
