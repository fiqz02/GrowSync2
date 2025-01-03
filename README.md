# Smart Irrigation System - GrowSync

## Overview
GrowSync is an advanced smart irrigation system designed to optimize water usage while ensuring the health of plants. The system integrates IoT-enabled monitoring and control mechanisms, Firebase for data storage, and a mobile app built with React Native for seamless user interaction.

---

## Features

### 1. **User Authentication**
   - Secure login and registration using Firebase Authentication.
   - Role-based access control for users and administrators.

### 2. **Irrigation Control**
   - Adjust water valve angles and set irrigation timers.
   - Monitor the irrigation process with real-time countdowns.
   - Firebase-based remote control for servo motors.

### 3. **Monitoring Dashboard**
   - Real-time monitoring of:
     - Temperature (°C)
     - Humidity (%)
     - pH Levels
     - Water Level (%)
   - Status indication with color codes (normal, near normal, far from normal).

### 4. **Data Visualization**
   - Interactive graphs to analyze trends for temperature and humidity.
   - Real-time data fetched from Firebase, displayed with average, highest, and lowest readings.

### 5. **User Profile Management**
   - Upload, update, and delete profile photos.
   - View user-specific details such as email.
   - Logout functionality.

### 6. **Alert Notifications**
   - Receive real-time push notifications for critical events, such as:
     - Extreme sensor readings (e.g., temperature, humidity, pH levels).
     - Completion of irrigation cycles.
   - Notifications are powered by Firebase Cloud Messaging (FCM).

---

## Technology Stack

### Frontend
- **React Native Expo**: For building cross-platform mobile applications.
- **React Navigation**: Provides navigation for multi-tab and nested screens.
- **Firebase SDK**: Authentication and Realtime Database integration.

### Backend
- **Firebase Realtime Database**: Stores sensor data and system logs.
- **Firebase Authentication**: Secures user access with role-based permissions.

### Hardware Integration
- **ESP32**: Connects sensors and actuators to Firebase.
- **Servo Motor**: Controls the angle of the irrigation valve.

---

## Project Structure

### Key Components

1. **Authentication**
   - Handles user login, registration, and password reset.
   - Includes email validation and error handling.

2. **Irrigation Control**
   - Interface to manage valve angle and timer settings.
   - Tracks real-time progress and updates via Firebase.

3. **Dashboard**
   - Displays sensor readings with visual indicators and progress bars.
   - Highlights sensor statuses for immediate attention.

4. **Graphs**
   - Provides a graphical view of temperature and humidity trends.
   - Includes dropdown-based parameter selection for analysis.

5. **Profile Settings**
   - Allows photo management and user sign-out.

---

## Firebase Integration
- **Authentication**: Manages user sign-in/sign-up.
- **Database**:
  - `servoControl`: Stores servo motor angle and timer data.
  - `irrigationSystemLogs`: Logs sensor data (temperature, humidity, etc.).
  - `users`: Contains user roles and email data.
- **Cloud Messaging**:
  - Sends real-time notifications to users.

---

## Screenshots

![WhatsApp Image 2025-01-03 at 11 46 19_9da5c566](https://github.com/user-attachments/assets/64e30aae-bc3a-433a-9180-800c64492509)
![WhatsApp Image 2025-01-03 at 11 46 19_4c62ca0c](https://github.com/user-attachments/assets/6c0bc7ea-3338-48b2-a551-7ee8f17289cd)
![WhatsApp Image 2025-01-03 at 11 46 19_f6606bec](https://github.com/user-attachments/assets/b485ed83-581b-41af-ab84-bb26822a8a3f)
![WhatsApp Image 2025-01-03 at 11 46 19_46400369](https://github.com/user-attachments/assets/4c73c205-c1b9-4bb0-af4a-e40cf2e2810c)
![WhatsApp Image 2025-01-03 at 11 46 20_737de412](https://github.com/user-attachments/assets/45d4bd21-75f7-417b-ba2c-9de69c441416)
![WhatsApp Image 2025-01-03 at 11 46 20_a1146276](https://github.com/user-attachments/assets/2a986e50-5ce0-48d0-ba49-3806f533b61c)
![WhatsApp Image 2025-01-03 at 11 46 20_c67393d4](https://github.com/user-attachments/assets/982b3448-95da-4d0f-8cce-85052a5d2000)
![WhatsApp Image 2025-01-03 at 11 46 21_d7f4d4af](https://github.com/user-attachments/assets/bc6cf1ef-9643-45a8-ae2f-71a8fe021547)
![WhatsApp Image 2025-01-03 at 11 46 21_194f72ad](https://github.com/user-attachments/assets/2a6eb820-e0ce-4765-859c-93e1127ae01e)
