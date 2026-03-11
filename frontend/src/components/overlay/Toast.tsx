"use client";

import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      gutter={0}
      containerStyle={{
        bottom: 99,
        left: "50%",
        right: "auto",
        transform: "translateX(-50%)",
        width: "min(100vw, 375px)",
      }}
      toastOptions={{
        duration: 2000,
        style: {
          width: "calc(100% - 32px)",
          maxWidth: "343px",
          margin: "0 auto",
          borderRadius: "12px",
          background: "rgba(53, 54, 68, 0.9)",
          color: "#FFFFFF",
          padding: "12px 16px",
          boxShadow: "0 8px 24px rgba(17, 17, 17, 0.18)",
          fontSize: "14px",
          lineHeight: "18px",
          fontWeight: 400,
          letterSpacing: "-0.2px",
          textAlign: "center",
          pointerEvents: "none",
        },
      }}
    />
  );
}
