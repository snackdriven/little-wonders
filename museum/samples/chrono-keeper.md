---
title: ChronoKeeper
subtitle: A time-tracking app that tracked everything except time
acquisition: MAFP-001
status: deceased
born: 2021-03-12
died: 2021-05-02
cause_of_death: "Scope creep. It tried to also be a calendar, a journal, a habit tracker, and quietly, a CRM."
medium: "React · Firebase · unreasonable optimism"
era: The Firebase Period
donor: "weekend-you, who had so many plans"
last_commit: "feat: begin rewriting the entire data layer (do not merge)"
tags: [productivity, react, scope-creep]
artifacts:
  - type: screenshot
    src: artifacts/chrono-keeper-dashboard.svg
    caption: "The dashboard, frozen mid-render. It is still loading streaks."
  - type: fragment
    lang: ts
    caption: "The last function ever written. Note that it returns nothing, and means it."
    code: |
      function calculateStreak(days: Day[]) {
        // TODO: figure out what a "streak" even is
        // is one day a streak? is zero days a streak you haven't started?
        return // ...
      }
timeline:
  - date: 2021-03-12
    event: "git init. The README promised it would 'finally fix productivity'."
  - date: 2021-03-20
    event: "First working prototype. Showed three friends. Two said 'cool'."
  - date: 2021-04-04
    event: "Added a calendar view, because how hard could a calendar be."
  - date: 2021-04-18
    event: "Decided the data layer was 'wrong' and had to be redone properly."
  - date: 2021-05-02
    event: "Last commit. The proper data layer was never finished. Neither was the improper one."
notes:
  - "Found a sticky note in the repo root that just says: WHY"
  - "The favicon was finished. Pixel-perfect. Nothing else was."
  - "Three different files named utils.ts. None of them were used."
---

It began, as these things do, with a real problem: you could never tell where
the day went. The fix was obvious — a small app, a few buttons, a number that
goes up.

Two weeks in, the number that goes up needed a chart. The chart needed a date
range. The date range needed a calendar. The calendar needed recurring events,
and recurring events are, it turns out, one of the hardest problems in computer
science, sitting quietly between two buttons you added on a Tuesday.

ChronoKeeper is preserved here in the exact posture of its death: a dashboard
eternally loading streaks for a streak system that was never defined. It knew
what time it was. It simply could not tell you where any of it had gone.
