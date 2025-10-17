import { useState,useEffect,useRef } from "react";

const MUSIC_URL = "/6-Happy-Commercial-Piano(chosic.com).mp3";
export const useMilkingSession = ()=>{
    const[timer,setTimer] = useState(0); //Track timing
    const[isMilking,setIsMilking] = useState(false); //True when milking is active
    const[isPaused,setIsPaused] = useState(false); // True when milking is paused
    const[startTime,setStartTime] = useState(null); //Records starting timer of milking

    const intervalRef = useRef(null);//Stores the runing timer machanism
    const audioRef = useRef(null);// Stores the audio file of  the browser

   useEffect(() => {
    if (isMilking && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer(prevTime => prevTime + 1); 
      }, 1000);
      
      if (!audioRef.current) {
        audioRef.current = new Audio(MUSIC_URL);
        audioRef.current.loop = true; 
      }
      audioRef.current.play().catch(e => console.warn("Audio playback failed:", e));
      
    } else {
  
      if (intervalRef.current) {
        clearInterval(intervalRef.current); 
      }
      if (audioRef.current) {
        audioRef.current.pause(); 
      }
    }

   
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, [isMilking, isPaused]); 

 
  
  const startSession = () => {
    setStartTime(new Date()); 
    setTimer(0);
    setIsPaused(false);
    setIsMilking(true);
  };

  const stopSession = () => {
    setIsMilking(false);
    setIsPaused(false);
    
  
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; 
    }
    
  
    return {
      startTime: startTime,
      endTime: new Date(), 
      duration: timer,
    };
  };

  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    timer,
    isMilking,
    isPaused,
    startSession,
    pauseSession: () => setIsPaused(true),
    resumeSession: () => setIsPaused(false),
    stopSession,
    formatTime,
  };
};
