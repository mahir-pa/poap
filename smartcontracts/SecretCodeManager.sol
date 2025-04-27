// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SecretCodeManager {
    struct CodeInfo {
        string metadataURI;
        bool exists;
    }

    mapping(bytes32 => CodeInfo) public codes; // secret code => metadata info
    mapping(bytes32 => mapping(address => bool)) public hasUsed; // secret code + address => minted?

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function verifyAndMarkUsed(string memory _secretWord, address user) external returns (string memory) {
        bytes32 codeHash = keccak256(abi.encodePacked(_secretWord));
        require(codes[codeHash].exists, "Invalid secret code");
        require(!hasUsed[codeHash][user], "Already minted with this code");

        hasUsed[codeHash][user] = true;
        return codes[codeHash].metadataURI;
    }

    function addSecretWord(string memory _secretWord, string memory _metadataURI) external onlyOwner {
        bytes32 codeHash = keccak256(abi.encodePacked(_secretWord));
        codes[codeHash] = CodeInfo({
            metadataURI: _metadataURI,
            exists: true
        });
    }
}
