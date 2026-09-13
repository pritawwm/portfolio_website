document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const themeToggleText = document.getElementById("themeToggleText");

  if (themeToggle && themeToggleText) {
    const updateText = () => {
      const currentTheme = document.documentElement.dataset.theme;
      themeToggleText.textContent =
        currentTheme === "dark" ? "Theme: Dark" : "Theme: Light";
    };

    updateText();

    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.dataset.theme;
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.dataset.theme = newTheme;
      localStorage.setItem("theme", newTheme);
      updateText();
    });
  }

  const inputElement = document.getElementById("typing-text");
  const micButton = document.getElementById("micButton");
  const voiceStatus = document.getElementById("voice-status");

  if (inputElement && micButton) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      micButton.setAttribute(
        "aria-label",
        "Voice search is not supported in this browser",
      );
    } else {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      const setListening = (isListening) => {
        micButton.classList.toggle("is-listening", isListening);
        micButton.setAttribute("aria-pressed", String(isListening));
        micButton.setAttribute(
          "aria-label",
          isListening ? "Stop voice search" : "Search by voice",
        );
        voiceStatus.textContent = isListening ? "Listening" : "";
      };

      const runVoiceCommand = (spokenText) => {
        const command = spokenText.toLowerCase().trim();
        const routes = [
          {
            matches: ["about", "who is pritam", "profile"],
            path: "about.html",
          },
          { matches: ["interest", "research"], path: "interests.html" },
          { matches: ["resume", "cv"], path: "resume.html" },
          { matches: ["twitter", "x profile"], url: "https://x.com/pritawwm" },
          { matches: ["single", "relationship"], path: "date.html" },
          {
            matches: ["linkedin"],
            url: "https://linkedin.com/in/pritam-saha-41b2b21b9",
          },
          { matches: ["music", "song", "playlist"], path: "music.html" },
          { matches: ["email", "contact"], url: "mailto:pritawwm@gmail.com" },
          { matches: ["game", "break", "play"], path: "game.html" },
        ];

        const route = routes.find(({ matches }) =>
          matches.some((match) => command.includes(match)),
        );
        if (route) {
          window.location.href = route.url || route.path;
          return;
        }

        if (command.includes("search") || command.includes("google")) {
          window.open(
            `https://www.google.com/search?q=${encodeURIComponent(spokenText)}`,
            "_blank",
          );
        }
      };

      micButton.addEventListener("click", () => {
        if (micButton.classList.contains("is-listening")) {
          recognition.stop();
          return;
        }

        try {
          recognition.start();
        } catch (error) {
          voiceStatus.textContent = "Voice search could not start";
        }
      });

      recognition.addEventListener("start", () => setListening(true));
      recognition.addEventListener("end", () => setListening(false));
      recognition.addEventListener("error", (event) => {
        setListening(false);
        voiceStatus.textContent =
          event.error === "not-allowed"
            ? "Microphone permission was denied"
            : "Voice search could not hear that";
      });
      recognition.addEventListener("result", (event) => {
        const spokenText = event.results[0][0].transcript;
        inputElement.value = spokenText;
        runVoiceCommand(spokenText);
      });
    }
  }

  const dropdown = document.getElementById("dropdown-results");
  const links = document.querySelectorAll(".suggestion-link");

  const isMobileView = window.innerWidth <= 600;
  const mobileOverlay = document.getElementById("mobile-overlay");
  const tutorialHand = document.getElementById("tutorial-hand");
  const nameTarget = document.getElementById("name-target");
  const singleTarget = document.getElementById("single-target");

  let currentMobileTutorialStep = 0;

  const simulatedHover = (element, isActive) => {
    if (!element) return;
    if (isActive) {
      element.classList.add("simulated-hover");
    } else {
      element.classList.remove("simulated-hover");
    }
  };

  function runMobileTutorialStep() {
    if (!isMobileView || currentMobileTutorialStep > 7) return;

    switch (currentMobileTutorialStep) {
      case 0:
        mobileOverlay.classList.add("active-loader");
        tutorialHand.style.opacity = "1";
        tutorialHand.style.left = window.innerWidth + 20 + "px";
        tutorialHand.style.top = "50vh";
        currentMobileTutorialStep++;
        setTimeout(runMobileTutorialStep, 300);
        break;
      case 1:
        if (nameTarget) {
          const rect = nameTarget.getBoundingClientRect();
          tutorialHand.style.top = rect.top + rect.height / 2 + "px";
          tutorialHand.style.left = rect.left + rect.width / 2 + "px";
          currentMobileTutorialStep++;
          setTimeout(runMobileTutorialStep, 1000);
        }
        break;
      case 2:
        simulatedHover(nameTarget, true);
        setTimeout(() => {
          tutorialHand.classList.add("cursor-click");
          nameTarget.style.transform = "scale(0.98)";
          nameTarget.style.transition = "transform 0.1s ease";
          currentMobileTutorialStep++;
          setTimeout(runMobileTutorialStep, 400);
        }, 200);
        break;
      case 3:
        tutorialHand.classList.remove("cursor-click");
        nameTarget.style.transform = "scale(1)";
        simulatedHover(nameTarget, false);
        currentMobileTutorialStep++;
        setTimeout(runMobileTutorialStep, 500);
        break;
      case 4:
        if (singleTarget) {
          const rect = singleTarget.getBoundingClientRect();
          tutorialHand.style.top = rect.top + rect.height / 2 + "px";
          tutorialHand.style.left = rect.left + rect.width / 2 + "px";
          currentMobileTutorialStep++;
          setTimeout(runMobileTutorialStep, 1000);
        }
        break;
      case 5:
        simulatedHover(singleTarget, true);
        setTimeout(() => {
          tutorialHand.classList.add("cursor-click");
          singleTarget.style.transform = "scale(0.98)";
          singleTarget.style.transition = "transform 0.1s ease";
          currentMobileTutorialStep++;
          setTimeout(runMobileTutorialStep, 400);
        }, 200);
        break;
      case 6:
        tutorialHand.classList.remove("cursor-click");
        singleTarget.style.transform = "scale(1)";
        simulatedHover(singleTarget, false);
        currentMobileTutorialStep++;
        setTimeout(runMobileTutorialStep, 500);
        break;
      case 7:
        tutorialHand.style.left = window.innerWidth + 50 + "px";
        tutorialHand.style.top = "50vh";
        currentMobileTutorialStep++;
        setTimeout(runMobileTutorialStep, 1000);
        break;
      case 8:
        tutorialHand.style.opacity = "0";
        setTimeout(() => {
          simulatedHover(nameTarget, false);
          simulatedHover(singleTarget, false);
          mobileOverlay.classList.remove("active-loader");
          mobileOverlay.style.display = "none";
        }, 300);
        break;
    }
  }

  const scriptSequence = "pritawwm\b\b\bm saha";
  let currentText = "";
  let index = 0;

  function updateSuggestions(currentInput) {
    const lowerInput = currentInput.toLowerCase();

    links.forEach((link) => {
      const fullText = link.getAttribute("data-text");
      const lowerFull = fullText.toLowerCase();
      const matchIndex = lowerFull.indexOf(lowerInput);

      if (matchIndex !== -1) {
        const before = fullText.substring(0, matchIndex);
        const match = fullText.substring(
          matchIndex,
          matchIndex + currentInput.length,
        );
        const after = fullText.substring(matchIndex + currentInput.length);
        link.innerHTML = `<b>${before}</b>${match}<b>${after}</b>`;
      } else {
        link.innerHTML = `<b>${fullText}</b>`;
      }
    });
  }

  function typeLetter() {
    if (index < scriptSequence.length) {
      if (index === 0 && dropdown) {
        dropdown.style.display = "block";
      }

      const char = scriptSequence.charAt(index);

      if (char === "\b") {
        currentText = currentText.slice(0, -1);
      } else {
        currentText += char;
      }

      if (inputElement) {
        inputElement.value = currentText;
        updateSuggestions(currentText);
      }

      index++;
      let typingSpeed = Math.floor(Math.random() * 130) + 120;

      if (char === "m" && currentText === "pritawwm") {
        typingSpeed += 800;
      } else if (scriptSequence.charAt(index) === "\b") {
        typingSpeed = 200;
      } else if (char === " ") {
        typingSpeed += 1000;
      }

      setTimeout(typeLetter, typingSpeed);
    } else if (isMobileView) {
      setTimeout(runMobileTutorialStep, 600);
    }
  }

  setTimeout(typeLetter, 2000);

  const suggestionList = document.getElementById("suggestion-list");
  if (suggestionList) {
    suggestionList.addEventListener("click", function (event) {
      if (event.target.classList.contains("suggestion-remove")) {
        event.stopPropagation();
        event.preventDefault();
        const listItem = event.target.closest("li");
        if (listItem) {
          listItem.remove();
        }
      }
    });
  }

  if (inputElement) {
    inputElement.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        if (inputElement.value.trim().toLowerCase() === "pritam saha") {
          window.location.href = "about.html";
        }
      }
    });
  }

  const navPopup = document.getElementById("navPopup");
  const openNavBtn = document.getElementById("openNavBtn");
  const closeNavBtn = document.getElementById("closeNavBtn");

  if (navPopup && openNavBtn && closeNavBtn) {
    openNavBtn.addEventListener("click", () => navPopup.showModal());
    closeNavBtn.addEventListener("click", () => navPopup.close());
  }
});
