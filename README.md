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

---

## Screenshots
*(Add images showcasing the app's interface and functionalities)*

---

## Getting Started

### Prerequisites
- Node.js & npm
- Expo CLI
- Firebase account

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-url.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm start
   ```
4. Connect Firebase:
   - Configure `firebase.config.ts` with your Firebase project credentials.

---

## Contributing
Feel free to fork this project, make your changes, and submit a pull request. Ensure all features are tested before submitting.
