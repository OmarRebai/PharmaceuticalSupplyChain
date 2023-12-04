import React, { useState, useEffect } from "react";
import Web3 from "web3";

function LandingPage() {
  const [currentaccount, setCurrentaccount] = useState("");

  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);
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
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    console.log(accounts[0]);
    setCurrentaccount(account);
  };
  return (
    <div className="homebg">
      <div className="project-title">
        {" "}
        <h1>MedSuiviChain</h1>
        <span>
          La chaîne d'approvisionnement pharmaceutique implique le processus
          d'approvisionnement en matières premières, de fabrication, de
          distribution et de livraison de médicaments aux consommateurs.
        </span>
        <br />
        <br />
        <span>
          <b>Adresse du compte courant :</b> {currentaccount}
        </span>
      </div>
    </div>
  );
}

export default LandingPage;
