import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Auto-play audio when gift is opened
  useEffect(() => {
    if (!isGiftOpened) return;

    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          console.log("Audio autoplayed successfully");
        } catch (err) {
          console.log("Audio autoplay blocked, waiting for user interaction");
          // If autoplay is blocked, set up event listeners to play on first interaction
          const events = ["click", "touchstart", "keydown"];
          const handler = async () => {
            try {
              await audioRef.current?.play();
              console.log("Audio played after user interaction");
            } catch (error) {
              console.log("Failed to play audio:", error);
            }
          };

          events.forEach((event) => {
            document.addEventListener(event, handler, { once: true });
          });
        }
      }
    };

    // Try to play immediately when gift opens
    playAudio();
  }, [isGiftOpened]);

  // Particle animation for background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto rotate carousel
  useEffect(() => {
    if (!isGiftOpened) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, [isGiftOpened]);

  const handleGiftClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      setShowLetter(true);
    }, 1500); // Show letter after gift opening animation
  };

  // Auto-open letter when it appears
  useEffect(() => {
    if (showLetter && !isLetterOpen) {
      setTimeout(() => {
        setIsLetterOpen(true);
      }, 500); // Open letter after a short delay

      // Mark typing as complete after all text has typed out
      setTimeout(() => {
        setIsTypingComplete(true);
      }, 13500); // 13s for all typing + 0.5s buffer
    }
  }, [showLetter, isLetterOpen]);

  const handleLetterClick = () => {
    // Only allow clicking to advance after typing is complete
    if (isTypingComplete) {
      setTimeout(() => {
        setIsGiftOpened(true);
      }, 500);
    }
  };

  // Gift box landing page
  if (!isGiftOpened && !showLetter) {
    return (
      <div className={`gift-page ${isOpening ? "opening" : ""}`}>
        <canvas ref={canvasRef} className="particles-canvas" />
        <audio ref={audioRef} src="/music2.mp3" loop />

        <div className={`gift-content ${isOpening ? "opening" : ""}`}>
          <h1 className="gift-title">Dành tặng em 💖</h1>
          <p className="gift-subtitle">Click vào hộp quà để mở nhé!</p>

          <div
            className={`gift-box ${isOpening ? "opening" : ""}`}
            onClick={handleGiftClick}
          >
            <div className="gift-lid">
              <div className="gift-bow"></div>
            </div>
            <div className="gift-body"></div>
            <div className="gift-ribbon-v"></div>
            <div className="gift-ribbon-h"></div>
          </div>

          <p className="gift-hint">👆 Click here</p>
        </div>
      </div>
    );
  }

  // Love letter page
  if (!isGiftOpened && showLetter) {
    return (
      <div className="letter-page">
        <canvas ref={canvasRef} className="particles-canvas" />
        <audio ref={audioRef} src="/music2.mp3" loop />

        <div className={`letter-container ${isLetterOpen ? "opening" : ""}`}>
          <div
            className={`letter-wrapper ${isTypingComplete ? "clickable" : ""}`}
            onClick={handleLetterClick}
          >
            <div className="envelope">
              <div className="envelope-flap"></div>
              <div className="envelope-body"></div>
            </div>

            <div className="letter-content">
              <div className="letter-header">
                <h2>Gửi em yêu của anh 💕</h2>
              </div>

              <div className="letter-text">
                <p>
                  Chúc em luôn xinh đẹp, luôn vui vẻ, luôn <br /> hạnh phúc!
                </p>
                <p>
                  Cảm ơn em đã đến bên anh, làm cuộc đời <br /> anh thêm ý
                  nghĩa.
                </p>
                <p>
                  Mỗi ngày bên em đều là những khoảnh khắc <br /> đáng trân
                  trọng nhất.
                </p>
                <p>Happy Valentine's Day! Yêu em nhiều lắm💖</p>
                {/* <p className="signature">Yêu em nhiều lắm! ❤️</p> */}
              </div>
            </div>
          </div>

          {isTypingComplete && (
            <p className="letter-hint" onClick={handleLetterClick}>
              👆 Click để tiếp tục
            </p>
          )}
        </div>
      </div>
    );
  }

  // Valentine page (original content)
  return (
    <div className="app">
      <canvas ref={canvasRef} className="particles-canvas" />
      <audio ref={audioRef} src="/music2.mp3" loop autoPlay />
      {/* Floating bubbles */}
      <div className="bubbles">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="content">
        {/* Top left text */}
        {/* <div className="text-decoration top-left">
          <p>gửi em iuuu của anh 💖</p>
        </div> */}

        {/* Top right text */}
        <div className="text-decoration top-right">
          <h1 className="main-title">Happy Valentine's Day</h1>
          <p className="date">luuv 14</p>
        </div>

        {/* Center heart with play button */}
        <div className="heart-container">
          <div className="heart-particles">
            {[...Array(120)].map((_, i) => (
              <div
                key={i}
                className="heart-particle"
                style={
                  {
                    "--angle": `${(i / 120) * 360}deg`,
                    "--delay": `${(i / 120) * 3}s`,
                    "--distance": `${80 + Math.random() * 60}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          {/* Heart shape background */}
          <div className="heart-shape">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient
                  id="heartGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ff1493" />
                  <stop offset="50%" stopColor="#ff69b4" />
                  <stop offset="100%" stopColor="#ff1493" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M100,170 C25,120 15,90 15,65 C15,40 30,25 50,25 C65,25 80,32 100,50 C120,32 135,25 150,25 C170,25 185,40 185,65 C185,90 175,120 100,170 Z"
                fill="url(#heartGradient)"
                filter="url(#glow)"
                className="heart-path"
              />
            </svg>
          </div>

          {/* Play button */}
          {/* <button className="play-button">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="35,25 35,75 75,50" fill="white" />
            </svg>
          </button> */}
        </div>

        {/* Right side text */}
        {/* <div className="text-decoration right-side">
          <p className="message">Anh yêu em nhiều 💖</p>
          <p className="sub-message">Từ khi có em đời anh</p>
        </div> */}

        {/* 3D Carousel */}
        <div className="carousel-container">
          <div className="carousel-label">Mãi bên nhau nhé 💕</div>
          <div
            className="carousel"
            style={{ "--current": currentImage } as React.CSSProperties}
          >
            {[1, 2, 3, 4, 5].map((num, index) => (
              <div
                key={num}
                className={`carousel-item ${index === currentImage ? "active" : ""}`}
                style={{ "--index": index } as React.CSSProperties}
              >
                <div className="image-placeholder">
                  {/* <span>Ảnh {num}</span>
                  <p className="hint">Thêm ảnh của bạn vào đây</p> */}
                  <img src={`/${num}.jpeg`} alt={`Ảnh ${num}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
