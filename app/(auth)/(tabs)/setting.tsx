import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert,} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../../../firebase.config";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons"; 
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null); // Allow null or string for state
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/authentication"); // Redirect to login page
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Please grant permission to access photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square cropping
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePhoto(result.assets[0].uri); // Correctly assign the URI from the assets array
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Please grant permission to use the camera."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1], // Square cropping
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePhoto(result.assets[0].uri); // Correctly assign the URI from the assets array
    }
  };

  const deletePhoto = () => {
    Alert.alert(
      "Delete Profile Photo",
      "Are you sure you want to delete your profile photo?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setProfilePhoto(null), // Reset to default image
        },
      ]
    );
  };

  return (
    <LinearGradient colors={["#87CEEB", "#4682B4"]} style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={
            profilePhoto
              ? { uri: profilePhoto }
              : require("../../../assets/images/avatar1.png") // Default image
          }
          style={styles.profileImage}
        />
        <Text style={styles.userEmail}>
          {auth.currentUser?.email || "User Email"}
        </Text>

        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={styles.photoButtonText}>Choose Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
          <Text style={styles.photoButtonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={deletePhoto}>
          <Text style={styles.deleteButtonText}>Delete Photo</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <MaterialIcons
          name="logout"
          size={24}
          color="#FFFFFF"
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  photoButton: {
    backgroundColor: "#4682B4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
  },
  photoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF4500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  logoutIcon: {
    marginRight: 10,
    color: "#B22222"
  },
  logoutText: {
    color: "#B22222",
    fontSize: 18,
    fontWeight: "bold",
  },
});
