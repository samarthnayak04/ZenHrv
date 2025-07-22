# 🧘‍♂️ ZenHRV — AI-Powered Meditation Assistant

🚀 **About the Project**\
**ZenHRV** is an innovative MERN-based web application that transforms meditation by using webcam-based photoplethysmography (PPG) to monitor heart rate variability (HRV) in real-time. Powered by AI, it computes HRV metrics like RMSSD and SDNN to assess stress and calmness, delivering interactive visualizations and motivational voice feedback to enhance mindfulness and well-being—all within a seamless, collaborative interface.

---

## 🛠 Features

- **🎥 Webcam-Based HRV Monitoring**\
  Captures facial PPG signals using OpenCV for non-invasive, real-time analysis.
- **📊 HRV Metrics Analysis**\
  Computes RMSSD and SDNN to evaluate stress and physiological stability.
- **🤖 AI-Powered Stress Detection**\
  Utilizes a pre-trained Random Forest model to identify stress states during meditation.
- **🎶 Immersive Meditation Experience**\
  Plays soothing background music to guide breathing and focus.
- **📈 Interactive Visualizations**\
  Displays RMSSD and SDNN trends with stress markers via Chart.js.
- **🔉 Voice Feedback**\
  Delivers spoken session summaries for an engaging, hands-free experience.

---

## ⚙️ Tech Stack

| **Component** | **Technologies**                                                   |
| ------------- | ------------------------------------------------------------------ |
| **Frontend**  | React.js, Vite, Bootstrap, Chart.js, React Router                  |
| **Backend**   | Node.js, Express.js, OpenCV, SciPy, NumPy, Pandas, Joblib, pyttsx3 |
| **Database**  | MongoDB                                                            |
| **AI Model**  | Random Forest (via Joblib)                                         |

---

## 📂 Folder Structure

```plaintext
ZenHRV/
├── backend/                   # Backend API (Node.js, Express)
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── scripts/               # HRV analysis and signal processing
│   ├── .env                   # Environment variables
│   ├── server.js              # Main backend server
├── frontend/                  # Frontend application (React, Vite)
│   ├── public/                # Static assets (e.g., session-graph-example.png)
│   ├── src/                   # React source code
│   │   ├── components/        # Reusable UI components
│   │   |    ├── pages/        # Page components (e.g., meditation session)
│   │   |    ├── styles/       # CSS and styling
│   │   |── App.js             # Main React app
│   ├── index.html             # Entry point
│   ├── package.json           # Node.js dependencies
│   ├── vite.config.js         # Vite configuration
├── .gitignore                 # Ignored files
├── README.md                  # Project documentation
```

## 🔧 Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/samarthnayak04/ZenHRV.git
   cd ZenHRV
   ```

2. **Set Up the Backend**

   ```bash
   cd backend
   # Install dependencies
   npm install
   # Run the backend server
   npx nodemon server.js
   ```

3. **Set Up the Frontend**

   ```bash
   cd ../frontend
   # Install dependencies
   npm install
   # Run the application
   npm run dev
   ```

4. **Set Up MongoDB**

   - Ensure MongoDB is installed and running locally or use a cloud service like MongoDB Atlas.
   - Configure the MongoDB connection string in `backend/.env` (e.g., `MONGODB_URI=mongodb://localhost:27017/zenhrv`).

5. **Access the Application**

   - Frontend: Open `http://localhost:5173` in your browser.
   - Backend API: Runs on `http://localhost:5000` by default.

---

## 🖥️ Usage

1. **Start a Meditation Session**

   - Launch the app and grant webcam access.
   - Begin your session with guided background music.
   - **ZenHRV** processes PPG signals to compute HRV metrics in real-time.

2. **View Results**

   - Post-session, explore interactive charts showing RMSSD and SDNN trends with stress markers.
   - Listen to optional voice feedback summarizing your calmness level.

---

## 🎯 Future Roadmap

- **Real-Time Feedback**: Implement WebSockets for live stress alerts.
- **User Profiles**: Add authentication and session history storage in MongoDB.
- **Personalized Guidance**: Suggest meditation techniques based on HRV patterns.
- **Mobile Support**: Enhance responsiveness and add Progressive Web App (PWA) capabilities.
- **Wearable Integration**: Support devices like Polar H10 for HRV data.

---

## 🤝 Contribution

1. Fork the project.
2. Create a feature branch (`git checkout -b feature/your-feature-name`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a Pull Request with a clear description.

---

## 📜 License

This project is licensed under the MIT License.

---
