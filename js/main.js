/* Shifa Medical Clinic — interactions */
document.addEventListener("DOMContentLoaded", function () {
  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".header .nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  /* ---- Sticky periwinkle nav on scroll ---- */
  var stickyNav = document.querySelector(".sticky-nav");
  var toTop = document.querySelector(".to-top");
  window.addEventListener(
    "scroll",
    function () {
      var y = window.scrollY;
      if (stickyNav) stickyNav.classList.toggle("show", y > 260);
      if (toTop) toTop.classList.toggle("show", y > 360);
    },
    { passive: true }
  );

  /* ---- Scroll to top ---- */
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- Hero slider ---- */
  var slides = document.querySelectorAll(".hero .slide");
  if (slides.length) {
    var current = 0;
    var timer;
    var show = function (i) {
      slides[current].classList.remove("active");
      current = (i + slides.length) % slides.length;
      slides[current].classList.add("active");
    };
    var next = function () { show(current + 1); };
    var prev = function () { show(current - 1); };
    var start = function () { timer = setInterval(next, 5500); };
    var reset = function () { clearInterval(timer); start(); };

    var nextBtn = document.querySelector(".hero-arrow.next");
    var prevBtn = document.querySelector(".hero-arrow.prev");
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); reset(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); reset(); });
    start();
  }

  /* ---- Patient feedback form (captcha 1 + 11) ---- */
  var fb = document.querySelector(".feedback-form");
  if (fb) {
    fb.addEventListener("submit", function (e) {
      e.preventDefault();
      var ans = fb.querySelector("#captcha");
      var msg = fb.querySelector(".form-msg");
      if (ans && parseInt(ans.value, 10) === 12) {
        if (msg) { msg.textContent = "Thank you! Your feedback has been submitted."; msg.style.display = "block"; }
        fb.reset();
      } else {
        if (msg) { msg.textContent = "Please solve the simple sum (1 + 11) correctly."; msg.style.color = "#c0392b"; msg.style.display = "block"; }
      }
    });
  }

  /* ---- Live clinic open / closed status (today only) ---- */
  (function () {
    var statusEl = document.getElementById("clinic-status");
    if (!statusEl) return;

    var labelEl = document.getElementById("today-label");
    var hoursEl = document.getElementById("today-hours");

    var TZ = "America/Toronto";
    // slots in minutes since midnight + their display labels
    var dayData = {
      Sun: { slots: [[600, 840]], labels: ["10:00 AM – 2:00 PM"] },
      Mon: { slots: [[900, 1050]], labels: ["3:00 PM – 5:30 PM"] },
      Tue: { slots: [], labels: [] },
      Wed: { slots: [[600, 870]], labels: ["10:00 AM – 2:30 PM"] },
      Thu: { slots: [[600, 870], [900, 1050]], labels: ["10:00 AM – 2:30 PM", "3:00 PM – 5:30 PM"] },
      Fri: { slots: [[600, 720], [900, 1050]], labels: ["10:00 AM – 12:00 PM", "3:00 PM – 5:30 PM"] },
      Sat: { slots: [[600, 840]], labels: ["10:00 AM – 2:00 PM"] }
    };
    var fullNames = {
      Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday",
      Thu: "Thursday", Fri: "Friday", Sat: "Saturday"
    };

    function nowInClinicTz() {
      var d = new Date();
      var day = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" }).format(d);
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(d);
      var h = parseInt((parts.find(function (p) { return p.type === "hour"; }) || {}).value, 10) || 0;
      var m = parseInt((parts.find(function (p) { return p.type === "minute"; }) || {}).value, 10) || 0;
      return { day: day, mins: (h % 24) * 60 + m };
    }

    function refresh() {
      var now = nowInClinicTz();
      var data = dayData[now.day] || { slots: [], labels: [] };
      var isOpen = data.slots.some(function (s) { return now.mins >= s[0] && now.mins < s[1]; });

      var text, open = false;
      if (isOpen) { text = "Open today"; open = true; }
      else if (data.slots.length === 0) { text = "Closed today"; }
      else { text = "Closed now"; }

      statusEl.className = "clinic-status" + (open ? " open" : "");
      var st = statusEl.querySelector(".status-text");
      if (st) st.textContent = text;

      if (labelEl) labelEl.textContent = "Today \u00B7 " + fullNames[now.day];

      if (hoursEl) {
        if (data.labels.length === 0) {
          hoursEl.innerHTML = '<span class="line">Closed</span>';
        } else {
          hoursEl.innerHTML = data.labels.map(function (l) {
            return '<span class="line">' + l + '</span>';
          }).join("");
        }
      }
    }

    refresh();
    setInterval(refresh, 60000);
  })();

  /* ---- Contact form ---- */
  var cf = document.querySelector(".contact-form");
  if (cf) {
    cf.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = cf.querySelector(".form-msg");
      if (msg) { msg.textContent = "Thank you! We will get back to you soon."; msg.style.display = "block"; }
      cf.reset();
    });
  }
});
