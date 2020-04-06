import React,{Component} from 'react';
import Login from "./login";
import Main from "./main";

class App extends Component {
  constructor(props){
    super(props);

    this.state={
      ip_server: "127.0.0.1",
      is_login : false,
    }
  }
  login = (value) =>{
    if (value === true){
      this.setState({is_login:true})
    }

  }
  logout = (value) =>{
    if (value === true){
      this.setState({is_login:false})
    }
  }

  render(){
    var loginButton
    if (!this.state.is_login) {
      loginButton = <Login login={this.login}/>;
    }else{
      loginButton = <Main logout={this.logout}/>;
    }

    return (
      <div className="App">
        {/* {!this.state.is_login ? <Login login={this.login}/> : <Main /> } */}
        {loginButton}
      </div>
    );
  }
}

export default App;
