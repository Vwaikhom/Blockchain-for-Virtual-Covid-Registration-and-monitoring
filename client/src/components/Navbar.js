import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = (props) => {

  const handleClick = (e) => {
   if(props.data.linkDisabled == "true"){
     e.preventDefault();
     alert("You are not the admin");
   }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
            </li>
              <NavLink className="nav-link" exact to="/">
                Home
              </NavLink>
              <NavLink className="nav-link" exact to="/RegisterPatient">
                Register Patient
              </NavLink>
              <NavLink className="nav-link" exact to="/UploadFile">
                Upload File
              </NavLink>
              <NavLink onClick={handleClick} className="nav-link" exact to="/CriticalPatients">
                Critical Patients
              </NavLink>
          </ul>
        </div>
      </div>
      <div>
      <form class="form-inline my-2 my-lg-0">
    </form>
      </div>
    </nav>
  );
};

export default Navbar;
