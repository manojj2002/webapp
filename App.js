import React, { useState } from 'react';
import './App.css';
function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    // Send the image to the back-end for processing
    // Update processedImage state with the processed image
    if (!originalImage) {
      alert('Please upload an image first.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', originalImage);
      
      const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process image.');
      }

      const processedImageData = await response.blob();
      setProcessedImage(URL.createObjectURL(processedImageData));
    } catch (error) {
      console.error('Error processing image:', error);
      alert('An error occurred while processing the image.');
    }
  };

  return (
    <div>
      <nav>Navigation Bar</nav>
      <section>
        <form>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <button type="button" onClick={processImage}>Process Image</button>
        </form>
      </section>
      <section className="image-container">
        <div>
          <h2>Original Image</h2>
          <img src={originalImage} alt="Original" />
        </div>
        <div>
          <h2>Processed Image</h2>
          <img src={processedImage} alt="Processed" />
        </div>
      </section>
    </div>
  );
}

export default App;
