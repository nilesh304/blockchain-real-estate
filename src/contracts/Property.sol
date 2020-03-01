pragma solidity ^0.5.0;
import "./ERC721Full.sol";

contract Property is ERC721Full {

    string[] public physical_address;
    mapping(string => bool) _propertyExists;
    mapping(uint => address) _propertyIndexToOwner;
    mapping(string => uint) _propertyToIndex;
    constructor() ERC721Full("Property","PROPERTY") public    {
    }

    function mint(string memory _physical_address) public {
        require(!_propertyExists[_physical_address]);
        uint _id = physical_address.push(_physical_address);
        _mint(msg.sender, _id);
        _propertyExists[_physical_address] = true;
        _propertyIndexToOwner[_id] = msg.sender;
        _propertyToIndex[_physical_address] =_id;
    }
    function transfer(string memory _physical_address,address reciever) public payable returns (address) {
        // address a = 0x84753F397F925ABA6d00222C51e8F6c6b81359E5;
        // approve(a, 1);
        // // _transferFrom(msg.sender, a, 1);
        // // _propertyIndexToOwner[1] = a;
        uint id = _propertyToIndex[_physical_address];
        safeTransferFrom(msg.sender,reciever,id);
        // return (msg.sender, balanceOf(msg.sender));
        _propertyIndexToOwner[id] = reciever;
        
        // uint256[] memory h = _tokensOfOwner(msg.sender);
        return _propertyIndexToOwner[id];
    }

    function tokensOfOwner(address _owner) external view returns(uint256[] memory ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 total = totalSupply();
            uint256 resultIndex = 0;

            // We count on the fact that all proprty have IDs starting at 1 and increasing
            // sequentially up to the count.
            uint256 propertyId;

            for (propertyId = 1; propertyId <= total; propertyId++) {
                if (_propertyIndexToOwner[propertyId] == _owner) {
                    result[resultIndex] = propertyId;
                    resultIndex++;
                }
            }

            return result;
        }
    }
    function senderAddres() public view returns(uint256) {
        uint256 tokenCount = balanceOf(msg.sender);

        return tokenCount;

    }

}