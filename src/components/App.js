import React, { Component } from 'react';
import logo from '../logo.jpg';
import './App.css';
import Web3 from 'web3';
import PropertyToken from "../abis/PropertyToken.json";
import MetaMaskLoginButton from 'react-metamask-login-button';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import MarketPlace from './MarketPlace';
import Create from './Create';
import PropertyDetail from './PropertyDetail';
import Home from './Home';
// import Home from './Home';

class App extends Component {

  async componentWillMount()
  {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3()
  {
    if (window.ethereum)
    {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3)
    {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert("Non-Ethereum Browser detected")
    }
  }

  async loadBlockchainData()
  {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({
      account : accounts[0]
    })
    // console.log(this.state.account);
    
    const networkId = await web3.eth.net.getId();
    const networkData = PropertyToken.networks[networkId] 
    const abi = PropertyToken.abi
    const address  = networkData.address
    const contract = new web3.eth.Contract(abi,address)
    // console.log(contract);
    
    this.setState({contract})
    console.log("Connected");
    



    // const blah = await contract.methods.tokensOfOwner(this.state.account).call()
    
    
  
  }


 async getDetails(property,address)
 {
  //  var val= await this.state.contract.methods.tokensOfOwner().call();
   const a = await this.state.contract.methods.transfer(property,address).send({from: this.state.account});
  console.log(a);
  
  console.log(await this.state.contract.methods.ownerOf(1).call());
 }
 transfer = ( property,address) => {
  console.log(address);
  this.getDetails(property,address);
 }

  constructor(props)
  {
    super(props)
    this.state = {
      account : '',
      contract : null,
      totalSupply : 0,
      properties : [],
      market : []
    }
  }

  metamaskLogin()
  {
    console.log("login");
    
  }
  render() {
    return (


      <div>
<Router>
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <div className="navbar-brand col-sm-3 col-md-2 mr-0"> 
            <Link style={{ textDecoration: 'none' ,color:"white"}} to="/">Home</Link>
          </div>
          <div className="navbar-brand col-sm-3 col-md-2 mr-0"> 
            <Link style={{ textDecoration: 'none' ,color:"white"}} to="/marketplace">Market Place</Link>
          </div><div className="navbar-brand col-sm-3 col-md-2 mr-0"> 
            <Link style={{ textDecoration: 'none' ,color:"white"}} to="/create">New Property</Link>
          </div>
            
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/create">
            <Create />
          </Route>
           <Route path="/marketplace">
            <MarketPlace />
          </Route>
          {/* <Route path="/try">
            <TryNew />
          </Route> */}
          } 
          <Route path="/property/:property" component={PropertyDetail} />
          <Route path="/">
            <Home />
          </Route>
          
            
          
        </Switch>
      </div>
    </Router>





        <div className="container-fluid mt-5">
 
          
          </div>

          <div>
          </div>
          {/* <form onSubmit={(event) => {
                  event.preventDefault()
                  const property = this.pro.value
                  const address = this.address.value
                  this.transfer(property,address)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Physical Address'
                    ref={(input) => { this.pro = input }}
                  />
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Address to Send to'
                    ref={(input) => { this.address = input }}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='Transfer'
                  />
                </form> */}
                
      </div>
    );
  }
}

export default App;
