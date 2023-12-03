// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './roles/Role.sol';
import './core/Medicine.sol';

contract SupplyChain {
    //Smart Contract owner will be the person who deploys the contract only he can authorize various roles like retailer, Manufacturer,etc
    address public Owner;
    
    Medicine public med;
    Role public rawMaterialSupplier;
    Role public manufacturer;
    Role public distributor;
    Role public retailer;

    


    //note this constructor will be called when smart contract will be deployed on blockchain
    constructor() public {
        Owner = msg.sender;
        rawMaterialSupplier = new Role();
        manufacturer = new Role();
        distributor = new Role();
        retailer = new Role();
        med = new Medicine();
    }

    //Roles (flow of pharma supply chain)
    // RawMaterialSupplier; //This is where Manufacturer will get raw materials to make medicines
    // Manufacturer;  //Various WHO guidelines should be followed by this person
    // Distributor; //This guy distributes the medicines to retailers
    // Retailer; //Normal customer buys from the retailer

    //modifier to make sure only the owner is using the function
    modifier onlyByOwner() {
        require(msg.sender == Owner);
        _;
    }
    
    
    function getMedicine(uint256 _id) public view returns (medicine memory) {
        return med.getElement(_id);
    }
    function getRMS(uint256 _id) public view returns (Rollable memory) {
        return rawMaterialSupplier.getElement(_id);
    }
    function getDistributor(uint256 _id) public view returns (Rollable memory) {
        return distributor.getElement(_id);
    }
    function getRetailer(uint256 _id) public view returns (Rollable memory) {
        return retailer.getElement(_id);
    }
    function getManufacturer(uint256 _id) public view returns (Rollable memory) {
        return manufacturer.getElement(_id);
    }

    function medicineCtr() public view returns (uint256) {
        return med.getLen();
    }
    function rawMaterialSupplierCtr() public view returns (uint256) {
        return rawMaterialSupplier.getLen();
    }
    function distributorCtr() public view returns (uint256) {
        return distributor.getLen();
    }
    function retailerCtr() public view returns (uint256) {
        return retailer.getLen();
    }
    function manufacturerCtr() public view returns (uint256) {
        return manufacturer.getLen();
    }



    //To show status to client applications
    function showStage(
        uint256 _medicineID
    ) public view returns (string memory) {
        return med.show(_medicineID);
    }

    //To add raw material suppliers. Only contract owner can add a new raw material supplier
    function addRawMaterialSupplier( address _address,string memory _name,string memory _place ) public 
    onlyByOwner {
        rawMaterialSupplier.add(_address, _name, _place);
    }

    //To add manufacturer. Only contract owner can add a new manufacturer
    function addManufacturer( address _address,string memory _name,string memory _place ) public 
    onlyByOwner {
        manufacturer.add(_address, _name, _place);
    }

    //To add distributor. Only contract owner can add a new distributor
    function addDistributor( address _address,string memory _name,string memory _place ) public 
    onlyByOwner {
        distributor.add(_address, _name, _place);
    }

    //To add retailer. Only contract owner can add a new retailer
    function addRetailer( address _address,string memory _name,string memory _place ) public 
    onlyByOwner {
        retailer.add(_address, _name, _place);
    }

    function Retail(uint256 _medicineID,string memory date) public{
        med.Retail(_medicineID, retailer, msg.sender,date);
    }

    function Distribute(uint256 _medicineID,string memory date) public{
        med.Distribute(_medicineID, distributor, msg.sender,date);
    }

    function Manufacturing(uint256 _medicineID,string memory date) public{
        med.Manufacturing(_medicineID, manufacturer, msg.sender,date);
    }

    function RMSsupply(uint256 _medicineID, string memory date) public{
        med.RMSsupply(_medicineID, rawMaterialSupplier, msg.sender,date);
    }

    function sold(uint256 _medicineID, string memory date) public{
        med.sold(_medicineID, retailer, msg.sender,date);
    }

    // To add new medicines to the stock
    function addMedicine(
        string memory _name,
        string memory _description,
        string memory _composition,
        uint256 _quantity,
        string memory date
    ) public onlyByOwner {
        med.add(
            _name,
            _description,
            _composition,
            _quantity,
            date,
            rawMaterialSupplier,
            manufacturer,
            distributor,
            retailer
        );
    }
}
