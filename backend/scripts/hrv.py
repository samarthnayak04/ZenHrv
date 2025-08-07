import numpy as np
import pandas as pd
from scipy.signal import butter, filtfilt, find_peaks, detrend
import joblib
import pyttsx3
import os
import sys
import json
import warnings

warnings.filterwarnings("ignore", category=UserWarning)

def apply_pos_algorithm(rgb_data):
    signal = np.array(rgb_data)
    signal = detrend(signal, axis=0)
    signal = signal / np.std(signal, axis=0)
    h = np.array([0, 1, -1])
    pos = np.dot(signal, h)
    return detrend(pos)

def preprocess(signal, fs=25):
    nyq = 0.5 * fs
    b, a = butter(5, [0.7 / nyq, 3.5 / nyq], btype='band')
    return filtfilt(b, a, (signal - np.mean(signal)) / np.std(signal))

def extract_hrv(signal, fs=25):
    peaks, _ = find_peaks(signal, distance=fs//2)
    if len(peaks) < 2:
        raise ValueError("Not enough peaks.")
    rr = np.diff(peaks) / fs
    return np.sqrt(np.mean(np.square(np.diff(rr)))) * 1000, np.std(rr) * 1000

def voice_feedback(pred):
    engine = pyttsx3.init()
    engine.setProperty('rate', 145)
    engine.setProperty('volume', 0.8)
    msg = "Great, keep up the calm breathing." if pred == 0 else "Noticing multiple thoughts. Inhale and exhale slowly."
    engine.say(msg)
    engine.runAndWait()

if __name__ == "__main__":
    try:
        input_json = sys.stdin.read()
        rgb_data = json.loads(input_json)

        ppg = apply_pos_algorithm(rgb_data)
        f_ppg = preprocess(ppg)
        rmssd, sdnn = extract_hrv(f_ppg)

        model = joblib.load(os.path.join(os.path.dirname(__file__), "NewrfWesad.pkl"))
        prediction = model.predict(pd.DataFrame({'RMSSD': [rmssd], 'SDNN': [sdnn]}))[0]
        voice_feedback(prediction)

        result = {
            "rmssdValues": [rmssd],
            "sdnnValues": [sdnn],
            "conditions": [int(prediction)]
        }
        print(json.dumps(result))
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)
