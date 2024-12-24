import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Icon } from "react-native-paper";
import * as Progress from "react-native-progress";
import { database } from "../../../firebase.config";
import { ref, onValue } from "firebase/database";
import { LinearGradient } from "expo-linear-gradient";

// Define the structure of each sensor's data
type Sensor = {
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  normalRange?: string;
};

// Icon mapping for sensors
const SensorIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "Temperature":
      return <Icon source="thermometer" size={24} color="#FFFFFF" />;
    case "Humidity":
      return <Icon source="water-percent" size={24} color="#FFFFFF" />;
    case "pH Level":
      return <Icon source="flask" size={24} color="#FFFFFF" />;
    case "Water Level":
      return <Icon source="waves" size={24} color="#FFFFFF" />;
    default:
      return null;
  }
};

// Determine status color based on value ranges
const getStatusColor = (
  value: number,
  min: number,
  max: number,
  sensorName: string
) => {
  if (sensorName === "Temperature") {
    if (value >= 25 && value <= 35) {
      return "#32CD32"; // Green (Normal)
    } else if ((value >= 20 && value < 25) || (value > 35 && value <= 38)) {
      return "#FFC107"; // Yellow (Near Normal for Temperature)
    } else {
      return "#F44336"; // Red (Far from Normal)
    }
  } else if (sensorName === "pH Level") {
    if (value >= 5 && value <= 9) {
      return "#32CD32"; // Green (Normal)
    } else if ((value >= 4 && value < 5) || (value > 9 && value <= 10)) {
      return "#FFC107"; // Yellow (Near Normal for pH)
    } else {
      return "#F44336"; // Red (Far from Normal)
    }
  } else if (sensorName === "Humidity") {
    if (value >= 70 && value <= 90) {
      return "#32CD32"; // Green (Normal)
    } else if ((value >= 65 && value < 70) || (value > 90 && value <= 95)) {
      return "#FFC107"; // Yellow (Near Normal for Humidity)
    } else {
      return "#F44336"; // Red (Far from Normal)
    }
  } else if (sensorName === "Water Level") {
    if (value >= 51 && value <= 100) {
      return "#32CD32"; // Green (Normal)
    } else if (value >= 26 && value <= 50) {
      return "#FFC107"; // Yellow (Near Normal for Water Level)
    } else {
      return "#F44336"; // Red (Far from Normal)
    }
  }
};

const EnhancedMonitoringDashboard = () => {
  const [sensorsData, setSensorsData] = useState<Sensor[]>([]);
  const [lastFetched, setLastFetched] = useState<string>("");

  useEffect(() => {
    // Firebase listener
    const dataRef = ref(database, "irrigationSystemLogs");
    const listener = onValue(
      dataRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log("Fetched Data:", data); // Debugging fetched data
        if (data) {
          // Function to retrieve the latest value from a timestamped object
          const getLatestValueWithTimestamp = (sensorData: {
            [timestamp: string]: number;
          }) => {
            const timestamps = Object.keys(sensorData);
            const latestTimestamp = timestamps.sort().pop(); // Get latest timestamp
            return latestTimestamp
              ? {
                  value: sensorData[latestTimestamp],
                  timestamp: latestTimestamp,
                }
              : { value: 0, timestamp: "" };
          };

          // Mapping formatted sensor data
          const formattedData: Sensor[] = [
            {
              name: "Temperature",
              value: getLatestValueWithTimestamp(data.temperature).value,
              unit: "°C",
              min: 20,
              max: 40,
              normalRange: "25-35 °C",
            },
            {
              name: "Humidity",
              value: getLatestValueWithTimestamp(data.humidity).value,
              unit: "%",
              min: 50,
              max: 100,
              normalRange: "70-90 %",
            },
            {
              name: "pH Level",
              value: getLatestValueWithTimestamp(data.pH).value,
              unit: "pH",
              min: 0,
              max: 14,
              normalRange: "5.0-9.0 pH",
            },
            {
              name: "Water Level",
              value: getLatestValueWithTimestamp(data.waterLevelPercentage)
                .value,
              unit: "%",
              min: 0,
              max: 100,
            },
          ];

          setSensorsData(formattedData);
          setLastFetched(
            getLatestValueWithTimestamp(data.temperature).timestamp
          );
        }
      },
      (error) => {
        console.error("Error fetching data from Firebase:", error);
      }
    );

    return () => listener(); // Cleanup listener
  }, []);

  const getProgress = (value: number, min: number, max: number) => {
    return (value - min) / (max - min);
  };

  return (
    <LinearGradient colors={["#87CEEB", "#4682B4"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Monitoring Dashboard</Text>

        {sensorsData.length > 0 ? (
          <View style={styles.rowContainer}>
            {sensorsData.map((sensor, index) => {
              const statusColor = getStatusColor(
                sensor.value,
                sensor.min,
                sensor.max,
                sensor.name
              );

              return (
                <View key={index} style={styles.sensorCard}>
                  <View style={styles.iconLabelRow}>
                    <SensorIcon type={sensor.name} />
                    <Text style={styles.sensorLabel}>{sensor.name}</Text>
                  </View>
                  <Text style={styles.valueLabel}>
                    {sensor.value} {sensor.unit}
                  </Text>
                  <Progress.Bar
                    progress={getProgress(sensor.value, sensor.min, sensor.max)}
                    width={null}
                    height={10}
                    color={statusColor}
                    unfilledColor="rgba(255, 255, 255, 0.3)"
                    borderWidth={0}
                    borderRadius={5}
                    style={styles.progressBar}
                  />
                  {sensor.normalRange && (
                    <Text style={styles.normalRange}>
                      Optimum: {sensor.normalRange}
                    </Text>
                  )}
                </View>
              );
            })}
            <Text style={styles.fetchedText}>Fetched on: {lastFetched}</Text>
          </View>
        ) : (
          <Text style={styles.loadingText}>Loading data...</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 30,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textAlign: "center",
  },
  rowContainer: {
    flexDirection: "column",
  },
  sensorCard: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 15,
    marginBottom: 15,
    width: "100%",
    borderRadius: 15,
  },
  iconLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sensorLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  valueLabel: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginVertical: 5,
  },
  progressBar: {
    marginVertical: 8,
  },
  normalRange: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 3,
    color: "#FFFFFF",
  },
  loadingText: {
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 50,
  },
  fetchedText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 10,
    textAlign: "center",
  },
});

export default EnhancedMonitoringDashboard;
