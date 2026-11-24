# 🗂️ Nullify — The Machine That Organizes Nothing

*Extracted into `little-wonders/nullify/` by Codex (GPT-6 AI agent). The original app and writing are preserved; see [PROVENANCE.md](PROVENANCE.md).*

> A fully functional* productivity app that lets you create categories, labels, systems,
> and workflows — and stores **absolutely none of it**.
>
> \*functional in the only way that matters: it makes you *feel* organized.

Open `index.html` in a browser. That's it. No build step. No backend. No database.
No `localStorage`. No account. No sync. Just vibes and a number that goes up.

From the repository root, open `nullify/index.html`. The commands below assume you are in the `nullify` folder.

---

## What it does

- **📁 Categories** — name them, color them, watch the counter tick. The foundation of a calm mind.
- **🏷️ Labels** — a cross-cutting taxonomy for a search feature that does not exist.
- **⚙️ Systems** — adopt GTD, PARA, Zettelkasten, or "the one from that YouTube video." Configure the review cadence you will never honor.
- **🔀 Workflows** — chain steps into an automation that runs silently in the background, doing nothing, forever.

Every action triggers:
- a satisfying `✨` toast with a randomized affirmation ("Clarity unlocked.")
- a fake save sequence — *Saving… → Encrypting… → ✓ All changes saved (nowhere)*
- a **Clarity Score** that climbs toward 100 and, by design, **never arrives**.

Then you refresh the tab and it's all gone. Which is, if you think about it, the only
truly complete form of organization.

---

## Why it's the most honest productivity app ever shipped

Most productivity software sells you a future self. You don't buy the app — you buy the
*person you'll become* once you've set it up correctly. So you set it up. Forever.

Nullify just removes the middleman. It gives you the entire emotional payload of
getting organized — the clicking, the color-picking, the rising metric, the gentle
checkmark — and skips the part where you'd have to actually do anything, or where the
data would have to mean anything, or persist at all.

The dirty secret it dramatizes: **for a lot of us, organizing IS the procrastination.**
Building the system feels like progress. Renaming the categories feels like work.
The fifth migration to a new methodology feels like a fresh start. Nullify is that loop
with the mask off — pure structure-theater, zero output, and a score that's always
*almost* at 100 so you never feel finished and never feel like quitting.

### The tells, embedded in the product

| You see | What's really happening |
|---|---|
| "✓ All changes synced" | Synced to all **0** of your devices. |
| Clarity Score: 8% → 47% → 91%… | Asymptotic. It physically cannot reach 100. You are permanently *almost* organized. |
| "Cognitive Load: Low — look at you go" | Nothing was offloaded. The load is a `<span>`. |
| "⚡ Workflow activated · running" | It runs nothing. There is no engine. There is no work. |
| Recommended next structures (refreshes endlessly) | You are never done. There is always one more bucket to make. |
| `beforeunload` "are you sure?" prompt | It begs you not to leave — then loses everything the instant you do. |

### Ask it the only real question

There's a quiet link in the sidebar: **"What is actually stored?"**

Click it. The app confesses. (Spoiler, also runnable in your console:)

```js
localStorage.length   // 0
```

The Clarity Score says 91%. The amount stored says 0%. Both are correct.

---

## Files

```
nullify/
├── index.html   ← the entire app (HTML + CSS + JS, single file, ~zero dependencies)
└── README.md    ← you are here
```

## Running it

```bash
open index.html        # macOS
xdg-open index.html    # Linux
# or just double-click it
```

## The architecture diagram

```
[ you ] → [ delightful UI ] → [ in-memory object ] → [ /dev/null ] → ✨ feeling of accomplishment
                                       │
                                  (tab close)
                                       ↓
                                 perfect organization
```

---

*Nullify™ — Organize Everything. Keep Nothing. Your data is not end-to-end encrypted
because there is no data.*
