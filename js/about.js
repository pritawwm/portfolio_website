document.addEventListener("DOMContentLoaded", () => {
  const inputElement = document.getElementById("typing-text");
  const micButton = document.getElementById("micButton");
  const voiceStatus = document.getElementById("voice-status");

  if (!inputElement || !micButton) return;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    micButton.setAttribute(
      "aria-label",
      "Voice search is not supported in this browser",
    );
    return;
  }

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
      { matches: ["home", "main", "index"], path: "index.html" },
      { matches: ["about", "who is pritam", "profile"], path: "about.html" },
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
});

document.querySelectorAll(".paa-question").forEach((item) => {
  item.addEventListener("click", () => {
    const answer = item.nextElementSibling;
    const arrow = item.querySelector(".arrow-icon");
    if (answer.style.display === "block") {
      answer.style.display = "none";
      arrow.style.transform = "rotate(0deg)";
    } else {
      answer.style.display = "block";
      arrow.style.transform = "rotate(180deg)";
    }
  });
});
