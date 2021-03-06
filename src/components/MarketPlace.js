import React, { Component } from 'react'
import Market from "../abis/Market.json";
import PropertyToken from "../abis/PropertyToken.json";
import Web3 from 'web3';
import logo from '../logo.jpg';
import { Button } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default class MarketPlace extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      balance : 0,
      account : '',
      marketContract : null,
      propertyContract : null,
      totalSupply : 0,
      properties : [],
      market : [],
      propertyid:[]
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
      
      const balance =web3.utils.fromWei(await web3.eth.getBalance(MarketAddress),'ether');
      this.setState({balance})
      console.log(balance);
      
      const propertyAbi = PropertyToken.abi
      const propertyAddress = await marketContract.methods.returnPropertyToken().call();
      const propertyContract = new web3.eth.Contract(propertyAbi,propertyAddress)
      this.setState({marketContract})
      this.setState({propertyContract})
      console.log("propertyContract",propertyContract.address);
      
      var totalSupply = await propertyContract.methods.propertiesForSaleN().call();
      totalSupply = parseInt(totalSupply,16)
      console.log(totalSupply);
      
      // var propertiesForSale = parseInt(await contract.methods.propertiesForSale(0).call(),16);
      // var property = await contract.methods.properties(propertiesForSale).call()
      // console.log(property);
      // var name = await contract.methods.properties(ind).call();      
      
      // const supplyOwner = await contract.methods.tokensOfOwner(this.state.account).call();
  
  
      // const blah = await contract.methods.tokensOfOwner(this.state.account).call()
      this.setState({totalSupply})
      console.log("totalSupply",totalSupply);
      console.log("owner", await propertyContract.methods.ownerOf(0).call());
      console.log("address", propertyAddress,MarketAddress );
      // console.log("j",await contract.methods.properties(0).call());
      

      for( var i=0 ; i < totalSupply ; i++ )
      {
      var propertiesForSale = parseInt(await propertyContract.methods.propertiesForSale(i).call(),16);
      console.log("i",propertiesForSale);
      
      // console.log(propertiesForSale);
      
      var propertyName = await propertyContract.methods.properties(propertiesForSale).call()
        this.setState({
          propertyid : [...this.state.propertyid , propertiesForSale],
          properties : [...this.state.properties, propertyName[0]]
        })
      }
      console.log("length",totalSupply);
      
      // console.log(this.state.propertyid);
      

      // this.setState({supplyOwner})
  
      // console.log("totalSupply",this.state.totalSupply);
      // console.log("supplyOwner",this.state.supplyOwner);
      
      // if (supplyOwner!=null && totalSupply !=null)
      // {
      //   var len = this.state.supplyOwner.length;
      //   console.log("length" , len);
      //   // console.log("length" , await contract.methods.physical_address(parseInt(this.state.supplyOwner[0]["_hex"],16)).call());
        
    
        // for(var i = 0 ; i < totalSupply ; i++ ){

        //   var ind = await contract.methods.indexes(i).call();
        //   this.setState({
        //     propertyid : [...this.state.propertyid,ind],
        //     properties : [...this.state.properties,]
        //   })

        // }
      //     var k = parseInt(this.state.supplyOwner[i]["_hex"],16)
      //     console.log("k",k);
          
      //     const property = await contract.methods.physical_address(k-1).call()
      //     this.setState({
      //       properties : [...this.state.properties,property]
      //     })
      //   }
      // }
      // var l = parseInt(this.state.totalSupply,16);
      // console.log(l);
      
      // for(var i = 1 ; i <= l ; i++ ){      
      //   const property = await contract.methods.physical_address(i-1).call()
      //   this.setState({
      //     market : [...this.state.market,property]
      //   })
      // }
      // this.setState({
      //   market : this.state.market.filter(x => !this.state.properties.includes(x))
      // })
      // let difference = this.state.market.filter(x => !this.state.properties.includes(x));
      // console.log("market",difference);
      
      
      // console.log(this.state.colors);
  
      // for(var i=1; i<= length(s))
      
    }
     getName(id)
    {
      var name =  this.state.propertyContract.methods.properties(id).call();
      console.log("name",typeof name[0]);
    return <div>{name}</div>
    }

    render() {
        return (
            <div>
                 <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <h1 style={{marginTop:"40px"}}>Market Place</h1>
        <h3 style={{marginTop:"40px"}}>Market Place Balance  : {this.state.balance}</h3>

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
                          sell : 0
                          // propertyName:property
                        }
                        }}>
                     <button style={{width:"90%",marginBottom:"10px"}} className="btn btn-outline-success ">Buy</button>
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
