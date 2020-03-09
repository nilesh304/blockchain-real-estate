pragma solidity ^0.5.0;
import "./ERC721Full.sol";
// import 'node_modules/@openzeppelin/contracts/ownership/Ownable.sol';
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.4.0/contracts/ownership/Ownable.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';


contract PropertyToken is ERC721Full,Ownable {

struct Property {
         // IPFS Hash
        string property_name;
        string property_address;
        string city;
        string state;
        uint postal_code;
    }
    mapping (address => uint[]) public ownerTokens;
    // string[] public physical_address;
    // mapping(string => bool) _propertyExists;
    // mapping(uint => address) _propertyIndexToOwner;
    // mapping(string => uint) _propertyToIndex;
    mapping (uint256 => address) internal tokenApprovals;
    Property[] public properties;
    mapping(uint => uint) public propertyPrices;
    uint[] public propertiesForSale;
    uint[] public propertiesApproved;

    mapping(uint => uint) public indexes; //propertyId -> propertiesForSale

    constructor() ERC721Full("Property","PROPERTY") public    {
    }

    // function mint(string memory _physical_address) public {
    //     require(!_propertyExists[_physical_address]);
    //     uint _id = physical_address.push(_physical_address);
    //     _mint(msg.sender, _id);
    //     _propertyExists[_physical_address] = true;
    //     _propertyIndexToOwner[_id] = msg.sender;
    //     _propertyToIndex[_physical_address] = _id;
    // }

    function mint( string memory _property_name,
                  string memory _property_address, string memory _city,
                  string memory _state,uint  _postal_code, uint _price, address _owner) public onlyOwner {

            Property memory p = Property({
                 property_name : _property_name,
                 property_address : _property_address,
                 city : _city,
                 state : _state,
                 postal_code : _postal_code
            });
            uint propertyId = properties.push(p) - 1;
            propertyPrices[propertyId] = _price;
            propertiesForSale.push(propertyId);
            indexes[propertyId] = propertiesForSale.length - 1;
            // _mint is a function part of ERC721Token that generates the NFT
            // The contract will own the newly minted tokens
            _mint(_owner, propertyId);
    }

  /// @notice Get number of spaceships for sale
    function propertiesForSaleN() public view returns(uint) {
        return propertiesForSale.length;
    }
    //Adds the property to propertiesForSale
    function pushForSale(uint _propertyId) public returns(uint) {
        bool avail = false;
        for (uint i = 0; i < propertiesForSale.length; i++) {
            if (propertiesForSale[i] == _propertyId)
                avail = true;
        }
        require(!avail,
        "ALready On Market");
        propertiesForSale.push(_propertyId);
        indexes[_propertyId] = propertiesForSale.length - 1;
        // return propertiesApproved.length;
    }
    // function approveAndSale(address to,uint tokenId) public{
    //     approve(to, tokenId);
    //     pushForSale(tokenId);

    // }

    /// @notice Buy property
    /// @param _propertyId TokenId

    //function to transfer from Market contract to User
    function buyProperty(uint _propertyId,address newOwner) public {
        // You can only buy the spaceships owned by this contract
        require(ownerOf(_propertyId) == msg.sender || getApproved(_propertyId) == msg.sender,
        "Sender not authorized");
        // Value sent should be at least the spaceship price
        // require(msg.value >= propertyPrices[_propertyId],
        // "Value less than selling price");
        // approve(newOwner, _propertyId);
        // We approve the transfer directly to avoid creating two trx
        // then we send the token to the sender
        // tokenApprovals[_propertyId] = msg.sender;
        transferFrom(msg.sender, newOwner, _propertyId);
        ownerTokens[newOwner].push(_propertyId);

        // address payable rec = 0x84753F397F925ABA6d00222C51e8F6c6b81359E5;
        // rec.transfer(msg.value);
        // Delete the token from the list of tokens for sale
        uint256 replacer = propertiesForSale[propertiesForSale.length - 1];
        uint256 pos = indexes[_propertyId];
        propertiesForSale[pos] = replacer;
        indexes[replacer] = pos;
        propertiesForSale.length--;
        // uint refund = msg.value - propertyPrices[_propertyId];
        // if (refund > 0)
        //     msg.sender.transfer(refund);
    }
    //function to transfer from one user to another
        function buyProperty2(address oldOwner,uint _propertyId,address newOwner) public {
        // You can only buy the spaceships owned by this contract
        require(ownerOf(_propertyId) == msg.sender || getApproved(_propertyId) == msg.sender,
        "Sender not authorized");
        
        // Value sent should be at least the spaceship price
        // require(msg.value >= propertyPrices[_propertyId],
        // "Value less than selling price");
        // approve(newOwner, _propertyId);
        // We approve the transfer directly to avoid creating two trx
        // then we send the token to the sender
        // tokenApprovals[_propertyId] = msg.sender;
        transferFrom(oldOwner, newOwner, _propertyId);
        ownerTokens[newOwner].push(_propertyId);
        uint[] storage oldOwnerArray = ownerTokens[oldOwner];
        uint ind;
        uint len = oldOwnerArray.length;
        for( uint i = 0; i < len; i++)
        {
            if (oldOwnerArray[i] == _propertyId)
                ind = i;
        }

        // ownerTokens[oldOwner][]
        oldOwnerArray[ind] = oldOwnerArray[len-1];
        delete oldOwnerArray[len-1];
        oldOwnerArray.length --;
        // address payable rec = 0x84753F397F925ABA6d00222C51e8F6c6b81359E5;
        // rec.transfer(msg.value);
        // Delete the token from the list of tokens for sale
        uint256 replacer = propertiesForSale[propertiesForSale.length - 1];
        uint256 pos = indexes[_propertyId];
        propertiesForSale[pos] = replacer;
        indexes[replacer] = pos;
        propertiesForSale.length--;


        
        // uint refund = msg.value - propertyPrices[_propertyId];
        // if (refund > 0)
        //     msg.sender.transfer(refund);
    }

    /// @notice Withdraw sales balance
    function withdrawBalance() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }
    
    function transferMoney() public payable  {
        // rec.transfer(msg.value);
        address payable rec = 0x84753F397F925ABA6d00222C51e8F6c6b81359E5;
        rec.transfer(msg.value);
    }
    
    /// @notice Get Metadata URI
    /// 
    /// @return IPFS URL of the metadata
    // function tokenURI(uint256 _propertyId) public payable returns (string memory) {
    //     Property storage s = properties[_propertyId];
    //     return strConcat("https://ipfs.io/ipfs/", string(s.metadataHash));
    // }

    // /// @notice Concatenate strings
    // /// @param _a First string
    // /// @param _b Second string
    // /// @return _a+_b
    // function strConcat(string memory _a, string memory _b)  private returns (string memory) {
    //     bytes memory _ba = bytes(_a);
    //     bytes memory _bb = bytes(_b);
    //     string memory ab = new string(_ba.length + _bb.length);
    //     bytes memory bab = bytes(ab);
    //     uint k = 0;

    //     for (uint i = 0; i < _ba.length; i++)
    //         bab[k++] = _ba[i];

    //     for (uint i = 0; i < _bb.length; i++)
    //         bab[k++] = _bb[i];

    //     return string(bab);
    // }

    // function transfer(string memory _physical_address,address reciever) public payable returns (address) {
    //     // address a = 0x84753F397F925ABA6d00222C51e8F6c6b81359E5;
    //     // approve(a, 1);
    //     // // _transferFrom(msg.sender, a, 1);
    //     // // _propertyIndexToOwner[1] = a;
    //     uint id = _propertyToIndex[_physical_address];
    //     safeTransferFrom(msg.sender,reciever,id);
    //     // return (msg.sender, balanceOf(msg.sender));
    //     _propertyIndexToOwner[id] = reciever;
    //     // uint256[] memory h = _tokensOfOwner(msg.sender);
    //     return _propertyIndexToOwner[id];
    // }

    // function tokensOfOwner(address _owner) external view returns(uint256[] memory ownerTokens) {
    //     uint256 tokenCount = balanceOf(_owner);

    //     if (tokenCount == 0) {
    //         // Return an empty array
    //         return new uint256[](0);
    //     } else {
    //         uint256[] memory result = new uint256[](tokenCount);
    //         uint256 total = totalSupply();
    //         uint256 resultIndex = 0;

    //         // We count on the fact that all proprty have IDs starting at 1 and increasing
    //         // sequentially up to the count.
    //         uint256 propertyId;

    //         for (propertyId = 1; propertyId <= total; propertyId++) {
    //             if (_propertyIndexToOwner[propertyId] == _owner) {
    //                 result[resultIndex] = propertyId;
    //                 resultIndex++;
    //             }
    //         }

    //         return result;
    //     }
    // }
    // function senderAddres() public view returns(uint256) {
    //     uint256 tokenCount = balanceOf(msg.sender);

    //     return tokenCount;

    // }
    //to get tokens of particular owner
    function tokensOfOwner(address add) public returns(uint[] memory)
    {
     return ownerTokens[add];
    }

}
contract Market is Ownable {


    // an object of Property Smart contract
    PropertyToken pt = new PropertyToken();

    //to get address of PropertyToken
    function returnPropertyToken() public returns (address)
    {
        return address(pt);
    }

    // struct Property {
    //      // IPFS Hash
    //     string property_name;
    //     string property_address;
    //     string city;
    //     string state;
    //     uint postal_code;
    // }
    // Property[] public marketProperties;

    //Test function
    function tryAdd() public returns (address)
    {
        return msg.sender;
    }

    // Function to create a new property throught PropertToken
    function mintPropety( string memory _property_name,
                  string memory _property_address, string memory _city,
                  string memory _state,uint  _postal_code, uint _price) public onlyOwner {

        pt.mint(_property_name, _property_address, _city, _state, _postal_code, _price, address(this));
    }
    // function propertyForSaleN()  public view returns(uint)
    // {
    //     return pt.propertiesForSaleN();
    // }
    // function ownerOf(uint id) public returns(address)
    // {
    //     return pt.ownerOf(id);
    // }
    // function propertiesForSale(uint id) public returns (uint)
    // {
    //     return pt.propertiesForSale(id);
    // }
    // function getProperties(uint id) public returns(Property memory)
    // {
    //     marketProperties = pt.properties(id);
    // }

    //Function to transfer Property, call transfer function of PropertyToken
    function transferProperty(uint _propertyId,address app) public payable
    {
        address ownerToken = pt.ownerOf(_propertyId);
        if(ownerToken == address(this))
        {
            pt.buyProperty(_propertyId,msg.sender);
        }
        else {
            address payable prevOwner = address(uint160(ownerToken));
            pt.buyProperty2(ownerToken,_propertyId,msg.sender);
            prevOwner.transfer(msg.value);

        }
        // pt.setApproval()
            // prevOwner.transfer(msg.value);
        // tokensOfOwner[msg.sender].push(_propertyId);
    }
}
