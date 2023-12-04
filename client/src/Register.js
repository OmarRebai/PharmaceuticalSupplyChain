import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import rawMaterialSuppliers from "./assets/RawMaterialSuppliers.png";
import distributors from "./assets/Distributors.png";
import manufacturers from "./assets/Manufacturers.png";
import retailers from "./assets/Retailers.png";
function Register() {
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata(false);
  }, []);
  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [tableData, setTableData] = useState({});
  const [address, setAddress] = useState();
  const [name, setName] = useState();
  const [place, setPlace] = useState();
  const [addMethod, setAddMethod] = useState();
  const [subTitle, setSubTitle] = useState("");
  const [showMain, setShowMain] = useState(true);
  const [type, setType] = useState("");
  const [control, setControl] = useState("");

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchaindata = async (have) => {
    setloader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentaccount(account);
    const supplychain = new web3.eth.Contract(
      SupplyChainABI.abi,
      SupplyChainABI.address
    );
    if (have) clickOnCard(control, type, addMethod, subTitle);
    setSupplyChain(supplychain);
    setloader(false);
  };

  if (loader) {
    return (
      <div className="spinner-button">
        <Button variant="warning" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Chargement...
        </Button>
      </div>
    );
  }

  const clickOnCard = async (ctrl, type, addMethod, title) => {
    setAddMethod(addMethod);
    setSubTitle(title);
    setShowMain(false);
    setType(type);
    setControl(ctrl);
    var i;
    const controls = await SupplyChain.methods?.[ctrl]().call();
    const records = {};
    for (i = 0; i < controls; i++) {
      records[i] = await SupplyChain.methods?.[type](i + 1).call();
    }
    setTableData(records);
  };

  const handlerChangePlace = (event) => {
    setPlace(event.target.value);
  };

  const handlerChangeName = (event) => {
    setName(event.target.value);
  };

  const handlerChangeAddress = (event) => {
    setAddress(event.target.value);
  };
  const handlerSubmit = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods?.[addMethod](
        address,
        name,
        place
      ).send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata(true);
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  return (
    <div className="blurBg">
      {showMain ? (
        <div className="container">
          <div className="row">
            <div className="col">
              <Card>
                <Card.Body
                  onClick={() =>
                    clickOnCard(
                      "rawMaterialSupplierCtr",
                      "getRMS",
                      "addRawMaterialSupplier",
                      "Fournisseurs de matières premières"
                    )
                  }
                >
                  {<Card.Title>Fournisseurs de matières premières</Card.Title>}
                  <Card.Img variant="top" src={rawMaterialSuppliers} />
                </Card.Body>
              </Card>
            </div>
            <div className="col">
              <Card>
                <Card.Body
                  onClick={() =>
                    clickOnCard(
                      "manufacturerCtr",
                      "getManufacturer",
                      "addManufacturer",
                      "Fabricants"
                    )
                  }
                >
                  <Card.Title>Fabricants</Card.Title>
                  <Card.Img variant="top" src={manufacturers} />
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Card>
                <Card.Body
                  onClick={() =>
                    clickOnCard(
                      "distributorCtr",
                      "getDistributor",
                      "addDistributor",
                      "Distributeurs"
                    )
                  }
                >
                  <Card.Title>Distributeurs</Card.Title>
                  <Card.Img variant="top" src={distributors} />
                </Card.Body>
              </Card>
            </div>
            <div className="col">
              <Card>
                <Card.Body
                  onClick={() =>
                    clickOnCard(
                      "retailerCtr",
                      "getRetailer",
                      "addRetailer",
                      "Détaillants"
                    )
                  }
                >
                  <Card.Title>Détaillants</Card.Title>

                  <Card.Img variant="top" src={retailers} />
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="bluredBg">
          <Breadcrumb variant="dark">
            <Breadcrumb.Item onClick={() => setShowMain(true)}>
              Liste
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{subTitle}</Breadcrumb.Item>
          </Breadcrumb>
          <form onSubmit={handlerSubmit} className="m-20">
            <input
              className="form-control-sm m-r-15"
              type="text"
              onChange={handlerChangeAddress}
              placeholder="Adresse Ethereum"
              required
            />
            <input
              className="form-control-sm m-r-15"
              type="text"
              onChange={handlerChangeName}
              placeholder="Nom"
              required
            />
            <input
              className="form-control-sm m-r-15"
              type="text"
              onChange={handlerChangePlace}
              placeholder="Adresse"
              required
            />
            <button className="btn btn-warning " onSubmit={handlerSubmit}>
              Ajouter
            </button>
          </form>
          <Table>
            <thead>
              <tr>
                <th>S. No</th>
                <th>Nom</th>
                <th>Adresse</th>
                <th>Adresse Ethereum</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tableData).map(function (key) {
                return (
                  <tr key={key}>
                    <td>{tableData[key]?.id}</td>
                    <td>{tableData[key]?.name}</td>
                    <td>{tableData[key]?.place}</td>
                    <td>{tableData[key]?.addr}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default Register;
