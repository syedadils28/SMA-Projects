# Moodline — Sentiment, Text, Emoji & OCR Analyzer

A modern, production-grade, client-side web application for analyzing sentiment, emotional tone, and linguistic nuance across text, emojis, and images with Optical Character Recognition (OCR).

---

## Features

- **Text Sentiment Analysis**: Lexicon-based deterministic evaluation with lookback negation detection (up to 3 tokens) and modifier scaling (intensifiers and diminishers).
- **Emoji Sentiment Engine**: Unicode emoji extractor with frequency-aware repetition scaling ($1 + 0.2 \times (\text{count} - 1)$) and polarity mapping.
- **Combined Analysis**: Seamlessly fuses lexical word valence with weighted emoji intensity to calculate unified compound sentiment scores.
- **Client-Side Image OCR**: Integrated with [Tesseract.js](https://tesseract.projectnaptha.com/) for local optical character recognition from JPG, PNG, and WEBP images without backend servers.
- **Fine-Grained Emotion Classification**: Maps content across 14 emotional dimensions (Happy, Excited, Love, Joy, Celebration, Appreciation, Sad, Disappointed, Angry, Frustrated, Fearful, Neutral, Curious, Doubtful).
- **Bounded Sentiment Score (-100 to +100)**: Normalized via hyperbolic compound functions for consistent, academically explainable metrics.
- **Signal Confidence (0–97%)**: Deterministic confidence score reflecting signal volume, token coverage, and emotional consistency.
- **Sarcasm & Contradiction Detection**: Flags contradictory emotional polarities (e.g., positive wording paired with irony emojis like `🙃`, `💀`, or `🙄`).
- **Interactive Analytics Dashboard**: Modern SaaS interface featuring real-time KPI cards, a precision sentiment range meter, dynamic emotion percentage bars, and token insight metrics.
- **Theme Support**: Dark mode and light mode with automatic persistence via `localStorage`.
- **Zero Backend Dependencies**: Runs entirely client-side in the browser.

---

## Project Structure

```
sentiment-text-and-emoji-analyzer/
│
├── index.html                  # Semantic, accessible HTML5 structure
│
├── css/
│   ├── style.css               # Design tokens, themes, typography, and base layout
│   ├── components.css          # UI components, cards, tabs, gauges, and meters
│   └── responsive.css          # Responsive breakpoints for desktop, tablet, and mobile
│
├── js/
│   ├── app.js                  # Main application bootstrap and event coordinators
│   ├── sentiment.js            # Core deterministic sentiment & compound engine
│   ├── emoji.js                # Emoji extraction, repetition scaling, and polarity scoring
│   ├── ocr.js                  # Tesseract.js client-side OCR processing
│   ├── ui.js                   # DOM rendering, dashboards, theme, and animations
│   └── data/
│       ├── config.js           # Central configuration, thresholds, and modifier mappings
│       ├── wordLexicon.js      # Lexical word valence and emotion category catalog
│       └── emojiLexicon.js     # Structured emoji database with polarity and sarcasm flags
│
├── assets/
│   ├── icons/                  # Application icons and marks
│   └── images/                 # Reference visual assets
│
└── README.md                   # Project documentation and formula specification
```

---

## Sentiment & Scoring Formula

The application calculates sentiment using the standard **Social Media Analytics (SMA)** normalized polarity formula:

$$\text{Sentiment Score} = \left( \frac{\text{Positive} - \text{Negative}}{\text{Positive} + \text{Negative} + \text{Neutral}} \right) \times 100$$

### 1. Signal Aggregation
- **Positive Signals ($\text{Positive}$)**:
  $$\text{Positive} = \sum \text{PosWords} + \sum (\text{PosEmojis} \times 1.5)$$
- **Negative Signals ($\text{Negative}$)**:
  $$\text{Negative} = \sum \text{NegWords} + \sum (\text{NegEmojis} \times 1.5)$$
- **Neutral Signals ($\text{Neutral}$)**:
  $$\text{Neutral} = \sum \text{NeuWords} + \sum \text{NeuEmojis}$$

### 2. Word & Modifier Scaling
Each recognized lexical word has a base valence $V \in [-4.0, +4.0]$, modified by preceding linguistic cues:
- **Negation (3-Token Lookback)**: If a negation word (`not`, `never`, `no`, `don't`, `didn't`, etc.) precedes the word, valence is inverted: $\text{val} \leftarrow \text{val} \times -0.74$.
- **Intensifiers (1-Token Lookback)**: e.g., `very` ($\times 1.30$), `extremely` ($\times 1.50$), `absolutely` ($\times 1.40$).
- **Diminishers (1-2 Token Lookback)**: e.g., `slightly` ($\times 0.60$), `somewhat` ($\times 0.70$), `a bit` ($\times 0.75$).

### 3. Emoji Repetition Factor
For each detected emoji:
$$\text{Repetition Factor} = 1 + 0.2 \times (\text{count} - 1)$$
$$\text{Emoji Contribution} = \text{PolaritySign} \times \text{Intensity} \times \text{Repetition Factor} \times 1.5$$

### 4. Classification Thresholds
- **Positive**: $\text{Final Score} \ge +5$
- **Negative**: $\text{Final Score} \le -5$
- **Neutral**: $-5 < \text{Final Score} < +5$

---

## How to Run

1. Clone or download this repository.
2. Open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
3. Alternatively, serve with any local HTTP server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js npx serve
   npx serve .
   ```
4. Access `http://localhost:8000` in your browser.

---

## Key Test Cases

| Input Message | Expected Outcome |
| :--- | :--- |
| `"I absolutely love this! 🔥❤️😍"` | **Strong Positive** ($\ge +75$), Primary Emotion: *Love / Excitement* |
| `"This is terrible 😡💔"` | **Strong Negative** ($\le -70$), Primary Emotion: *Disappointed / Sad* |
| `"The update is okay."` | **Neutral** ($-5 < \text{score} < +5$), Primary Emotion: *Neutral* |
| `"What a brilliant system 🙃💀"` | **Possible Sarcasm** warning triggered, Contradiction flag |
| `"I do not love this."` | **Negative / Reduced** sentiment via negation lookback |
| `"I am very happy!"` | **Higher positive score** than `"I am happy!"` due to intensifier scaling |
| Image with text upload | **OCR extraction** $\rightarrow$ Editable text panel $\rightarrow$ Sentiment analysis |

---

## Limitations

- **Heuristic Lexicon Nature**: This is a deterministic, rule-based lexicon and emoji heuristic analyzer, not a heavy deep-learning model (like BERT or GPT). It provides high-speed, explainable client-side scoring.
- **Academic & Evaluative Purpose**: Moodline is intended for educational, social media, and product review text analysis. It should not be used as a clinical, psychological, or medical diagnostic instrument.
- **OCR Constraints**: Recognition accuracy depends on image resolution, font clarity, lighting, and contrast.
