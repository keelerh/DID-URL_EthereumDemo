pragma solidity ^0.4.8;

contract Registrar {
    struct Data {
        address owner;
        string url;
        bool isRegistered;
    }

    mapping (string => Data) map;

    event Registration(address indexed _by, string _did, string _url);

    function Registrar() {
    }

    function registerDIDURL(string did, string url) returns(bool success) {
        Data memory data = Data({
            owner: msg.sender,
            url: url,
            isRegistered: true
        });
        if (map[did].isRegistered) {
            if (msg.sender != map[did].owner) {
                return false;
            }
        }
        map[did] = data;
        Registration(msg.sender, did, url);
        return true;
    }

    function getURL(string did) constant returns(string) {
        return map[did].url;
    }
}
