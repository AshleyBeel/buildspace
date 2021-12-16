import React from "react";

const WaveList = ({ allWaves }) => {
  return allWaves.map((wave, index) => {
    return (
      <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
        <div>Address: {wave.address}</div>
        <div>Time: {wave.timestamp.toString()}</div>
        <div>Message: {wave.message}</div>
      </div>
    );
  });
};

export default WaveList;
