import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  texts: string[];
  delay?: number;
  pauseDuration?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  texts, 
  delay = 50, // Delay between each character
  pauseDuration = 2000 // Duration to pause between words (2 seconds)
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentTextIndex];

    if (isDeleting) {
      if (displayText === '') {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        return;
      }

      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
      }, delay / 2);

      return () => clearTimeout(timeout);
    }

    if (currentIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
        setCurrentIndex(0);
      }, pauseDuration);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, texts, currentTextIndex, isDeleting, displayText, pauseDuration]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};