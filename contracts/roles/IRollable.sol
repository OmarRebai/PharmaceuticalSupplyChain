// SPDX-License-Identifier: MIT 
pragma solidity >=0.4.22 <0.9.0;


struct Rollable{
    address addr;
    uint256 id;
    string name;
    string place;
}

interface IRollable{

    function find(address _address) external view returns (uint256);
    
}