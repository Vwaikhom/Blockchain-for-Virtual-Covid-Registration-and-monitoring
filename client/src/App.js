import React, { Component } from "react";
import Patient from "./contracts/Patient.json";
import getWeb3 from "./getWeb3";
import "../node_modules/bootstrap/dist/css/bootstrap.css"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import RegisterPatient from "./components/RegisterPatient";
import ViewPatient from "./components/ViewPatient";
import UploadFile from "./components/UploadFile";
import Condition from "./components/Condition";
import CriticalPatients from "./components/CriticalPatients";
import LogRocket from 'logrocket';

LogRocket.init('gmyfec/blockchain-mlxwy');

class App extends Component {
  state = { web3: null, accounts: null, Contract: null, linkDisabled: ""};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const PatientdeployedNetwork = Patient.networks[networkId];
      const Patientinstance = new web3.eth.Contract(
        Patient.abi,
        PatientdeployedNetwork && PatientdeployedNetwork.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, Contract: Patientinstance });
      if (accounts[0] === "0x9b5390DFB6A50AE586942c5984BDB8Bf147d82cE")
        this.state.linkDisabled = "false";
      else
        this.state.linkDisabled = "true";
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      
      <div className="App">
        <Router>
        <Navbar data = {this.state}/>
        <Routes>
          <Route path="/" element = {<ViewPatient data = {this.state} />} />
          <Route path="/RegisterPatient" element = {<RegisterPatient data = {this.state}/>} />
          <Route path="/UploadFile" element = {<UploadFile data = {this.state} />} />
          <Route path="/Condition/:id" element = {<Condition  data = {this.state}/>} />
          <Route path="/CriticalPatients" element = {<CriticalPatients  data = {this.state}/>} />
        </Routes>
      </Router>
      </div>

    );
  }
}

export default App;
