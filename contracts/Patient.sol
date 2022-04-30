// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;
pragma experimental ABIEncoderV2;

contract Patient {

  struct patient {
    address owner;
    string patient_name;
    string patient_aadhar;
    string phone_number;
    bool exist;
  }

  struct file{
      string FileHash;
      string FileName;
      address PatientAddress;
  }

  struct parameters{
    address patientAddress;
    uint temp;
    uint oxygen;
    uint256 timestamp;
    bool exists;
  }

  address[] public patientsAddress;
  address[] public criticalPatients;
  mapping(address => parameters[]) public patientHealth;
  mapping(address => parameters[]) public criticalParameters;
  mapping(address => file) public patientFiles;
  mapping(address => patient) public patients;
  mapping(string => bool) public isRegistered;
  uint public blockCount = 0;
  uint critical = 0;
  uint public PatientCounter = 0;
  address admin = 0x9b5390DFB6A50AE586942c5984BDB8Bf147d82cE; 

  modifier isAdmin(){
    require(msg.sender == admin, "Access Denied");
    _;
  }

  function registerPatient(string memory name, string memory aadhar, string memory phoneN) public {
    require(!isRegistered[aadhar], 'This user is already registered');
    isRegistered[aadhar] = true; //mark patient as registered
    patientsAddress.push(msg.sender);
    patients[msg.sender] = patient(msg.sender,name,aadhar,phoneN,true);
    PatientCounter++;
  }

  function getPatients() public view returns (patient [] memory) {
    patient [] memory Lists = new patient[] (patientsAddress.length);
    for(uint i = 0; i < patientsAddress.length; i++){
      // if(patients[patientsAddress[i]].exist == true){
        patient storage List = patients[patientsAddress[i]];
        Lists[i] = List;
      //}
    }
    return Lists;
  }

  function deletePatient(address addr) public isAdmin {
    patients[addr].exist = false;
    uint index;
    for(uint i = 0; i < PatientCounter; i++){
      if(patientsAddress[i] == addr){
        index = i;
      }
    }
    patientsAddress[index] = patientsAddress[patientsAddress.length - 1];
    patientsAddress.pop();
    PatientCounter--;
  }

  function storeParameters(address addr, uint _temp, uint _oxygen, string memory _aadhar) public {

    require(isRegistered[_aadhar], 'Not registered Patient');
    require(patients[addr].exist == true, 'Patient does not exist');

    parameters memory param = parameters(addr,_temp,_oxygen, block.timestamp, true);
    parameters[] storage params = patientHealth[addr];  
    params.push(param);
    patientHealth[addr] = params;
    uint tempCritical = critical;
    bool found = false;

    if(_temp >= 100 && _oxygen <= 92){
      for(uint i = 0; i < tempCritical; i++){
        if(criticalPatients[i] == addr){
          found = true;
          break;
        }
      }
      if(found == false){
        criticalParameters[addr] = params;
        criticalPatients.push(addr);
        critical++;
      }
    }

  }


  function getPatientCondition(address addr) public isAdmin view returns(parameters [] memory){
    parameters [] storage params = patientHealth[addr];
    return params;
  }

  function getCriticalPatients() public isAdmin view returns(patient [] memory, parameters [] memory){
    patient[] memory Lists = new patient[] (criticalPatients.length);
    parameters[] memory params = new parameters[] (criticalPatients.length);

    for(uint i = 0; i < criticalPatients.length; i++){
      patient storage list = patients[criticalPatients[i]];
      parameters[] storage tempParams = criticalParameters[criticalPatients[i]];
      parameters storage param = tempParams[tempParams.length - 1];
      //parameters storage param = criticalParameters[criticalPatients[i]];
      Lists[i] = list;
      params[i] = param;
    }  
    
    return (Lists, params);
  }

  function isPatient(address addr) public view returns(bool) {
      return patients[address(addr)].exist;
  }

  function uploadFile(string memory _FileHash, uint _FileSize, string memory _FileName, string memory _aadhar) public {
    require(isRegistered[_aadhar], "Not registerd as a patient");
    require(_FileSize > 0, "No File detected!");
    patientFiles[msg.sender] = file(_FileHash, _FileName, msg.sender);
  }

  function getFile(address addr) public isAdmin view returns (string memory, string memory){
    return(patientFiles[addr].FileHash, patientFiles[addr].FileName);
  }
  
}
