import React from "react";
import { Component, useState } from "react";
import { Link, NavLink } from "react-router-dom";

class ViewPatient extends Component{
    constructor(props){
        super(props);
        this.state = {
            PatientResult: [],
            PatientName: "",
            PatientAadhar: "",
            PatientPhoneNumber: ""
        };
    }

    componentDidMount = async() => {
        try{
            const { Contract, accounts } = this.props.data;
            const result = await Contract.methods.getPatients().call();
            console.log(result.length);
            console.log(result)

            this.setState({ PatientResult: result })

        }
        catch(error){
            console.error(error);
        }
    }

    handleClick = (e) => {
        if(this.props.data.linkDisabled == "true"){
            e.preventDefault()
            alert("You are not the admin.")
        }
    }

    showInAnotherTab = (blob) => {
        const URL = window.URL.createObjectURL(blob);
        window.open(URL);
    }

    viewRecord = patient => async(event) => {
        if(this.props.data.linkDisabled === "true"){
            event.preventDefault();
            alert("You are not the admin!")
        } else{
            console.log(patient.owner);
            const{Contract} = this.props.data;
            const admin = "0x9b5390DFB6A50AE586942c5984BDB8Bf147d82cE";
            const result = await Contract.methods.getFile(patient.owner).call({from: admin});
            console.log(result);

            const data = new FormData()
            data.append('hash', result[0]);

            try{
                await fetch('http://192.168.29.122:5000/download' ,{
                    method : 'POST',
                    body: data
                })
                .then((response) => {
                    response.blob().then(blob => this.showInAnotherTab(blob));
                });
            } catch(error){
                console.log(error);
            }
        }  
    }

    deletePatient = patient => async(e) => {
        //e.preventDefault()
        if(this.props.data.linkDisabled == "true"){
            e.preventDefault();
            alert("You dont have permission")
        } else {
            const{Contract , accounts} = this.props.data;
            const deleteResult = await Contract.methods.deletePatient(patient.owner).send({ from: accounts[0]})
            console.log(deleteResult)
        }
    }
    render(){
        return(
            <div className="container">          
            <table className="table border shadow">
            <thead>
            <tr className="table-dark">
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Aadhar Number</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
            {
                this.state.PatientResult.map((patient, index) => (
                    <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{patient.patient_name}</td>
                        <td>{patient.patient_aadhar}</td>
                        <td>{patient.phone_number}</td>
                        <td>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                <NavLink onClick={this.handleClick} className="btn btn-danger mr-2" to={`/Condition/${patient.owner}`} >View Condition</NavLink>
                                <button className="btn btn-primary mr-2" onClick={this.viewRecord(patient)}>View Medical Record</button>
                                <button className="btn btn-danger" onClick={this.deletePatient(patient)}>Delete Patient</button>
                            </div>
                        </td>
                    </tr>
                ))
            }
        </tbody>
      </table>
          </div>
        );
    }

};

export default ViewPatient;