import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

// Sample card data - replace with your actual content
const cardData = [
    { 
        id: 1, 
        title: "Project 1", 
        content: "Project description",
        image: "/src/images/Project Card - 1.png" // Optional
    },
    {
        id: 2,
        title: "Project 2",
        content: "Project description",
        image: "/src/images/Project Card - 2.png" // Optional
    },
    {
        id: 3,
        title: "Project 3",
        content: "Project description",
        image: "/src/images/Project Card - 3.png" // Optional
    },
    {
        id: 4,
        title: "Project 4",
        content: "Project description",
        image: "/src/images/Project Card - 4.png" // Optional
    },
    {
        id: 5,
        title: "Project 5",
        content: "Project description",
        image: "/src/images/Project Card - 5.png" // Optional
    },
    {
        id: 6,
        title: "Project 6",
        content: "Project description",
        image: "/src/images/Project Card - 6.png" // Optional
    }
];

// Individual card component
const Card = ({ data, index, activeIndex, progress, isActive }) => {
  // Calculate rotation based on index for variety
  const rotation = index % 2 === 0 ? 
    5 + (index % 3) * 2 : 
    -5 - (index % 3) * 2;
    
  // Calculate unique offsets based on index
  const offsetX = ((index % 3) - 1) * 5;
  const offsetY = ((index % 2) - 0.5) * 5;
  
  // Calculate visual properties
  const isArchived = index < activeIndex;
  const isNext = index === activeIndex + 1;
  const isFuture = index > activeIndex + 1;
  
  // Apply different styles based on card status
  let cardStyle = {};
  let opacity = 1;
  let scale = 1;
  let y = '50%';
  let x = '-50%';
  let rotate = '0deg';
  
  if (isArchived) {
    // Cards that have been archived
    const archiveDepth = activeIndex - index;
    scale = 0.7 - Math.min(0.2, 0.05 * archiveDepth);
    opacity = 0.7 - Math.min(0.5, 0.1 * archiveDepth);
    y = `${offsetY - 50}%`;
    x = `${offsetX - 50}%`;
    rotate = `${rotation}deg`;
    
  } else if (isActive) {
    // Active card
    if (progress <= 0.5) {
      // Phase 1: Bottom to center
      const phase1Progress = progress;
      y = `${50 - phase1Progress * 100}%`;
      x = '-50%';
    } else {
      // Phase 2: Center to archived
      const phase2Progress = (progress - 0.5) * 2;  // Scale 0.5-1 to 0-1
      
      // Transition to archived position
      scale = 1 - (0.3 * phase2Progress);
      y = `${offsetY - 50 * (1 - phase2Progress)}%`;
      x = `${offsetX - 50 * (1 - phase2Progress)}%`;
      rotate = `${rotation * phase2Progress}deg`;
      opacity = 1 - phase2Progress * 0.3;
    }
    
  } else if (isNext) {
    // Next card waiting to become active
    if (progress < 0.5) {
      // Wait below fold
      y = '100%';
      opacity = 0;
    } else {
      // Start coming up
      const nextCardProgress = (progress - 0.5) * 2;  // Scale 0.5-1 to 0-1
      y = `${100 - nextCardProgress * 50}%`;
      opacity = nextCardProgress;
    }
    
  } else if (isFuture) {
    // Future cards stay hidden below
    y = '100%';
    opacity = 0;
  }
  
  cardStyle = {
    transform: `translateX(${x}) translateY(${y}) scale(${scale}) rotate(${rotate})`,
    opacity: opacity,
    zIndex: 100 - index,  // Higher index = lower in stack
  };

  return (
    <div 
      className="absolute left-1/2 bottom-0 w-4/5 max-w-md rounded-lg shadow-lg border border-black bg-white"
      style={{
        ...cardStyle,
        transition: 'transform 0.3s ease, opacity 0.3s ease',
      }}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">{data.title}</h2>
        <p>{data.content}</p>
        <div className="h-32 flex items-center justify-center bg-gray-100 rounded mt-4">
          {/* Placeholder for card content/image */}
          <div className="text-gray-400">Card {data.id}</div>
        </div>
      </div>
    </div>
  );
};

// Main component
const CardScroller = () => {
  // State for tracking active card and animation progress
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const containerRef = useRef(null);
  const controls = useAnimation();
  
  // Number of cards
  const cardCount = cardData.length;

  // Clean animation progress on active card change
  useEffect(() => {
    setProgress(0);
  }, [activeIndex]);
  
  // Handle touch/drag events
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setLastY(e.touches[0].clientY);
    setLastTime(Date.now());
    setVelocity(0);
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = lastY - currentY;
    const now = Date.now();
    const dt = now - lastTime;
    
    // Calculate instant velocity (px/ms)
    if (dt > 0) {
      const instantVelocity = deltaY / dt;
      // Smooth velocity calculation
      setVelocity(velocity * 0.7 + instantVelocity * 0.3);
    }
    
    // Calculate progress based on screen height
    const screenHeight = window.innerHeight;
    const newProgress = progress + (deltaY / screenHeight);
    
    // Apply limits based on current position
    if (activeIndex === 0 && newProgress < 0) {
      // First card, limit backward movement
      setProgress(0);
    } else if (activeIndex === cardCount - 1 && newProgress > 0.5) {
      // Last card, limit forward movement
      setProgress(0.5);
    } else {
      // Normal case
      setProgress(Math.max(0, Math.min(1, newProgress)));
    }
    
    // Update tracking variables
    setLastY(currentY);
    setLastTime(now);
  };
  
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Determine if this was a fast flick (high velocity)
    const isFastFlick = Math.abs(velocity) > 0.3; // Threshold in px/ms
    
    if (isFastFlick) {
      // Fast movement - complete the action in the direction of movement
      if (velocity > 0) {
        // Flicked upward
        if (progress < 0.5) {
          // Move to center
          animateToProgress(0.5);
        } else if (activeIndex < cardCount - 1) {
          // Move to next card
          completeTransition();
        }
      } else {
        // Flicked downward
        if (progress > 0.5) {
          // Move back to center
          animateToProgress(0.5);
        } else if (activeIndex > 0) {
          // Move to previous card
          goToPreviousCard();
        } else {
          // Already at first card, go back to start
          animateToProgress(0);
        }
      }
    } else {
      // Slow movement - snap to nearest position
      if (progress < 0.25) {
        // Snap back to start
        animateToProgress(0);
      } else if (progress < 0.75) {
        // Snap to center
        animateToProgress(0.5);
      } else {
        // Go to next card
        completeTransition();
      }
    }
  };
  
  // Animation helpers
  const animateToProgress = async (targetProgress) => {
    // Calculate animation steps
    const steps = 20;
    const duration = 300; // ms
    const stepTime = duration / steps;
    const startProgress = progress;
    const delta = targetProgress - startProgress;
    
    for (let i = 1; i <= steps; i++) {
      // Use cubic easing
      const t = i / steps;
      const easedT = 1 - Math.pow(1 - t, 3); // Cubic ease out
      
      // Calculate next progress value
      const nextProgress = startProgress + delta * easedT;
      
      // Update progress state
      setProgress(nextProgress);
      
      // Wait for next frame
      await new Promise(resolve => setTimeout(resolve, stepTime));
    }
    
    // Ensure final value is set exactly
    setProgress(targetProgress);
  };
  
  const completeTransition = async () => {
    // Animate to full progress
    await animateToProgress(1);
    
    // Move to next card
    if (activeIndex < cardCount - 1) {
      setActiveIndex(activeIndex + 1);
      setProgress(0);
    } else {
      // No more cards, snap back to center
      animateToProgress(0.5);
    }
  };
  
  const goToPreviousCard = async () => {
    // Move to previous card
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      // Start previous card at center
      setProgress(0.5);
    } else {
      // Already at first card, snap back to start
      animateToProgress(0);
    }
  };
  
  // Handle wheel events for desktop
  const handleWheel = (e) => {
    e.preventDefault();
    
    // Convert wheel delta to touch delta
    const delta = e.deltaY * 0.002; // Adjust sensitivity
    const newProgress = progress + delta;
    
    // Apply same limits as touch
    if (activeIndex === 0 && newProgress < 0) {
      setProgress(0);
    } else if (activeIndex === cardCount - 1 && newProgress > 0.5) {
      setProgress(0.5);
    } else {
      setProgress(Math.max(0, Math.min(1, newProgress)));
    }
    
    // Clear timeout for wheel stop detection
    if (window.wheelTimeout) {
      clearTimeout(window.wheelTimeout);
    }
    
    // Detect when wheel stops
    window.wheelTimeout = setTimeout(() => {
      // Apply same snapping logic as touch end
      if (progress < 0.25) {
        animateToProgress(0);
      } else if (progress < 0.75) {
        animateToProgress(0.5);
      } else {
        completeTransition();
      }
    }, 150);
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-white" 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Drawing board background */}
      <div className="absolute inset-0 bg-white"></div>
      
      {/* Cards */}
      {cardData.map((card, index) => (
        <Card
          key={card.id}
          data={card}
          index={index}
          activeIndex={activeIndex}
          progress={index === activeIndex ? progress : 0}
          isActive={index === activeIndex}
        />
      ))}
      
      {/* Optional scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-1">
          {cardData.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full ${idx === activeIndex ? 'bg-black' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardScroller;