function nextStep(stepNumber) {
  const currentStep = document.querySelector(".step.active");

  const requiredFields = currentStep.querySelectorAll(
    "input[required], select[required]",
  );

  let allValid = true;

  for (let field of requiredFields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      allValid = false;
      break;
    }
  }

  if (allValid) {
    currentStep.classList.remove("active");
    document.getElementById("step" + stepNumber).classList.add("active");
  }
}

function prevStep(stepNumber) {
  document
    .querySelectorAll(".step")
    .forEach((step) => step.classList.remove("active"));
  document.getElementById("step" + stepNumber).classList.add("active");
}

const today = new Date();
const yyyy = today.getFullYear();

const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");

const formattedToday = `${yyyy}-${mm}-${dd}`;

document.getElementById("date").setAttribute("min", formattedToday);

const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

dateInput.addEventListener("change", function () {
  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const formattedToday = `${yyyy}-${mm}-${dd}`;

  if (this.value === formattedToday) {
    const bufferTime = new Date();
    const currentDay = bufferTime.getDate();

    bufferTime.setHours(bufferTime.getHours() + 1);

    let minTime;
    if (bufferTime.getDate() !== currentDay) {
      minTime = "23:59";
    } else {
      const hours = String(bufferTime.getHours()).padStart(2, "0");
      const minutes = String(bufferTime.getMinutes()).padStart(2, "0");
      minTime = `${hours}:${minutes}`;
    }

    timeInput.setAttribute("min", minTime);
  } else {
    timeInput.removeAttribute("min");
  }

  if (timeInput.value) {
    timeInput.dispatchEvent(new Event("input"));
  } else {
    timeInput.setCustomValidity("");
  }
});

timeInput.addEventListener("input", function () {
  const minTime = this.getAttribute("min");

  if (minTime && this.value) {
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, "0");
    const currentMinutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${currentHours}:${currentMinutes}`;

    if (this.value < currentTime) {
      this.setCustomValidity("You can't select a time in the past!");
    } else if (this.value < minTime) {
      this.setCustomValidity("Please give me at least an hour to get ready!");
    } else {
      this.setCustomValidity("");
    }
  } else {
    this.setCustomValidity("");
  }
});

const noBtn = document.getElementById("noBtn");

function runaway(e) {
  e.preventDefault();

  noBtn.style.position = "fixed";
  noBtn.style.zIndex = "9999";

  const maxX = window.innerWidth - noBtn.offsetWidth - 20;
  const maxY = window.innerHeight - noBtn.offsetHeight - 20;

  const randomX = Math.max(20, Math.floor(Math.random() * maxX));
  const randomY = Math.max(20, Math.floor(Math.random() * maxY));

  noBtn.style.left = randomX + "px";
  noBtn.style.top = randomY + "px";
}

noBtn.addEventListener("mouseover", runaway);
noBtn.addEventListener("touchstart", runaway);

noBtn.addEventListener("click", function (e) {
  runaway(e);
  alert("Nice try, but 'No' is not an option!");
});

function formatCalendarTime(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function getCalendarTimes(formData) {
  const [year, month, day] = formData.get("Date").split("-").map(Number);
  const [hours, minutes] = formData.get("Time").split(":").map(Number);
  const start = new Date(year, month - 1, day, hours, minutes);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  return {
    start: formatCalendarTime(start),
    end: formatCalendarTime(end),
  };
}

function getCalendarDescription(formData) {
  return [
    `Activity Vibe: ${formData.get("Activity Vibe") || ""}`,
    `Cuisine Preference: ${formData.get("Cuisine Preference") || ""}`,
    `Additional Notes: ${formData.get("Additional Notes") || "None"}`,
  ].join("\n");
}

function escapeICS(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function generateICS(formData) {
  const times = getCalendarTimes(formData);
  const description = getCalendarDescription(formData);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pritam Saha//Date Invitation//EN",
    "BEGIN:VEVENT",
    `UID:date-with-pritam-${Date.now()}@pritamsaha.co.in`,
    `DTSTAMP:${formatCalendarTime(new Date())}`,
    `DTSTART:${times.start}`,
    `DTEND:${times.end}`,
    "SUMMARY:Date with Pritam",
    `DESCRIPTION:${escapeICS(description)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Date with Pritam",
    "TRIGGER:-PT30M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const icsLink = document.getElementById("icsLink");
  if (icsLink.dataset.objectUrl) {
    URL.revokeObjectURL(icsLink.dataset.objectUrl);
  }
  const objectUrl = URL.createObjectURL(
    new Blob([ics], { type: "text/calendar;charset=utf-8" }),
  );
  icsLink.href = objectUrl;
  icsLink.dataset.objectUrl = objectUrl;
}

function generateGCal(formData) {
  const times = getCalendarTimes(formData);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Date with Pritam",
    dates: `${times.start}/${times.end}`,
    details: getCalendarDescription(formData),
  });

  document.getElementById("gcalLink").href =
    `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const form = document.getElementById("dateForm");
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const data = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      generateICS(data);
      generateGCal(data);
      document.getElementById("icsLink").click();
      nextStep(4);
      form.reset();
    } else {
      alert(
        "Oops! There was a problem submitting your form. Make sure you entered a valid Formspree ID.",
      );
    }
  } catch (error) {
    alert("Oops! Network error. Drop a message in my social media.");
  }
});
