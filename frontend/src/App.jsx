import { useState, useEffect} from 'react';
import './index.css';
import logo from './assets/logo.webp';



function App() {
  const [term, setTerm] = useState("");
  const [result, setResult] = useState(null);

  
  const handleSearch = async () => {
    if (!term) return;

    try {
      const res = await fetch(`http://localhost:3000/reference?term=${encodeURIComponent(term.toLowerCase())}`);
      const data = await res.json();
      setResult(data);

    } catch (err) {
      setResult({ error: true, description: "Something went wrong." });
    }
  };

  // chrome.runtime.onMessage.addListener((message) => {
  //   if (message.target === "popup" && message.quote) {
  //     var quote = message.quote;
  //     console.log(quote)
      

  //   }
  // });

  useEffect(() => {
    chrome.storage.sync.get(['quote'], function(result){
      if(result.quote){
        var str = result.quote.trim().toLowerCase()
        str = removePunctuation(str)
        setTerm(str)
      }
    })
  }, []); 
  function removePunctuation(text) {
    return text.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
  }
  useEffect(() => {
    if(term)
      handleSearch()
  }, [term]); 

  return (
    <div>
      <img src={logo} alt="Dramatic logo" className="brand-logo" />
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
