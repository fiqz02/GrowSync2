import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { database } from "../../../firebase.config";
import { ref, set, onValue } from "firebase/database";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EnhancedIrrigationControl = () => {
  const [selectedAngle, setSelectedAngle] = useState<number>(45);
  const [timer, setTimer] = useState<string>("10");
  const [countdown, setCountdown] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [servoState, setServoState] = useState<{
    angle: number;
    timer: number;
  }>({ angle: 0, timer: 0 });

  const formatCountdown = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prevCount) => Math.max(prevCount - 1000, 0));
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, countdown]);

  useEffect(() => {
    if (countdown === 0 && isActive) {
      Alert.alert("Watering Completed");

      // Reset Firebase values to ensure servo closes
      const servoRef = ref(database, "servoControl");
      set(servoRef, { angle: 0, timer: 0 })
        .then(() => {
          console.log("Servo reset to angle 0 after irrigation cycle.");
        })
        .catch((error) => {
          console.error("Error resetting servo after cycle completion:", error);
          Alert.alert("Error", "Failed to reset the servo after the cycle.");
        });

      setIsActive(false);
    }
  }, [countdown, isActive]);

  useEffect(() => {
    const servoRef = ref(database, "servoControl");
    const listener = onValue(
      servoRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setServoState(data);
        }
      },
      (error) => {
        console.error("Error fetching servo state:", error);
      }
    );

    return () => listener();
  }, []);

  const handleTimerChange = (value: string) => {
    if (!isNaN(Number(value)) && Number(value) >= 0) {
      setTimer(value);
    } else {
      alert("Invalid timer value. Only positive numbers are allowed.");
    }
  };

  const startIrrigation = () => {
    const timerInMilliseconds = parseInt(timer) * 60 * 1000;

    if (isNaN(timerInMilliseconds) || timerInMilliseconds <= 0) {
      Alert.alert(
        "Invalid Timer",
        "Please enter a valid timer value greater than 0."
      );
      return;
    }

    const servoRef = ref(database, "servoControl");
    set(servoRef, { angle: selectedAngle, timer: timerInMilliseconds })
      .then(() => {
        console.log(
          `Servo started at ${selectedAngle} degrees for ${timer} minutes`
        );
        setCountdown(timerInMilliseconds);
        setIsActive(true);
      })
      .catch((error) => {
        console.error("Error starting irrigation:", error);
        Alert.alert("Error", "Failed to start irrigation. Please try again.");
      });
  };

  const stopIrrigation = () => {
    const servoRef = ref(database, "servoControl");
    set(servoRef, { angle: 0, timer: 0 })
      .then(() => {
        console.log("Irrigation stopped immediately");
        setCountdown(0);
        setIsActive(false);
      })
      .catch((error) => {
        console.error("Error stopping irrigation:", error);
        Alert.alert("Error", "Failed to stop irrigation. Please try again.");
      });
  };

  const { minutes, seconds } = formatCountdown(countdown);

  return (
    <LinearGradient colors={["#87CEEB", "#4682B4"]} style={styles.container}>
      <Text style={styles.title}>Irrigation Control</Text>

      <View style={styles.countdownContainer}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>{minutes}</Text>
          <Text style={styles.timeLabel}>minutes</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>{seconds}</Text>
          <Text style={styles.timeLabel}>seconds</Text>
        </View>
      </View>

      <Text style={styles.remainingTime}>Remaining Time</Text>

      <Text style={styles.subtitle}>Set Water Valve Angle:</Text>
      <View style={styles.angleGrid}>
        {[45, 90, 135, 180].map((angle) => (
          <TouchableOpacity
            key={angle}
            style={[
              styles.angleButton,
              selectedAngle === angle ? styles.selectedAngleButton : null,
            ]}
            onPress={() => setSelectedAngle(angle)}
          >
            <Text
              style={[
                styles.angleButtonText,
                selectedAngle === angle ? styles.selectedAngleButtonText : null,
              ]}
            >
              {angle}°
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitle}>Set timer:</Text>
      <View style={styles.timerContainer}>
        {[
          { value: 10, label: "10 min" },
          { value: 20, label: "20 min" },
          { value: 30, label: "30 min" },
          { value: 60, label: "1 hour" },
          { value: 90, label: "1.5 hours" },
          { value: 120, label: "2 hours" },
        ].map(({ value, label }) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.timerButton,
              timer === value.toString() ? styles.selectedTimerButton : null,
            ]}
            onPress={() => setTimer(value.toString())}
          >
            <Text
              style={[
                styles.timerButtonText,
                timer === value.toString()
                  ? styles.selectedTimerButtonText
                  : null,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
        <TextInput
          style={styles.timerInput}
          keyboardType="numeric"
          value={timer}
          onChangeText={handleTimerChange}
          placeholder="Other"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.startButton]}
          onPress={startIrrigation}
          disabled={isActive}
        >
          <MaterialCommunityIcons name="play" size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.stopButton]}
          onPress={stopIrrigation}
          disabled={!isActive}
        >
          <MaterialCommunityIcons name="stop" size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 25,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  countdownContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  timeBlock: {
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 10,
    width: 100,
  },
  timeText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  timeLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 5,
  },
  separator: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  remainingTime: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 25,
    color: "#FFFFFF",
    marginBottom: 5,
    textAlign: "center",
  },
  angleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  angleButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 8,
    margin: 8,
    width: "40%",
    alignItems: "center",
  },
  selectedAngleButton: {
    backgroundColor: "#00008b",
  },
  angleButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  selectedAngleButtonText: {
    fontWeight: "bold",
  },
  timerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center", // Center align all items including TextInput
    width: "100%",
    gap: 5,
  },
  timerButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 8,
    width: "30%",
    height: "25%",
    alignItems: "center",
    marginVertical: 5,
  },
  selectedTimerButton: {
    backgroundColor: "#00008b",
  },
  timerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedTimerButtonText: {
    fontWeight: "bold",
  },
  timerInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 10,
    width: "30%",
    textAlign: "center",
    color: "#FFFFFF",
    marginVertical: 10,
    alignSelf: "center", // Ensures the input is centered within its parent container
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 8,
    width: "45%",
  },
  startButton: {
    backgroundColor: "#32CD32",
  },
  stopButton: {
    backgroundColor: "#B22222",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default EnhancedIrrigationControl;
