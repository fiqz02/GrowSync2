import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase.config";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;

const GraphWithDropdown = () => {
  const [selectedParameter, setSelectedParameter] = useState("temperature"); // 'temperature' or 'humidity'
  const [graphData, setGraphData] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState({
    highest: 0,
    lowest: 0,
    average: 0,
    date: "",
  });
  const [open, setOpen] = useState(false); // Dropdown open state
  const [items, setItems] = useState([
    { label: "Temperature", value: "temperature" },
    { label: "Humidity", value: "humidity" },
  ]);

  useEffect(() => {
    const dataRef = ref(database, `irrigationSystemLogs/${selectedParameter}`);

    const listener = onValue(
      dataRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD" format
          const entries = Object.entries(data).filter(
            ([key]) => key.split("_")[0] === today // Filter entries for today's date
          );

          if (entries.length > 0) {
            const values = entries.map(([_, value]) => value as number);
            const averages: number[] = [];
            const timeLabels: string[] = [];

            for (let i = 0; i < entries.length; i += 5) {
              const chunk = entries.slice(i, i + 5);
              const average =
                chunk.reduce((sum, [_, value]) => sum + (value as number), 0) /
                chunk.length;

              averages.push(average);

              const lastTimestamp = chunk[chunk.length - 1][0];
              timeLabels.push(lastTimestamp.split("_")[1]); // Extract time from the timestamp
            }

            const highest = Math.max(...values);
            const lowest = Math.min(...values);
            const average =
              values.reduce((sum, val) => sum + val, 0) / values.length;

            // Update the graph data with today's filtered data
            setGraphData(averages);
            setTimestamps(timeLabels);
            setAnalysis({
              highest,
              lowest,
              average: parseFloat(average.toFixed(2)),
              date: today,
            });
          } else {
            // No data for today, clear the graph
            console.log(`No data for today's date: ${today}`);
            setGraphData([]);
            setTimestamps([]);
            setAnalysis({ highest: 0, lowest: 0, average: 0, date: today });
          }
        }
      },
      (error) => {
        console.error(`Error fetching ${selectedParameter} data:`, error);
      }
    );

    return () => listener();
  }, [selectedParameter]);

  return (
    <LinearGradient colors={["#87CEEB", "#4682B4"]} style={styles.container}>
      <Text style={styles.title}>Data Visualisation</Text>

      {/* Dropdown Menu */}
      <DropDownPicker
        open={open}
        value={selectedParameter}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedParameter}
        setItems={setItems}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        textStyle={styles.dropdownText}
        placeholder="Select Parameter"
        dropDownContainerStyle={styles.dropdownContainerStyle}
      />

      <Text style={styles.graphTitle}>
        {selectedParameter === "temperature"
          ? "Temperature vs Time"
          : "Humidity vs Time"}
      </Text>

      {graphData.length > 0 ? (
        <LineChart
          data={{
            labels: timestamps.map(() => ""), // Replace labels with empty strings
            datasets: [
              {
                data: graphData,
              },
            ],
          }}
          width={screenWidth - 40}
          height={300}
          yAxisLabel="" // No label for y-axis
          yAxisSuffix="" // No suffix for y-axis
          chartConfig={{
            backgroundColor: "#1E2923",
            backgroundGradientFrom: "#87CEEB",
            backgroundGradientTo: "#4682B4",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.loadingText}>Loading data...</Text>
      )}

      {/* Analysis Section */}
      <View style={styles.analysisContainer}>
        <Text style={styles.analysisTitle}>
          {selectedParameter === "temperature" ? "Temperature" : "Humidity"}{" "}
          Data
        </Text>
        <View style={styles.rowContainer}>
          <Text style={styles.analysisLabel}>Highest : </Text>
          <TextInput
            style={styles.textBox}
            editable={false}
            value={`${analysis.highest}`}
          />
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.analysisLabel}>Lowest : </Text>
          <TextInput
            style={styles.textBox}
            editable={false}
            value={`${analysis.lowest}`}
          />
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.analysisLabel}>Average : </Text>
          <TextInput
            style={styles.textBox}
            editable={false}
            value={`${analysis.average}`}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 25,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textAlign: "center",
  },
  graphTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#00000",
    marginBottom: 5,
    textAlign: "center",
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
  },
  dropdownText: {
    color: "#000000",
    fontSize: 20,
  },
  dropdownContainerStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 50,
  },
  analysisContainer: {
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    padding: 15,
    width: 300,
    alignSelf: "center",
  },
  analysisTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#00000",
    marginBottom: 10,
    textAlign: "center",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  analysisLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 10,
  },
  textBox: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    color: "#000",
    width: 100,
    textAlign: "center",
  },
});

export default GraphWithDropdown;
