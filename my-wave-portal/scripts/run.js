const deployContract = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  // Deploys the contract with a balance of 0.01 Eth taken from the 'deployer's' account
  const waveContract = await waveContractFactory.deploy({ value: hre.ethers.utils.parseEther("0.01") });
  await waveContract.deployed();
  console.log("Contract address:", waveContract.address);
  return waveContract;
};

const sendWave = async (contract, waveMessage, waver) => {
  let waveTxn = await contract.connect(waver).wave(waveMessage);
  await waveTxn.wait();
};

const logContractBalance = async (contract) => {
  let contractBalance = await hre.ethers.provider.getBalance(contract.address);
  console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));
};

const logAllWaves = async (contract) => {
  let allWaves = await contract.getAllWaves();
  console.log("All Waves -->", allWaves);
};

const logTotalWaveCount = async (contract) => {
  let waveCount = await contract.getTotalWaves();
  // console.log(waveCount.toString());
};

const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContract = await deployContract();
  await logTotalWaveCount(waveContract);
  await logContractBalance(waveContract);
  let waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait();
  await logTotalWaveCount(waveContract);
  await sendWave(waveContract, "Another message!", randomPerson);
  await logContractBalance(waveContract);
  await sendWave(waveContract, "A third message!", randomPerson);
  await logTotalWaveCount(waveContract);
  await logContractBalance(waveContract);
  await logAllWaves(waveContract);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
