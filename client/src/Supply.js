import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

function getDateNow() {
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();

  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}

function Supply() {
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();

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
  const loadBlockchaindata = async () => {
    setloader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentaccount(account);

    const supplychain = new web3.eth.Contract(
      SupplyChainABI.abi,
      SupplyChainABI.address
    );

    setSupplyChain(supplychain);
    var i;
    const medCtr = await supplychain.methods.medicineCtr().call();
    const med = {};
    const medStage = [];
    for (i = 0; i < medCtr; i++) {
      med[i] = await supplychain.methods.getMedicine(i + 1).call();
      medStage[i] = await supplychain.methods.showStage(i + 1).call();
      if (medStage[i] === "Medicine Ordered") {
        medStage[i] = "Médicament commandé";
      } else if (medStage[i] === "Raw Material Supply Stage") {
        medStage[i] = "Approvisionnement en Matières Premières";
      } else if (medStage[i] === "Manufacturing Stage") {
        medStage[i] = "Fabrication";
      } else if (medStage[i] === "Distribution Stage") {
        medStage[i] = "Distribution";
      } else if (medStage[i] === "Retail Stage") {
        medStage[i] = "Vente au Détail";
      } else if (medStage[i] === "Medicine Sold") {
        medStage[i] = "Médicament Vendu";
      } else {
        medStage[i] = "Étape non valide";
      }
    }
    setMED(med);
    setMedStage(medStage);
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

  const handlerSubmitRMSsupply = async (event, ID) => {
    event.preventDefault();
    try {
      var dateNow = getDateNow();
      var reciept = await SupplyChain.methods
        .RMSsupply(ID, dateNow)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitManufacturing = async (event, ID) => {
    event.preventDefault();
    try {
      var dateNow = getDateNow();
      var reciept = await SupplyChain.methods
        .Manufacturing(ID, dateNow)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitDistribute = async (event, ID) => {
    event.preventDefault();
    try {
      var dateNow = getDateNow();
      var reciept = await SupplyChain.methods
        .Distribute(ID, dateNow)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitRetail = async (event, ID) => {
    event.preventDefault();
    try {
      var dateNow = getDateNow();
      var reciept = await SupplyChain.methods
        .Retail(ID, dateNow)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitSold = async (event, ID) => {
    event.preventDefault();
    try {
      var dateNow = getDateNow();
      var reciept = await SupplyChain.methods
        .sold(ID, dateNow)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  return (
    <div className="bluredBg">
      <div class="progressbar-wrapper">
        <ul class="progressbar">
          <li class="active">Commande de médicaments</li>
          <li class="active">Fournisseur de matières premières</li>
          <li class="active">Fabricant</li>
          <li class="active">Distributeur</li>
          <li class="active">Détaillant</li>
          <li class="active">Consommateur</li>
        </ul>
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Composition</th>
            <th>Quantité</th>
            <th>Date de création</th>
            <th>Date de mise à jour</th>
            <th>Étape actuelle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(MED).map(function (key) {
            return (
              <tr key={key}>
                <td>{MED[key].id}</td>
                <td>
                  {MED[key]?.name?.length > 40
                    ? MED[key]?.name?.substring(1, 40) + "..."
                    : MED[key]?.name}
                </td>
                <td>
                  {MED[key]?.description?.length > 40
                    ? MED[key]?.description?.substring(1, 40) + "..."
                    : MED[key]?.description}
                </td>
                <td>
                  {MED[key]?.compositions?.length > 40
                    ? MED[key]?.compositions?.substring(1, 40) + "..."
                    : MED[key]?.compositions}
                </td>
                <td>{MED[key].quantity}</td>
                <td>{MED[key].create_date}</td>
                <td>{MED[key].update_date}</td>
                <td>{MedStage[key]}</td>
                <td>
                  {MedStage[key] === "Médicament commandé" && (
                    <button
                      className="btn btn-warning btn-sm w-100"
                      onClick={(event) =>
                        handlerSubmitRMSsupply(event, MED[key].id)
                      }
                    >
                      Approvisionner
                    </button>
                  )}
                  {MedStage[key] ===
                    "Approvisionnement en Matières Premières" && (
                    <button
                      className="btn btn-warning btn-sm w-100"
                      onClick={(event) =>
                        handlerSubmitManufacturing(event, MED[key].id)
                      }
                    >
                      Fabriquer
                    </button>
                  )}
                  {MedStage[key] === "Fabrication" && (
                    <button
                      className="btn btn-warning btn-sm w-100"
                      onClick={(event) =>
                        handlerSubmitDistribute(event, MED[key].id)
                      }
                    >
                      Distribuer
                    </button>
                  )}
                  {MedStage[key] === "Distribution" && (
                    <button
                      className="btn btn-warning btn-sm w-100"
                      onClick={(event) =>
                        handlerSubmitRetail(event, MED[key].id)
                      }
                    >
                      Vente au détail
                    </button>
                  )}
                  {MedStage[key] === "Vente au Détail" && (
                    <button
                      className="btn btn-warning btn-sm w-100"
                      onClick={(event) => handlerSubmitSold(event, MED[key].id)}
                    >
                      Vendu
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default Supply;
