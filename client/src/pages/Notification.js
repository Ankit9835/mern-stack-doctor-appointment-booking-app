
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { setUser } from "../redux/userSlice";
import toast from "react-hot-toast";


function Notifications() {
const {user} = useSelector((state) => state.user)
const dispatch = useDispatch()
const navigate = useNavigate()
const markAllSeen = async () => {
  try{
    dispatch(showLoading())
    const response = await axios.post('/api/mark-all-read', {userId:user._id},{
      headers:{
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    })
    dispatch(hideLoading())
    if(response.data.success){
      toast.success(response.data.message)
      setUser(response.data.data)
    } else {
      toast.error(response.data.error)
    }
    console.log(response)
  } catch(err){
    dispatch(hideLoading())
    toast.error(err)
  }
}

const deleteNotification = async () => {
  try{
    const response = await axios.post('/api/remove-all-notifications', {userId:user._id},{
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    if(response.data.success){
      toast.success(response.data.message)
      setUser(response.data.data)
    } else {
      toast.error(response.data.message)
    }
  } catch(err){
     toast.error(err)
  }
}
  return (
    
    <Layout>

        <h1 className="page-title">Notifications</h1>
      <hr />

      <Tabs>
        <Tabs.TabPane tab="Unseen" key={0}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={() => markAllSeen()}>Mark all as seen</h1>
          </div>

          {user?.unseenNotification.map((notification) => (
            <div className="card p-2 mt-2" onClick={()=>navigate(notification.onClickPath)}>
                <div className="card-text">{notification.message}</div>
            </div>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane tab="seen" key={1}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={() => deleteNotification()}>Delete all</h1>
          </div>

          {user?.seenNotification.map((notification) => (
            <div className="card p-2 mt-2" onClick={()=>navigate(notification.onClickPath)}>
                <div className="card-text">{notification.message}</div>
            </div>
          ))}
         
        </Tabs.TabPane>
      </Tabs> 
        
    </Layout>
  );
}

export default Notifications;