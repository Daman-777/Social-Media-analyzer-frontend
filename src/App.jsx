import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});
useEffect(() => {
  localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);
useEffect(() => {
  if (darkMode) {
    document.body.classList.remove("light-bg");
    document.body.classList.add("dark-bg");
  } else {
    document.body.classList.remove("dark-bg");
    document.body.classList.add("light-bg");
  }
}, [darkMode]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await axios.post(
        "https://social-media-analyzer-gg0l.onrender.com/api/upload",
        formData
      );

      setResult(response.data);
    } catch (error) {
      alert("Error processing file");
    }

    setLoading(false);
  };
  const getScoreColor = (score) => {
  if (score >= 70) return "#2ecc71";   // green
  if (score >= 40) return "#f39c12";   // orange
  return "#e74c3c";                    // red
};

  return (
    <div className={`container ${darkMode ? "dark" : "light"}`}>

      <h1>Social Media Content Analyzer</h1>
<div className="theme-toggle">
  <div
    className={`toggle-switch ${darkMode ? "active" : ""}`}
    onClick={() => setDarkMode(!darkMode)}
  >
    <div className="switch-circle"></div>
  </div>
</div>


      <div className="upload-box">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      <button onClick={handleUpload}>Analyze</button>

      {loading && <p className="loading">Processing...</p>}

      {result && (
        <div className="result-box">
          <h2>Extracted Text</h2>
          <div className="text-preview">
  {result.extractedText}
</div>


          <h2>Analysis</h2>
          <p><strong>Word Count:</strong> {result.analysis.wordCount}</p>
          <p><strong>Hashtags:</strong> {result.analysis.hashtagCount}</p>
          <p><strong>Engagement Score:</strong> {result.analysis.engagementScore}/100</p>
          <div className="score-bar">
  <div
    className="score-fill"
    style={{
      width: `${result.analysis.engagementScore}%`,
      background: getScoreColor(result.analysis.engagementScore)
    }}
  ></div>
</div>


          <p><strong>Tone:</strong> {result.analysis.tone}</p>

          <h3>Suggestions</h3>
          <ul>
            {result.analysis.suggestions.map((s, index) => (
              <li key={index}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
