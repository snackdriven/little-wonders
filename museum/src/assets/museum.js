// Progressive enhancement only — the museum works fully without JS.
(() => {
  "use strict";

  // --- gallery filtering ---------------------------------------------------
  const filters = document.querySelectorAll("[data-filter-status], [data-filter-tag]");
  const cases = Array.from(document.querySelectorAll(".case"));

  let activeStatus = "all";
  const activeTags = new Set();

  function apply() {
    for (const card of cases) {
      const status = card.dataset.status;
      const cardTags = (card.dataset.tags || "").split(/\s+/).filter(Boolean);
      const statusOk = activeStatus === "all" || status === activeStatus;
      const tagOk = activeTags.size === 0 || cardTags.some((t) => activeTags.has(t));
      card.classList.toggle("is-hidden", !(statusOk && tagOk));
    }
  }

  for (const btn of filters) {
    btn.addEventListener("click", () => {
      if (btn.dataset.filterStatus) {
        activeStatus = btn.dataset.filterStatus;
        document
          .querySelectorAll("[data-filter-status]")
          .forEach((b) => b.classList.toggle("is-active", b === btn));
      } else if (btn.dataset.filterTag) {
        const tag = btn.dataset.filterTag;
        if (activeTags.has(tag)) activeTags.delete(tag);
        else activeTags.add(tag);
        btn.classList.toggle("is-active");
      }
      apply();
    });
  }

  // --- reveal on scroll ----------------------------------------------------
  const revealables = document.querySelectorAll(".exhibit__section, .case");
  if ("IntersectionObserver" in window && revealables.length) {
    revealables.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    revealables.forEach((el) => io.observe(el));
  }
})();
