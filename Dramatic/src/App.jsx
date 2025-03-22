import { useEffect, useState } from 'react';
import logo from './assets/logo.webp';
import './index.css';



function App() {
  const [term, setTerm] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async (customTerm) => {
    const search = customTerm || term;
    if (!search) return;
  
    try {
      const res = await fetch(`http://localhost:3000/reference?term=${encodeURIComponent(search)}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: true, description: "Something went wrong." });
    }
  };  
  
  useEffect(() => {
    const handleMessage = (request, sender, sendResponse) => {
      if (request.target === "popup" && request.data) {
        const selectedText = request.data.trim().toLowerCase();
        setTerm(selectedText);
        handleSearch(selectedText); // auto-fetch explanation
      }
    };

    // Add the listener
    chrome.runtime.onMessage.addListener(handleMessage);

    // Clean up when component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <div>
      <img src={logo} alt="Dramatic Logo" className="brand-logo" />
      <p className="tagline">Hover. Decode. Dramatically.</p>

      <input
        type="text"
        value={term}
        placeholder="e.g. plus ultra"
        onChange={(e) => setTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Decode</button>

      {result && (
        <div className="result">
          {result.error ? (
            <p>{result.description}</p>
          ) : (
            <>
              <strong>{result.title}</strong>
              <p>{result.description}</p>
              {result.image && <img src={result.image} alt={result.title} />}
              <a href={result.link} target="_blank" rel="noreferrer">See more</a>
              <p style={{ fontSize: "10px", color: "#888" }}>
                Source: {result.source}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
