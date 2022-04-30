import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Condition = (props) => {
  const [PatientCondition, setCondition] = useState([]);
  const { id } = useParams();

  const getCondition = async () => {
    console.log(id);
    const condition = await props.data.Contract.methods
      .getPatientCondition(id)
      .call();
    setCondition(condition);
  };

  useEffect(() => {
    getCondition();
  }, []);

  const toTime = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
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

  return (
    <div className="container">
      <table className="table border shadow">
        <thead>
          <tr className="table-dark">
            <th scope="col">#</th>
            <th scope="col">Temperature</th>
            <th scope="col">Oxygen</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {PatientCondition.map((condition, index) => (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{condition.temp}</td>
              <td>{condition.oxygen}</td>
              <td>{toTime(condition.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Condition;
