# Voice Guardian Shield - Deepfake Audio Detection System

A machine learning system for detecting AI-generated voice content using XGBoost classification.

## Project Structure

```
├── Explanation_Files/          # Documentation and concept explanations
├── Extracted_Features/         # CSV files containing processed audio features  
├── Notebooks/                  # Python notebooks for ML pipeline
├── voice-guardian-shield/      # React Native mobile application
└── README.md                   # This file
```

## Repository Contents

### Explanation_Files
Markdown files explaining the theoretical concepts and methodologies used in deepfake detection.

### Extracted_Features  
CSV files containing audio features extracted from the training dataset including MFCCs, spectral features, and temporal characteristics.

### Notebooks
Python code for the complete machine learning pipeline:
- Feature extraction from audio files
- Training multiple ML models (Random Forest, SVM, XGBoost)
- Model comparison and evaluation
- Hyperparameter tuning for XGBoost

### voice-guardian-shield
Cross-platform mobile application for real-time deepfake detection. See the app's README for setup instructions.

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/ArshT12/998_Arsh.git
   ```

2. Explore ML development in `Notebooks/`

3. Run the mobile app from `voice-guardian-shield/`

## Model Performance

The XGBoost classifier achieves 98.93% accuracy on test data with robust performance across different audio qualities.

## Technologies

- **ML**: Python, Librosa, Scikit-learn, XGBoost
- **App**: React Native, TypeScript, Capacitor
- **API**: FastAPI, Hugging Face Spaces

## Contact

Arsh Tandon - [@ArshT12](https://github.com/ArshT12)
