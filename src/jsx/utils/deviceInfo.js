export const getDeviceInfo = () => {
  const storedDeviceId = localStorage.getItem("deviceId") || null;
  if (!storedDeviceId) {
    let deviceName;
    try {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform.split(" ")[0];
      const currentDate = new Date().toISOString().split("T")[0];

      // Detect browser
      let browser = "Unknown";
      if (userAgent.includes("Chrome")) {
        browser = userAgent.includes("Edg")
          ? "Edge"
          : userAgent.includes("OPR")
          ? "Opera"
          : userAgent.includes("Brave")
          ? "Brave"
          : "Chrome";
      } else if (userAgent.includes("Firefox")) {
        browser = "Firefox";
      } else if (userAgent.includes("Safari")) {
        browser = "Safari";
      }

      deviceName = `${platform}-${browser}-${currentDate}`;
    } catch (error) {
      const currentDate = new Date().toISOString().split("T")[0];
      deviceName = `Device-${Math.random()
        .toString(36)
        .substr(2, 9)}-${currentDate}`;
    }

    localStorage.setItem("deviceId", deviceName);
    return deviceName;
  } else {
    return storedDeviceId;
  }
};
