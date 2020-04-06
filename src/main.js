import React,{Component} from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/icons/Send';
import StopIcon from '@material-ui/icons/Stop';
import MailIcon from '@material-ui/icons/Mail';
import Badge from '@material-ui/core/Badge';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CameraIcon from '@material-ui/icons/Camera';
// import DeleteIcon from '@material-ui/icons/Delete';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
// import { ipcRenderer } from 'electron';
const { ipcRenderer } = window.require('electron');

// import {
//   START_NOTIFICATION_SERVICE,
//   NOTIFICATION_SERVICE_STARTED,
//   NOTIFICATION_SERVICE_ERROR,
//   NOTIFICATION_RECEIVED as ON_NOTIFICATION_RECEIVED,
//   TOKEN_UPDATED
// } from 'electron-push-receiver/src/constants';

const {
  // START_NOTIFICATION_SERVICE,
  // NOTIFICATION_SERVICE_STARTED,
  // NOTIFICATION_SERVICE_ERROR,
  NOTIFICATION_RECEIVED ,
  TOKEN_UPDATED} = window.require('electron-push-receiver/src/constants')
const ON_NOTIFICATION_RECEIVED = NOTIFICATION_RECEIVED

class Main extends Component {
  constructor(props){
    super(props);
    // this.file_mp3 = React.createRef();
    this.optionBox = React.createRef();
    this.state={
      ip_server: "127.0.0.1",
      file_mp3:"2.mp3",
      file_image:"",
      list_cam: [],
      messages: [],
      number_of_notification: 0

    }
  }

  // componentWillUnmount = () =>{
  //   let session = localStorage.getItem("session")
  //   axios.get(`https://mekongsmartcam.vnpttiengiang.vn/server/logout?session=${session}`)
  //   // this.props.logout(true)
  // }

  componentDidMount = async ()=>{

    let id = localStorage.getItem("id")
    let session = localStorage.getItem("session")
    window.addEventListener("beforeunload", (ev) =>
      {
        ev.preventDefault();
        axios.get(`https://mekongsmartcam.vnpttiengiang.vn/server/logout?session=${session}`)
        // if(false){
          // return ev.returnValue = 'Are you sure you want to close?';

        // }
      });
    axios.get(`https://mekongsmartcam.vnpttiengiang.vn/server/api/admin/cameras/facerecs?user_id=${id}&facerec_status=1&page=1&limit=10000&session=${session}`).then(
      response =>{
        // console.log(response)
        response.data.results.forEach(element => {
          let info_cam = {
            id: element.FACEREC_ID,
            name: element.CAMERA_NAME
          }
          this.setState({list_cam:[...this.state.list_cam,info_cam]})
        });
        // console.log(this.state.list_cam)
      }
    )
    // Listen for service successfully started
    // ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) =>{
    //   console.log('service successfully started, This is client Key: ', token)
    //   localStorage.setItem('token',token)
    //   // axios.post('http://192.168.55.158:8080/get_client_key/',JSON.stringify({ client_key: token }))
    //   axios({
    //     method: "post",
    //     url: "http://127.0.0.1:8080/get_client_key/",
    //     data: JSON.stringify({ client_key: token }),
    //     headers: { "Content-Type": "application/json; charset=utf-8" }
    //   }).then(respone =>{
    //     console.log("Send Client Key Successful !")
    //     console.log(respone)
    //   }).catch(error => {
    //     console.log(error)
    //     console.log("fail to stared service")
    //   })
    // } );

    // Send FCM token to backend
    ipcRenderer.on(TOKEN_UPDATED, (_, token) =>{
      console.log("send FCM token to backend")
    } );


    // Display notification
    ipcRenderer.on(ON_NOTIFICATION_RECEIVED, (_, notification) =>{
      console.log("Display message")
      console.log(notification)
      let data = JSON.parse(notification.data.message)
      let check_message = this.state.list_cam.some(item=>data.stream_id===item.id)

      if (check_message === true){

        let frame_id_ofImage = data.frame_id
        // console.log(data.tracks[0].bbox)
        let bbox_array = data.tracks[0].bbox
        let timestamp = data.created_at
        let datetime = new Date(timestamp*1000)
        var year = datetime.getFullYear()
        var month = "0" + (datetime.getMonth()+1)
        var date = "0" + datetime.getDate()
        var hours = "0" + datetime.getHours();
        var minutes = "0" + datetime.getMinutes();
        var seconds = "0" + datetime.getSeconds();
        datetime = date.substr(-2) + "/" + month.substr(-2) +"/" +
                  year +", "+ hours.substr(-2) +":" + minutes.substr(-2) +
                  ":" + seconds.substr(-2)

        console.log(datetime)
        let info = {
          stream_id: data.stream_id,
          datetime:datetime,
          frame_id: frame_id_ofImage,
          bbox: bbox_array
        }
        this.setState({messages:[info,...this.state.messages]})
        this.setState({number_of_notification:this.state.number_of_notification + 1})
        console.log(info)

        console.log(this.state.messages)

        this.setState({file_image:`https://mekongsmartcam.vnpttiengiang.vn/server/api/facerec/images/${frame_id_ofImage}?bbox=${bbox_array[0]}%2C${bbox_array[1]}%2C${bbox_array[2]}%2C${bbox_array[3]}&session=${localStorage.getItem("session")}`})
        const audio = document.getElementsByClassName("audio_alert")[0]
        console.log("play")
        audio.currentTime = 0
        audio.play()
      }
    });
    // Start service
    // ipcRenderer.send(START_NOTIFICATION_SERVICE, "758928510591");
  }

  send = () =>{

    // alert("hello")
    // console.log(this.state.ip_server);
    let token = localStorage.getItem('token')


    axios({
      method: "post",
      url: `http://${this.state.ip_server}:8080/get_client_key/`,
      data: JSON.stringify({ client_key: token }),
      headers: { "Content-Type": "application/json; charset=utf-8" }
    }).then(response=>{
      console.log("response from server")
      console.log(response)
    })
  }

  handleChage = (event) =>{
    // console.log(event.target.value)
    this.setState({ip_server : event.target.value})
  }
  stop = () =>{
    const audio = document.getElementsByClassName("audio_alert")[0]
    audio.pause()
    // this.setState({message:""})
    this.setState({file_image:""})
  }
  remove_message = () =>{
    console.log('remove message')
    this.setState({number_of_notification:0})
    this.setState({messages:[]})
  }
  logout = ()=>{
    let session = localStorage.getItem('session')
    // axios.get(`https://mekongsmartcam.vnpttiengiang.vn/server/api/facerec/alerts?session=${session}1`)

    axios.get(`https://mekongsmartcam.vnpttiengiang.vn/server/logout?session=${session}`)
    this.props.logout(true)
  }
  view_message = () =>{
    this.setState({number_of_notification:0})
  }

  render(){

    const messages_tab = this.state.messages.map((message,i) => (
      <div key={i} className="card">
        <span className="small-text">{message.datetime}</span>
        <img src={`https://mekongsmartcam.vnpttiengiang.vn/server/api/facerec/images/${message.frame_id}?bbox=${message.bbox[0]}%2C${message.bbox[1]}%2C${message.bbox[2]}%2C${message.bbox[3]}&thumbnail=0&session=${localStorage.getItem("session")}`} style={{height:"auto",width:"100%"}}></img>
        <div className="title strong">
          <CameraIcon className="icon"/>
          {this.state.list_cam.filter(e => e.id === message.stream_id)[0].name}
        </div>
      </div>
    ))
    return (
      <div className="App">
        <header className="App-header">
          <audio  className="audio_alert" >
            <source  src={this.state.file_mp3} type="audio/mpeg"></source>
          </audio>
        <div onClick={()=>this.view_message()} >
          {messages_tab.length > 0 ? messages_tab :
          <div style={{height:"93vh",display:'flex',alignItems:'center',display: "flex",
          flexDirection: "column",
          justifyContent: "center"}}>
            <img src={logo} className="App-logo" alt="logo" />
            <p style={{textAlign:"center"}}>No Notifications</p>
          </div>}
        </div>
        </header>
        <div className="App-footer">
          <span className="button" onClick={()=>this.stop()}>
            <Badge><PlayCircleOutlineIcon /></Badge>
            </span>
          <span className="button" onClick={()=>this.view_message()}>
            <Badge badgeContent={this.state.number_of_notification} color="secondary">
            <NotificationsNoneIcon />
            </Badge>
          </span>

          <span className="button" onClick={()=>
            {if(window.confirm('Delete the item?')){this.remove_message()};}}>
            <Badge>
            <DeleteOutlineIcon />
            </Badge>
          </span>
          <span className="button" onClick={this.logout}>
            <Badge><ExitToAppIcon /></Badge>
          </span>
        </div>
      </div>
    );
  }
}

export default Main;
