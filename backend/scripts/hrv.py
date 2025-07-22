import cv2
import numpy as np
import pandas as pd
from scipy.signal import butter, filtfilt, find_peaks, detrend
import joblib
import pyttsx3
import os
import time
import warnings
import sys
import json

warnings.filterwarnings("ignore", category=UserWarning)

# --- Video Capture (ROI) ---
def capture_ppg_signal(duration, fps=30):
    roi = (150, 100, 490, 400)
    # cap = cv2.VideoCapture(0)
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        raise Exception("Webcam could not be accessed")

    frames = []
    total_frames = duration * fps
    frame_count = 0
    start_time = time.time()
    while frame_count < total_frames:
        ret, frame = cap.read()
        if not ret:
            break
        cropped_frame = frame[roi[1]:roi[3], roi[0]:roi[2]]
        frames.append(cropped_frame)
        cv2.rectangle(frame, (roi[0], roi[1]), (roi[2], roi[3]), (255, 0, 0), 2)
        cv2.imshow('PPG Signal Capture', frame)
        elapsed_time = time.time() - start_time
        remaining_time = duration - elapsed_time
        # print(f"Remaining time: {max(0, remaining_time):.1f} seconds", end='\r')
        frame_count += 1
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()
    return frames

# --- POS Algorithm ---
def apply_pos_algorithm(frames):
    signal_r, signal_g, signal_b = [], [], []
    for frame in frames:
        signal_r.append(np.mean(frame[:, :, 2]))
        signal_g.append(np.mean(frame[:, :, 1]))
        signal_b.append(np.mean(frame[:, :, 0]))
    raw_signal = np.array([signal_r, signal_g, signal_b]).T
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
    rr_intervals = np.diff(peaks) / fs
    heart_rate = 60 / rr_intervals
    hr_mean = np.mean(heart_rate)
    # print(f"Mean Heart Rate: {hr_mean:.2f} BPM")
    if len(peaks) < 2:
        raise ValueError("Not enough peaks detected to calculate HRV metrics.")
    ibi = rr_intervals
    rmssd = np.sqrt(np.mean(np.square(np.diff(ibi))))
    sdnn = np.std(ibi)
    return rmssd*1000, sdnn*1000

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(CURRENT_DIR, "NewrfWesad.pkl")
loaded_model = joblib.load(MODEL_PATH)

def play_voice_prompt_stress():
    engine = pyttsx3.init()
    engine.setProperty('rate', 145)
    engine.setProperty('volume', 0.8)
    engine.say("Noticing multiple thoughts.Inhale... and exhale slowly.")
    engine.runAndWait()

def play_voice_prompt_calm():
    engine = pyttsx3.init()
    engine.setProperty('rate', 145)
    engine.setProperty('volume', 0.8)
    engine.say("Great, keep up the calm breathing.")
    engine.runAndWait()


def provide_feedback(rmssd, sdnn):
    
    input_data = pd.DataFrame({'RMSSD': [rmssd], "SDNN": [sdnn]})
    prediction = loaded_model.predict(input_data)[0]
    if prediction == 1:
        # print(f"Stress detecte! RMSSD ({rmssd:.2f} ms).")
        play_voice_prompt_stress()
        return 1
    else:
        play_voice_prompt_calm()
        return 0

def monitor_meditation_session(total_duration):
    interval = 30  # Feedback interval in seconds
    intervals = total_duration // interval
    conditions, rmssd_values, sdnn_values = [], [], []
    for i in range(intervals):
        # print(f"\nStarting interval {i + 1} of {intervals}")
        frames = capture_ppg_signal(duration=interval)
        ppg_signal = apply_pos_algorithm(frames)
        f_ppg_signal = preprocess_signal(ppg_signal)
        rmssd, sdnn = calculate_hrv_metrics(f_ppg_signal)
        rmssd_values.append(rmssd)
        sdnn_values.append(sdnn)
        # print(f"Interval {i + 1}: RMSSD = {rmssd:.4f}, SDNN = {sdnn:.4f}")
        condition = provide_feedback(rmssd, sdnn)
        conditions.append(condition)
        time.sleep(1)
    # print("Meditation session complete. Thank you for participating!")
    return rmssd_values,sdnn_values,conditions
   
    

if __name__ == '__main__':
    try:
        duration_minutes = int(sys.argv[1])  # Receive duration from Node
        total_duration = duration_minutes * 60
        # print(f"Starting meditation session for {duration_minutes} minutes.")
        rmssd_values, sdnn_values, conditions = monitor_meditation_session(total_duration)
        result = {
            "rmssdValues": rmssd_values,
            "sdnnValues": sdnn_values,
            "conditions": conditions   # each 0 (calm) or 1 (stress)
        }
        print(json.dumps(result))  # Send JSON back to Node

        # print("SUCCESS")  # Used to notify Node.js
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)