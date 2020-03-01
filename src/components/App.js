import React, { Component } from 'react';
import logo from '../logo.jpg';
import './App.css';
import Web3 from 'web3';
import Property from "../abis/Property.json";
import MetaMaskLoginButton from 'react-metamask-login-button';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import MarketPlace from './MarketPlace';
import Create from './Create';
import Home from './Home';

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
    console.log(accounts);
    
    const networkId = await web3.eth.net.getId();
    const networkData = Property.networks[networkId] 
    const abi = Property.abi
    const address  = networkData.address
    const contract = new web3.eth.Contract(abi,address)
    // console.log(contract);
    
    this.setState({contract})
    console.log("Connected");
    
    const totalSupply = await contract.methods.totalSupply().call()
    const supplyOwner = await contract.methods.tokensOfOwner(this.state.account).call();


    // const blah = await contract.methods.tokensOfOwner(this.state.account).call()
    this.setState({totalSupply})
    this.setState({supplyOwner})

    console.log("totalSupply",this.state.totalSupply);
    console.log("supplyOwner",this.state.supplyOwner);
    
    if (supplyOwner!=null && totalSupply !=null)
    {
      var len = this.state.supplyOwner.length;
      console.log("length" , len);
      // console.log("length" , await contract.methods.physical_address(parseInt(this.state.supplyOwner[0]["_hex"],16)).call());
      
  
      for(var i = 0 ; i < len ; i++ ){
        var k = parseInt(this.state.supplyOwner[i]["_hex"],16)
        console.log("k",k);
        
        const property = await contract.methods.physical_address(k-1).call()
        this.setState({
          properties : [...this.state.properties,property]
        })
      }
    }
    var l = parseInt(this.state.totalSupply,16);
    console.log(l);
    
    for(var i = 1 ; i <= l ; i++ ){      
      const property = await contract.methods.physical_address(i-1).call()
      this.setState({
        market : [...this.state.market,property]
      })
    }
    this.setState({
      market : this.state.market.filter(x => !this.state.properties.includes(x))
    })
    let difference = this.state.market.filter(x => !this.state.properties.includes(x));
    console.log("market",difference);
    
    
    // console.log(this.state.colors);

    // for(var i=1; i<= length(s))
    
  }
 mint = (property) => {
   console.log(property);
   
   this.state.contract.methods.mint(property).send({from: this.state.account})
   .once('reciept',(reciept)=>{
     this.setState({
       properties:[...this.state.properties,property]
     })
   })

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
   
  //  console.log(this.state.account,address,id);
  //  console.log(this.state.contract.methods.tokensOfOwner().call());
  //  this.getDetails();
  //  console.log(this.state.contract.methods.senderAddres().call());
  //  var ans= this.state.contract.methods.tokensOfOwner(this.state.account).call();
  //  console.log(reciever,id);
  //  console.log(this.state.contract.methods.approve("0x84753F397F925ABA6d00222C51e8F6c6b81359E5",1).call());
  //  this.state.contract.methods.approve("0x84753F397F925ABA6d00222C51e8F6c6b81359E5",1).call();
  this.getDetails(property,address);
  //  this.state.contract.transferFrom('0x74BFBB44Ece31DA8A28791Bb7ee1783Deb3f231A','0x84753F397F925ABA6d00222C51e8F6c6b81359E5',1)
  //  console.log(this.state.contract.balanceOf(this.state.account));
  //  this.state.contract.transferFrom('0x74BFBB44Ece31DA8A28791Bb7ee1783Deb3f231A','0x84753F397F925ABA6d00222C51e8F6c6b81359E5',1)
   
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
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>





        {/* <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://localhost:3000/"
            
            rel="noopener noreferrer"
          >
            Real Estate on Blockchain
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav> */}
        <div className="container-fluid mt-5">
          {/* <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const property = this.property.value
                  this.mint(property)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Physical Address'
                    ref={(input) => { this.property = input }}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div> */}
          
          </div>

          <div>
          </div>
          <form onSubmit={(event) => {
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
                </form>
                {/* <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <h1>Market Place</h1>
        </div>
        </main>
        </div>
        </div> */}
                {/* <div className="row text-center"> */}

            {/* { this.state.market.map((property, key) => { */}
              {/* return( */}
                {/* <div key={key} className="col-md-3 mb-3" style={{padding:"20px"}}> */}
                  {/* <div> */}
                    {/* <img style={{width:"256px"}} src={logo}></img> */}
                    {/* <div>{property}</div> */}
                    {/* <div>{key}</div> */}
                  {/* </div> */}
                  
                {/* </div> */}
              {/* ) */}
            {/* })} */}

          {/* </div>     */}
      </div>
    );
  }
}

export default App;
