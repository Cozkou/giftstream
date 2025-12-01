import { useState, useEffect } from 'react';

interface TutorialProps {
  onComplete: () => void;
}

const TUTORIAL_PAGES = [
  {
    title: "Welcome to GiftStream!",
    content: "I'm your friendly gift elf! I'll be placing mystery boxes on the conveyor belt for you to unbox. Each box contains a random crypto reward!",
    highlight: "🎁 Mystery boxes appear on the conveyor belt",
  },
  {
    title: "How to Play",
    content: "Each gift box has a cost shown below it. Click any box you can afford to unbox it! The reward is random — you might win big or lose some tokens. Higher rarity boxes glow brighter!",
    highlight: "💰 Pay to unbox → Get random rewards",
  },
  {
    title: "Ready to Unbox?",
    content: "Connect your wallet to get 100 GIFT tokens to start. Visit the Shop for power-ups, check the Social tab for friends & leaderboards, and track your winnings in History!",
    highlight: "🚀 Good luck and have fun!",
  },
];

export function Tutorial({ onComplete }: TutorialProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in on mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleNext = () => {
    if (currentPage < TUTORIAL_PAGES.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const isLastPage = currentPage === TUTORIAL_PAGES.length - 1;
  const page = TUTORIAL_PAGES[currentPage];

  return (
    <div className={`tutorial-overlay ${isVisible ? 'tutorial-visible' : ''}`}>
      <div className="tutorial-container">
        {/* Elf image */}
        <div className="tutorial-elf-wrapper">
          <img src="/elf.png" alt="Gift Elf" className="tutorial-elf" />
        </div>

        {/* Speech bubble */}
        <div className="tutorial-bubble">
          {/* Page indicator */}
          <div className="tutorial-progress">
            {TUTORIAL_PAGES.map((_, i) => (
              <div 
                key={i} 
                className={`tutorial-dot ${i === currentPage ? 'tutorial-dot-active' : ''} ${i < currentPage ? 'tutorial-dot-done' : ''}`}
              />
            ))}
          </div>

          {/* Content */}
          <h2 className="tutorial-title">{page.title}</h2>
          <p className="tutorial-content">{page.content}</p>
          
          {/* Highlight box */}
          <div className="tutorial-highlight">
            {page.highlight}
          </div>

          {/* Button */}
          <button
            onClick={isLastPage ? handleComplete : handleNext}
            className="tutorial-btn"
          >
            {isLastPage ? "Let's Go!" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(true);

  const completeTutorial = () => {
    setShowTutorial(false);
  };

  const resetTutorial = () => {
    setShowTutorial(true);
  };

  return { showTutorial, isLoaded: true, completeTutorial, resetTutorial };
}

