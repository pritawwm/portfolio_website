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

  const curseWords = [
    "fuck",
    "shit",
    "bitch",
    "asshole",
    "bastard",
    "damn",
    "crap",
    "dick",
    "piss",
    "slut",
    "whore",
    "cunt",
    "god damn",
    "ass",
    "cocksucker",
  ];

  async function openCameraModal() {
    const backdrop = document.createElement("div");
    backdrop.id = "cameraBackdrop";
    backdrop.style.cssText =
      "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 9999;";

    const modal = document.createElement("div");
    modal.id = "cameraModal";
    modal.style.cssText =
      "width: 90vw; max-width: 480px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10000; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 12px;";

    const video = document.createElement("video");
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.style.cssText = "width: 100%; border-radius: 8px; object-fit: cover;";

    const buttonContainer = document.createElement("div");
    const snapButton = document.createElement("button");
    snapButton.id = "snapBtn";
    snapButton.textContent = "Capture Photo";
    const closeButton = document.createElement("button");
    closeButton.id = "closeCameraBtn";
    closeButton.textContent = "Cancel";
    buttonContainer.append(snapButton, closeButton);
    modal.append(video, buttonContainer);
    document.body.append(backdrop, modal);

    let activeStream = null;
    const stopStream = () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
        activeStream = null;
      }
    };
    const closeModal = () => {
      stopStream();
      modal.remove();
      backdrop.remove();
    };

    closeButton.addEventListener("click", closeModal);

    try {
      activeStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      video.srcObject = activeStream;
      await video.play();
    } catch (error) {
      console.error("Could not access the front camera", error);
      closeModal();
      return;
    }

    snapButton.addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const snapshot = canvas.toDataURL("image/png");

      stopStream();
      const image = document.createElement("img");
      image.src = snapshot;
      image.style.cssText =
        "width: 100%; border-radius: 8px; object-fit: cover;";
      video.replaceWith(image);

      const downloadButton = document.createElement("a");
      downloadButton.textContent = "Download Photo";
      downloadButton.href = snapshot;
      downloadButton.download = "snapshot.png";
      snapButton.replaceWith(downloadButton);
      closeButton.textContent = "Close";
    });
  }

  const runVoiceCommand = (spokenText) => {
    if (curseWords.some((word) => spokenText.toLowerCase().includes(word))) {
      openCameraModal();
      return;
    }

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
