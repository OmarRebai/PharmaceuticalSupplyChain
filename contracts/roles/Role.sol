// SPDX-License-Identifier: MIT 
pragma solidity >=0.4.22 <0.9.0;

import "./IRollable.sol";


contract Role is IRollable  {
    
    
    mapping(uint256 => Rollable) private rollable_arr;
    uint256 private len = 0;

    function find(address _address) public view returns (uint256) {
        require(len > 0);
        for (uint256 i = 1; i <= len; i++) {
            if (rollable_arr[i].addr == _address) return rollable_arr[i].id;
        }
        return 0;
    }

    function add(
        address _address,
        string memory _name,
        string memory _place
    ) public {
        len++;
        rollable_arr[len] = Rollable(_address, len, _name, _place);
    }

    function getLen() public view returns (uint256) {
        return len;
    }

     function getElement(uint256 _id) public view returns (Rollable memory) {
        return rollable_arr[_id];
    }

}
