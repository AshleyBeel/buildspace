// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    // Map to keep track of the number of times each individual has waved using the contract.
    mapping(address => uint256) individualWaveCount;
    // Map to keep track of all of the last time each address last waved
    mapping(address => uint256) public lastWavedAt;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("Contract under construction");
        // generate partially random seed to use to decide a winner
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        // Ensures user last waved a minimum of 15 minutes ago
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        // Update current timestamp for user
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log(
            "%s waved with the following message %s",
            msg.sender,
            _message
        );

        // Keeps track of the number of times each address has waved
        address sender = msg.sender;
        individualWaveCount[sender] += 1;
        console.log(
            "Sender %s has waved %d times",
            msg.sender,
            individualWaveCount[msg.sender]
        );
        // pushes each new wave to our waves array
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // Generate a new seed for the next user that sends a wave
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        // Decides if the 'waver' is a winner based on a 50% chance
        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more than the wave contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from the contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    // Returns an array of our 'waves' structs.
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    // Returns the total number of waves
    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves", totalWaves);
        return totalWaves;
    }
}
