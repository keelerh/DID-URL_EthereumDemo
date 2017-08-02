import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import registrar_artifacts from '../../build/contracts/Registrar.json'

let Registrar = contract(registrar_artifacts);

let accounts;
let account;

window.App = {
  start: function() {
    let self = this;

    Registrar.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
    });
  },

  setStatus: function(message) {
    let status = document.getElementById("status");
    status.innerHTML = message;
  },

  register: function() {
    let self = this;

    let did = document.getElementById("did").value;
    let url = document.getElementById("url").value;

    this.setStatus("Initiating registration... (please wait)");

    let registrar;
    Registrar.deployed().then(function(instance) {
      registrar = instance;
      return registrar.registerDIDURL.call(did, url, {from: web3.eth.coinbase});
    }).then(function(success) {
      console.log(success)
      if (success) {
        //console.log(web3.eth.estimateGas{web3.eth.coinbase, "0x1234abababababa"})
        registrar.registerDIDURL(did, url, {from: web3.eth.coinbase});
        self.setStatus("Registration complete!");
      } else {
        self.setStatus("Registration failed :(");
      }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error registering DID-URL pair; see log.");
    });
  },

  getURL: function() {
    let self = this;

    let did = document.getElementById("registeredDID").value;

    this.setStatus("Querying for URL... (please wait)");

    let registrar;
    Registrar.deployed().then(function(instance) {
      registrar = instance;
      return registrar.getURL.call(did, {from: web3.eth.coinbase});
    }).then(function(url) {
      if (url) {
        self.setStatus("URL: " + url);
      } else {
        self.setStatus("DID has not been registered.");
      }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error retrieving registered URL; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
