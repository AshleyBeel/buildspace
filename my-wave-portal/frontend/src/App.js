import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";
import WaveList from "./components/WaveList";
import SendWave from "./components/SendWave";

const App = () => {
  /*
   * Just a state variable we use to store our user's public wallet.
   */
  const [allWaves, setAllWaves] = useState([]);
  const [waveMessage, setWaveMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState("");
  const contractAddress = "0xBf06D33d31eB7861d7Ebb0a5d281adEb86689Cb9";
  const contractABI = abi.abi;
  // let wavePortalContract;

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const contract = getContract();
        const waves = await contract.getAllWaves();
        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });

        setAllWaves(wavesCleaned);
        console.log(allWaves);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        await getTotalWaves();
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        await getAllWaves();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        await getTotalWaves();
        console.log("Retrieved total wave count...", totalWaves.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */
        const wavePortalContract = getContract();
        const waveTxn = await wavePortalContract.wave(waveMessage, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        await getTotalWaves();
        console.log("Retrieved total wave count...", totalWaves.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getContract = () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    return wavePortalContract;
  };

  const getTotalWaves = async () => {
    const wavePortalContract = getContract();
    setTotalWaves(await wavePortalContract.getTotalWaves());
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>
        <div className="bio">
          I am Ashley and I work as a full-stack developer on a range of different projects. I'm currently learning the
          basics of Web3.
        </div>
        <div className="bio">Connect your Ethereum wallet and wave at me!</div>
        {totalWaves > 0 && <div className="bio">Total waves: {totalWaves.toString()}</div>}

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {currentAccount && <SendWave setWaveMessage={setWaveMessage} wave={wave} />}
        {/* {currentAccount && (
          <div className="dataContainer waveBox">
            <h3 className="waveHeader">Send me a wave 👋</h3>
            <input
              type="text"
              placeholder="Add a message with your wave?"
              onChange={(e) => setWaveMessage(e.target.value)}
            />
            <button className="waveButton" onClick={wave}>
              Wave at Me
            </button>
          </div>
        )} */}
        {/* <SendWave setWaveMessage={setWaveMessage} wave={wave} /> */}
        <WaveList allWaves={allWaves} />
      </div>
    </div>
  );
};

export default App;
