# Two Dogmas of DNS

*or: a name has no address*

> The totality of our so-called knowledge or beliefs … is a man-made fabric which impinges on experience only along the edges.
>
> — W. V. O. Quine, "Two Dogmas of Empiricism"

Juliet's wager, in Shakespeare, is that a name is a light garment. The rose would keep its sweetness under any other word; the thing holds its qualities, and the name merely visits. A web address inverts the wager. Strip away the web of other names that `www.buildlittleworlds.com` leans on — the delegations, the aliases, the authorities that agree to answer for it — and there is no scent left at all. No address, no place, nothing. The qualities were never in the name.

Here is the record behind this site:

```text
www.buildlittleworlds.com. CNAME buildlittleworlds.github.io.
```

Ask the Domain Name System where this name lives, and it does not answer with an address. It answers with another name. Follow that name and you are handed to another authority, which may hand you on again, until — somewhere — a name finally gives way to a number. The address you wanted was never a property of the name you typed. It is produced, on demand, by the whole arrangement.

Quine made a version of this claim about language itself: that our statements about the world face experience "not individually but only as a corporate body." A sentence, taken alone, has no meaning-sized parcel of evidence attached to it; it has a place in a fabric, and the fabric as a whole answers to the world. This essay reads one DNS record through that one essay of his. To be clear about the method: this is a deliberate reading, not a historical claim — the engineers who built DNS were solving operational problems, not doing epistemology, and nothing below pretends otherwise. The wager is only that their solution and his picture have the same shape, and that each makes the other easier to see.

Quine's title named two dogmas. DNS has its own pair. The first is the everyday assumption that the address is *in* the name — that somewhere inside `www.buildlittleworlds.com` an address inheres, waiting to be looked up, the way we imagine a meaning sitting inside a word. The second is the belief that beneath all the aliases there is, or ought to be, one canonical book in which every name is tied directly to its number. The first dogma dies the moment you watch a resolver work. The second is more interesting, because the internet actually built it — and then had to kill it.

## The reductionist dream: one book of names

In the early ARPANET, the book existed. It was called `HOSTS.TXT`, and RFC 1034 describes the arrangement plainly: a single host-name-to-address file, maintained by the Network Information Center, which every host on the network copied down by FTP.

Feel the appeal of that before dismissing it. One file, one authority, every name bound individually and directly to its number. Any question about naming could be settled by looking in one place. The book was a foundation — the ground floor of the network's knowledge of itself, the naming world's version of the *given*.

And it could not survive. The network grew, and the bandwidth needed to ship the file everywhere grew with it. Organizations wanted to administer their own names without petitioning a central editor. The file was stale the moment it finished copying. The failure was not clerical but structural: a single canonical book requires that naming be small, slow, and centrally owned, and the network was becoming none of those things.

Quine's second dogma — the one he called reductionism — was the belief that each meaningful statement can be traced down, individually, to its own parcel of immediate experience. The internet's version was the belief that each name could be traced down, individually, to its own line in one file. Both pictures fail the same way: not because any single lookup goes wrong, but because the world outgrows the idea that facts come one at a time, each with its own private anchor.

## The web replaces the book

What replaced `HOSTS.TXT` was not a bigger file. It was a different kind of thing altogether: a hierarchical namespace, delegated authority, local administration, caches with expiry, and resolvers that walk the tree. No universal list survives anywhere in the design. The trace of this site shows the structure in miniature (recorded from the public DNS on July 4, 2026):

```text
$ dig +trace www.buildlittleworlds.com A
.                         NS a.root-servers.net.
com.                      NS ...
buildlittleworlds.com.    NS ns1.dns-parking.com.
buildlittleworlds.com.    NS ns2.dns-parking.com.
www.buildlittleworlds.com. 300 IN CNAME buildlittleworlds.github.io.
```

Walk it. The root does not know where this site is; it knows who answers for `com.`. The `com.` servers do not know either; they know who answers for `buildlittleworlds.com.`. Those nameservers finally answer for `www` — and their answer is not an address but another name. At no single node in this walk does the fact of *where this site lives* reside. Every authority contributes one deferral, and the answer is a property of the whole chain, produced fresh each time someone asks.

This is the holist picture, made walkable. The name has no address to hold. It has a place in a web that answers on request — and the web, not the name, is where the knowing happens.

## The edge, where the web touches ground

But it cannot be aliases all the way down. Complete the query and the deferrals run out:

```text
$ dig +noall +answer www.buildlittleworlds.com A
www.buildlittleworlds.com. 300 IN CNAME buildlittleworlds.github.io.
buildlittleworlds.github.io. 30 IN A 185.199.108.153
buildlittleworlds.github.io. 30 IN A 185.199.109.153
buildlittleworlds.github.io. 30 IN A 185.199.110.153
buildlittleworlds.github.io. 30 IN A 185.199.111.153
```

The last four lines are A records: a name giving way, at last, to bare numbers — routable addresses at which packets can actually arrive. A chain of CNAMEs must terminate in something like this. The web of names impinges on the world of number only here, at its edge.

DNS enforces the edge in a second place, and the enforcement is philosophically exact. The apex of a zone — `buildlittleworlds.com` itself, without the `www` — cannot be a CNAME. RFC 1034 rules that where a CNAME is present, no other data may be; and the apex must carry the zone's own SOA and NS records, the records by which the zone exists at all. So the base of a domain cannot be a pure deferral. Something down there has to be a fact and not another alias. Lewis Carroll's Tortoise taught the same lesson about inference: if every step needs a further step to license it, nothing ever gets concluded — the regress has to stop. DNS stops its regress by decision: every resolver ships with the root hints, a short file of root-server names bound to hardcoded IP addresses, so that the walk of names has somewhere to stand before it takes its first step. The ground floor of the web of names is, quite literally, a handful of numbers held true by agreement.

## Canonical is a decision, not a discovery

The record's own vocabulary invites a misreading. RFC 1035 says the CNAME's data names the *canonical* name for which the owner is an alias — and "canonical" sounds like a finding, as though DNS had peeled back the public name and discovered the true one underneath.

Nothing in the names supports that. `buildlittleworlds.github.io` is not intrinsically more real than `www.buildlittleworlds.com`; it is canonical because a zone file says so, and the zone file can say otherwise. Re-point the alias — one edited line — and a different name becomes canonical, provided the rest of the web is adjusted to agree: the new target must exist, resolve, and consent to answer. That is Quine's most quoted move wearing operational clothes: a claim can be held true, come what may, if we make adjustments elsewhere in the system. Canonicity in DNS is exactly such a claim — assigned, held, and revisable, never discovered.

The record even publishes the terms of its own revisability. The `300` after the name is a TTL, a time to live in seconds: any resolver may treat this answer as true for five minutes, after which it must ask again. A DNS name is neither an eternal identity nor a momentary improvisation. It is a claim with a lease — held true *for now*, by an authority that reserves the right to change its mind, in a system built to notice when it does.

Two honesties are owed here. First, the revisability is bounded. The apex rule is a real constraint, not a formality: you cannot declare the root of your zone to be a pure alias, because something must carry the zone's own records. Choice runs nearly free in the middle of the web and runs out at the edge — which is just where Quine put the limit too, since the fabric may be man-made but the edges are where experience pushes back. Admitting the bound does not weaken the reading; the bound *is* the edge, showing up as engineering. Second, an aside for readers who know the philosophy of language: there is another way to read an alias and its canonical name — as a puzzle of *reference*, of how a name reaches its bearer at all, the territory of Frege's morning star and Kripke's rigid designators. That is a different lens and would make a different essay. This one stays with the web.

## The widening

So: when does a name become a place?

The two dead dogmas give the answer its shape. Not by containing an address — the first dogma is false; the name holds nothing. Not by being registered in the one true book — the second dogma's book is forty years gone. A name becomes a place only *inside a web*, and only *at the edge*: it must hold a position in a fabric of delegating authorities, and that fabric must, somewhere, touch the world of number.

This site's own arrangement shows how distributed the fabric is. A registrar has the domain on lease. Two nameservers answer for the zone. A DNS record aliases `www` to GitHub Pages. And inside this repository sits a one-line file, `docs/CNAME`, containing `www.buildlittleworlds.com` — the host's side of the agreement, telling GitHub which public name this site may answer for. The DNS record and the repository file mirror each other from opposite sides of deployment, and the site exists in their agreement. Its identity is not stored anywhere in the middle. It is distributed across authorities that could each, separately, withdraw — and it is real only where the last alias becomes a number and a server actually answers.

That is a miniature theory of hosted identity: a public work is a position in a web of arrangements, grounded nowhere in the middle, real only at the edges.

## The calm surface

The browser tells you none of this. The address bar shows one serene name; the page arrives; the name looks like a place the way a word looks like it simply has a meaning.

Gérard Genette gave literature a word for the machinery under that calm: *paratexts* — the titles, imprints, and thresholds through which a work is presented to the world and without which it cannot arrive. The address bar is such a threshold. But Quine adds what Genette's thresholds alone do not say: the thresholds hold nothing individually. Each name in the chain — the alias, the canonical name, the nameservers, the root — carries no address of its own, the way no thread of a fabric carries the fabric's shape. What you cross, when you type this site's name, is the visible hem of a man-made web that is all delegation and no center, touching ground only along its edges — where the last alias gives way to a number, and the name, at last, becomes a place.

## Sources

- W. V. O. Quine, "Two Dogmas of Empiricism," *The Philosophical Review* 60 (1951); reprinted in *From a Logical Point of View*
- [RFC 1034: Domain Names - Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034.html)
- [RFC 1035: Domain Names - Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035.html)
- [RFC 2181: Clarifications to the DNS Specification](https://www.rfc-editor.org/rfc/rfc2181.html)
- [IANA: Root Files (root hints)](https://www.iana.org/domains/root/files)
- [GitHub Docs: Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- Lewis Carroll, "What the Tortoise Said to Achilles," *Mind* 4 (1895)
- Gérard Genette, *Paratexts: Thresholds of Interpretation*
- [Stanford Encyclopedia of Philosophy: Willard Van Orman Quine](https://plato.stanford.edu/entries/quine/)
