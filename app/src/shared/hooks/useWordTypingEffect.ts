import { useState, useEffect, useRef } from 'react';

interface UseWordTypingEffectOptions {
  text: string;
  speed?: number; // milliseconds per word
  onComplete?: () => void;
}

export function useWordTypingEffect({
  text,
  speed = 50,
  onComplete
}: UseWordTypingEffectOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset when text changes
    indexRef.current = 0;
    setDisplayedText('');
    setIsTyping(true);

    // Split text into words (preserving spaces and punctuation)
    const words = text.split(/(\s+)/);

    const typeNextWord = () => {
      if (indexRef.current < words.length) {
        setDisplayedText(words.slice(0, indexRef.current + 1).join(''));
        indexRef.current++;
        timeoutRef.current = setTimeout(typeNextWord, speed);
      } else {
        setIsTyping(false);
        onComplete?.();
      }
    };

    timeoutRef.current = setTimeout(typeNextWord, speed);

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
