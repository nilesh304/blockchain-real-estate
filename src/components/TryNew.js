import React, { Component } from 'react'
import Web3 from 'web3';
import PropertyToken from "../abis/MyUser.json";

export default class TryNew extends Component {
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
        
        const networkId = await web3.eth.net.getId();
        const networkData = PropertyToken.networks[networkId] 
        const abi = PropertyToken.abi
        const address  = networkData.address
        const contract = new web3.eth.Contract(abi,address)
        console.log("a",contract);
        
  
        this.setState({contract})
        console.log(this.state.account);
        // console.log(contract.methods.totalSupply().call());
  
        console.log("tryAdd", await contract.methods.tryAdd().call());
        
        
        
      }
      mint = ( _property_name, _property_address,_city, _state, _postal_code, _price) => {
        console.log("contract",this.state.contract);
        
        
        this.state.contract.methods.mintPropety( _property_name, _property_address,_city, _state, _postal_code, _price)
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
