import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Play,
  Volume2,
  Lock,
  ArrowRight,
  Star,
  RefreshCw,
  Eye,
  AlertCircle,
  FileText,
  Bookmark,
  TrendingUp,
  ShieldCheck,
  BookOpen,
  Award,
  CreditCard,
  Download,
  Flame,
  CheckSquare,
  Gift,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { QUIZ_QUESTIONS, PROFILES, determineProfile, QuestionOption } from "./data";

export default function App() {
  // Screens: "landing" | "quiz" | "vsl" | "analyzing" | "newspaper" | "result_profile" | "sales_page" | "thank_you"
  const [currentScreen, setCurrentScreen] = useState<
    "landing" | "quiz" | "vsl" | "analyzing" | "newspaper" | "result_profile" | "sales_page" | "thank_you"
  >("landing");

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");

  // Scale question (Q17) helper
  const [selectedCommitment, setSelectedCommitment] = useState<number | null>(null);

  // VSL states
  const [vslPlaying, setVslPlaying] = useState(false);
  const [vslCompleted, setVslCompleted] = useState(false);
  const [vslSecondsLeft, setVslSecondsLeft] = useState(0);
  const [showSkipFallback, setShowSkipFallback] = useState(false);
  const vslTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Analyzing status animation states
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [analyzingStep, setAnalyzingStep] = useState(0);

  // Checkout embedded form visible state
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutCard, setCheckoutCard] = useState("");
  const [checkoutExpiry, setCheckoutExpiry] = useState("");
  const [checkoutCVV, setCheckoutCVV] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Notification states and logic for purchase toast matching the specified names and delays
  const [notification, setNotification] = useState<{ name: string; text: string } | null>(null);

  useEffect(() => {
    if (currentScreen !== "result_profile" && currentScreen !== "sales_page") {
      setNotification(null);
      return;
    }

    let active = true;
    let timerId: NodeJS.Timeout | null = null;
    let dismissId: NodeJS.Timeout | null = null;

    const namesMasc = ['Jose', 'Joao', 'Antonio', 'Francisco', 'Carlos', 'Paulo', 'Pedro', 'Lucas', 'Luiz', 'Marcos', 'Luis', 'Gabriel', 'Rafael', 'Daniel', 'Marcelo', 'Bruno', 'Eduardo', 'Felipe', 'Rodrigo', 'Manoel', 'Mateus', 'Andre', 'Fernando', 'Fabio', 'Leonardo', 'Gustavo', 'Guilherme', 'Leandro', 'Tiago', 'Anderson', 'Ricardo', 'Marcio', 'Jorge', 'Alexandre', 'Roberto', 'Edson', 'Diego', 'Vitor', 'Sergio', 'Claudio', 'Matheus', 'Thiago', 'Geraldo', 'Adriano', 'Luciano', 'Julio', 'Renato', 'Alex', 'Vinicius', 'Rogerio', 'Samuel', 'Ronaldo', 'Mario', 'Flavio', 'Douglas', 'Igor', 'Davi', 'Manuel', 'Jeferson', 'Cicero', 'Victor', 'Miguel', 'Robson', 'Mauricio', 'Danilo', 'Henrique', 'Caio', 'Reginaldo', 'Joaquim', 'Benedito', 'Gilberto', 'Marco', 'Alan', 'Nelson', 'Cristiano', 'Elias', 'Wilson', 'Valdir', 'Emerson', 'Luan', 'David', 'Renan', 'Severino', 'Fabricio', 'Mauro', 'Jonas', 'Gilmar', 'Jean', 'Fabiano', 'Wesley', 'Diogo', 'Adilson', 'Jair', 'Alessandro', 'Everton', 'Osvaldo', 'Gilson', 'Willian', 'Joel', 'Silvio', 'Helio', 'Maicon', 'Reinaldo', 'Pablo', 'Artur', 'Vagner', 'Valter', 'Celso', 'Ivan', 'Cleiton', 'Vanderlei', 'Vicente', 'Arthur', 'Milton', 'Domingos', 'Wagner', 'Sandro', 'Moises', 'Edilson', 'Ademir', 'Adao', 'Evandro', 'Cesar', 'Valmir', 'Murilo', 'Juliano', 'Edvaldo', 'Ailton', 'Junior', 'Breno', 'Nicolas', 'Ruan', 'Alberto', 'Rubens', 'Nilton', 'Augusto', 'Cleber', 'Osmar', 'Nilson', 'Hugo', 'Otavio', 'Vinicios', 'Italo', 'Wilian', 'Alisson', 'Aparecido'];
    const namesFem = ['Maria', 'Ana', 'Francisca', 'Antonia', 'Adriana', 'Juliana', 'Marcia', 'Fernanda', 'Patricia', 'Aline', 'Sandra', 'Camila', 'Amanda', 'Bruna', 'Jessica', 'Leticia', 'Julia', 'Luciana', 'Vanessa', 'Mariana', 'Gabriela', 'Vera', 'Vitoria', 'Larissa', 'Claudia', 'Beatriz', 'Rita', 'Luana', 'Sonia', 'Renata', 'Eliane'];

    const triggerNotification = () => {
      if (!active) return;

      const isMasc = Math.random() > 0.5;
      const name = isMasc
        ? namesMasc[Math.floor(Math.random() * namesMasc.length)]
        : namesFem[Math.floor(Math.random() * namesFem.length)];

      const text = "acabou de comprar";

      setNotification({ name, text });

      dismissId = setTimeout(() => {
        if (active) setNotification(null);
      }, 4000);

      // Random delay between min_time (4) and max_time (20) seconds
      const rand = Math.floor(Math.random() * (20 - 4 + 1) + 4);
      timerId = setTimeout(triggerNotification, rand * 1000);
    };

    // First notification after 4 seconds
    timerId = setTimeout(triggerNotification, 4000);

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
      if (dismissId) clearTimeout(dismissId);
    };
  }, [currentScreen]);

  // Current Question
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIdx];

  // Map progress bar percentage
  const totalQuizQuestions = QUIZ_QUESTIONS.length;
  // Subtracting the email from count so it is part of the flow or has its own screen
  const progressPercentage = Math.min(
    100,
    Math.round(((currentQuestionIdx) / totalQuizQuestions) * 100)
  );

  // Analyzing screen smooth checklist animations
  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let stepTimer: NodeJS.Timeout;

    if (currentScreen === "analyzing") {
      setAnalyzingProgress(0);
      setAnalyzingStep(0);

      progressTimer = setInterval(() => {
        setAnalyzingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressTimer);
            return 100;
          }
          return prev + 1;
        });
      }, 90); // ~9 seconds total progress

      stepTimer = setInterval(() => {
        setAnalyzingStep((prev) => {
          if (prev >= 4) {
            clearInterval(stepTimer);
            setTimeout(() => {
              setCurrentScreen("newspaper");
            }, 1000);
            return 4;
          }
          return prev + 1;
        });
      }, 1800); // 1.8s interval for steps
    }

    return () => {
      if (progressTimer) clearInterval(progressTimer);
      if (stepTimer) clearInterval(stepTimer);
    };
  }, [currentScreen]);

  // Preload Wistia scripts and styles immediately on mount so they are fully ready in cache
  useEffect(() => {
    // 1. Inject Wistia Stylesheet for non-defined custom player and popover trigger
    const styleId = "wistia-player-styles";
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.innerHTML = `
        wistia-player[media-id='7i8ufihqb8']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/7i8ufihqb8/swatch');
          display: block;
          filter: blur(5px);
          padding-top: 100.0%;
        }
        .vsl-trigger-link {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          height: 100% !important;
          min-height: 380px !important;
          background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%) !important;
          background-image: radial-gradient(circle at center, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%), url('https://fast.wistia.com/embed/medias/7i8ufihqb8/swatch') !important;
          background-size: cover !important;
          background-position: center !important;
          text-decoration: none !important;
          color: white !important;
          text-align: center !important;
          padding: 24px !important;
          box-sizing: border-box !important;
          transition: all 0.3s ease !important;
          position: relative !important;
          cursor: pointer !important;
        }
        .vsl-trigger-link:hover {
          transform: scale(1.02) !important;
          filter: brightness(1.1) !important;
        }
        .vsl-trigger-link-text {
          font-family: 'Inter', sans-serif !important;
          font-weight: 700 !important;
          font-size: 20px !important;
          line-height: 1.3 !important;
          margin-bottom: 8px !important;
          color: #ffffff !important;
          text-shadow: 0 2px 4px rgba(0,0,0,0.8) !important;
          max-width: 320px !important;
        }
        .vsl-trigger-link-subtext {
          font-family: 'Inter', sans-serif !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          color: #94a3b8 !important;
          text-shadow: 0 1px 2px rgba(0,0,0,0.6) !important;
        }
        .vsl-play-button-wrapper {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 72px !important;
          height: 72px !important;
          background: #ffffff !important;
          border-radius: 50% !important;
          margin-bottom: 24px !important;
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 10px 20px rgba(0,0,0,0.3) !important;
          transition: all 0.3s ease !important;
          position: relative !important;
        }
        .vsl-trigger-link:hover .vsl-play-button-wrapper {
          transform: scale(1.1) !important;
          background: #2563eb !important;
          box-shadow: 0 0 40px rgba(37, 99, 235, 0.8), 0 10px 20px rgba(0,0,0,0.4) !important;
        }
        .vsl-play-icon {
          width: 0 !important;
          height: 0 !important;
          border-top: 12px solid transparent !important;
          border-left: 20px solid #1e1b4b !important;
          border-bottom: 12px solid transparent !important;
          margin-left: 6px !important;
          transition: all 0.3s ease !important;
        }
        .vsl-trigger-link:hover .vsl-play-icon {
          border-left-color: #ffffff !important;
        }
        .vsl-pulse-ring {
          position: absolute !important;
          border: 4px solid rgba(255, 255, 255, 0.4) !important;
          border-radius: 50% !important;
          top: -12px !important;
          left: -12px !important;
          right: -12px !important;
          bottom: -12px !important;
          animation: vsl-pulse-anim 2s infinite !important;
          opacity: 0 !important;
        }
        @keyframes vsl-pulse-anim {
          0% {
            transform: scale(0.95);
            opacity: 1;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }

    // 2. Load Wistia Main Player JS
    const playerScriptId = "wistia-player-js";
    if (!document.getElementById(playerScriptId)) {
      const script = document.createElement("script");
      script.id = playerScriptId;
      script.src = "https://fast.wistia.com/player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // 3. Load Wistia Specific Video Embed JS
    const embedScriptId = "wistia-embed-js";
    if (!document.getElementById(embedScriptId)) {
      const script = document.createElement("script");
      script.id = embedScriptId;
      script.src = "https://fast.wistia.com/embed/7i8ufihqb8.js";
      script.async = true;
      script.type = "module";
      document.body.appendChild(script);
    }
  }, []);

  // Handle video events and auto-start playing when screen is "vsl"
  useEffect(() => {
    if (currentScreen === "vsl") {
      setVslCompleted(false);
      setShowSkipFallback(false);

      // Show fallback skip link after 4 seconds
      const fallbackTimer = setTimeout(() => {
        setShowSkipFallback(true);
      }, 4000);

      // Setup callbacks safely
      const handlePlay = () => setVslPlaying(true);
      const handlePause = () => setVslPlaying(false);
      const handleEnd = () => {
        setVslCompleted(true);
        setVslPlaying(false);
      };

      // Push to Wistia queue (the recommended official way)
      const wq = (window as any)._wq || [];
      wq.push({
        id: "7i8ufihqb8",
        onReady: (video: any) => {
          video.bind("play", handlePlay);
          video.bind("pause", handlePause);
          video.bind("end", handleEnd);
          // Auto-play immediately as soon as ready!
          try {
            video.play();
          } catch (e) {
            console.log("Auto-play blocked, waiting for user play interaction", e);
          }
        }
      });
      wq.push({
        id: "_all",
        onReady: (video: any) => {
          if (video.hashedId() === "7i8ufihqb8") {
            video.bind("play", handlePlay);
            video.bind("pause", handlePause);
            video.bind("end", handleEnd);
            try {
              video.play();
            } catch (e) {}
          }
        }
      });
      (window as any)._wq = wq;

      // Safe polling using only the custom element's public getApi method (no global Wistia.api calls)
      let active = true;
      let isBound = false;

      const tryBindCustomElement = () => {
        if (!active) return false;
        const playerEl = document.querySelector("wistia-player") as any;
        if (playerEl && typeof playerEl.getApi === "function") {
          playerEl.getApi().then((video: any) => {
            if (!active) return;
            video.bind("play", handlePlay);
            video.bind("pause", handlePause);
            video.bind("end", handleEnd);
            try {
              video.play();
            } catch (e) {}
          }).catch(() => {});
          return true; // successfully triggered binding promise
        }
        return false;
      };

      // Try immediately
      if (tryBindCustomElement()) {
        isBound = true;
      }

      // Poll periodically to ensure binding happens if element is registered/defined late
      const pollingInterval = setInterval(() => {
        if (!active) {
          clearInterval(pollingInterval);
          return;
        }
        if (isBound) {
          clearInterval(pollingInterval);
          return;
        }
        if (tryBindCustomElement()) {
          isBound = true;
          clearInterval(pollingInterval);
        }
      }, 300); // Poll faster (300ms) to ensure instant play

      return () => {
        active = false;
        clearTimeout(fallbackTimer);
        clearInterval(pollingInterval);
      };
    }
  }, [currentScreen]);

  // Load Stander Checkout script dynamically when checkout is displayed
  useEffect(() => {
    if (showCheckout) {
      const scriptId = "stander-checkout-script";
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://standerpay.com/embed/stander-checkout.js";
        script.async = true;
        document.body.appendChild(script);
      } else {
        // If the script already exists, reload it to scan the DOM freshly
        script.remove();
        const newScript = document.createElement("script");
        newScript.id = scriptId;
        newScript.src = "https://standerpay.com/embed/stander-checkout.js";
        newScript.async = true;
        document.body.appendChild(newScript);
      }
    }
  }, [showCheckout]);

  // Option selection logic
  const handleOptionSelect = (optionId: string) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(updatedAnswers);

    // If Question 17 (Commitment) is selected
    if (currentQuestion.id === "q17") {
      const scaleVal = optionId.replace("q17_", "");
      setSelectedCommitment(parseInt(scaleVal));
    }

    // Auto-advance after small timeout for beautiful visual feedback
    setTimeout(() => {
      moveToNextStep(updatedAnswers);
    }, 280);
  };

  const moveToNextStep = (currentAnswers: Record<string, string>) => {
    // If it's the 13th question (index 12), we go to VSL!
    if (currentQuestionIdx === 12) {
      setCurrentScreen("vsl");
      return;
    }

    // Otherwise advance normally
    if (currentQuestionIdx < totalQuizQuestions - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Finished all quiz questions (normally email is the last)
      setCurrentScreen("analyzing");
    }
  };

  // Back button flow
  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    } else {
      setCurrentScreen("landing");
    }
  };

  // Submit Q18 Email Form
  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!emailInput) {
      setEmailError("Por favor, introduza um e-mail.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setEmailError("Por favor, introduza um e-mail válido.");
      return;
    }

    // Save final state
    const updatedAnswers = { ...answers, q18: emailInput };
    setAnswers(updatedAnswers);

    setCurrentScreen("analyzing");
  };

  // checkout submission logic
  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCheckoutError("");

    if (!checkoutName.trim()) {
      setCheckoutError("Por favor, insira o seu nome completo.");
      return;
    }
    if (!checkoutCard || checkoutCard.replace(/\s/g, "").length < 16) {
      setCheckoutError("Número do cartão inválido. Deve conter 16 dígitos.");
      return;
    }
    if (!checkoutExpiry || !checkoutExpiry.includes("/")) {
      setCheckoutError("Validade do cartão inválida. Use o formato MM/AA.");
      return;
    }
    if (!checkoutCVV || checkoutCVV.length < 3) {
      setCheckoutError("Código CVV inválido.");
      return;
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setCurrentScreen("thank_you");
    }, 2000);
  };

  // Format Card Number (adds spaces every 4 digits)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format Expiry date (adds MM/AA slash)
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  // Determine user profile based on answer logic
  const detectedProfileKey = determineProfile(answers);
  const profile = PROFILES[detectedProfileKey];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0f172a] font-sans flex flex-col antialiased relative selection:bg-blue-100 selection:text-blue-950 overflow-x-hidden">
      
      {/* Decorative premium subtle grid and shadows background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10 opacity-60" />

      {/* HEADER SECTION */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-950 flex items-center justify-center shadow-md shadow-blue-900/10 border border-blue-900/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-blue-950 block">
                Plano de Memória
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest hidden sm:inline-block">
              Avaliação Cognitiva Inteligente
            </span>
            <div className="flex items-center gap-1.5 text-xs text-blue-900 font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Ativo</span>
            </div>
          </div>
        </div>

        {/* PROGRESS BAR (PINNED TO TOP DURING QUIZ) */}
        {currentScreen === "quiz" && (
          <div className="w-full bg-slate-100 h-1 relative overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 to-blue-900 rounded-r-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow flex items-center justify-center p-4 py-8 md:py-14">
        <div className="w-full max-w-2xl mx-auto">
          
          <AnimatePresence mode="wait">
            
            {/* SCREEN 1: LANDING */}
            {currentScreen === "landing" && (
              <motion.div
                key="landing-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-8"
              >
                {/* Scientific badge with gold star */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-950 text-xs font-bold border border-blue-100 shadow-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Baseado em Técnicas de Neurociência Cognitiva</span>
                </div>

                {/* Typography stack */}
                <div className="space-y-4">
                  <h1 className="font-bold text-3xl md:text-5xl lg:text-5xl text-blue-950 tracking-tight leading-tight max-w-xl mx-auto">
                    Descubra em 2 Minutos Porque Você Esquece as Coisas — E <span className="text-blue-600 relative inline-block">Como Resolver Isso<span className="absolute bottom-1 left-0 w-full h-1 bg-amber-400 rounded-full -z-10"></span></span>
                  </h1>
                  <p className="text-slate-600 text-sm md:text-base max-w-lg mx-auto font-normal leading-relaxed">
                    Responda a um teste rápido e receba um plano de treino de memória 100% personalizado ao seu perfil.
                  </p>
                </div>

                {/* Premium landing box card */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 max-w-md mx-auto space-y-6">
                  
                  {/* Microtext trust signals list */}
                  <ul className="text-left space-y-3.5 text-slate-700 text-sm py-2">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      </div>
                      <span className="font-medium">Leva menos de 3 minutos</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      </div>
                      <span className="font-medium">100% gratuito para descobrir o seu perfil</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      </div>
                      <span className="font-medium">Baseado em técnicas de neurociência cognitiva</span>
                    </li>
                  </ul>

                  {/* CTA START BUTTON */}
                  <div className="pt-2">
                    <button
                      id="start-test-btn"
                      onClick={() => {
                        setCurrentQuestionIdx(0);
                        setCurrentScreen("quiz");
                      }}
                      className="w-full bg-blue-950 text-white font-bold text-base md:text-lg py-4 px-6 rounded-2xl hover:bg-blue-900 active:scale-[0.98] transition-all shadow-lg shadow-blue-950/20 flex items-center justify-center gap-3 group cursor-pointer"
                    >
                      <span>COMEÇAR O TESTE</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="max-w-xs mx-auto">
                  <p className="text-xs text-slate-500 font-medium">
                    Já usado por milhares de pessoas para melhorar a memória e a concentração
                  </p>
                </div>
              </motion.div>
            )}

            {/* SCREEN 2: ACTIVE QUIZ */}
            {currentScreen === "quiz" && currentQuestion && (
              <motion.div
                key={`quiz-card-${currentQuestionIdx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Navigation and state header */}
                <div className="flex items-center justify-between">
                  <button
                    id="quiz-back-btn"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                  
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Pergunta {currentQuestion.number} de {totalQuizQuestions}
                  </span>
                </div>

                {/* Question core card container */}
                <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-100/60 border border-slate-100">
                  
                  {/* Single Choice layout */}
                  {currentQuestion.type === "single" && (
                    <div className="space-y-6">
                      <h2 className="font-bold text-xl md:text-2xl text-blue-950 leading-snug">
                        {currentQuestion.title}
                      </h2>

                      {/* Options stack */}
                      <div className="space-y-3 pt-2">
                        {currentQuestion.options?.map((option) => {
                          const isSelected = answers[currentQuestion.id] === option.id;
                          return (
                            <button
                              key={option.id}
                              id={`opt-${option.id}`}
                              onClick={() => handleOptionSelect(option.id)}
                              className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                                isSelected
                                  ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/10"
                                  : "border-slate-100 bg-slate-50/20 hover:border-slate-300 hover:bg-slate-50/50"
                              }`}
                            >
                              <span className="font-semibold text-slate-800 text-sm md:text-base group-hover:text-blue-950 transition-colors">
                                {option.text}
                              </span>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Q17 scale selector */}
                  {currentQuestion.type === "scale" && (
                    <div className="space-y-6">
                      <h2 className="font-bold text-xl md:text-2xl text-blue-950 leading-snug text-center">
                        {currentQuestion.title}
                      </h2>

                      <div className="flex justify-between gap-2 md:gap-4 py-6 max-w-md mx-auto">
                        {currentQuestion.options?.map((option, index) => {
                          const num = index + 1;
                          const isSelected = answers[currentQuestion.id] === option.id;
                          return (
                            <button
                              key={option.id}
                              id={`scale-opt-${option.id}`}
                              onClick={() => handleOptionSelect(option.id)}
                              className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl border font-bold text-base md:text-lg transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
                                isSelected
                                  ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/15"
                                  : "border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-white text-slate-700"
                              }`}
                            >
                              <span>{num}</span>
                              {index === 0 && <span className="text-[9px] font-normal block mt-0.5 opacity-80">(pouco)</span>}
                              {index === 4 && <span className="text-[9px] font-normal block mt-0.5 opacity-80">(total)</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Q18 email field option */}
                  {currentQuestion.type === "email" && (
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-100 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Passo Final da Personalização</span>
                        </div>
                        <h2 className="font-bold text-xl md:text-2xl text-blue-950">
                          {currentQuestion.title}
                        </h2>
                      </div>

                      <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-md mx-auto pt-2">
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block ml-1">
                            Endereço de E-mail Principal
                          </label>
                          <input
                            id="q18-email-input"
                            type="email"
                            placeholder="exemplo@gmail.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-base"
                          />
                          {emailError && (
                            <p className="text-rose-500 text-xs font-semibold flex items-center gap-1.5 mt-1 ml-1">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              <span>{emailError}</span>
                            </p>
                          )}
                        </div>

                        <button
                          id="submit-email-quiz-btn"
                          type="submit"
                          className="w-full bg-blue-950 text-white font-bold text-base py-4 px-6 rounded-2xl hover:bg-blue-900 active:scale-[0.98] transition-all shadow-lg shadow-blue-950/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>CONTINUAR PARA O PLANO</span>
                          <ArrowRight className="w-4.5 h-4.5" />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Footer signals */}
                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-400">
                    <span className="flex items-center gap-1">🔒 Encriptação Segura</span>
                    <span className="flex items-center gap-1">🧠 Rigor Científico</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCREEN 3: INTERACTIVE MINI VSL SCREEN (AFTER QUESTION 13) */}
            {currentScreen === "vsl" && (
              <motion.div
                key="vsl-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-950 text-[10px] tracking-wider font-bold uppercase border border-blue-100">
                    Apresentação em Vídeo Recomendada
                  </div>
                  <h2 className="font-bold text-2xl md:text-3xl text-blue-950 tracking-tight">
                    O Seu Perfil de Memória Está Quase Pronto...
                  </h2>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Assista a esta breve explicação para compreender a metodologia e desbloquear as perguntas finais de personalização.
                  </p>
                </div>

                {/* VSL Video Player Wistia Embed Box */}
                <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 max-w-md mx-auto relative group">
                  <div 
                    className="w-full relative bg-black rounded-3xl aspect-square"
                    dangerouslySetInnerHTML={{
                      __html: `
                        <wistia-player media-id="7i8ufihqb8" popover-content="link" wistia-popover="true" aspect="1.0" style="display: block; width: 100%; height: 100%;">
                          <a href="#" class="vsl-trigger-link">
                            <div class="vsl-play-button-wrapper">
                              <div class="vsl-pulse-ring"></div>
                              <div class="vsl-play-icon"></div>
                            </div>
                            <div class="vsl-trigger-link-text">O seu vídeo já começou</div>
                            <div class="vsl-trigger-link-subtext">Clique para acompanhar</div>
                          </a>
                        </wistia-player>
                      `
                    }}
                  />
                </div>

                {/* Continue button */}
                <AnimatePresence mode="wait">
                  {vslCompleted ? (
                    <motion.div
                      key="vsl-continue-container"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center pt-4 max-w-xs mx-auto"
                    >
                      <motion.button
                        id="vsl-continue-btn"
                        onClick={() => {
                          // Go to Question 14 (idx 13 in zero-index arrays)
                          setCurrentQuestionIdx(13);
                          setCurrentScreen("quiz");
                        }}
                        className="w-full bg-blue-950 text-white font-bold text-base py-4 px-6 rounded-2xl hover:bg-blue-900 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>CONTINUAR</span>
                        <ArrowRight className="w-4.5 h-4.5" />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="vsl-waiting-container"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center pt-4 max-w-xs mx-auto space-y-3"
                    >
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] text-slate-500 font-semibold leading-relaxed shadow-inner">
                        ⏳ Assista à breve explicação acima para desbloquear as perguntas finais. O botão ficará ativo automaticamente quando o vídeo terminar.
                      </div>
                      {showSkipFallback && (
                        <button
                          type="button"
                          onClick={() => setVslCompleted(true)}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-all cursor-pointer"
                        >
                          O vídeo não iniciou ou já terminou? Clique aqui para prosseguir
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* SCREEN 4: ANALYZING RESPONSES */}
            {currentScreen === "analyzing" && (
              <motion.div
                key="analyzing-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 text-center space-y-8"
              >
                {/* Visual brain scanner radar circle */}
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  />
                  
                  <div className="absolute inset-3 rounded-full bg-blue-50 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-blue-950 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-4 max-w-sm mx-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-blue-950 text-[10px] tracking-wider font-bold uppercase border border-blue-100">
                    A processar as suas respostas...
                  </div>
                  
                  <h2 className="font-bold text-xl md:text-2xl text-blue-950">
                    A calcular o seu perfil cognitivo...
                  </h2>
                  
                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-100"
                        style={{ width: `${analyzingProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                      <span>REDE NEURAL COGNITIVA</span>
                      <span>{analyzingProgress}%</span>
                    </div>
                  </div>
                </div>

                {/* Animated checkmarks list */}
                <div className="max-w-xs mx-auto text-left space-y-2.5 pt-4 border-t border-slate-50">
                  {[
                    "Analisando o seu perfil cognitivo...",
                    "Identificando os seus principais desafios de memória...",
                    "Cruzando dados com técnicas de neurociência...",
                    "Criando o seu plano de treino personalizado...",
                    "Quase pronto..."
                  ].map((stepText, idx) => {
                    const isCompleted = idx < analyzingStep;
                    const isActive = idx === analyzingStep;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 text-xs transition-opacity duration-300 ${
                          isCompleted ? "text-blue-950 font-semibold" : isActive ? "text-slate-800" : "text-slate-300"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                        ) : isActive ? (
                          <RefreshCw className="w-4.5 h-4.5 text-blue-500 animate-spin shrink-0" />
                        ) : (
                          <div className="w-4.5 h-4.5 rounded-full border border-slate-200 shrink-0" />
                        )}
                        <span className="truncate">{stepText}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* SCREEN 5: NEWSPAPER REPORT STATE */}
            {currentScreen === "newspaper" && (
              <motion.div
                key="newspaper-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* News Header Label */}
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded">
                    Artigo de Interesse Científico Recomendado
                  </span>
                </div>

                {/* Actual Paper Container */}
                <div className="bg-[#FAF9F5] p-6 md:p-10 rounded-3xl border border-[#E9E5D9] shadow-xl text-slate-900 font-serif max-w-2xl mx-auto space-y-6 relative">
                  
                  {/* Stamp detail */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full border border-[#DCD6C4] flex items-center justify-center text-[9px] font-mono text-slate-400 tracking-wider rotate-12 hidden sm:flex">
                    N_INDEX
                  </div>

                  {/* Newspaper branding line */}
                  <div className="border-b-4 border-double border-slate-800 pb-3 text-center">
                    <span className="font-sans font-extrabold text-xs tracking-widest text-slate-500 uppercase block">
                      DIÁRIO DA NEUROCIÊNCIA COGNITIVA
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 uppercase mt-0.5 block">
                      Edição Diária • Saúde Mental & Plasticidade Sináptica
                    </span>
                  </div>

                  {/* THE GIANT HEADLINE */}
                  <div className="space-y-4">
                    <h1 className="font-serif font-black text-2xl md:text-3.5xl leading-tight text-slate-950 tracking-tight text-center sm:text-left">
                      Estudo revela: 78% dos casos de &ldquo;esquecimento&rdquo; não têm origem em falta de capacidade, mas em ausência de técnica adequada.
                    </h1>
                  </div>

                  {/* Visual mockup styling with actual journal image */}
                  <div className="overflow-hidden rounded-2xl shadow-lg border border-slate-200/60 bg-white">
                    <img
                      src="https://lh3.googleusercontent.com/d/1bZu50wCMXnaxIF_HNlmh4LydmCtvYJUZ"
                      alt="Reportagem Estilo Jornal"
                      className="w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Editorial Column layout text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed font-serif text-justify pt-1">
                    <p>
                      Especialistas em neurociência cognitiva têm vindo a alertar: a forma tradicional de estudar e memorizar informação está desatualizada. Técnicas como repetição espaçada e associação visual têm mostrado resultados significativos na retenção de memória a curto e longo prazo — mesmo em pessoas que sempre acreditaram ter &ldquo;má memória&rdquo;.
                    </p>
                    <p>
                      A tendência tem levado a um aumento na procura por planos de treino cognitivo estruturados, especialmente entre estudantes, profissionais e adultos preocupados em manter a mente ativa e livre de lapsos que prejudicam o dia a dia.
                    </p>
                  </div>

                  {/* Double line footer of article */}
                  <div className="border-t-4 border-double border-[#E3DDD0] pt-4 flex items-center justify-between font-sans text-[11px] text-slate-400 font-bold">
                    <span>SEÇÃO SAÚDE DO CÉREBRO</span>
                    <span>PÁGINA 4B</span>
                  </div>
                </div>

                {/* CTA BUTTON */}
                <div className="text-center max-w-xs mx-auto">
                  <button
                    id="newspaper-continue-btn"
                    onClick={() => setCurrentScreen("result_profile")}
                    className="w-full bg-blue-950 text-white font-bold text-base py-4 px-6 rounded-2xl hover:bg-blue-900 transition-all shadow-lg shadow-blue-950/15 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>CONTINUAR</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 6: RESULTADO DA ANÁLISE (PROFILE MATCH) */}
            {currentScreen === "result_profile" && profile && (
              <motion.div
                key="profile-match-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-950 text-[10px] tracking-wider font-bold uppercase border border-blue-100">
                    ⭐ Perfil Identificado de Forma Determinista
                  </div>
                  <h2 className="font-bold text-2xl md:text-3xl text-blue-950 tracking-tight">
                    O seu perfil foi identificado
                  </h2>
                </div>

                {/* Profile Core Card */}
                <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 space-y-6">
                  
                  {/* Title banner */}
                  <div className="space-y-3 pb-4 border-b border-slate-100">
                    <span className="text-[10px] tracking-wider uppercase font-extrabold text-blue-600 block">
                      Perfil Atribuído
                    </span>
                    <h3 className="font-bold text-2xl text-blue-950 flex items-center gap-2">
                      <Brain className="w-6 h-6 text-blue-600" />
                      <span>{profile.name}</span>
                    </h3>
                  </div>

                  {/* Profile Meaning Paragraph */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm tracking-wide uppercase">
                      O que isto significa:
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {profile.description}
                    </p>
                  </div>

                  {/* Specs Table */}
                  <div className="overflow-hidden border border-slate-100 rounded-2xl bg-slate-50/50">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="p-4 font-bold text-slate-500 w-1/3 bg-slate-50">Duração</td>
                          <td className="p-4 text-slate-800 font-semibold">{profile.duration}</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="p-4 font-bold text-slate-500 bg-slate-50">Exercícios</td>
                          <td className="p-4 text-slate-800 font-semibold">{profile.exercises}</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-slate-500 bg-slate-50">Foco principal</td>
                          <td className="p-4 text-slate-950 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span>{profile.focus}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Compliance warning if profile is vital age maintenance */}
                  {profile.id === "perfil_5" && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 text-[11px] text-slate-500 leading-normal">
                      *Nota de compliance: este perfil destina-se puramente ao suporte de mudanças e aptidões cognitivas naturais que acompanham o avanço da idade. Não serve para diagnosticar, mitigar ou prevenir condições médicas clínicas de declínio neurológico severo.
                    </div>
                  )}
                </div>

                {/* Navigation CTA button */}
                <div className="text-center max-w-xs mx-auto">
                  <button
                    id="view-custom-plan-btn"
                    onClick={() => setCurrentScreen("sales_page")}
                    className="w-full bg-blue-950 text-white font-bold text-base py-4 px-6 rounded-2xl hover:bg-blue-900 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>VER MEU PLANO PERSONALIZADO</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 7: PLANO PERSONALIZADO (PÁGINA DE VENDAS) */}
            {currentScreen === "sales_page" && (
              <motion.div
                key="sales-page-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 pb-12"
              >
                
                {/* Main Premium Dark Card Container */}
                <div className="bg-[#0f172a] text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
                  
                  {/* Glowing background highlights */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Header/Title Block inside the card */}
                  <div className="p-6 md:p-8 text-center border-b border-slate-800/80 space-y-3.5 relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[11px] font-extrabold uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Plano Personalizado Gerado</span>
                    </div>
                    <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight max-w-xl mx-auto uppercase leading-tight">
                      Plano de Treinamento de Memória Ativa 30 Dias
                    </h1>
                    <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                      Desenvolvido exclusivamente com base no seu perfil de <span className="font-bold text-amber-400">&ldquo;{profile?.name}&rdquo;</span> para otimizar o seu desempenho cognitivo.
                    </p>
                  </div>

                  {/* Body Content Area */}
                  <div className="p-6 md:p-8 space-y-6 relative z-10">
                    
                    {/* What is Included (organized clean list) */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Conteúdo do seu Treinamento</span>
                      </div>
                      
                      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
                        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                          Uma metodologia prática passo a passo, focada em resolver exatamente as dificuldades indicadas nas suas respostas: foco rápido, memorização duradoura e mitigação de lapsos.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {[
                            "Treinamento de memória estruturado para 30 dias",
                            "12 exercícios de alta fixação para o cotidiano",
                            "Protocolo de repetição espaçada e associação",
                            "Checklist diário de evolução cognitiva"
                          ].map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[3]" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Benefits & Bonus: Side-by-side Layout inside the premium card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Core Benefits */}
                      <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800/80 space-y-3">
                        <h3 className="font-bold text-[11px] tracking-wider uppercase text-slate-300 flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                          <span>Benefícios Principais</span>
                        </h3>
                        <div className="space-y-2.5 text-xs text-slate-300">
                          {[
                            "Reter informações importantes com menos esforço",
                            "Estudar, planejar ou trabalhar com mais foco",
                            "Reduzir a insegurança de esquecer dados na hora H",
                            "Ganhar mais agilidade mental no dia a dia"
                          ].map((benefit, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bonus */}
                      <div className="bg-amber-500/5 p-5 rounded-xl border border-amber-500/10 space-y-3">
                        <h3 className="font-bold text-[11px] tracking-wider uppercase text-amber-400 flex items-center gap-2">
                          <Gift className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>Bónus Exclusivo de Hoje</span>
                        </h3>
                        <div className="bg-slate-950/60 p-3.5 rounded-lg border border-amber-500/15 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 bg-amber-400/10 text-amber-400 text-[8px] rounded font-extrabold uppercase tracking-wider border border-amber-400/20">
                              LIST
                            </span>
                            <h4 className="font-bold text-slate-100 text-xs">
                              Checklist de Hábitos para Mente Ativa
                            </h4>
                          </div>
                          <p className="text-slate-400 text-[10px] leading-relaxed">
                            Um guia visual com pequenas rotinas diárias práticas para reconfigurar e fortalecer a sua plasticidade cognitiva de forma simples.
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Guarantee & Social Proof Segment */}
                    <div className="pt-4 border-t border-slate-800/80 space-y-5">
                      
                      {/* Guarantee Box */}
                      <div className="flex items-start gap-3 bg-slate-900/30 p-4 rounded-xl border border-slate-800">
                        <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5 text-xs">
                          <h4 className="font-bold text-white">Garantia de Satisfação de 7 Dias</h4>
                          <p className="text-slate-400 leading-normal">
                            Se por qualquer motivo considerar que as técnicas apresentadas não se adaptam ao seu perfil cognitivo, devolvemos 100% do valor pago de forma imediata.
                          </p>
                        </div>
                      </div>

                      {/* Social Proof Mini */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <div className="flex -space-x-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-600/30 border border-slate-800 flex items-center justify-center text-[8px] font-bold text-blue-300">CM</div>
                            <div className="w-5 h-5 rounded-full bg-amber-600/30 border border-slate-800 flex items-center justify-center text-[8px] font-bold text-amber-300">ST</div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Recomendado por mais de 1.200 participantes
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="bg-slate-900/20 p-3.5 rounded-lg border border-slate-800/60 space-y-1">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                              ))}
                            </div>
                            <p className="text-slate-300 text-[11px] leading-normal italic">
                              &ldquo;Sinto-me muito mais focado no dia a dia. Excelente investimento.&rdquo;
                            </p>
                            <p className="text-[9px] font-bold text-slate-500">— Carlos M., 54 anos</p>
                          </div>

                          <div className="bg-slate-900/20 p-3.5 rounded-lg border border-slate-800/60 space-y-1">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                              ))}
                            </div>
                            <p className="text-slate-300 text-[11px] leading-normal italic">
                              &ldquo;O checklist facilitou muito para fixar novos hábitos rápidos.&rdquo;
                            </p>
                            <p className="text-[9px] font-bold text-slate-500">— Sara T., Estudante</p>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* PRICE VISUALIZATION & OUTSTANDING PREMIUM CALL TO ACTION */}
                    <div className="pt-6 border-t border-slate-800/80 text-center space-y-5 relative overflow-hidden">
                      
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 text-[9px] tracking-wider uppercase font-black text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                          <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
                          Acesso Vitalício em Promoção
                        </span>
                        <div className="pt-1.5">
                          <p className="text-slate-400 text-xs line-through">De 9.800 KZ</p>
                          <div className="flex items-baseline justify-center gap-1.5 mt-0.5">
                            <span className="text-3xl md:text-4.5xl font-black text-amber-400 tracking-tight">5.799 KZ</span>
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Taxa Única</span>
                          </div>
                        </div>
                        <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider pt-0.5">
                          Sem mensalidades • Envio imediato por e-mail
                        </p>
                      </div>

                      {/* IMPROVED HIGH-CONVERTING BUTTON LINK */}
                      <div className="pt-1">
                        <a
                          id="unlock-plan-cta-btn"
                          href="https://standerpay.com/checkout/ae8d5180-a641-4036-93b7-8ba912fadb43"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full max-w-md mx-auto bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700 text-white font-bold text-sm md:text-base py-4 px-6 rounded-2xl hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-emerald-600/30 flex flex-col items-center justify-center gap-1 group cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>DESBLOQUEAR O MEU PLANO AGORA</span>
                            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                          <span className="text-[9px] text-emerald-100 font-medium tracking-wide uppercase">
                            Transação Protegida de Alta Segurança
                          </span>
                        </a>
                      </div>

                      {/* Security trust badges */}
                      <div className="flex items-center justify-center gap-4 text-[9px] text-slate-400 pt-1 font-semibold">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          Pagamento Seguro SSL
                        </span>
                        <span className="text-slate-700">•</span>
                        <span className="flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 text-emerald-500" />
                          Garantia Incondicional
                        </span>
                      </div>

                    </div>

                  </div>

                </div>

              </motion.div>
            )}

            {/* SCREEN 8: PÁGINA DE OBRIGADO (THANK YOU STATE) */}
            {currentScreen === "thank_you" && (
              <motion.div
                key="thank-you-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 md:p-12 rounded-3xl border border-slate-100 shadow-2xl text-center space-y-8 max-w-xl mx-auto"
              >
                
                {/* Success checkmark */}
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-100">
                    Inscrição Concluída
                  </span>
                  <h1 className="font-bold text-2xl md:text-3xl text-blue-950 tracking-tight">
                    Compra Confirmada!
                  </h1>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-normal">
                    Parabéns! O seu plano personalizado <span className="font-bold text-blue-950">&ldquo;TREINAMENTO DE MEMÓRIA ATIVA 30 DIAS&rdquo;</span> já está pronto e foi enviado para o seu e-mail cadastrado.
                  </p>
                </div>

                {/* Materials download link */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center gap-3 justify-center text-slate-800 text-sm font-semibold">
                    <Download className="w-5 h-5 text-blue-600 animate-bounce" />
                    <span>📥 Aceda ao seu material:</span>
                  </div>

                  {/* Real download link button */}
                  <a
                    id="download-bonus-pdf-btn"
                    href="https://drive.google.com/file/d/1zE8prMsE3FyWVYzmclmMpMYx_nK9vxV1/view?usp=drivesdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-xs mx-auto bg-blue-600 text-white font-bold text-xs py-3 px-5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ACEDER E DESCARREGAR BÓNUS</span>
                  </a>
                </div>

                {/* Instructions timeline */}
                <div className="space-y-4 text-left pt-2 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Bookmark className="w-4.5 h-4.5 text-blue-600" />
                    <span>📌 Instruções de Acesso:</span>
                  </h3>

                  <div className="space-y-3 font-medium text-xs text-slate-600">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                      <p className="leading-relaxed">Clique no link acima para aceder ao treinamento completo ou aceda o seu e-mail para ver o produto.</p>
                    </div>
                    
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                      <p className="leading-relaxed">Faça download do bónus para consulta rápida de suporte.</p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                      <p className="leading-relaxed">Comece pelo Dia 1 do plano — recomendamos seguir a ordem proposta.</p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                      <p className="leading-relaxed">Guarde este email/página para acesso futuro ou reimpressão.</p>
                    </div>
                  </div>
                </div>

                {/* Footer sign */}
                <div className="pt-2 text-center text-xs text-slate-400 font-bold tracking-wide uppercase">
                  Bem-vindo(a) à sua jornada de memória mais forte.
                </div>

                <div className="pt-2">
                  <button
                    id="restart-quiz-btn"
                    onClick={() => {
                      setAnswers({});
                      setEmailInput("");
                      setCheckoutName("");
                      setCheckoutCard("");
                      setCheckoutExpiry("");
                      setCheckoutCVV("");
                      setShowCheckout(false);
                      setVslCompleted(false);
                      setVslSecondsLeft(0);
                      setCurrentScreen("landing");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-bold"
                  >
                    <span>Repetir Quiz</span>
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-100 py-6 text-center text-xs text-slate-400 space-y-2">
        <p>&copy; 2026 MindPlan. Todos os direitos reservados.</p>
        <p className="max-w-md mx-auto px-4 leading-normal text-[11px]">
          Esta página destina-se ao suporte e treinamento cognitivo de alta qualidade. Os dados recolhidos são tratados com máxima confidencialidade e segurança para o cálculo interativo do seu perfil.
        </p>
      </footer>

      {/* Floating live purchase notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-4 left-4 z-50 flex items-center gap-3 bg-white border border-emerald-200 shadow-xl p-3.5 rounded-2xl max-w-[280px] md:max-w-xs cursor-pointer select-none ring-4 ring-emerald-500/5 bg-gradient-to-r from-white to-emerald-50/10"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Check className="w-4.5 h-4.5 stroke-[3]" />
            </div>
            <div className="text-[11px] md:text-xs text-slate-700 leading-normal font-semibold">
              <span className="font-black text-slate-900 block text-xs">{notification.name}</span>{" "}
              {notification.text} o <span className="font-extrabold text-emerald-600">Plano de Memória Ativa</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
