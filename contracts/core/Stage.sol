// SPDX-License-Identifier: MIT 
pragma solidity >=0.4.22 <0.9.0;



//stages of a medicine in pharma supply chain
enum STAGE {
    Init,
    RawMaterialSupply,
    Manufacture,
    Distribution,
    Retail,
    sold
}

