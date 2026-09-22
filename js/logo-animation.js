document.addEventListener("DOMContentLoaded", () => {
  const paths = document.querySelectorAll(".logo-wrapper .anim-path");
  paths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.setProperty("--path-length", length);
  });

  const wrapper = document.getElementById("animation-trigger");
  if (!wrapper) return;

  wrapper.addEventListener("click", () => {
    wrapper.classList.toggle("is-active");
  });
});
