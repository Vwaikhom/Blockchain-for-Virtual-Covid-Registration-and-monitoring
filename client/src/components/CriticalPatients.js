import React from "react";
import { Component } from "react";

class CriticalPatients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientsConditions: [
        {
          name: "",
          phone: "",
          temp: "",
          oxygen: "",
          time: "",
        },
      ],
    };
  }

  componentDidMount = async () => {
    try {
      const { Contract } = this.props.data;
      const result = await Contract.methods.getCriticalPatients().call();

      const Patients = result[0];
      const Conditions = result[1];

      const conditionObj = [];

      for (let i = 0; i < Patients.length; i++) {
        var obj = [];
        var arr1 = [...Patients[i]];
        var arr2 = [...Conditions[i]];

        obj.name = arr1[1];
        obj.phone = arr1[3];
        obj.temp = arr2[1];
        obj.oxygen = arr2[2];
        obj.time = arr2[3];

        conditionObj.push(obj);
      }
      //console.log(conditionObj)
      this.setState({ patientsConditions: conditionObj });
    } catch (error) {
      console.log(error);
    }
  };

  toTime = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  };

  render() {
    return (
      <div className="container">
        <table className="table border shadow">
          <thead>
            <tr className="table-dark">
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Phone Number</th>
              <th scope="col">Temperature</th>
              <th scope="col">Oxygen</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            {this.state.patientsConditions.map((patient, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{patient.name}</td>
                <td>{patient.phone}</td>
                <td>{patient.temp}</td>
                <td>{patient.oxygen}</td>
                <td>{this.toTime(patient.time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default CriticalPatients;
