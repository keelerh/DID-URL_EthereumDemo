pragma solidity ^0.4.8;

contract Registrar {
    mapping (string => string) map;

    event Registration(address indexed _by, string _did, string _url);

    function Registrar() {
    }

    function registerDIDURL(string did, string url) returns(bool success) {
        map[did] = url;
        Registration(msg.sender, did, url);
        return true;
    }

    function getURL(string did) constant returns(string) {
        return map[did];
    }
}
