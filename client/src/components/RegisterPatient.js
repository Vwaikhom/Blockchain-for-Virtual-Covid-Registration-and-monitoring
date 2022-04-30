import { Component, useState } from "react";
import React from "react";
class RegisterPatient extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            PatientName: "",
            PatientAadhar: "",
            PatientPhoneNumber: ""
        };
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { accounts, Contract } = this.props.data;
        const { PatientName, PatientAadhar, PatientPhoneNumber } = this.state;
      
        console.log(accounts[0]);
        await Contract.methods.registerPatient(PatientName,PatientAadhar,PatientPhoneNumber).send( { from: accounts[0] } );
    }

    handleChange = (e) => {
        const { target: {value, name} } = e;

        this.setState({
            [name]: value
        });
    }

    render(){
        return (
            <div className="container">
          <div className="w-75 mx-auto shadow p-5 mt-5">
            <h2 className="text-center mb-4">Register a Patient</h2>
    
            <form onSubmit={this.handleSubmit}>
              <div className="form-group mt-3">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter Name"
                  name="PatientName"
                  value={this.state.PatientName}
                  onChange={this.handleChange}/>
              </div>
    
              <div className="form-group mt-3">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter AADHAR"
                  name="PatientAadhar"
                  value={this.state.PatientAadhar}
                  onChange={this.handleChange}
                />
              </div>
    
              <div className="form-group mt-3">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter Phone Number"
                  name="PatientPhoneNumber"
                  value={this.state.PatientPhoneNumber}
                  onChange={this.handleChange}
                />
              </div>
              <button className="btn btn-primary btn-block mt-3">
                Register Patient
              </button>
            </form>
          </div>
        </div>
        );   
    };
};

export default RegisterPatient;

