import React, { Component } from 'react'
import Web3 from 'web3';
import Market from "../abis/Market.json";
export default class Create extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      account : '',
      marketContract : null,
      tokenContract : null,
      totalSupply : 0,
      properties : [],
      market : []
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
      
      
    }

   

  // mint = (property) => {
  //   console.log(property);
    
  //   this.state.contract.methods.mint(property).send({from: this.state.account})
  //   .once('reciept',(reciept)=>{
  //     this.setState({
  //       properties:[...this.state.properties,property]
  //     })
  //   })
 
  // }
  mint = ( _property_name, _property_address,_city, _state, _postal_code, _price) => {
    console.log("contract",this.state.marketContract);
    
    
    this.state.marketContract.methods.mintPropety( _property_name, _property_address,_city, _state, _postal_code, _price)
    .send({from: this.state.account})
    .once('reciept',(reciept)=>{
      this.setState({
        properties:[...this.state.properties,_property_name]
      })
    })
    
  }

    render() {
        return (
            <div>
                <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <h1>Create New Property</h1>
        </div>
        </main>
        </div>
        </div>
        <br/>
                <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              {/* <h1>Issue Token</h1> */}
                <form onSubmit={(event) => {
                  event.preventDefault()
                  // const property = this.property.value
                  const _property_name = this.property_name.value
                  const _property_address = this.property_address.value
                  const _city = this.city.value
                  const _state = this._state.value
                  const _price = this.price.value
                  const _postal_code = this.postal_code.value
                  this.mint(_property_name,_property_address,_city,_state,_postal_code,_price)
                }}
                >
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Property Name'
                    ref={(input) => { this.property_name = input }}
                  />
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Property Address'
                    ref={(input) => { this.property_address = input }} />
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='City'
                    ref={(input) => { this.city = input }}/>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='State'
                    ref={(input) => { this._state = input }}/>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Postal Code'
                    ref={(input) => { this.postal_code = input }}/>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Price'
                    ref={(input) => { this.price = input }}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
            </div>
        )
    }
}
