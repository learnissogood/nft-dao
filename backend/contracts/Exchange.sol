// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {
    address public tokenAddress;

    constructor(address _tokenAddress) ERC20("CryptoDev LP Token", "CDLP") {
        require(
            _tokenAddress != address(0),
            "Token address passed is  a null address"
        );
        tokenAddress = _tokenAddress;
    }

    /**
     * @dev Returns the amount of tokens held bythe contract
     */
    function getReserve() public view returns (uint) {
        return ERC20(tokenAddress).balanceOf(address(this));
    }

    /**
     * @dev Adds liquidity to the exchange.
     */
    function addLiquidity(uint _amount) public payable returns (uint) {
        uint liquidity;
        uint ethBalance = address(this).balance;
        uint tokenReserve = getReserve();
        ERC20 token = ERC20(tokenAddress);

        if (tokenReserve == 0) {
            token.transferFrom(msg.sender, address(this), _amount);
            liquidity = ethBalance;
            _mint(msg.sender, liquidity);
        } else {
            uint ethReserve = ethBalance - msg.value;
            uint tokenAmount = (msg.value * tokenReserve) / (ethReserve);
            require(
                _amount >= tokenAmount,
                "Amount of token sent is less than the minimum tokens required"
            );
            token.transferFrom(msg.sender, address(this), tokenAmount);
            liquidity = (totalSupply() * msg.value) / ethReserve;
            _mint(msg.sender, liquidity);
        }

        return liquidity;
    }

    /**
     * @dev Returns the amount ETH / TOKEN that would be returned to the user in the swap
     */
    function removeLiquidity(uint _amount) public returns (uint, uint) {
        require(_amount > 0, "_amount should be greater than zero");
        uint ethReserve = address(this).balance;
        uint _totalSupply = totalSupply();

        uint ethAmount = (ethReserve * _amount) / _totalSupply;
        uint tokenAmount = (getReserve() * _amount) / _totalSupply;
        _burn(msg.sender, _amount);
        (bool sent, ) = payable(msg.sender).call{value: ethAmount}("");
        require(sent, "Failed to send ETH");
        ERC20(tokenAddress).transfer(msg.sender, tokenAmount);
        return (ethAmount, tokenAmount);
    }

    /**
     * @dev Returns the amount Eth/Tokens that would be returned to the user in the swap
     */
    function getAmountOfTokens(
        uint inputAmount,
        uint inputReserve,
        uint outputReserve
    ) public pure returns (uint) {
        require(inputReserve > 0 && outputReserve > 0, "invalid reserves");
        uint inputAmountWithFee = inputAmount * 99;
        uint numerator = inputAmountWithFee * outputReserve;
        uint denominator = (inputReserve * 100) + inputAmountWithFee;
        return numerator / denominator;
    }

    /**
     * @dev Swaps ETH for Token
     */
    function ethToToken(uint _minTokens) public payable {
        uint tokenReserve = getReserve();
        uint tokensBought = getAmountOfTokens(
            msg.value,
            address(this).balance - msg.value,
            tokenReserve
        );
        require(tokensBought >= _minTokens, "insufficient output amount");
        ERC20(tokenAddress).transfer(msg.sender, tokensBought);
    }

    /**
     * @dev Swaps Token for ETH
     */
    function tokenToEth(uint _minEth, uint _tokensSold) public payable {
        uint tokenReserve = getReserve();
        uint ethBought = getAmountOfTokens(
            _tokensSold,
            tokenReserve,
            address(this).balance
        );
        require(ethBought >= _minEth, "insufficient output amount");
        ERC20(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );
        (bool sent, ) = payable(msg.sender).call{value: ethBought}("");
        require(sent, "Failed to send ETH");
    }
}
