
import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, delay,onComplete, onTypingComplete }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTypingComplete, setIsTypingComplete] = useState(false); // Track completion
    useEffect(() => { 
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prevText => prevText + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, delay);
            return () => clearTimeout(timeout);
        }
        // else if (!isTypingComplete) {
        //     setIsTypingComplete(true); // Mark typing as complete
            
        //     if (onTypingComplete) {
        //         onTypingComplete(true); // Notify parent about completion
                
        //     }
            
        // }
        if (onTypingComplete) {
            onTypingComplete(true); // Notify parent about completion
            setIsTypingComplete(true);
            
        }
        else
        {
            setIsTypingComplete(false);
        }
    }, [currentIndex, delay, text, onComplete, isTypingComplete, onTypingComplete]);
   

    return <p style={{margin:0}}>{currentText}</p>;
};

export default Typewriter;