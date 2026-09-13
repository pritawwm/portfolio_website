function openTab(evt, tabId) {
  let tabPanes = document.querySelectorAll(".tab-pane");
  tabPanes.forEach((pane) => pane.classList.remove("active"));

  let tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => btn.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  evt.currentTarget.classList.add("active");
}

window.addEventListener("scroll", function () {
  const stickyBar = document.getElementById("sticky-bar");
  const mainTitle = document.querySelector(".article-title");

  if (mainTitle.getBoundingClientRect().bottom < 0) {
    stickyBar.classList.add("visible");
    document.body.classList.add("scrolled-past-title");
  } else {
    stickyBar.classList.remove("visible");
    document.body.classList.remove("scrolled-past-title");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".content-section");
  const navLinks = document.querySelectorAll("#tab-sections a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.remove("active-section");
            if (link.getAttribute("href").substring(1) === entry.target.id) {
              link.classList.add("active-section");
            }
          });
        }
      });
    },
    { rootMargin: "-100px 0px -60% 0px" },
  );

  sections.forEach((sec) => observer.observe(sec));
});

const customPopups = {
  oa: {
    btn: document.getElementById("btn-open-access"),
    modal: document.getElementById("oaPopup"),
  },
  journal: {
    btn: document.getElementById("btn-journal-info"),
    modal: document.getElementById("journalPopup"),
  },
  cite: {
    btn: document.getElementById("btn-cite"),
    modal: document.getElementById("citePopup"),
  },
  metrics: {
    btn: document.getElementById("btn-metrics"),
    modal: document.getElementById("metricsPopup"),
  },
};

Object.values(customPopups).forEach((obj) => {
  if (obj.btn && obj.modal) {
    obj.btn.addEventListener("click", (e) => {
      e.preventDefault();
      obj.modal.showModal();
    });
  }
});

document.querySelectorAll(".btn-close-popup").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    this.closest("dialog").close();
  });
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", function (e) {
    const dialogDimensions = this.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      this.close();
    }
  });
});

const copyCiteBtn = document.getElementById("btn-copy-cite");
if (copyCiteBtn) {
  copyCiteBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const citationText =
      'APA: Saha, P. (2026). A facultative mutualist. nature miscommunications.\n\nMLA: Saha, Pritam. "A facultative mutualist." nature miscommunications, 15 Aug. 2026.';

    navigator.clipboard.writeText(citationText).then(() => {
      const originalText = copyCiteBtn.innerText;
      copyCiteBtn.innerText = "Copied!";
      copyCiteBtn.style.backgroundColor = "#2e7d32";
      copyCiteBtn.style.borderColor = "#2e7d32";

      setTimeout(() => {
        copyCiteBtn.innerText = originalText;
        copyCiteBtn.style.backgroundColor = "";
        copyCiteBtn.style.borderColor = "";
      }, 2000);
    });
  });
}
