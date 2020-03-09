import React, { Component } from 'react'
import Web3 from 'web3';
import Market from "../abis/Market.json";
import PropertyToken from "../abis/PropertyToken.json";
import logo from '../logo.jpg';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default class Home extends Component {

    constructor(props)
    {
      super(props)
      this.state = {
        account : '',
        marketContract : null,
        propertyContract : null,
        properties : [],
        market : [],
        propertyid:[],
        balance : 0
      }
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
    }
  
    async loadBlockchainData()
    {
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      this.setState({
        account : accounts[0]
      })
      console.log(accounts);
      
      const MarketNetworkId = await web3.eth.net.getId();
      const MarketNetworkData = Market.networks[MarketNetworkId] 
      const MarketAbi = Market.abi
      const MarketAddress  = MarketNetworkData.address
      const marketContract = new web3.eth.Contract(MarketAbi,MarketAddress)
      // console.log(contract);
      
      const propertyAbi = PropertyToken.abi
      const propertyAddress = await marketContract.methods.returnPropertyToken().call();
      const propertyContract = new web3.eth.Contract(propertyAbi,propertyAddress)
      this.setState({marketContract})
      this.setState({propertyContract})
      console.log("Connected");
      
      const totalSupply = await propertyContract.methods.totalSupply().call()
      const supplyOwner = await propertyContract.methods.tokensOfOwner(accounts[0]).call();
  
  
      // const blah = await contract.methods.tokensOfOwner(this.state.account).call()
      this.setState({totalSupply})
      this.setState({supplyOwner})
  
      console.log("totalSupply",this.state.totalSupply);
      // console.log("Owner",await propertyContract.methods._tokenOwner(accounts[0]));

      console.log("supplyOwner",this.state.supplyOwner);
      
      if (supplyOwner!=null && totalSupply !=null)
      {
        var len = this.state.supplyOwner.length;
        console.log("length" , len);
        // console.log("length" , await contract.methods.physical_address(parseInt(this.state.supplyOwner[0]["_hex"],16)).call());
        
    
        for(var i = 0 ; i < len ; i++ ){
          var k = parseInt(this.state.supplyOwner[i]["_hex"],16)
          console.log("k",k);
          var propertyName = await propertyContract.methods.properties(k).call()
          
          // const property = await propertyContract.methods.properties(k).call()
          this.setState({
          propertyid : [...this.state.propertyid , k],

            properties : [...this.state.properties,propertyName[0]]
          })
        }
      }
      var l = parseInt(this.state.totalSupply,16);
      const balance =web3.utils.fromWei(await web3.eth.getBalance(accounts[0]),'ether');
      this.setState({balance})
      
    }
    render() {
        return (
          <div>
          <div className="container-fluid mt-5">
   <div className="row">
     <main role="main" className="col-lg-12 d-flex text-center">
       <div className="content mr-auto ml-auto">
       <h1 style={{marginTop:"40px"}}>My Properties </h1>
 <h3 style={{marginTop:"40px"}}>My Balance  : {this.state.balance} Eth</h3>

 </div>
 </main>
 </div>
 </div>
         <div className="row text-center">

     { this.state.propertyid.map((id, key) => {
        return(   
         <div key={key} className="card" style={{width :"18em",margin:"20px"}}>   
               <img className="card-img-top"  src={logo}></img>  
             <div className="card-body">  

               <h5 className="card-title">{this.state.properties[key]}</h5>  
               {/* <h5 className="card-title">{this.getName(id)}</h5>   */}


               <Link to={{
                 pathname: '/property/abc',
                 state: {
                   propertyid: id,
                   sell : 1,
                   // propertyName:property
                 }
                 }}>
              <button style={{width:"90%",marginBottom:"10px"}} className="btn btn-outline-success ">Sell</button>
              </Link> 
               <br/> 
               <button style={{width:"90%",marginBottom:"10px"}} className="btn btn-outline-danger ">Rent</button> 
               {/* <div>{key}</div>   */}
             </div>  
           
           </div>  
           ) 
         })}  
      </div> 
     </div>
        )
    }
}
