const Property= artifacts.require('./Property.sol')
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Property',(accounts)=>{

    let contract;
    before(async () => {
        contract = await Property.deployed();
    })

    describe('deployment',async()=>{
        it('deploys successfully', async () => {
            contract = await Property.deployed();
            const address = contract.address;
            console.log(address);
            assert.notEqual(address,'')
        })
        it('has a name',async()=>{
            const name= await contract.name()
            assert.equal(name,'Property')
        })
    })

    describe('minting',async()=>{
        it('create a new property', async()=>{
            const result = await contract.mint('Estancia')
            const totalSupply = await contract.totalSupply()
            //SUCCESS
            assert(totalSupply,1)
            console.log(result);
            
        })
    })
    describe('indexing',async() => {
        it('list all',async() => {
            await contract.mint('Tanishq Park')
            await contract.mint('Jai Park')
            await contract.mint('Green Park')
            const totalSupply = await contract.totalSupply();

            let color;
            let result = [];
            for(var i = 1 ; i <= totalSupply; i++)
            {
                color = await contract.physical_address(i-1);
                result.push(color);

            }
            let expected = ['Estancia','Tanishq Park','Jai Park','Green Park']
            assert.equal(result.join(','),expected.join(','))
        })
    })
    describe('transferring',async() => {
        it('test transfer', async() =>{
          await  contract.transferFrom('0x74BFBB44Ece31DA8A28791Bb7ee1783Deb3f231A','0x84753F397F925ABA6d00222C51e8F6c6b81359E5',1)
          const owner = await contract.ownerOf(1);
          console.log(owner);
          
        })
    })
})