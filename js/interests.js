let ytPlayer;
let currentActiveBtn = null;

const playIcon = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="vertical-align: middle; margin-right: 4px;"><path d="M8 5v14l11-7z"/></svg> Play Audio`;
const pauseIcon = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="vertical-align: middle; margin-right: 4px;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> Pause Audio`;

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player("audio-player", {
    height: "1",
    width: "1",
    events: {
      onStateChange: onPlayerStateChange,
    },
    playerVars: {
      playsinline: 1,
      controls: 0,
      autoplay: 0,
    },
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED && currentActiveBtn) {
    currentActiveBtn.innerHTML = playIcon;
    currentActiveBtn = null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const audioButtons = document.querySelectorAll(".audio-toggle");

  audioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!ytPlayer || typeof ytPlayer.loadVideoById !== "function") return;

      const clickedVid = button.dataset.vid;
      const clickedStart = Number(button.dataset.start) || 0;

      if (button !== currentActiveBtn) {
        audioButtons.forEach((audioButton) => {
          audioButton.innerHTML = playIcon;
        });
        button.innerHTML = pauseIcon;
        ytPlayer.loadVideoById({
          videoId: clickedVid,
          startSeconds: clickedStart,
        });
        currentActiveBtn = button;
        return;
      }

      const playerState = ytPlayer.getPlayerState();
      if (playerState === 1) {
        ytPlayer.pauseVideo();
        button.innerHTML = playIcon;
      } else if (playerState === 2) {
        ytPlayer.playVideo();
        button.innerHTML = pauseIcon;
      }
    });
  });

  const moveStates = [
    {
      pieces: {
        wb: ["a8"],
        wk: ["g1"],
        wp: ["g3"],
        wr: ["f4"],
        br: ["b2"],
        bb: ["e6"],
        bk: ["e5"],
        bp: ["f5", "g4"],
      },
      highlights: [],
    },
    {
      pieces: {
        wb: ["a8"],
        wk: ["g1"],
        wp: ["g3"],
        wr: ["f2"],
        br: ["b2"],
        bb: ["e6"],
        bk: ["e5"],
        bp: ["f5", "g4"],
      },
      highlights: ["f4", "f2"],
    },
    {
      pieces: {
        wb: ["a8"],
        wk: ["g1"],
        wp: ["g3"],
        br: ["f2"],
        bb: ["e6"],
        bk: ["e5"],
        bp: ["f5", "g4"],
      },
      highlights: ["b2", "f2"],
    },
    {
      pieces: {
        wb: ["a8"],
        wk: ["f2"],
        wp: ["g3"],
        bb: ["e6"],
        bk: ["e5"],
        bp: ["f5", "g4"],
      },
      highlights: ["g1", "f2"],
    },
    {
      pieces: {
        wb: ["a8"],
        wk: ["f2"],
        wp: ["g3"],
        bb: ["d5"],
        bk: ["e5"],
        bp: ["f5", "g4"],
      },
      highlights: ["e6", "d5"],
    },
    {
      pieces: {
        wb: ["d5"],
        wk: ["f2"],
        wp: ["g3"],
        bk: ["e5"],
        bp: ["f5", "g4"],
      },
      highlights: ["a8", "d5"],
    },
    {
      pieces: {
        wk: ["f2"],
        wp: ["g3"],
        bk: ["d5"],
        bp: ["f5", "g4"],
      },
      highlights: ["e5", "d5"],
    },
    {
      pieces: {
        wk: ["e3"],
        wp: ["g3"],
        bk: ["d5"],
        bp: ["f5", "g4"],
      },
      highlights: ["f2", "e3"],
    },
    {
      pieces: {
        wk: ["e3"],
        wp: ["g3"],
        bk: ["e5"],
        bp: ["f5", "g4"],
      },
      highlights: ["d5", "e5"],
    },
  ];

  let currentMove = 0;
  const prevButton = document.getElementById("prevMove");
  const nextButton = document.getElementById("nextMove");
  const board = document.querySelector(".chess-board");
  const chessCaption = document.getElementById("chess-caption");
  const originalCaption =
    "— IM Sagar Shah, Round 14, World Chess Championship 2024";

  function renderBoard(stateIndex) {
    const state = moveStates[stateIndex];
    const pieceClasses = ["wp", "wr", "wb", "wk", "bp", "br", "bb", "bk"];
    board.querySelectorAll(".sq").forEach((square) => {
      square.classList.remove(...pieceClasses, "highlight-move");
    });

    Object.entries(state.pieces).forEach(([pieceClass, squareIds]) => {
      squareIds.forEach((squareId) => {
        document.getElementById(squareId).classList.add(pieceClass);
      });
    });

    state.highlights.forEach((squareId) => {
      document.getElementById(squareId).classList.add("highlight-move");
    });

    prevButton.disabled = stateIndex === 0;
    nextButton.disabled = stateIndex === moveStates.length - 1;
  }

  nextButton.addEventListener("click", () => {
    currentMove = Math.min(currentMove + 1, moveStates.length - 1);
    renderBoard(currentMove);
  });

  prevButton.addEventListener("click", () => {
    currentMove = Math.max(currentMove - 1, 0);
    renderBoard(currentMove);
  });

  renderBoard(currentMove);
});
