import React from "react";
import Image from "next/image";
import { Maximize, Share2, Trash2 } from "lucide-react";

interface EntryHeroProps {
  imageUrl: string;
  emotions: Array<{
    id: string;
    name: string;
    intensity: number;
  }>;
  entryDate: string;
  onExpandImage: () => void;
  onDeleteClick: () => void;
}

export default function EntryHero({
  imageUrl,
  emotions,
  entryDate,
  onExpandImage,
  onDeleteClick,
}: EntryHeroProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) + " at " + date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full h-[700px] overflow-hidden relative bg-gray-100 bg-gray-800 rounded-b-2xl">
      <Image
        src={imageUrl.startsWith('http') ? imageUrl : `${API_URL}${imageUrl}`}
        alt={`Journal entry from ${formatDateTime(entryDate)}`}
        width={1200}
        height={700}
        className="w-full h-full object-cover rounded-b-2xl cursor-pointer"
        onClick={onExpandImage}
        priority
        unoptimized
      />
      
      {/* Inset Shadow Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ 
          boxShadow: 'inset 0 0 80px 10px rgba(0, 0, 0, 0.4)',
        }}
      />
      
      {/* Emotions - Bottom Right */}
      {emotions.length > 0 && (
        <div 
          className="absolute bottom-3 right-3 z-[2]" 
          style={{ 
            maxWidth: emotions.length > 3 ? 'calc(100% - 180px)' : 'auto',
            overflowX: emotions.length > 3 ? 'auto' : 'visible',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex flex-row gap-2 items-center">
            {emotions.map((emotion) => (
              <span
                key={emotion.id}
                className="text-sm font-medium text-white drop-shadow-lg bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg whitespace-nowrap"
              >
                {emotion.name}: {Math.round(emotion.intensity * 100)}%
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Expand, Share, and Delete Buttons - Bottom Left */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 z-[2]">
        <button
          onClick={onExpandImage}
          className="bg-black/30 backdrop-blur-sm rounded-full p-2 transition-colors duration-300 hover:bg-black/50 shadow-lg"
          style={{ borderRadius: '9999px' }}
          aria-label="Expand image"
        >
          <Maximize className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Journal Entry',
                text: 'Check out my journal entry',
                url: window.location.href
              }).catch(err => console.log('Error sharing:', err));
            }
          }}
          className="bg-black/30 backdrop-blur-sm rounded-full p-2 transition-colors duration-300 hover:bg-black/50 shadow-lg"
          style={{ borderRadius: '9999px' }}
          aria-label="Share"
        >
          <Share2 className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={onDeleteClick}
          className="bg-black/30 backdrop-blur-sm rounded-full p-2 transition-colors duration-300 hover:bg-black/50 shadow-lg"
          style={{ borderRadius: '9999px' }}
          aria-label="Delete entry"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
