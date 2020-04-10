import React, { Component } from 'react'
import Web3 from 'web3';
import Market from "../abis/Market.json";
import Metamask from '../metamask2.png';
import "./Login.css";

export default class Login extends Component {
    constructor(props)
  {
    super(props)
    this.state = {
      account : '',
      marketContract : null,
      tokenContract : null,
      totalSupply : 0,
      properties : [],
      market : [],
      web3:null
    }
    this.handleLogin=this.handleLogin.bind(this)
  }
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
      // console.log(this.state);
    }
  
    async loadBlockchainData()
    {
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      this.setState({
        account : accounts[0]
      }, function ()
      {
        console.log(this.state.account);
        
      })
      console.log(accounts[0]);
      
      const MarketNetworkId = await web3.eth.net.getId();
      const MarketNetworkData = Market.networks[MarketNetworkId] 
      const MarketAbi = Market.abi
      const MarketAddress  = MarketNetworkData.address
      const marketContract = new web3.eth.Contract(MarketAbi,MarketAddress)
      console.log("a",marketContract);
      
      const a=await marketContract.methods.returnPropertyToken().call();
      console.log("add",a);
      console.log("mardket Add",MarketAddress);
      
      
      this.setState({marketContract})
      console.log(this.state.account);
      // console.log(contract.methods.totalSupply().call());

      console.log("tryAdd", await marketContract.methods.tryAdd().call());
      // web3.eth.sign(web3.utils.hexToString("0x68656c6c6f20776f726c64") , accounts[0], console.log);
      this.setState({web3})
      
    }
    async handleLogin()
    {
        const web3 = this.state.web3;
        var login;
        console.log(login);
        
        login = await web3.eth.personal.sign(web3.utils.fromUtf8("Requesting Signature for Secure Login"), this.state.account,"test")
        console.log(login);
        if(login)
        {
            window.location = '/home'

        }
    }

    render() {
        return (
            <div style={{padding:"80px"}}>
                <div>
                    <h1>Single Click Login with Metamask</h1>
                    <div style={{padding:"20px"}}>
                        No more cumbersome form-filling.<br/>
                        No need to remember yet another username/password pair.<br/>
                        The whole process takes seconds instead of minutes.<br/>
                    </div>
                </div>
                
                <h1>Login to Continue</h1>
                
                <button className="login-metamask" onClick={this.handleLogin} >
                    <img style={{width:"40px"}} src={Metamask}/>
                    <div>Login with Metamask</div>
                </button>
            </div>
        )
    }
}
