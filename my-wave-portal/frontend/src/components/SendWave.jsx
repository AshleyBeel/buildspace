import React from "react";

const SendWave = ({ setWaveMessage, wave }) => {
  return (
    <div className="dataContainer waveBox">
      <h3 className="waveHeader">Send me a wave 👋</h3>
      <input type="text" placeholder="Add a message with your wave?" onChange={(e) => setWaveMessage(e.target.value)} />
      <button className="waveButton" onClick={wave}>
        Wave at Me
      </button>
    </div>
  );
};

export default SendWave;
