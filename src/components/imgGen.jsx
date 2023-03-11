import React, { useState } from "react";
import api from "./api";

function ImageGenerator() {
  const [inputText, setInputText] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [countingDown, setCountingDown] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setCountingDown(true);
    setTimeLeft(5); // Set the timer to 10 seconds

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

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
        clearInterval(timer);
        setCountingDown(false);
      });
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