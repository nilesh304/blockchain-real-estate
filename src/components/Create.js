import React, { Component } from 'react'
import Web3 from 'web3';
import Property from "../abis/Property.json";
export default class Create extends Component {

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
    //   console.log("Connected");
      
    //   const totalSupply = await contract.methods.totalSupply().call()
    //   const supplyOwner = await contract.methods.tokensOfOwner(this.state.account).call();
  
  
    //   // const blah = await contract.methods.tokensOfOwner(this.state.account).call()
    //   this.setState({totalSupply})
    //   this.setState({supplyOwner})
  
    //   console.log("totalSupply",this.state.totalSupply);
    //   console.log("supplyOwner",this.state.supplyOwner);
      
    //   if (supplyOwner!=null && totalSupply !=null)
    //   {
    //     var len = this.state.supplyOwner.length;
    //     console.log("length" , len);
    //     // console.log("length" , await contract.methods.physical_address(parseInt(this.state.supplyOwner[0]["_hex"],16)).call());
        
    
    //     for(var i = 0 ; i < len ; i++ ){
    //       var k = parseInt(this.state.supplyOwner[i]["_hex"],16)
    //       console.log("k",k);
          
    //       const property = await contract.methods.physical_address(k-1).call()
    //       this.setState({
    //         properties : [...this.state.properties,property]
    //       })
    //     }
    //   }
    //   var l = parseInt(this.state.totalSupply,16);
    //   console.log(l);
      
    //   for(var i = 1 ; i <= l ; i++ ){      
    //     const property = await contract.methods.physical_address(i-1).call()
    //     this.setState({
    //       market : [...this.state.market,property]
    //     })
    //   }
    //   this.setState({
    //     market : this.state.market.filter(x => !this.state.properties.includes(x))
    //   })
    //   let difference = this.state.market.filter(x => !this.state.properties.includes(x));
    //   console.log("market",difference);
      
      
      // console.log(this.state.colors);
  
      // for(var i=1; i<= length(s))
      
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

  mint = (property) => {
    console.log(property);
    
    this.state.contract.methods.mint(property).send({from: this.state.account})
    .once('reciept',(reciept)=>{
      this.setState({
        properties:[...this.state.properties,property]
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
          </div>
            </div>
        )
    }
}
