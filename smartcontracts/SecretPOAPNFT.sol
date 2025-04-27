// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SecretPOAPNFT
 * @notice Ultra-small ERC-721-style NFT contract
 *         – only “minter” address can mint
 *         – ownerOf / balanceOf & Transfer event for wallet / explorer support
 *         – updateMinter() lets you hand over mint rights to the Router
 */
contract SecretPOAPNFT {
    /*//////////////////////////////////////////////////////////////
                               METADATA
    //////////////////////////////////////////////////////////////*/

    string public constant name   = "SecretPOAP";
    string public constant symbol = "SPOAP";

    /*//////////////////////////////////////////////////////////////
                               STORAGE
    //////////////////////////////////////////////////////////////*/

    uint256               public nextTokenId;
    mapping(uint256 => address) public ownerOf;
    mapping(address  => uint256) public balanceOf;
    mapping(uint256 => string )  public tokenURI;

    address public minter;          // who can mint (you first, later the Router)

    /*//////////////////////////////////////////////////////////////
                               EVENTS
    //////////////////////////////////////////////////////////////*/

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /*//////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier onlyMinter() {
        require(msg.sender == minter, "Not minter");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @param _minter initial minter (your wallet on first deploy)
    constructor(address _minter) {
        minter = _minter;
    }

    /*//////////////////////////////////////////////////////////////
                                MINT
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Mint a new NFT to `to` with metadata `uri`
     * @dev    Only callable by current minter (Router after hand-off)
     */
    function mint(address to, string calldata uri) external onlyMinter returns (uint256 tokenId) {
        tokenId = nextTokenId;
        nextTokenId++;

        ownerOf[tokenId] = to;
        balanceOf[to]   += 1;
        tokenURI[tokenId] = uri;

        emit Transfer(address(0), to, tokenId);
    }

    /*//////////////////////////////////////////////////////////////
                          MINTER HAND-OVER
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Hand over mint permissions to a new contract (Router)
     * @dev    Only current minter can call
     */
    function updateMinter(address _newMinter) external onlyMinter {
        minter = _newMinter;
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW HELPERS (OPTIONAL)
    //////////////////////////////////////////////////////////////*/

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        // ERC-165: 0x01ffc9a7, ERC-721: 0x80ac58cd, ERC-721 Metadata: 0x5b5e139f
        return interfaceId == 0x01ffc9a7 || interfaceId == 0x80ac58cd || interfaceId == 0x5b5e139f;
    }
}
