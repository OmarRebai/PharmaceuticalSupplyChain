// SPDX-License-Identifier: MIT 
pragma solidity >=0.4.22 <0.9.0;

import './Stage.sol';
import '../roles/Role.sol';

//To store information about the medicine
struct medicine {
    uint256 id; //unique medicine id
    string name; //name of the medicine
    string description; //about medicine
    string compositions; //about compostion
    uint256 quantity; //medicine quantity
    uint256 RMSid; //id of the Raw Material supplier for this particular medicine
    uint256 MANid; //id of the Manufacturer for this particular medicine
    uint256 DISid; //id of the distributor for this particular medicine
    uint256 RETid; //id of the retailer for this particular medicine
    STAGE stage; //current medicine stage
    
    string create_date;
    string update_date;
    
}
    

contract Medicine {

    
    mapping(uint256 => medicine) public MedicineStock;
    uint256 private len = 0;

    //To supply raw materials from RMS supplier to the manufacturer
    function RMSsupply(uint256 _medicineID, Role rawMaterialSupplier, address _address, string memory date ) public {
        require(_medicineID > 0 && _medicineID <= len);
        uint256 _id = rawMaterialSupplier.find(_address);
        require(_id > 0);
        require(MedicineStock[_medicineID].stage == STAGE.Init);
        MedicineStock[_medicineID].RMSid = _id;
        MedicineStock[_medicineID].stage = STAGE.RawMaterialSupply;
        MedicineStock[_medicineID].update_date = date;
    }

    

    //To manufacture medicine
    function Manufacturing(uint256 _medicineID,  Role manufacturer, address _address, string memory date ) public {
        require(_medicineID > 0 && _medicineID <= len);
        uint256 _id = manufacturer.find(_address);
        require(_id > 0);
        require(MedicineStock[_medicineID].stage == STAGE.RawMaterialSupply);
        MedicineStock[_medicineID].MANid = _id;
        MedicineStock[_medicineID].stage = STAGE.Manufacture;
        MedicineStock[_medicineID].update_date = date;
    }

   
    //To supply medicines from Manufacturer to distributor
    function Distribute(uint256 _medicineID,  Role distributor, address _address, string memory date) public {
        require(_medicineID > 0 && _medicineID <= len);
        uint256 _id = distributor.find(_address);
        require(_id > 0);
        require(MedicineStock[_medicineID].stage == STAGE.Manufacture);
        MedicineStock[_medicineID].DISid = _id;
        MedicineStock[_medicineID].stage = STAGE.Distribution;
        MedicineStock[_medicineID].update_date = date;
    }

    

    //To supply medicines from distributor to retailer
    function Retail(uint256 _medicineID,  Role retailer, address _address, string memory date) public {
        require(_medicineID > 0 && _medicineID <= len);
        uint256 _id = retailer.find(_address);
        require(_id > 0);
        require(MedicineStock[_medicineID].stage == STAGE.Distribution);
        MedicineStock[_medicineID].RETid = _id;
        MedicineStock[_medicineID].stage = STAGE.Retail;
        MedicineStock[_medicineID].update_date = date;
    }

    
    //To sell medicines from retailer to consumer
    function sold(uint256 _medicineID,  Role retailer, address _address, string memory date) public {
        require(_medicineID > 0 && _medicineID <= len);
        uint256 _id = retailer.find(_address);
        require(_id > 0);
        require(_id == MedicineStock[_medicineID].RETid); //Only correct retailer can mark medicine as sold
        require(MedicineStock[_medicineID].stage == STAGE.Retail);
        MedicineStock[_medicineID].stage = STAGE.sold;
        MedicineStock[_medicineID].update_date = date;
    }


    // To add new medicines to the stock
    function add(
        string memory _name,
        string memory _description,
        string memory _composition,
        uint256 _quantity,
        string memory date,
        Role rawMaterialSupplier,
        Role manufacturer,
        Role distributor,
        Role retailer
    ) public {
        require((rawMaterialSupplier.getLen() > 0) 
        && (manufacturer.getLen() > 0) 
        && (distributor.getLen() > 0) 
        && (retailer.getLen() > 0));
        len++;
        
        MedicineStock[len] = medicine(
            len,
            _name, // set the name of medicine
            _description, // set the description of the medicine
            _composition, // set the composition of the medicine
            _quantity, // Set the number of quantities
            0,
            0,
            0,
            0,
            STAGE.Init,
            date,
            date
        );
    }

    
    function show(uint256 _medicineID) public view returns (string memory) {
        require(len > 0);
        if (MedicineStock[_medicineID].stage == STAGE.Init)
            return "Medicine Ordered";
        else if (MedicineStock[_medicineID].stage == STAGE.RawMaterialSupply)
            return "Raw Material Supply Stage";
        else if (MedicineStock[_medicineID].stage == STAGE.Manufacture)
            return "Manufacturing Stage";
        else if (MedicineStock[_medicineID].stage == STAGE.Distribution)
            return "Distribution Stage";
        else if (MedicineStock[_medicineID].stage == STAGE.Retail)
            return "Retail Stage";
        else if (MedicineStock[_medicineID].stage == STAGE.sold)
            return "Medicine Sold";
        else
            revert("Invalid stage");
    }
         
    function getLen() public view returns (uint256) {
        return len;
    }

    function getElement(uint256 _id) public view returns (medicine memory) {
        return MedicineStock[_id];
    }


    
      
        

}