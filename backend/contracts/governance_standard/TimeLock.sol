// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../../node_modules/@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    /**
     * @dev Initalize TimelockController with params
     * @param _minDelay - How long you have to wait before executing proposal
     * @param _proposers - List of addresses that can propose
     * @param _executors - List of address that can execute proposals when passes
     */
    constructor(
        uint256 _minDelay,
        address[] memory _proposers,
        address[] memory _executors,
        address _admin
    ) TimelockController(_minDelay, _proposers, _executors, _admin) {}
}
