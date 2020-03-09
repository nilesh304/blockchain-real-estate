import React, { Component } from 'react'
import Market from "../abis/Market.json";
import PropertyToken from "../abis/PropertyToken.json";
import Web3 from 'web3';
import logo from '../logo.jpg';
import './PropertyDetails.css'

export default class PropertyDetail extends Component {
    
   constructor(props)
   {
       super(props)
       console.log(props.location.state.propertyid);
        this.state = {
          web3:null,
        account : '',
        marketContract : null,
        propertyContract : null,
        propertyId: props.location.state.propertyid,
        sell: props.location.state.sell,
        propertyName : null,
        propertyAddress : null,
        propertyCity : null,
        propertyState : null,
        propertyPostal : null,
        propertyPrice : null,

      }
      this.buy = this.buy.bind(this);
      this.sell = this.sell.bind(this);
      this.push = this.push.bind(this);

       
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
      this.setState({web3})
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
      // console.log("market address",marketContract.address);
      

      const propertyAbi = PropertyToken.abi
      const propertyAddress = await marketContract.methods.returnPropertyToken().call();
      const propertyContract = new web3.eth.Contract(propertyAbi,propertyAddress)
      this.setState({marketContract})
      this.setState({propertyContract})
      console.log("Connected");
      const price = await propertyContract.methods.propertyPrices(this.state.propertyId).call();
      const p = await propertyContract.methods.propertyPrices(this.state.propertyId).call();
      console.log(parseInt(p._hex,16));
      

      const propertyDetails = await propertyContract.methods.properties(this.state.propertyId).call();
      console.log(propertyDetails);
      this.setState({
          propertyName: propertyDetails[0],
          propertyAddress : propertyDetails[1],
          propertyCity : propertyDetails[2],
          propertyState  : propertyDetails[3],
          propertyPostal : parseInt( propertyDetails[4]._hex,16),
          propertyPrice : parseInt(price._hex,16)
        })
        console.log(await propertyContract.methods.ownerOf(this.state.propertyId).call());
        console.log("propertyContract",propertyContract.address);
        console.log("approvedContract",await propertyContract.methods.getApproved(this.state.propertyId).call());

        // console.log("tryAdd", await contract.methods.tryAdd().call());
        
        
    }
    async buy()
    {
      console.log("id",this.state.propertyId);

      // this.state.web3.eth.sendTransaction({
      //   to: '0x84753F397F925ABA6d00222C51e8F6c6b81359E5',
      //   from: '0x74BFBB44Ece31DA8A28791Bb7ee1783Deb3f231A',
      //   value: this.state.web3.utils.toWei('1', 'ether'),
      // }, console.log)
      console.log(this.state.propertyPrice.toString() );
      await this.state.marketContract.methods.transferProperty(this.state.propertyId,'0x600be05cA961366069c4CB3c123F5636Bce5e7e7').send({
        from:this.state.account,
        value:this.state.web3.utils.toWei(this.state.propertyPrice.toString(),'ether')
      })
      // console.log(this.state.contract.methods.safeTransferFrom('0x6C00f9976a954c17AdEDAa466843580b8541718E', this.state.account, 2).send({
      //   from : this.state.account
        
      // }
      // ));
      
      // console.log(await this.state.contract.methods.ownerOf(this.state.propertyId).call());
      // console.log("loo",await this.state.contract.methods.ownerOf(this.state.propertyId));
      
      //  
      // const val = await this.state.contract.methods.buyProperty(this.state.propertyId).send({
      //   from:this.state.account,
      //   value:this.state.web3.utils.toWei(this.state.propertyPrice.toString(),'ether')
      // })
      // .then(res => 
      //   console.log('Success',res))
      // .catch(err => console.log(err)) 
      
      // console.log("loo",await this.state.contract.methods.ownerOf(this.state.propertyId).call());
      
      // var tr = await this.state.contract.methods.transferMoney().send({
      //   from  : this.state.account,
      //   value : this.state.web3.utils.toWei(this.state.propertyPrice.toString(),'ether')
      // })
    }

    async sell()
    {
      console.log("id",this.state.propertyId);
      
      var k = await this.state.propertyContract.methods.approve(this.state.marketContract.address,this.state.propertyId).send({
        from : this.state.account,
        value:0
      });
      // console.log('approve',k);
      // var m=await this.state.propertyContract.methods.getApproved(this.state.propertyId).call()
      // var p = await this.state.propertyContract.methods.pushForSale(this.state.propertyId).call()
      // console.log("p",p);
      // console.log("m",m);
      // await this.push()
    }
    async push()
    {
      console.log("p",await this.state.propertyContract.methods.propertiesForSaleN().call());
      var p = await this.state.propertyContract.methods.pushForSale(this.state.propertyId).send({
        from:this.state.account,
        value:0
      })
      
    }


    render() {
        return (
            <div  style={{width: "50%",margin:"auto",border:"1px black solid ", borderRadius:"5px",padding:"20px",margin:"100px auto"}}>
                
                {/* {this.props.location.state.propertyName} */}
                <div style={{width:"50%",margin:"auto"}}>
                  <img   style={{width:"90%"}} src={logo}></img> 
                </div>
                <table>
                  <tbody>
                <tr>
                        <th>Name</th>
                        <td>{this.state.propertyName}</td>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <td>{this.state.propertyAddress}</td>
                    </tr>
                    <tr>
                        <th>City</th>
                        <td>{this.state.propertyCity}</td>
                    </tr>
                    <tr>
                        <th>State</th>
                        <td>{this.state.propertyState}</td>
                    </tr>
                    <tr>
                        <th>Postal Code</th>
                        <td>{this.state.propertyPostal}</td>
                    </tr>
                    <tr>
                        <th>Price</th>
                        <td>{this.state.propertyPrice}</td>
                    </tr>
                    </tbody>
                </table>
                <br/>
                {this.state.sell ? 
                (
                  <div>
                <button onClick={this.sell} style={{width:"49%",marginBottom:"10px",marginRight:"2%"}} className="btn btn-outline-success ">Sell</button>
                <button onClick={this.push} style={{width:"49%",marginBottom:"10px"}} className="btn btn-outline-danger ">Confirm</button>
                </div>
                ) 
                :
                (<button onClick={this.buy} style={{width:"49%",marginBottom:"10px",marginRight:"2%"}} className="btn btn-outline-success ">Buy</button>)
                }
                
                
                {/* <button style={{width:"49%",marginBottom:"10px"}} className="btn btn-outline-danger ">Rent</button> */}

                
                {/* {this.state.propertyDetails.property_name} */}
            </div>
        )
    }
}
