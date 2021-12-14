// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    mapping(address => uint) individualWaveCount;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart contract");
    }

    function wave() public {
        address sender = msg.sender;
        totalWaves += 1;
        individualWaveCount[sender] += 1;
        console.log("%s has waved", msg.sender);
        console.log("Sender %s has waved %d times", msg.sender, individualWaveCount[msg.sender]);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves", totalWaves);
        return totalWaves;
    }
}

// Rank wavers based on individual wave counts
// Display total number of waves