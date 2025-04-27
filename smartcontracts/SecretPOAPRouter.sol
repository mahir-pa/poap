// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SecretCodeManager.sol";
import "./SecretPOAPNFT.sol";

contract SecretPOAPRouter {
    SecretCodeManager public codeManager;
    SecretPOAPNFT public nftContract;
    address public owner;

    event Minted(address indexed user, uint256 tokenId, string uri);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _codeManager, address _nftContract) {
        codeManager = SecretCodeManager(_codeManager);
        nftContract = SecretPOAPNFT(_nftContract);
        owner = msg.sender;
    }

    function mintWithSecret(string memory _secretWord) external {
        string memory uri = codeManager.verifyAndMarkUsed(_secretWord, msg.sender);
        uint256 tokenId = nftContract.mint(msg.sender, uri);
        emit Minted(msg.sender, tokenId, uri);
    }

    function updateNFTContract(address _newNFTContract) external onlyOwner {
        nftContract = SecretPOAPNFT(_newNFTContract);
    }
}
