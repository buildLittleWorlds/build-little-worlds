# A Language Model Is a Probability Distribution

A language model is a mathematical way of asking a simple question:

Given these words so far, what words are likely to come next?

That question is asked again and again. The model receives a sequence of tokens, estimates a probability distribution over possible next tokens, chooses one according to the generation settings, and then repeats the process with the new token included.

This is the basic rhythm of next-token prediction.

## What is a token?

A token is a small unit of text used by a language model. It might be a whole word, part of a word, punctuation, or another text fragment.

The model does not begin with sentences as human readers do. It begins with token sequences. It learns patterns in how those token sequences tend to unfold.

## What is a probability distribution?

A probability distribution assigns likelihoods across possible outcomes. For an LLM, that often means assigning likelihoods to possible next tokens.

For example, after the phrase:

```text
The mouse ate the
```

some continuations are more likely than others:

```text
cheese
crumb
bread
moon
```

"Cheese" is not guaranteed, but it is much more likely than "moon" in an ordinary sentence. The model is not summoning words from nowhere. It is moving through a learned landscape of linguistic likelihood.

## Why this matters theologically

Calling this statistical should not make it spiritually boring. Probability is not irrational guessing. It is a disciplined mathematical form for reasoning under uncertainty.

For Christians, the interesting question is not whether probability cheapens language. The interesting question is why language has enough order for probability to work so well at all.

LLMs reveal that words, genres, meanings, tones, and arguments form patterns at a scale no single reader could hold in mind. The model is not a soul. But the order it discovers is real enough to be studied.

Language has form. Probability helps us glimpse it.

## Sources

- [Stanford CS324: Introduction](https://stanford-cs324.github.io/winter2022/lectures/introduction/)
- [Stanford CS324: Modeling](https://stanford-cs324.github.io/winter2022/lectures/modeling/)
- [E. T. Jaynes resource hub](https://bayes.wustl.edu/)
