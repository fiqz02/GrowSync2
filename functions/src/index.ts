import { onValueCreated } from "firebase-functions/v2/database";
import * as admin from "firebase-admin";

admin.initializeApp({
  databaseURL: "https://growsync-e8713-default-rtdb.asia-southeast1.firebasedatabase.app",
});

// Define thresholds for all sensors
const SENSOR_THRESHOLDS = {
  temperature: { safe: [20, 30], warning: [10, 20, 30, 35], danger: [0, 10, 35, 40] },
  humidity: { safe: [50, 70], warning: [30, 50, 70, 90], danger: [0, 30, 90, 100] },
  pH: { safe: [6.5, 8.5], warning: [5.5, 6.5, 8.5, 9.5], danger: [0, 5.5, 9.5, 14] },
};

type SensorType = keyof typeof SENSOR_THRESHOLDS;

const checkThreshold = (type: SensorType, value: number): "safe" | "warning" | "danger" => {
  const thresholds = SENSOR_THRESHOLDS[type];
  if (value < thresholds.danger[1] || value > thresholds.danger[2]) return "danger";
  if (value < thresholds.warning[1] || value > thresholds.warning[2]) return "warning";
  return "safe";
};

export const monitorSensorData = onValueCreated(
  {
    region: "asia-southeast1",
    ref: "irrigationSystemLogs/{sensorType}/{timestamp}",
  },
  async (event) => {
    const sensorType = event.params?.sensorType as SensorType;
    const value = event.data?.val();

    if (!SENSOR_THRESHOLDS[sensorType] || typeof value !== "number") {
      console.error(`Invalid sensor data: ${sensorType}, ${value}`);
      return;
    }

    const status = checkThreshold(sensorType, value);
    if (status === "safe") return;

    const message = {
      topic: "sensor-alerts",
      notification: {
        title: `${status.toUpperCase()} Alert: ${sensorType}`,
        body: `The ${sensorType} value is ${value}, which is out of the safe range.`,
      },
      data: {
        sensorType,
        value: value.toString(),
        status,
        timestamp: new Date().toISOString(),
      },
    };

    try {
      await admin.messaging().send(message);
      console.log(`Notification sent for ${sensorType}:`, message.notification?.title);
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  }
);
