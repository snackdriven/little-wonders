---
title: Hearthlight
subtitle: A cozy game about keeping a single fire alive
acquisition: MAFP-003
status: dormant
born: 2022-01-28
died: 2022-01-30
cause_of_death: "Ran out of weekend. The game jam ended; the fire did not get a save system."
medium: "Godot · pixel art · 48 hours"
era: The Game-Jam Interglacial
donor: "you, two coffees deep, at 3am"
last_commit: "art: title screen done!! gameplay tomorrow (there was no tomorrow)"
tags: [games, godot, gamejam]
artifacts:
  - type: screenshot
    src: artifacts/hearthlight-title.svg
    caption: "The title screen. Genuinely finished. 'Continue' finds no saves, because there are none."
  - type: fragment
    lang: gdscript
    caption: "The core loop. The fire works perfectly. There is nothing else to do but watch it."
    code: |
      func _process(delta):
          fuel -= delta * 0.5
          if fuel <= 0:
              emit_signal("fire_died")
          # TODO: literally everything else
          # - a reason to keep it alive
          # - something to gather
          # - someone to keep warm
timeline:
  - date: 2022-01-28
    event: "Jam starts. Theme is 'one'. Decided: one fire, one night, keep it lit."
  - date: 2022-01-29
    event: "Spent the day on the title screen. It looks incredible. Worth it."
  - date: 2022-01-30
    event: "Jam ends in 4 hours. The fire burns down in 90 seconds and that is the entire game."
notes:
  - "The flicker shader took six hours and is honestly some of your best work."
  - "There is one sound effect: a log settling. It plays once. It is perfect."
---

Hearthlight is the only specimen in this wing marked *dormant* rather than
deceased, and the curators argue about it constantly.

It is not finished. It is barely started — a beautiful title screen in front of
a single, doomed flame. But unlike its neighbors, nothing about it is broken.
The fire burns exactly as designed. It simply has nowhere to burn toward.

We file it as dormant because every few months someone opens the project again,
watches the fire for a while, adds nothing, and closes it. That is not death.
That is a pilot light.
