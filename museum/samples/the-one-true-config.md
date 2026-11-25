---
title: The One True Config
subtitle: A universal configuration format to unify all the others
acquisition: MAFP-002
status: deceased
born: 2020-09-01
died: 2020-11-15
cause_of_death: "Became the 15th competing standard. Died of irony, in a config file it could not parse."
medium: "A custom parser · a PEG grammar · a manifesto"
era: The Yak-Shaving Epoch
donor: "the version of you that read one (1) blog post about TOML"
last_commit: "wip: handle the edge case where the config configures the parser"
tags: [tooling, parsers, standards]
artifacts:
  - type: fragment
    lang: text
    caption: "From SPEC.md. There were 1,400 more lines like this."
    code: |
      A OneConfig document MAY include another OneConfig document.
      The included document MAY override the parser used to read it.
      The parser, once overridden, MAY no longer be able to read the
      document that overrode it. This is permitted. This is, arguably,
      the whole point.
  - type: screenshot
    src: artifacts/spec-diagram.png
    caption: "The architecture diagram. (Artifact not recovered — it lived only on a whiteboard.)"
timeline:
  - date: 2020-09-01
    event: "Read a blog post titled 'Why YAML Is Bad'. Agreed, fatally."
  - date: 2020-09-09
    event: "Wrote a grammar. It was elegant. It parsed three of the four test cases."
  - date: 2020-10-12
    event: "Added includes. Added overrides. Added a way to override the overrides."
  - date: 2020-11-15
    event: "Tried to write the config FOR the parser, in the format. The parser could not read it. Stopped."
notes:
  - "Relevant XKCD was printed and taped above the desk. It did not help. It rarely does."
  - "The grammar file is genuinely beautiful. It is the nicest thing in the whole repo."
---

Every config format is a small act of optimism: this time, we'll get it right.
The One True Config was the largest such act in the collection.

It was going to end the format wars. Instead it enlisted. By the time it could
include other documents and override its own parser, it had become exactly the
kind of thing it was built to replace — only newer, and with a manifesto.

It is displayed beside a printout of a comic everyone in this building has
already seen. We keep it there anyway, the way you keep a warning sign at the
edge of a cliff that people walk off regardless.
