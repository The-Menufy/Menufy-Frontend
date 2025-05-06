import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const TestQR = () => {
  return (
    <div style={{
      backgroundColor: "#eee",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <QRCodeCanvas value="https://google.com" size={200} />
    </div>
  );
};

export default TestQR;
