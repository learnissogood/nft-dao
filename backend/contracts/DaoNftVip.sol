// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract DaoNftVip is ERC721Enumerable, Ownable {
    /**
     * @dev _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`.
     */
    string public _baseTokenURI;

    //  _price is the price of one DAONFT Vip
    uint256 public _price = 0.05 ether;

    // max number of DAONFT Vip
    uint256 public maxTokenIds = 10;

    // total number of tokenIds minted
    uint256 public tokenIds;

    /**
     * @dev ERC721 constructor takes in a `name` and a `symbol` to the token collection.
     * name in our case is `Dao NFT Vip` and symbol is `DAOV`.
     * Constructor for DAONFT Vip takes in the baseURI to set _baseTokenURI for the collection.
     */
    constructor(
        string memory baseURI
    ) ERC721("Dao NFT Vip", "DAOV") {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev mint allows a user to mint 1 NFT per wallet.
     */
    function mint() public payable {
        require(tokenIds < maxTokenIds, "Exceed maximum Crypto DAO Vip supply");
        require(msg.value >= _price, "Ether sent is not correct");
        require(balanceOf(msg.sender) == 0, "You already claim this NFT");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    /**
     * @dev _baseURI overrides the Openzeppelin's ERC721 implementation which by default
     * returned an empty string for the baseURI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev withdraw sends all the ether in the contract
     * to the owner of the contract
     */
    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
