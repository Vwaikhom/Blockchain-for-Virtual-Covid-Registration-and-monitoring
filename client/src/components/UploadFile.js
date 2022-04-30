import { Component } from "react";
import React from "react";

class UploadFile extends Component{
    constructor(props) {   
        super(props); 
        this.state = { buffer: null, ipfsHash: "", PatientAadhar: "", Name: ""};
        this.captureFile = this.captureFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

      handleChange = (e) => {
        const { target: {value, name} } = e;

        this.setState({
            [name]: value
        });
      }

      captureFile = (e) => {
        e.preventDefault()
        this.setState({file: e.target.files[0], fileSize: e.target.files[0].size});
      }

      onSubmit = async (e) => {
        const {Contract, accounts} = this.props.data;
        e.preventDefault()
        const data = new FormData();
        data.append('file', this.state.file);

        const response = await fetch('http://192.168.29.122:5000/upload', {
          method: 'POST',
          body: data,
        });
        const result = await response.json();
        console.log(result); 
        
        await this.setState({ipfsHash : String(result.Hash), Name : result.Name});
        console.log(this.state.ipfsHash, this.state.fileSize, this.state.Name)
        const upload = await Contract.methods.uploadFile(this.state.ipfsHash, this.state.fileSize, this.state.Name, this.state.PatientAadhar).send({ from : accounts[0] })
        console.log(upload);

        // const file = new Blob([this.state.file], { type: "application/pdf" });
        // const fileURL = URL.createObjectURL(file);
        // const pdfWindow = window.open();
        // pdfWindow.location.href = fileURL;

      };

      render() {
        if (!this.props.data.web3) {
          return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
          <div className="App">
            <p>Upload your file to the IPFS.</p>
            <h2>Upload File</h2>
            <form onSubmit={this.onSubmit}>
              <input type='file' onChange={this.captureFile} />
              <input
                  type="text"
                  placeholder="Enter AADHAR"
                  name="PatientAadhar"
                  value={this.state.PatientAadhar}
                  onChange={this.handleChange}
              />
              <input type="submit" />
            </form>
          </div>
        );
      }
}

export default UploadFile;