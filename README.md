# Blockchain-for-Virtual-Covid-Registration-and-monitoring
## CP-ABE toolkit setup 
* Follow [this link](https://acsc.cs.utexas.edu/cpabe/) to setup CP-ABE toolkit and run the shell scripts ```setup.sh```
## How to run this project.
* Clone this repository in your local machine. 
* Run ```npm install``` to install all the node modules.
* Download ganache and create a new workspace.
* Install truffle suite.
* Install metamask in your chrome browser.
* Open your truffle cli by running this command ```truffle develop```
* To compile and migrate the contracts, run this command from your truffle cli ```truffle migrate --reset``` 
* Run the python script by typing ```python Encrypt.py```
* To store parameters open the truffle cli and call the ```storeParameters()``` 
* Connect the application:
  * Run ```nodemon app.js```
  * Open ```localhost:3000```
* We are now connected.
