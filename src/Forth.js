import { useState, useEffect, useRef } from "react";

function Forth() {
  const [data, setData] = useState();
  const [name, setName] = useState("");
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setName(transcript);
      setRecognitionActive(false);
    };

    recognition.onerror = () => {
      setRecognitionActive(false);
    };

    recognition.onend = () => {
      setRecognitionActive(false);
    };

    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    if (data?.name) {
      setName(data.name);
    }
  }, [data]);

  async function fetchData() {
    let student = {
      name: "Prashant",
      age: 24,
      regno: "RA421"
    };
    const d = await fetch("http://localhost:8000/save/user", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(student)
    });
    let djson = await d.json();
    setData(djson.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const startSpeech = () => {
    if (!recognitionRef.current) return;
    setRecognitionActive(true);
    recognitionRef.current.start();
  };
  return (
    <div>
      {data ? (
        <>
          <div>
            <label htmlFor="nameInput">Name:</label>
            <input
              id="nameInput"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Speak or type your name"
              style={{ marginLeft: 8 }}
            />
            <button type="button" onClick={startSpeech} disabled={!speechSupported || recognitionActive} style={{ marginLeft: 8 }}>
              {recognitionActive ? "Listening..." : "Start Speech"}
            </button>
          </div>
          {!speechSupported && <p>Your browser does not support Speech Recognition.</p>}
          <h1>Name: {name}</h1>
          <h1>Regno: {data.regno}</h1>
          <h1>Age: {data.age}</h1>
        </>
      ) : (
        "No data found"
      )}
    </div>
  );
}

export default Forth;