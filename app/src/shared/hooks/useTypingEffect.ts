import { useState, useEffect, useRef } from 'react';

interface UseTypingEffectOptions {
  text: string;
  speed?: number; // milliseconds per character
  onComplete?: () => void;
}

export function useTypingEffect({ 
  text, 
  speed = 20, 
  onComplete 
}: UseTypingEffectOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset when text changes
    indexRef.current = 0;
    setDisplayedText('');
    setIsTyping(true);

    const typeNextCharacter = () => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
        timeoutRef.current = setTimeout(typeNextCharacter, speed);
      } else {
        setIsTyping(false);
        onComplete?.();
      }
    };

    timeoutRef.current = setTimeout(typeNextCharacter, speed);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, onComplete]);

  const skipTyping = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDisplayedText(text);
    setIsTyping(false);
    onComplete?.();
  };

  return { displayedText, isTyping, skipTyping };
}
