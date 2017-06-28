var Registrar = artifacts.require("./Registrar.sol");

module.exports = function(deployer) {
  deployer.deploy(Registrar);
};
