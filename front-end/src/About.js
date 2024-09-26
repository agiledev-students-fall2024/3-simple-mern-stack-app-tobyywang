import React, { useState, useEffect } from 'react';
import './About.css'

const About = () => {
  const [aboutData, setAboutData] = useState({ title: "", paragraphs: [], imageUrl: "" });

  useEffect(() => {
    fetch('HTTP://localhost:5002/about')
      .then((response) => response.json())
      .then((data) => setAboutData(data))
      .catch((error) => console.error('Error fetching the about data:', error));
  }, []);

  return (
    <div className="about-container">
      <h1>{aboutData.title}</h1>
      <div className="paragraphs-container">
        {aboutData.paragraphs.map((paragraph, index) => (
          <p key={index} className="about-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
      <img src={aboutData.imageUrl} className="about-image" />
    </div>
  );
};

export default About;