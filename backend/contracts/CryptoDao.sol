// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
 * Minimal interface for NFT721
 */
interface IDaoNFT {
    /// @dev balanceOf returns the number of NFTs owned by the given address
    /// @param owner - address to fetch number of NFTs for
    /// @return Returns the number of NFTs owned
    function balanceOf(address owner) external view returns (uint256);
}

contract CryptoDaoToken is ERC20, Ownable {
    // Price of one Crypto Dao token
    uint256 public constant tokenPrice = 0.1 ether;
    // the max total supply is 1000 for Crypto Dao Tokens
    uint256 public constant maxTotalSupply = 1000 * 10 ** 18;
    // DAONFTMember contract instance
    IDaoNFT DAONFTMember;
    // DAONFTVip contract instance
    IDaoNFT DAONFTVip;

    constructor(
        address _daoNftMemberContract,
        address _daoNftVipContract
    ) ERC20("Crypto DAO Token", "CDT") {
        DAONFTMember = IDaoNFT(_daoNftMemberContract);
        DAONFTVip = IDaoNFT(_daoNftVipContract);
    }

    /**
     * @dev Mints `amount` number of CryptoDaoTokens
     * Requirements:
     * - `msg.value` should be equal or greater than the tokenPrice * amount
     */
    function mint(uint256 amount) public payable {
        // A wallet can only have a max of 10 of this tokens
        require(
            balanceOf(msg.sender) + amount * 10 ** 18 <= 10 * 10 ** 18,
            "You can't mint more than 10 CDT Tokens"
        );
        // A wallet need to mint one of DAONFTMember or DAONFTVip to mint this tokens
        require(
            DAONFTMember.balanceOf(msg.sender) > 0 ||
                DAONFTVip.balanceOf(msg.sender) > 0,
            "Your are not a member of this DAO"
        );
        // the value of ether that should be equal or greater than tokenPrice * amount;
        uint256 _requiredAmount = tokenPrice * amount;
        require(msg.value >= _requiredAmount, "Ether sent is incorrect");
        // total tokens + amount <= 1000, otherwise revert the transaction
        uint256 amountWithDecimals = amount * 10 ** 18;
        require(
            (totalSupply() + amountWithDecimals) <= maxTotalSupply,
            "Exceeds the max total supply available."
        );
        // call the internal function from Openzeppelin's ERC20 contract
        _mint(msg.sender, amountWithDecimals);
    }

    /**
     * @dev withdraws all ETH sent to this contract
     * Requirements:
     * wallet connected must be owner's address
     */
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw, contract balance empty");

        address _owner = owner();
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
