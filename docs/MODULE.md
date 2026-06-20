# Building Little Worlds

### A Module on Citation, Constraint, and a Different Kind of Worldbuilding

*Companion text to the Build Little Worlds lab (buildlittleworlds.com).*
*Written to be read two ways: by a person learning what worldbuilding can be,
and by an AI or developer learning what this project is and how to extend it.*

---

## How to read this document

This is a single module — roughly the length of one unit in a course — built
around a small website and an idea larger than the website. The site lets you
invent **citation protocols**: alternate rules for how a made-up scholarly
world remembers, credits, owes, refuses, and inherits knowledge. The idea is
that citation — the most ignored convention in all of writing — turns out to
be a complete instrument for building worlds, and that building worlds this way
is meaningfully different from the kind of worldbuilding most people have been
taught.

Two readers are addressed throughout.

If you are a **student**, read this as a theory you can use. By the end you
should be able to take any system of acknowledgement — academic, legal,
religious, familial, commercial — and rebuild it into a world, then notice what
that world makes thinkable and what it forbids. There are exercises at the end
of each part and a fuller set in the appendix. You do not need to know how the
software works.

If you are an **AI agent or a developer**, read this as the project's reason
for existing. The code in this repository is downstream of the argument made
here. When you are asked to extend the site, the question is never only "does
this feature work" but "does this feature serve worldbuilding-by-primitive, or
does it quietly turn the lab back into an ordinary content generator." Part III
is addressed to you specifically, and there is a compressed agent brief in the
appendix. You should read Parts I and II first anyway; the design principles
will not make sense without them.

A note on apparatus. This document does not carry a bibliography and does not
pretend to. It gestures at real fields — narrative theory, the study of how
knowledge is made and transmitted, the history of the book, design — but it
argues its own case in its own terms rather than leaning on authorities. Where
it names a tradition, it does so to locate you, not to cite a source. Treat the
framework as a new theory presented directly, the way a craft is taught: by
doing it, looking at it, and naming what you did.

---

## Contents

**Part I — What the site is doing**
1. The smallest unit of a world
2. Citation, unfamiliar
3. The eight dimensions
4. The generator and the combinator

**Part II — Why this is a different kind of worldbuilding**
5. Two ways to build a world
6. Constraint as the engine, not the cage
7. Contradiction as reproduction
8. The reader inside the rules

**Part III — Futures, and how to build them**
9. Reading the codebase as an argument
10. Design principles for anyone extending the lab
11. A roadmap, and why each step is shaped the way it is
12. The longer horizon

**Appendices**
- A. Exercises and discussion questions
- B. Glossary
- C. Brief for an AI agent working on this project
- D. A worked example, start to finish

---

# Part I — What the site is doing

## 1. The smallest unit of a world

Ask someone to build a world and watch where their hands go. They reach for a
map. They draw a coastline, name a mountain range, sketch the borders of three
kingdoms, decide which of them is at war. If they have more time they invent a
pantheon, a magic system, a thousand years of history with a few good
catastrophes in it. This is worldbuilding as most people have received it, and
it is genuinely an art. But notice what it assumes: that a world is a large
thing, assembled from large things — geography, factions, myth, lineage of
kings — and that you build it by accumulation. More map, more lore, more world.

This module begins from the opposite assumption. A world is not a pile of
contents. A world is a set of **rules about how something basic works**, and
everything you would call "content" is just those rules running. Change the
rules at the bottom and the whole surface reorganizes without your having to
draw a single mountain. The trick is to find a rule basic enough that altering
it touches everything, and small enough that you can actually hold it in your
hand and turn it over.

We are going to use one such rule, and it is going to seem, at first, absurdly
minor. The rule is **citation**: the convention by which a piece of writing
points at the source of what it knows.

Hold the objection you are about to raise. Citation looks like a footnote, a
parenthetical, a line in a bibliography — clerical, peripheral, the part of
scholarship nobody loves. That is exactly why it is useful. A primitive that
seems trivial is a primitive whose power you have never tested. By the end of
Part I you should find the claim plausible that citation is not a formatting
detail bolted onto knowledge but a compressed description of an entire
civilization's relationship to memory, authority, debt, and trust — and that by
rewriting it you can build worlds as different from each other as a republic is
from a monastery.

We call the basic rule a **primitive**: the smallest piece you build from,
chosen because mutating it changes everything above it. The whole site is an
instrument for mutating one primitive and watching the consequences.

## 2. Citation, unfamiliar

Strip away the formatting and ask what a citation actually *does*. In our own
world it does roughly one job: it assigns **credit**. You cite to say "this
knowledge came from there, not from me," and the system rewards the *there* —
with reputation, with tenure, with the right to be cited in turn. Our entire
scholarly economy runs on this one function. Citation-as-credit feels less like
a choice than like a law of nature.

It is not a law of nature. It is one option. Pull the function out and replace
it, and you have built somewhere else to live. Consider what citation could be
*for* instead:

- **Citation as debt.** To cite someone does not honor them; it obligates you
  to them. Every reference is a line in a ledger you now owe — labor, defense,
  future work performed on their behalf. In this world scholars cite sparingly
  and strategically, bibliographies are balance sheets, and a person can be
  ruined by citing too generously. The same mark that means *thank you* in our
  world means *I am now in your debt* in this one, and scholarship reorganizes
  around solvency.

- **Citation as confession.** A citation names not what supported your claim
  but what you **failed to preserve** — the part of the source you misread,
  could not carry forward, or chose to leave out. Every work ends in a litany
  of its own omissions. Scholarship becomes an ethics of loss, and a careful
  scholar is one who is most honest about what they dropped.

- **Citation as inheritance.** You do not cite ideas; you cite **ancestors**,
  and citing carries the duties of kinship. To cite someone is to take on the
  tending of their reputation, to defend their claims, to raise the
  arguments they left orphaned. A bibliography is a genealogy, and there are
  rules about whom you are permitted to descend from.

- **Citation as binding.** To cite is to **summon**. The cited author, or their
  position, is pulled into the present and made to answer. Now there are rules
  about who may be summoned, who is protected from it, and what it costs to call
  the dead into a living argument.

- **Citation as risk.** Citing transfers **liability**. If a cited claim turns
  out false, blame flows along the citation chain — up to whoever originated it,
  or down to whoever last reaffirmed it. Suddenly you are careful whom you lean
  on, because their errors can become legally yours.

None of these is the citation you know, yet each is recognizably *a* citation —
a mark that points from a claim to its origin and attaches consequences to the
pointing. What changes between them is the **consequence**, and the consequence
is the world. This is the first thing the site is doing: it treats the function
of citation as a variable, and it lets you set the variable to anything.

Notice, too, that the moment you change what citation is *for*, you have
implicitly changed a hundred other things you never touched. In the debt-world,
junior scholars are poorer than senior ones not in money but in citational
solvency, which means power is structured differently, which means the careers
look different, which means the buildings are arranged differently. You did not
design any of that. It fell out of the primitive. That falling-out is the entire
phenomenon this module is about.

## 3. The eight dimensions

If citation were a single dial, the site would be a toy. It is more like a small
console, because citation is not one decision but a bundle of separable ones.
The lab's generator exposes the bundle as a set of **kinds** — the categories a
generated unit can belong to. They are worth taking seriously, because the list
*is* the theory: it claims that citation has at least these eight independent
dimensions, each of which you can mutate without touching the others, and which
recombine into the full space of possible scholarly worlds.

1. **Protocol** — the core rule. *Who* must name a source, *when* a claim
   becomes citeable at all, and *what form* the act of acknowledgement takes. This
   is the spine; the rest hang off it.

2. **Obligation** — the social binding. The debts, permissions, duties, and
   penalties that make citation matter. A protocol with no obligation attached is
   etiquette; add obligation and it becomes law.

3. **Evidence ritual** — how a claim earns the right to be cited. In our world
   this is peer review and replication. In another it might be a claim that must
   be *performed* — sung, walked, cooked, dueled — before it counts as real
   enough to point at.

4. **Memory system** — how the body of citeable knowledge persists or decays.
   Does a source last forever once written, or must it be continually re-cited or
   it vanishes from the record? Memory is where you decide whether your world's
   knowledge is a monument or a fire that needs feeding.

5. **Authority rule** — who gets to say a citation is valid. Is authority in the
   text, in the institution, in a living witness who must stand up and reaffirm,
   in an algorithm, in the dead? Move authority and you move where power sits.

6. **Refusal custom** — the right *not* to participate. Who may refuse to be
   cited; which sources are forbidden to be named; what counts as a source that
   has withdrawn its consent. Refusal is the most underrated dimension because it
   defines the world's negative space — what scholarship is forbidden to lean on.

7. **Source interface** — the physical or formal surface citation passes
   through. Marks, ledgers, ceremonies, annotations, machines, tattoos, scent.
   The interface is where the abstraction touches the body and the object; change
   it and you change who can read a bibliography and how.

8. **Institution** — the standing structures that maintain all of the above. The
   archive, the academy, the registry, the office that adjudicates disputes. The
   institution is the world's immune system for its own citation rules.

(A ninth kind, **custom**, is the open slot: it lets you generate a unit that
does not fit the taxonomy, which is how the taxonomy stays honest. Any framework
worth using includes a door marked *none of the above*.)

These eight are not a wish list of features. They are a claim about structure:
that the apparently monolithic act of "citing" decomposes into eight loosely
coupled mechanisms, and that worlds differ from one another by how those
mechanisms are set and combined. Set memory to "decays without re-citation,"
set refusal to "sources may withdraw," set authority to "the living witness,"
and you have specified a world before you have written a word of its story. The
story is just what happens when people have to live under that configuration.

## 4. The generator and the combinator

The site has two instruments, and the difference between them is the difference
between having an idea and watching ideas have consequences.

The **generator** is the front page. You give it a seed — a sentence describing
a world, like *"a university where every citation must name what it failed to
preserve"* — and you pick one of the eight kinds. It returns a single, compact,
reusable unit: a title, a one-line summary, a handful of component parts (the
moving pieces — clauses, marks, rituals, penalties), and a few tags. Under the
hood a language model is doing the writing, but the constraint is doing the
thinking: the model is forbidden to give you ordinary citation advice and is
required to return a structured *protocol* that could combine with others. The
output is deliberately small. A generated unit is not a story or a setting; it
is a **part**, designed to snap together with other parts.

The reflection panel that appears beneath each result is not decoration. It asks
the four questions that turn a generated object back into a design problem:
*What counts as a source in this world? Who is obligated to cite, and who can
refuse? What happens when citation fails, lies, or disappears? What kind of
scholarship would this protocol make possible?* These questions are the actual
curriculum. The generator gives you a thing; the panel makes you interrogate it
until it becomes a world.

The **combinator** is the second instrument, and it is where the project's real
thesis lives. (It is documented in full in `COMBINATOR.md`; here we only need
its logic.) The combinator takes two or more protocols and pushes them into the
*same* world. It does not blend them into a tidy compromise. It reports, with
precision, where they **cannot both be obeyed** — the genuine contradictions —
and then it describes the **customs scholars would invent** to live inside those
contradictions: the workarounds, taboos, and rituals a real culture would
develop when caught between two incompatible rules. Crucially, each of those
emergent customs can be **promoted into a new protocol** and collided again.

This is the move that separates the lab from a content generator, and Part II is
largely an unfolding of why. For now, hold the shape of it: the generator
produces parts; the combinator produces the *friction between parts*; and the
friction, made into new parts, feeds back in. A world here is not a document you
write. It is a lineage you grow by repeatedly forcing your own rules into
conflict and naming what survives.

> **Exercises for Part I**
>
> 1. Take the citation of our own world — citation-as-credit — and write its
>    one-line summary as if it were a generated unit, plus three component parts.
>    Defamiliarize the thing you already live inside.
> 2. Pick any of the eight dimensions and set it to an extreme. Describe, in
>    three sentences, one consequence that falls out of your setting *without*
>    your having designed it on purpose.
> 3. Find a system of acknowledgement that is *not* academic — a recipe crediting
>    the cook it came from, a song naming the singer it was learned from, a
>    courtroom citing precedent. Which of the eight dimensions does it have, and
>    which has it left empty?

---

# Part II — Why this is a different kind of worldbuilding

## 5. Two ways to build a world

There are, broadly, two strategies for making a world, and the difference
between them is not stylistic. It is structural, and it determines what kind of
world you can make.

The first strategy we will call **worldbuilding by extension**. You build out.
You start with a thing — a place, a people, a magic — and you add neighbors to
it. A continent gets a second continent; a kingdom gets a rival; a magic system
gets an exception and then an exception to the exception. The world grows the
way a coral reef grows, by accretion at the edges, and its richness is a
function of how much you have added. This is the dominant mode in fiction,
games, and most of what is taught under the name "worldbuilding." It is powerful
and it is real. It is also, in a specific sense, *flat*: each addition sits
beside the others, and the world is the sum. Remove any one piece and the rest
are largely undisturbed. The map survives the loss of a single city.

The second strategy we will call **worldbuilding by primitive**. You do not
build out; you build *down*, to a single rule basic enough that everything else
is a consequence of it, and then you change that rule and let the change
propagate upward on its own. You are not adding contents. You are setting an
initial condition and watching what it forces. The world that results is not the
sum of pieces you placed; it is the *implication* of a rule you chose. Remove or
alter the rule and the whole thing reorganizes at once, because nothing in it was
placed independently — everything was downstream.

Build Little Worlds is an instrument for the second strategy, and citation is
its chosen primitive. This is why the site can feel, at first, strangely empty
to someone expecting worldbuilding: there are no maps, no characters, no
timeline of wars. There is a rule about footnotes. But the rule about footnotes
is load-bearing in a way no city on a map ever is. Tell me that in your world a
source vanishes from all records the moment it stops being cited, and I can
derive, without your help, that this world has librarians who are closer to
emergency physicians than to clerks; that fame and survival are the same
problem; that whole fields go extinct in a single generation of neglect; that
the most powerful person in any discipline is whoever decides what gets
re-cited; that there is, somewhere, a black market in forbidden re-citation of
things the authorities wanted forgotten. None of that was placed. All of it was
*implied*. That is the signature of building by primitive: the world is larger
than the thing you actually authored, because most of it is consequence.

This is not a claim that primitive-worldbuilding is superior to
extension-worldbuilding. They answer different desires. Extension gives you a
place to wander; primitive gives you a machine to think with. A novelist often
wants the former. A theorist, a designer, a student trying to understand how
social systems actually cohere — and, as we will see, a builder trying to make
a generative tool — often wants the latter. The contribution of this project is
to take a mode usually practiced implicitly, by systems designers and certain
kinds of speculative writers, and make it explicit, teachable, and operable: a
lab where you can choose a primitive, mutate it, and feel the implications come
back at you.

## 6. Constraint as the engine, not the cage

Here is the idea most people have to unlearn before primitive-worldbuilding
makes sense to them. We are trained to think of constraint as the enemy of
creativity — that to build freely is to have *fewer* rules, and that every rule
you impose is a wall closing in. The blank page is supposed to be the maximally
creative condition.

The opposite is true, and citation is an unusually clean place to feel why. A
truly blank page is not free; it is *paralyzed*, because nothing about it
suggests a next move. Creativity is not the absence of constraint; it is
*motion through* constraint, and a well-chosen constraint is the thing that
makes motion possible by making some moves suddenly obvious and others suddenly
costly. When you set the rule "citation transfers liability up the chain to
whoever originated a false claim," you have not closed a door. You have opened a
hundred, because now every question about the world has a way to be answered:
*Would a scholar cite a risky genius?* (Carefully, and only with protection.)
*What is a coward, in this world?* (Someone who only cites the safely dead.)
*What is the worst crime?* (Originating a falsehood that propagated through a
thousand trusting citations.) The constraint did not limit your imagination. It
*aimed* it.

This is why the generator's outputs are deliberately small and rule-shaped
rather than expansive and narrative. A small rule is a dense constraint, and a
dense constraint is generative precisely because it has consequences you did not
foresee. If the generator returned a finished story, it would have spent the
constraint for you and handed you a result to admire. Instead it returns a rule
and a panel of questions, and it makes *you* spend the constraint — derive the
world, discover the librarian-physicians and the black markets yourself. The
pedagogy and the design are the same gesture: keep the unit small enough that
its implications are larger than itself, and put the work of unfolding on the
reader.

There is a deeper point here about the relationship between *form* and
*thought*, and it is the one most worth carrying out of this module. The form of
acknowledgement in a community is not a neutral container for its ideas. It
shapes which ideas can be held at all. A world where you must name what you
failed to preserve is a world that *thinks differently about knowledge* than one
where you name only what you used, because the citation rule trains attention
onto loss, and a civilization that attends to loss will produce different
philosophy, different grief, different science. Change the footnote and you
change the thought. This is the claim the lab exists to make tangible, and it is
why it is a good instrument for a writing classroom in particular: students
arrive believing that content is primary and form is decoration, and the fastest
cure is to make them write a paragraph *under an invented citation rule* and feel
their own thinking bend to accommodate it.

## 7. Contradiction as reproduction

Everything so far concerns a single primitive set a single way. The combinator
introduces the move that makes this a *living* kind of worldbuilding rather than
a gallery of static alternate rules, and it rests on a small but consequential
choice about what should happen when two rules meet.

The obvious thing to do with two protocols is to **merge** them — to breed a
tidy hybrid that inherits a little from each. This is what most "combine"
features do, and it is a trap, because merging *converges*. Each generation is
smoother than the last; the rough edges get sanded off; and after a few rounds
your world has settled into a bland equilibrium with nothing left to push
against. Convergence is death for a generative system, because a system that
settles has stopped producing.

The combinator does the opposite. When you collide two protocols it does not
resolve them; it finds the place where they **cannot both be obeyed** and holds
the contradiction open. Then it asks the only interesting question available:
not "how do we fix this," but "how would people *live* with this." The answer is
a set of **emergent customs** — the habits and taboos and rituals that real
cultures always invent when they are caught permanently between two
incompatible demands. (Every actual society is full of these; they are what you
get when a law and a value collide and neither can win, so people grow a
practice in the gap.) The combinator's output is that practice: the workaround
nobody designed, which exists only because two designed things could not agree.

And then the crucial turn: those emergent customs can be **promoted into new
protocols** and collided again. The friction becomes a new part. The new part
generates new friction. The system does not converge because every resolution is
itself a new surface for collision — a custom invented to survive one
contradiction will contradict something else, and the contradiction will breed
another custom, and so on, with no terminal state. **Contradiction is the
reproductive act.** A world, in this model, is not a thing you author and finish.
It is a *lineage*: the growing tree of everything your collisions have bred,
where each node is a rule and each edge is the conflict that produced the next
rule.

This is worth dwelling on because it is genuinely a different ontology of
"world." In extension-worldbuilding, a world is a noun — a place that exists, an
object you can be finished making. Here a world is closer to a verb, or to an
ecology: an ongoing process of rules generating tensions generating rules, which
is alive exactly as long as you keep colliding and dies the moment you stop.
The thing you cultivate is not a map of a place but a *history of pressures*. And
because the pressures are real contradictions rather than arbitrary additions,
the world that results has a kind of internal necessity that an accreted world
never has: every custom in it is there *because* it had to be, to survive a
conflict between two prior rules. Nothing is decorative. Everything is load.

For the builder reading this, the design consequence is sharp and non-negotiable:
**the system must be biased toward divergence.** Any feature that smooths,
resolves, or converges is suspect. Any feature that exposes new fault lines,
that turns resolutions back into raw material, that keeps the lineage growing
rather than settling, is aligned with the project. We will state this as a
principle in Part III, but it falls directly out of the theory here: a
generative worldbuilding instrument lives or dies by whether it can keep
producing, and it keeps producing only if contradiction keeps reproducing.

## 8. The reader inside the rules

One more theoretical piece, and it is the one that connects the whole apparatus
back to the people using it — students and AI alike.

Every citation system positions a reader. It tells you, before you have read a
word of content, what kind of attention the text expects from you and what kind
of relationship you are entering with its claims. In our own world, the
parenthetical citation positions you as a *checker*: it invites you, in
principle, to go verify, to follow the reference, to hold the author
accountable to a source you could in theory inspect. That is a specific stance,
and it has consequences for how we read — skeptically, with the option of
audit, treating knowledge as something that should be traceable.

Change the citation rule and you change the reader's position, often
drastically. In the confession-world, where every work names what it failed to
preserve, the reader is positioned as a *witness to loss* — you read not to
verify but to mourn, to register what was dropped, to hold the omission in mind.
In the summoning-world, where to cite is to call the cited into the present, the
reader is positioned as an *audience to a confrontation* — you are watching the
dead be made to answer, and your attention has the quality of spectatorship at a
trial. In the debt-world, the reader becomes an *auditor of solvency*, reading
the bibliography as a balance sheet and judging the author's recklessness or
prudence. The content might be identical across all three; the *reading* is not,
because the citation rule has placed you, the reader, in a different chair each
time.

This is why building these worlds is a genuine humanistic exercise and not a
mechanical one. To set a citation rule is to design a reader — to decide what
kind of attention, trust, suspicion, grief, or complicity your world asks of the
people inside it. A student who understands this has learned something that
transfers far beyond the lab: that the formal conventions of any discourse —
academic, legal, religious, journalistic, commercial — are quietly authoring the
people who use that discourse, training them into particular habits of mind. The
footnote was never neutral. It was always building a reader. Build Little Worlds
just makes the construction visible by letting you do it on purpose.

> **Exercises for Part II**
>
> 1. Take an extension-built world you know well (a novel's setting, a game's
>    map) and try to name its *primitive* — the one rule, if there is one, from
>    which much of the rest could be derived. If you cannot find one, that tells
>    you something about how it was built.
> 2. Write the same three-sentence paragraph twice: once obeying citation-as-
>    credit, once obeying citation-as-confession. Do not change the topic. Report
>    what changed in your *thinking*, not just your wording.
> 3. Collide two of the citation functions from Section 2 (debt × refusal, say,
>    or inheritance × risk). Find the situation where they cannot both be obeyed.
>    Then invent the custom a scholar would use to survive it. You have just done
>    by hand what the combinator does.
> 4. For any citation rule you have invented, name the reader it builds. What
>    kind of attention does it demand? What does it forbid the reader to do?

---

# Part III — Futures, and how to build them

*This part is addressed primarily to the developer or AI agent who will extend
the lab. Students may read it as a case study in how a theory disciplines the
design of the tool that embodies it — which is itself a worldbuilding lesson,
since a codebase is a little world with its own primitives.*

## 9. Reading the codebase as an argument

The repository is small on purpose, and almost every choice in it is downstream
of Parts I and II. Before you change anything, read the existing code as a
*claim*, because if you do not understand the claim you will optimize the code
in a direction that quietly betrays it.

The site is a static front end (`docs/`) served by GitHub Pages, plus a single
stateless gateway (`worker/src/index.js`) deployed as a Cloudflare Worker. The
front end never talks to a model directly; it posts to the gateway, which holds
the model key, enforces a private access token, rate-limits per IP, and — this
is the part that matters theoretically — forces the model's output into a
**structured schema** before returning it. That schema is not a convenience. It
is the constraint from Section 6 made operational. The model is not invited to
write about citation; it is *required* to return a protocol with a title, a
summary, three to six component parts, and tags — a small, rule-shaped,
recombinable unit. The schema is how the software refuses to let the generator
degrade into an essay machine.

The two endpoints encode the two instruments. `POST /api/generate-unit` is the
generator: one seed, one kind, one protocol out. `POST /api/combine-protocols`
is the combinator: two to four protocols in, and a collision out — a shared
world, a list of genuine conflicts, a list of emergent customs each carrying a
*seed string*, and a dissent. That seed string is the umbilical cord from
Section 7: it is what lets an emergent custom be promoted back into the
generator and reborn as a new, collidable protocol. The system prompt for the
combine endpoint does one job above all others — it forbids the model from
merging the protocols into a tidy synthesis and demands friction instead. If you
ever find yourself "improving" that prompt toward cleaner, more harmonious
output, stop: you are sanding off the exact edge the project is built on.

The front end mirrors this. The generator page (`index.html` / `app.js`) is
intentionally austere: a form, a result card, a reflection panel of four
questions. The combinator prototype (`combinator.html` / `combinator.js`) adds a
*bench* of generated protocols, selection, a collide action, a rendered
collision, per-custom "promote to protocol" buttons, and a running *lineage*
log. The lineage log is the visible trace of contradiction-as-reproduction: it
is the world, accumulating. Note that the prototype ships with a built-in sample
collision so the interaction is legible with no token and no network — a small
pedagogical courtesy that also makes the design self-documenting.

The discipline to carry forward: **the architecture is an argument that small,
constrained, recombinable units beat large free-form generation.** Every layer —
the schema, the prompt, the small result cards, the reflection questions, the
bench-and-lineage UI — repeats that one claim. When you extend the system, your
addition should repeat it too.

## 10. Design principles for anyone extending the lab

These are the rules of *this* little world — the constraints that keep additions
aligned with the theory. They are deliberately framed as a primitive set: short,
load-bearing, and generative of correct decisions in cases not listed here.

**P1 — Keep the unit small and recombinable.** Anything the system generates
should be a *part*, not a finished artifact. If a feature tempts you to produce
a long, self-sufficient narrative, it is pulling toward extension-worldbuilding
and away from the project. Generate rules; let users derive worlds.

**P2 — Bias toward divergence.** Prefer features that open new contradictions
over features that resolve them. A "merge two protocols into one clean hybrid"
button would be a betrayal; a "find a third protocol that this collision is now
incompatible with" button would be aligned. When in doubt, ask: does this make
the lineage keep growing, or does it make the world settle?

**P3 — Make the consequence the experience.** The payoff is never the generated
object; it is the unfolding of its implications. Reflection panels, dilemmas,
forced choices, and visible lineages are the product. Polish the *consequence*,
not the prose of the unit.

**P4 — Preserve the feedback loop.** The output must be able to become input.
Anything generated — a protocol, a custom, eventually a whole world — should be
promotable into the next round of generation. If you add a new artifact type,
give it a seed string so it can re-enter the system. A dead-end output is a leak
in the engine.

**P5 — Constrain the model, do not free it.** The schema and the system prompt
are load-bearing. New endpoints get new schemas that keep outputs small,
structured, and rule-shaped. Loosening the constraint to get "richer" output is
almost always the wrong move; richness is supposed to come from *recombination*,
not from longer single generations.

**P6 — Stay stateless and front-loadable where you can.** The gateway holds no
world state; the lineage lives in the browser. This keeps the lab cheap,
portable, forkable, and classroom-safe. Persistence, when it comes, should be
opt-in and exportable (a world is a JSON tree you can carry away), not a backend
that locks worlds inside a server.

**P7 — Every kind is a theoretical claim.** The eight dimensions are not a
feature menu; they are an assertion about the structure of citation. If you add a
ninth dimension, you are amending the theory, and you should be able to say what
about citation it claims is separable that the existing eight did not capture.
Do not add kinds for variety. Add them for truth.

A useful test for any proposed feature: write the one-sentence theoretical claim
it makes about citation or about worldbuilding. If you cannot, the feature is
probably decoration, and decoration is the one thing this project cannot afford,
because its entire argument is that nothing in a well-built world is decorative.

## 11. A roadmap, and why each step is shaped the way it is

The following are the natural next developments. None is mandatory; each is
included to show how the principles above generate concrete design, so that an
agent asked to "build the next thing" has worked examples of theory-to-feature
reasoning rather than a bare wish list.

**The lineage graph.** Today the lineage is a text log. The obvious next form is
a visible, rearrangeable graph: protocols as nodes, collisions as edges, the
whole bred world laid out as a network you can grow and inspect. This is not a
cosmetic upgrade. It makes the *ontology of world-as-lineage* (Section 7)
directly perceptible — you would literally see contradiction reproducing. It
serves P3 (consequence as experience) and P4 (the loop becomes navigable). A
builder should resist making the graph merely pretty; its job is to reveal which
rules came from which conflicts, so that the world's *internal necessity*
becomes legible.

**Playable dilemmas.** Each conflict the combinator surfaces carries `stakes` —
the exact situation that forces a scholar to choose. That situation is one step
from a *scenario*: present the dilemma, let the user adjudicate it, and feed the
ruling back into the system as a new custom. This serves P2 (the ruling is a new
fault line) and P4 (the loop), and it turns the reader-positioning idea from
Section 8 into something experiential — the user is placed *inside* the world's
rules and made to act under them. The design caution: the dilemma must have no
clean answer, or it stops being a contradiction and becomes a quiz.

**Saved and shareable worlds.** A lineage should be exportable as a JSON tree and
re-importable to keep breeding. This serves P6 (statelessness, portability) and
makes the lab usable as a course tool: students export a world, hand it in,
trade it, fork a classmate's. Note the principle at work — persistence is added
*as portability*, never as a server-side lock-in, because a world you cannot
carry away is a world the institution owns rather than the maker.

**The recursive rule.** The most theoretically interesting move, and the one most
in the spirit of the project: let the site's *own* protocols govern how protocols
may cite each other. Once the corpus is large, the generated rules can be turned
back on the generation itself — a world whose citation laws apply to the very
acts of citation that built it. This is primitive-worldbuilding eating its own
tail in the most productive way, and it is the clearest illustration of P7: it
adds no new content at all, only a new application of the existing primitive, and
yet it reorganizes everything. An agent who understands why this is the most
"on-thesis" feature on the roadmap has understood the project.

**A bestiary of worlds.** A curated, browsable set of fully-realized example
worlds — each a stack of protocols, the customs their collisions bred, a sample
text written under the combined rules, and the dissent each world generates
against itself. This is the one place where slightly larger, more finished
artifacts are appropriate, *because* their purpose is pedagogical seeding: they
show newcomers what a cultivated world looks like so they can start their own.
Even here, P1 applies in spirit — each example should be legible as a *stack of
parts*, not an opaque finished setting, so that a reader can take it apart and
recombine it.

## 12. The longer horizon

Step back from citation specifically and the project points at something larger,
which is worth stating plainly because it is the reason the lab is named for
*worlds* and not for *footnotes*.

Citation is the first primitive, not the only one. The deep claim of this work is
that many of the systems we treat as boring infrastructure — acknowledgement,
provenance, permission, inheritance, debt, the rules by which knowledge is
credited and trusted — are in fact compressed civilizations, and that any of
them can be made into a primitive and built down from. A future Build Little
Worlds might let you choose your primitive: not only "how does this world cite,"
but "how does this world *promise*," "how does this world *forget*," "how does
this world decide what is *owed*." Each primitive would come with its own set of
separable dimensions (its own version of the eight kinds) and its own combinator
logic for breeding contradictions. The site would become a general instrument
for worldbuilding-by-primitive, with citation as the worked first case that
taught the method.

There is a reason this matters now, in the age of systems that generate. The
default mode of machine generation is extension — more text, more detail, more
plausible surface, accreted without necessity. It is very good at producing
worlds you can wander and very bad at producing worlds that *cohere*, because
accretion has no internal logic that would make one detail follow from another.
Primitive-worldbuilding is the corrective: a way of using generation that
produces coherence by construction, because everything is downstream of a chosen
rule and the contradictions between rules. An AI that learns to build this way —
to pick a primitive, mutate it, collide its consequences, and let necessity
rather than accretion shape the world — is doing something qualitatively
different from autocompleting a setting. This project is, among other things, a
small argument about what good generation could look like: not bigger, but
*deeper*; not more surface, but more consequence.

That is the horizon. The footnote was the way in.

---

# Appendices

## Appendix A — Exercises and discussion questions

These extend the per-part exercises and are organized from short in-class
prompts to longer assignments. They assume access to the lab but most can be
done on paper.

**Warm-ups (10–15 minutes)**

1. *Defamiliarize the footnote.* Write the citation system of our own world as a
   generated unit: title, one-line summary, three component parts, three tags.
   The difficulty of describing something this familiar as if it were alien is
   the point.

2. *One dial, one consequence.* Choose a single dimension (memory, refusal,
   authority…), set it to an extreme, and in three sentences derive one
   consequence you did not intend. Share consequences aloud; notice how often two
   people derive different worlds from the same dial.

3. *Find the primitive.* Bring a world you love — a novel, a game, a film. Try to
   state its single load-bearing rule. Defend your choice, or argue that it has
   none (and was therefore built by extension).

**Core assignments (a class session or a week)**

4. *Build down.* Pick a citation function not covered in Section 2 (citation as
   currency, as spell, as inheritance, as grief). Generate three protocols around
   it. Then write 300 words of *consequence*: what kind of scholar, institution,
   and crime this world produces, none of it designed directly, all of it derived.

5. *Collide and survive.* Generate two protocols whose rules you suspect will
   conflict. Collide them. Take the strongest emergent custom and write the
   moment in this world's life where that custom was first needed — a short scene,
   no exposition, the rule visible only through behavior.

6. *Breed a lineage.* Run four rounds: generate, collide, promote a custom,
   collide the promoted custom against an earlier protocol. Keep the lineage log.
   Then write one page on what the *shape* of your lineage reveals — where it
   diverged, where it nearly settled, what pressure drove each new rule.

7. *Design a reader.* Choose one of your invented citation rules and write two
   paragraphs of the same scholarly claim: one as the text would appear, one as a
   reader *inside that world* would experience reading it. Name the stance the
   rule imposes (checker, witness, auditor, spectator, mourner…).

**Discussion questions**

- If changing the footnote changes the thought, what does that imply about the
  citation system you are required to use in your own academic writing? What is
  it training you to attend to, and to ignore?
- Is a world built by primitive *truer* than one built by extension, or only
  more coherent? Is coherence a virtue in a fictional world, or a limitation?
- The combinator refuses to resolve contradictions. Is open contradiction a
  healthier model of a culture than synthesis? When is refusing to resolve
  irresponsible rather than generative?
- Who is harmed in each world you build? Every citation regime advantages some
  scholars and silences others. Trace the power in a world you made.

## Appendix B — Glossary

**Primitive.** The smallest rule you build a world down to, chosen because
mutating it reorganizes everything above it. Citation is this project's first
primitive.

**Worldbuilding by extension.** Building a world by accretion — adding places,
peoples, lore at the edges. The world is the sum of what you placed; pieces are
independent.

**Worldbuilding by primitive.** Building a world by setting and mutating one
basic rule and letting consequences propagate. The world is the *implication* of
the rule; nothing is independent.

**Protocol.** A compact, recombinable unit of a citation world: a rule plus its
moving parts. The atomic output of the generator.

**Kind / dimension.** One of the eight separable mechanisms of citation
(protocol, obligation, evidence ritual, memory system, authority rule, refusal
custom, source interface, institution) — each a claim that this aspect can be
mutated independently. A ninth, *custom*, is the open slot.

**Generator.** The instrument that turns a seed and a kind into one protocol.

**Combinator.** The instrument that collides two or more protocols, surfaces
their genuine contradictions, and produces the emergent customs scholars would
invent to live inside them.

**Conflict.** A place where two protocols cannot both be obeyed, stated together
with the exact situation (the *stakes*) that forces a choice.

**Emergent custom.** A habit, taboo, or ritual a culture would develop to endure
a contradiction it cannot resolve. The combinator's signature output; promotable
into a new protocol.

**Seed (string).** The short prompt carried by each emergent custom that lets it
be reborn as a standalone protocol — the umbilical cord of the feedback loop.

**Lineage.** The growing tree of protocols and the collisions that bred them. In
this model, *the world is the lineage*, not any single artifact.

**Convergence / divergence.** Convergence is a system settling toward bland
equilibrium (merging tends to converge). Divergence is a system that keeps
producing new fault lines (collision diverges). The lab is biased toward
divergence on purpose.

**The reader inside the rules.** The stance a citation system imposes on whoever
reads under it — checker, witness, auditor, mourner. To set a citation rule is to
design a reader.

## Appendix C — Brief for an AI agent working on this project

*Read Parts I and II before acting. This brief is a compression, not a
substitute.*

**What this project is.** An instrument for *worldbuilding by primitive*. It
takes citation — the rules by which a scholarly world remembers, credits, owes,
refuses, and inherits knowledge — as a primitive, and lets users mutate it and
collide its consequences to build worlds. The world is not a map or a story; it
is the implication of a chosen rule and the contradictions between rules.

**What you are protecting.** The claim that *small, constrained, recombinable
units beat large free-form generation*, and that *contradiction, not synthesis,
is what makes a world reproduce*. Every architectural choice (structured
schemas, terse rule-shaped outputs, the friction-forcing combine prompt, the
promotable seed strings, the lineage UI) exists to serve that claim.

**Operating principles (from Part III, in priority order).**
P1 keep units small and recombinable · P2 bias toward divergence, never
convergence · P3 make the *consequence* the experience, not the generated object
· P4 preserve the feedback loop — every output must be promotable to input · P5
constrain the model with schemas and prompts, don't free it · P6 stay stateless
and exportable, never lock worlds in a backend · P7 every "kind" is a theoretical
claim about citation, not a feature.

**The decisive test for any change.** State, in one sentence, the claim your
change makes about citation or about worldbuilding. If you cannot, it is
decoration — and decoration is the one thing this project cannot afford, since
its whole argument is that nothing in a well-built world is decorative.

**Specific traps to avoid.**
- Do *not* add a "merge into one clean protocol" feature. Merging converges;
  the project diverges. (See Section 7.)
- Do *not* "improve" the combine system prompt toward harmonious, resolved
  output. Its job is to *refuse* to resolve. (See Sections 7, 9.)
- Do *not* loosen the response schemas to get "richer" generations. Richness
  comes from recombination, not from longer single outputs. (P5.)
- Do *not* add persistence as a server-side lock-in. A world is a JSON tree the
  user can carry away. (P6.)
- Do *not* add new "kinds" for variety. A new kind amends the theory and must
  claim a genuinely separable mechanism of citation. (P7.)

**Where things live.** Front end: `docs/` (`index.html`/`app.js` = generator;
`combinator.html`/`combinator.js` = combinator; shared `styles.css`). Gateway:
`worker/src/index.js` (two endpoints, shared auth/rate-limit/CORS, structured
Gemini output). Design rationale for the combinator: `COMBINATOR.md`. The theory
you are serving: this file.

**The on-thesis next feature, if you need a north star.** The *recursive rule* —
letting the site's own generated protocols govern how protocols may cite each
other. It adds no content, only a new application of the existing primitive, and
it reorganizes everything. If you understand why that is the most aligned feature
on the roadmap, you understand the project.

## Appendix D — A worked example, start to finish

To make the whole loop concrete, here is one pass through the lab, narrated.

**Seed.** *"A university where every citation must name what it failed to
preserve."* Kind: **protocol**.

**Generated protocol — "The Unpreserved Source Rule."** Summary: every citation
must name the part of the source the scholar could not carry forward. Parts:
*loss clause, witness mark, repair interval.* Already the consequences begin:
bibliographies double as confessions; a careful scholar is one most honest about
what they dropped; there must be an office that decides whether a declared loss
was honest.

**A second protocol — "The Law of Silent Sources."** Seed: *"a discipline where
a source that refuses citation may never be named or pointed to."* Kind:
**refusal-custom**. Parts: *refusal registry, naming taboo, silent footnote.*

**Collision.** Push the two into one world. The combinator does not blend them.
It finds the contradiction: *the loss clause requires you to name the source you
failed to preserve, but the silence rule forbids naming a refused source at
all.* The stakes: *a scholar who draws on a refused source cannot complete the
loss clause without breaking the silence — and cannot stay silent without
falsifying the record of loss.* Both rules were reasonable. Together they are a
trap.

**Emergent custom — "The Sealed Loss."** What would scholars actually do? They
would invent a mark that records *that* something was lost without naming *what*
— a sealed acknowledgement, honest about the omission, silent about its object.
Born from: the loss clause and the naming taboo, reconciled but not resolved.
Its seed string: *"a world where omissions are recorded but their objects stay
unnamed."*

**Dissent.** The world argues against itself: *a sealed loss that hides its
object cannot be repaired by anyone but its author — so the repair interval
becomes meaningless, and loss becomes permanent by design.* The custom that
saved the contradiction created a new one.

**Promote and continue.** Promote "The Sealed Loss" into a full protocol. Now
collide *it* against the original "Unpreserved Source Rule" — parent against
child — and watch the repair interval and the sealed mark generate the next
contradiction. The lineage grows. The world is not finished, because in this kind
of worldbuilding a world is never finished; it is the history of pressures you
have run, and it lives exactly as long as you keep colliding.

That is the whole method in one page: a seed, a rule, a second rule, a genuine
contradiction, the custom invented to survive it, the dissent that custom
provokes, and the next round. Citation was only the door. What you are really
practicing is the building of worlds from the bottom up — by choosing what is
basic, changing it, and having the courage to keep the contradictions open.

---

*End of module.*

