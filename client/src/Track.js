import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import Table from "react-bootstrap/Table";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

function Track() {
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);
  const [showMain, setShowMain] = useState(true);
  const [selectedRed, setSelectedRec] = useState({});
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();
  const [ID, setID] = useState();
  const [RMS, setRMS] = useState();
  const [MAN, setMAN] = useState();
  const [DIS, setDIS] = useState();
  const [RET, setRET] = useState();

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
      med[i + 1] = await supplychain.methods.getMedicine(i + 1).call();
      medStage[i + 1] = await supplychain.methods.showStage(i + 1).call();
    }
    setMED(med);
    setMedStage(medStage);
    const rmsCtr = await supplychain.methods.rawMaterialSupplierCtr().call();
    const rms = {};
    for (i = 0; i < rmsCtr; i++) {
      rms[i + 1] = await supplychain.methods.getRMS(i + 1).call();
    }
    setRMS(rms);
    const manCtr = await supplychain.methods.manufacturerCtr().call();
    const man = {};
    for (i = 0; i < manCtr; i++) {
      man[i + 1] = await supplychain.methods.getManufacturer(i + 1).call();
    }
    setMAN(man);
    const disCtr = await supplychain.methods.distributorCtr().call();
    const dis = {};
    for (i = 0; i < disCtr; i++) {
      dis[i + 1] = await supplychain.methods.getDistributor(i + 1).call();
    }
    setDIS(dis);
    const retCtr = await supplychain.methods.retailerCtr().call();
    const ret = {};
    for (i = 0; i < retCtr; i++) {
      ret[i + 1] = await supplychain.methods.getRetailer(i + 1).call();
    }
    setRET(ret);
    setloader(false);
  };

  if (loader)
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

  const trackDetails = async (event, ID, obj) => {
    event.preventDefault();
    setID(ID);
    setSelectedRec(obj);
    setShowMain(false);
    var ctr = await SupplyChain.methods.medicineCtr().call();
    if (!(ID > 0 && ID <= ctr)) alert("Invalid Medicine ID!!!");
  };

  return (
    <div className="bluredBg">
      {showMain ? (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Composition</th>
              <th>Quantité</th>
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
                  <td>{MedStage[key]}</td>
                  <td>
                    {" "}
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={(event) =>
                        trackDetails(event, MED[key]?.id, MED[key])
                      }
                    >
                      Suivre la commande
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <>
          {" "}
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => setShowMain(true)}>
              Liste
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{selectedRed?.name}</Breadcrumb.Item>
            <Breadcrumb.Item active>{selectedRed?.id}</Breadcrumb.Item>
            <Breadcrumb.Item active>Suivre les détails</Breadcrumb.Item>
          </Breadcrumb>
          {ID && (
            <div className="container-xl track-card">
              <h3>
                <b>
                  <u> Médicament: </u>
                </b>
              </h3>
              <span>
                <b> ID Médicament: </b>
                {MED[ID]?.id}
              </span>
              <br />
              <span>
                <b> Nom: </b> {MED[ID]?.name}
              </span>
              <br />
              <span>
                <b> Description: </b>
                {MED[ID]?.description}
              </span>
              <br />
              <span>
                <b> Composition: </b>
                {MED[ID]?.compositions}
              </span>
              <br />
              <span>
                <b> Quantité: </b>
                {MED[ID]?.quantity}
              </span>
              <br />
              <span>
                <b> Étape actuelle: </b>
                {MedStage[ID]}
              </span>
            </div>
          )}
          <div className="progressbar-wrapper">
            <ul className="progressbar">
              <li className={selectedRed?.stage >= "0" ? "active" : ""}>
                Commande de médicaments
              </li>
              <li className={selectedRed?.stage >= "1" ? "active" : ""}>
                Fournisseur de matières premières
              </li>
              <li className={selectedRed?.stage >= "2" ? "active" : ""}>
                Fabricant
              </li>
              <li className={selectedRed?.stage >= "3" ? "active" : ""}>
                Distributeur
              </li>
              <li className={selectedRed?.stage >= "4" ? "active" : ""}>
                Détaillant
              </li>
              <li className={selectedRed?.stage >= "5" ? "active" : ""}>
                Consommateur
              </li>
            </ul>
          </div>
          <div className="row container d-flex justify-content-center track-card">
            {MED[ID]?.stage >= "1" && (
              <div className="col d-flex flex-column justify-content-between">
                <h6>
                  Matières premières fournis par{" "}
                  <strong>{RMS[MED[ID]?.RMSid].name}</strong> de{" "}
                  <strong>{RMS[MED[ID]?.RMSid].place}</strong>
                </h6>
                <h5>
                  ID fournisseur
                  <span className="text-c-green m-l-10">
                    {RMS[MED[ID]?.RMSid].id}
                  </span>
                  <div className="progress mt-2">
                    <div
                      className="progress-bar bg-c-red"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </h5>
              </div>
            )}

            {MED[ID]?.stage >= "2" && (
              <div className="col d-flex flex-column justify-content-between">
                <h6>
                  Fabriqué par <strong>{MAN[MED[ID]?.MANid].name}</strong> de{" "}
                  <strong>{MAN[MED[ID]?.MANid].place}</strong>
                </h6>
                <h5>
                  ID fabricant
                  <span className="text-c-red m-l-10">
                    {MAN[MED[ID]?.MANid].id}
                  </span>
                  <div className="progress mt-2">
                    <div
                      className="progress-bar bg-c-red"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </h5>
              </div>
            )}
            {MED[ID]?.stage >= "3" && (
              <div className="col d-flex flex-column justify-content-between">
                <h6>
                  Distribué par <strong>{DIS[MED[ID]?.DISid].name}</strong> de{" "}
                  <strong>{DIS[MED[ID]?.DISid].place}</strong>
                </h6>
                <h5>
                  ID distributeur
                  <span className="text-c-red m-l-10">
                    {DIS[MED[ID]?.DISid].id}
                  </span>
                  <div className="progress mt-2">
                    <div
                      className="progress-bar bg-c-red"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </h5>
              </div>
            )}
            {MED[ID]?.stage >= "4" && (
              <div className="col d-flex flex-column justify-content-between">
                <h6>
                  Vendu par <strong>{RET[MED[ID]?.RETid].name}</strong> de{" "}
                  <strong>{RET[MED[ID]?.RETid].place}</strong>
                </h6>
                <h5>
                  ID détaillant
                  <span className="text-c-red m-l-10">
                    {RET[MED[ID]?.RETid].id}
                  </span>
                  <div className="progress mt-2">
                    <div
                      className="progress-bar bg-c-red"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </h5>
              </div>
            )}
            {MED[ID]?.stage >= "5" && (
              <div className="col d-flex flex-column justify-content-between">
                <h6>
                  Vendu par <strong>{RET[MED[ID]?.RETid].name}</strong> de{" "}
                  <strong>{RET[MED[ID]?.RETid].place}</strong>
                </h6>
                <h5>
                  ID détaillant
                  <span className="text-c-red m-l-10">
                    {RET[MED[ID]?.RETid].id}
                  </span>
                  <div className="progress mt-2">
                    <div
                      className="progress-bar bg-c-red"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </h5>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Track;
