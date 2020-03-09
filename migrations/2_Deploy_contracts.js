const Property = artifacts.require('Market');
// const Property2 = artifacts.require('PropertyToken')
module.exports = function(deployer){
    deployer.deploy(Property);
    // deployer.deploy(Property2)
}