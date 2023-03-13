import React, { useState, useEffect } from "react";
import api from "./api";

function ImageGenerator() {
  const [inputText, setInputText] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [countingDown, setCountingDown] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // Check if there's a saved expiration time in localStorage
    const savedExpirationTime = localStorage.getItem("expirationTime");
    if (savedExpirationTime) {
      const expirationTime = parseInt(savedExpirationTime);
      const timeLeft = Math.max(0, expirationTime - Date.now());
      if (timeLeft > 0) {
        // If the saved expiration time has not yet passed, start the countdown
        setTimeLeft(timeLeft / 1000);
        setCountingDown(true);
        setDisabled(true);
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(timer);
          setCountingDown(false);
          setDisabled(false);
          localStorage.removeItem("expirationTime");
        }, timeLeft * 1000);
      } else {
        // If the saved expiration time has passed, clear the saved value
        localStorage.removeItem("expirationTime");
      }
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setDisabled(true);
    setCountingDown(true);
    setTimeLeft(60);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      setCountingDown(false);
      setDisabled(false);
      localStorage.removeItem("expirationTime");
    }, 60000);

    fetch(
      "https://api-inference.huggingface.co/models/prompthero/openjourney-v2",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${api}`,
        },
        body: JSON.stringify({ inputs: inputText }),
      }
    )
      .then((res) => res.blob())
      .then((blob) => {
        setImageURL(window.URL.createObjectURL(blob));
      });

    // Save the expiration time to localStorage
    const expirationTime = Date.now() + 60000;
    localStorage.setItem("expirationTime", expirationTime.toString());
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = imageURL;
    downloadLink.download = "generated-image.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <label
          htmlFor="input-text"
          style={{
            marginRight: "10px",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Enter Text:
        </label>
        <input
          type="text"
          id="input-text"
          value={inputText}
          onChange={handleInputChange}
          style={{
            marginRight: "10px",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#3F51B5",
            color: "#FFFFFF",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          }}
          disabled={disabled} // Disable the button if `disabled` is true
        >
          Generate Image
        </button>
        </form>
      {countingDown && (
            <div
              style={{
                marginBottom: "20px",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              {timeLeft > 0
                ? `Generating image in ${timeLeft} seconds...`
                : "Generating image..."}
            </div>
          )}
    
    {imageURL && (
            <div
            style={{
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
              borderRadius: "5px",
              overflow: "hidden",
            }}
            >
              <img
                src={imageURL}
                alt="Generated Image"
                style={{ width: "500px", height: "500px", objectFit: "cover" }}
                
              />
               
        
    
    
               <button onClick={handleDownload}>Download Image</button>
            </div>
          )}
          
        </div>
        
        );
        
      }

        
    export default ImageGenerator;
         
  

           
