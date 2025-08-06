# Updated hrv.py for frontend RGB input instead of webcam
import numpy as np
import pandas as pd
from scipy.signal import butter, filtfilt, find_peaks, detrend
import joblib
import pyttsx3
import os
import warnings
import sys
import json

warnings.filterwarnings("ignore", category=UserWarning)

# --- POS Algorithm ---
def apply_pos_algorithm(rgb_array):
    raw_signal = np.array(rgb_array)
    detrended_signal = detrend(raw_signal, axis=0)
    normalized_signal = detrended_signal / np.std(detrended_signal, axis=0)
    h = np.array([0, 1, -1])
    pos_signal = np.dot(normalized_signal, h)
    pos_signal = detrend(pos_signal)
    return pos_signal

# --- Signal Pre-processing ---
def preprocess_signal(ppg_signal, lowcut=0.7, highcut=3.5, fs=30, order=5):
    ppg_signal = (ppg_signal - np.mean(ppg_signal)) / np.std(ppg_signal)
    nyquist = 0.5 * fs
    low = lowcut / nyquist
    high = highcut / nyquist
    b, a = butter(order, [low, high], btype='band')
    filtered_signal = filtfilt(b, a, ppg_signal)
    return filtered_signal

# --- HRV Metrics ---
def calculate_hrv_metrics(ppg_signal, fs=30):
    peaks, _ = find_peaks(ppg_signal, distance=fs//2)
    if len(peaks) < 2:
        raise ValueError("Not enough peaks detected to calculate HRV metrics.")
    rr_intervals = np.diff(peaks) / fs
    rmssd = np.sqrt(np.mean(np.square(np.diff(rr_intervals))))
    sdnn = np.std(rr_intervals)
    return rmssd * 1000, sdnn * 1000

# --- Feedback ---
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(CURRENT_DIR, "NewrfWesad.pkl")
loaded_model = joblib.load(MODEL_PATH)

def play_voice_prompt_stress():
    engine = pyttsx3.init()
    engine.setProperty('rate', 145)
    engine.setProperty('volume', 0.8)
    engine.say("Noticing multiple thoughts. Inhale and exhale slowly.")
    engine.runAndWait()

def play_voice_prompt_calm():
    engine = pyttsx3.init()
    engine.setProperty('rate', 145)
    engine.setProperty('volume', 0.8)
    engine.say("Great, keep up the calm breathing.")
    engine.runAndWait()

def provide_feedback(rmssd, sdnn):
    input_data = pd.DataFrame({'RMSSD': [rmssd], 'SDNN': [sdnn]})
    prediction = loaded_model.predict(input_data)[0]
    if prediction == 1:
        play_voice_prompt_stress()
    else:
        play_voice_prompt_calm()
    return int(prediction)

# --- Main Entry ---
if __name__ == '__main__':
    try:
        input_text = sys.stdin.read()
        rgb_data = json.loads(input_text)  # Expecting [[r,g,b], [r,g,b], ...]

        ppg_signal = apply_pos_algorithm(rgb_data)
        f_ppg_signal = preprocess_signal(ppg_signal)
        rmssd, sdnn = calculate_hrv_metrics(f_ppg_signal)
        condition = provide_feedback(rmssd, sdnn)

        result = {
            "rmssdValues": [rmssd],
            "sdnnValues": [sdnn],
            "conditions": [condition]
        }
        print(json.dumps(result))
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)
