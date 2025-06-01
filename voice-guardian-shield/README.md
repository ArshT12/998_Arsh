# Voice Guardian Shield

> A real-time voice authentication system that detects deepfake audio during phone calls using AI-powered analysis.

## Overview

Voice Guardian Shield is a mobile application that monitors phone calls in real-time to detect potential deepfake or AI-generated voices. The app runs in the background during calls and uses advanced machine learning models to analyze voice patterns and alert users to potential voice spoofing attempts.

### Key Features
- Real-time deepfake voice detection during phone calls
- Background monitoring with minimal battery impact
- AI-powered analysis using Hugging Face models
- Cross-platform support (iOS/Android)
- Intuitive user interface with instant alerts

## Prerequisites

### Required Tools
- **Node.js (16+)** and **npm (8+)** - For JavaScript development
- **Xcode (13+)** - For iOS development
- **CocoaPods (1.11+)** - For iOS dependency management
- **Android Studio** - For Android development (optional)

### Environment Setup

1. **Install Node.js and npm**
   ```bash
   # Download and install from nodejs.org
   node -v  # Verify installation
   npm -v   # Verify npm installation
   ```

2. **Install Xcode (for iOS development)**
   ```bash
   # Install Xcode command line tools
   xcode-select --install
   ```
   - Download Xcode from the Mac App Store
   - Open Xcode and accept license agreements

3. **Install CocoaPods**
   ```bash
   sudo gem install cocoapods
   pod --version  # Verify installation
   ```

## Testing Instructions for Evaluation

**For Professor/Evaluator - Quick Testing Guide:**

### Option 1: Web Testing (Recommended for Quick Evaluation)
```bash
# 1. Clone and setup
git clone https://github.com/ArshT12/998_Arsh.git
cd 998_Arsh

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
- Open `http://localhost:5173` in your browser
- Navigate through the app interface
- Test UI components and basic functionality

### Option 2: iOS Testing (Full Functionality)
**Prerequisites:** macOS with Xcode installed

```bash
# 1. Clone and setup
git clone https://github.com/ArshT12/voice-guardian-shield.git
cd voice-guardian-shield

# 2. Install dependencies
npm install

# 3. Build the application
npm run build

# 4. Sync to iOS
npx cap sync ios

# 5. Open in Xcode
npx cap open ios
```
- In Xcode: Select a simulator or connected device
- Click the "Play" button to build and run
- **Note:** Real call monitoring requires a physical iOS device

### Testing the Core Features
1. **Interface Navigation**: Test all screens and user interactions
2. **Settings Configuration**: Access app settings and permissions
3. **Call Monitoring**: 
   - Web version: Interface demonstration only
   - iOS device: Actual call monitoring functionality
4. **Background Service**: Verify the app can run in background (iOS device only)

## Development Setup (For Full Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArshT12/voice-guardian-shield.git
   cd voice-guardian-shield
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the web application**
   ```bash
   npm run build
   ```

4. **Setup iOS development environment**
   ```bash
   # Sync web code to iOS
   npx cap sync ios
   
   # Open in Xcode
   npx cap open ios
   ```

5. **Run the application**
   - For web development: `npm run dev`
   - For iOS: Build and run through Xcode
   - For Android: Build and run through Android Studio

##  Development Workflow

### Web Development

**Start development server:**
```bash
npm run dev
```
Access the app at `http://localhost:5173`

**Build for production:**
```bash
npm run build
```

### Mobile Development

After making changes to the web code:

1. **Build the web app**
   ```bash
   npm run build
   ```

2. **Sync changes to native projects**
   ```bash
   npx cap sync              # All platforms
   npx cap sync ios          # iOS only
   npx cap sync android      # Android only
   ```

3. **Open native IDEs**
   ```bash
   npx cap open ios          # Open Xcode
   npx cap open android      # Open Android Studio
   ```

## 📁 Project Structure

```
voice-guardian-shield/
├── src/                           # Source code
│   ├── components/                # React components
│   ├── services/                  # Core services
│   │   ├── deepfakeApi.ts         # Deepfake detection API
│   │   ├── callMonitorService.ts  # Call monitoring
│   │   └── backgroundService.ts   # Background processing
│   ├── pages/                     # App pages
│   ├── utils/                     # Utility functions
│   └── App.tsx                    # Main app component
├── public/                        # Static assets
├── ios/                           # iOS platform code
├── android/                       # Android platform code
├── capacitor.config.ts            # Capacitor configuration
└── package.json                   # Project dependencies
```

## 🔧 Core Services

### Deepfake Detection API (`src/services/deepfakeApi.ts`)
Handles communication with the Hugging Face AI model for voice analysis and deepfake detection.

### Call Monitor Service (`src/services/callMonitorService.ts`)
Manages phone call detection, audio stream capture, and real-time monitoring during calls.

### Background Service (`src/services/backgroundService.ts`)
Enables the app to run in the background and continue monitoring calls even when the app is not in the foreground.

## 🔍 Testing & Evaluation

### For Evaluators: Quick Testing Options

**Option 1: Web Interface Testing (5 minutes)**
- Fastest way to evaluate the user interface and basic functionality
- Run `npm run dev` and test at `http://localhost:5173`
- No iOS setup required

**Option 2: Full iOS Testing (15-20 minutes)**  
- Complete functionality testing including call monitoring
- Requires macOS with Xcode
- Follow the iOS testing steps above for full feature demonstration

## ⚠️ Troubleshooting

### iOS Build Issues

**Signing Issues:**
1. In Xcode, select the App project
2. Navigate to Signing & Capabilities
3. Check "Automatically manage signing"
4. Select your personal team

**Dependency Version Conflicts:**
- Ensure all Capacitor packages have compatible versions
- iOS platform requires Capacitor 7.0.0+ for background-runner plugin

**Pod Installation Failures:**
```bash
# Update CocoaPods
sudo gem install cocoapods

# Clean cache
pod cache clean --all

# Reset pods (if needed)
cd ios/App
rm -rf Pods Podfile.lock
pod install
```

**Permission Issues:**
- Ensure proper microphone permissions in `Info.plist`
- Request runtime permissions for phone and microphone access

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions:
call me 
Arsh Tandon 
0492911641
aat925@uowmail.edu.au
