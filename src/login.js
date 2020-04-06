import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons'
import axios from 'axios';
const { ipcRenderer } = window.require('electron');

const {START_NOTIFICATION_SERVICE,
  NOTIFICATION_SERVICE_STARTED,
  NOTIFICATION_SERVICE_ERROR} = window.require('electron-push-receiver/src/constants')

const styles = theme => ({
    margin: {
        margin: theme.spacing(4),
    },
    padding: {
        padding: theme.spacing()
    }
});

class Login extends React.Component {
    constructor(props){
      super(props);

      this.state={
        username: localStorage.getItem('username')? localStorage.getItem('username') :"",
        password: localStorage.getItem('password')? localStorage.getItem('password') :"",
        remember:localStorage.getItem('password') && localStorage.getItem('username') ? true : false,
        is_error: false
      }
    }
    componentDidMount = async ()=>{


      // Listen for service successfully started
      ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) =>{
        console.log('service successfully started, This is client Key: ', token)
        localStorage.setItem('token',token)
      } );

      // Handle notification errors
      ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) =>{
        console.log(error)
        console.log("error with start the fcm")
      });
      ipcRenderer.send(START_NOTIFICATION_SERVICE, "758928510591");

    }

    showError = (val) => {
      this.setState({is_error:val})
    }

    check_remember_me = (value)=> {
      console.log(value)
      this.setState({remember:value})
    }

    login=()=>{
      // Axios.post
      console.log(this.state.username,this.state.password)
      let token = localStorage.getItem("token")
      const json_login = {
        email: this.state.username,
        password: this.state.password,
        client_key: token
      }
      axios.post("https://mekongsmartcam.vnpttiengiang.vn/server/login",json_login).then(response=>{
        // console.log(response)
        // console.log(response.data.session)
        localStorage.setItem('id',response.data.id)
        localStorage.setItem('session',response.data.session)
        this.props.login(true)
        if(this.state.remember===true){
          localStorage.setItem("username",this.state.username)
          localStorage.setItem("password",this.state.password)
        }else{
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }
      }).catch(error=>{
        this.setState({is_error: true})
      })

    };
    render() {
        const { classes } = this.props;
        return (
          <div>
            <Paper className={classes.padding}>
                <div className={classes.margin}>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Face />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField required className="username" value={this.state.username} label="Username" type="email" onChange={(event)=>{this.setState({username:event.target.value})}} fullWidth autoFocus required />
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Fingerprint />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField required id="password" value={this.state.password} label="Password" type="password" onChange={(event)=>{this.setState({password:event.target.value})}} fullWidth required />
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" spacing={8} justify="flex-start">
                        <Grid item>
                            <FormControlLabel control={
                                <Checkbox
                                    onChange={value=>{this.check_remember_me(value.target.checked)}}
                                    color="primary"
                                    checked={this.state.remember}
                                />
                            } label="Remember me" />
                        </Grid>
                        {/* <Grid item>
                            <Button disableFocusRipple disableRipple style={{ textTransform: "none" }} variant="text" color="primary">Forgot password ?</Button>
                        </Grid> */}
                        {/* <Grid item>
                            <Button disableFocusRipple disableRipple style={{ textTransform: "none" }} variant="text" color="primary">Forgot password ?</Button>
                        </Grid> */}
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.login}>Login</Button>
                    </Grid>
                </div>
            </Paper>
            {this.state.is_error && <div>Sai thong tin dang nhap</div>}
            </div>

        );
    };
}

export default withStyles(styles)(Login);
