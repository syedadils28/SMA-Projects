# 🎯 Social Media Analytics Projects

Welcome to the **Social Media Analytics (SMA) Projects** repository. This workspace contains client-side tools and analytics engines designed to parse, extract, and interpret emotional tones, sentiments, and linguistic features from social media text, emojis, and images.

Currently, this repository features **Moodline**—a production-grade, serverless analyzer utilizing deterministic lexicons and client-side Optical Character Recognition (OCR) to evaluate content directly in the browser.

---

## 📋 Quick Navigation

- [📁 Repository Structure](#-repository-structure)
- [📊 Project Comparison](#-project-comparison)
- [🚀 Projects](#-projects)
  - [Moodline: Sentiment & Emoji Analyzer](#moodline-sentiment--emoji-analyzer)
- [🛠️ Technologies & Tools](#️-technologies--tools)
- [⚙️ Installation & Setup](#️-installation--setup)
- [▶️ Running the Projects](#️-running-the-projects)
- [🔮 Future Improvements](#-future-improvements)
- [📚 Learning Outcomes](#-learning-outcomes)
- [🤝 Contributing](#-contributing)
- [📞 Contact & Support](#-contact--support)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 📁 Repository Structure

```text
SMA Projects/
│
├── sentiment-emoji-analyzer/       # Moodline Sentiment Analyzer application
│
└── README.md                       # Repository root documentation (this file)
```

---

## 📊 Project Comparison

The repository organizes its workflows into modular and standalone formats:

| Project / Build                                                     | Purpose                                                                                           | Main Technologies                          | Data / Input                                   | Type             | Status       |
| :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------ | :----------------------------------------- | :--------------------------------------------- | :--------------- | :----------- |
| [Modular Sentiment Analyzer](./sentiment-emoji-analyzer/index.html) | Production-ready dashboard with modular stylesheet architecture and segregated engine components. | HTML5, CSS3, ES6 JS, Tesseract.js          | Plain Text, Emojis, Image Files (JPG/PNG/WEBP) | Frontend Web App | 🔵 Completed |
| [Standalone Prototype](./sentiment-emoji-analyzer/sentiment.html)   | A single-file, highly portable distribution combining all styles, configurations, and scripts.    | HTML5, Inline CSS, Inline JS, Tesseract.js | Plain Text, Emojis, Image Files (JPG/PNG/WEBP) | Frontend Web App | 🔵 Completed |

---

## 🚀 Projects

### Moodline: Sentiment & Emoji Analyzer

Moodline is a modern, high-fidelity client-side web application that implements deterministic sentiment analysis and character recognition. By running entirely inside the web browser, it ensures maximum performance and complete data privacy, as no user content is sent to external servers.

- **Project Folder:** [`sentiment-emoji-analyzer`](./sentiment-emoji-analyzer)
- **Main Entry Point:** [`index.html`](./sentiment-emoji-analyzer/index.html)

#### 📝 Overview

Moodline takes raw user text or images containing text, runs client-side Optical Character Recognition (OCR), and extracts linguistic tokens. It then applies a VADER-inspired lexicon scoring model to assess semantic sentiment while factoring in linguistic modifiers (intensifiers, diminishers), lookback negation, emoji polarity, and sarcasm indicators.

#### ✨ Key Features

- **Modular and Standalone Options:** Choose between a highly organized modular code structure (`index.html` loading segregated CSS/JS) and a completely self-contained page (`sentiment.html`).
- **Text Sentiment Engine:** Lexicon-based deterministic evaluation with lookback negation detection (up to 3 tokens) and modifier scaling (intensifiers and diminishers).
- **Emoji Sentiment Engine:** Evaluates emoji contribution weighted at 1.5x word valence, with diminishing returns scaling for repetitive emojis to prevent artificial score inflation.
- **Linguistic Nuance Detection:** Flags contradictions and potential sarcasm (e.g. positive words paired with irony emojis like `🙃` or `💀`).
- **Client-Side Image OCR:** Integrated local OCR powered by Tesseract.js, accepting JPG, PNG, and WEBP image uploads.
- **Granular Emotion Distribution:** Maps text signals into 14 emotional dimensions (Happy, Excited, Love, Joy, Celebration, Appreciation, Sad, Disappointed, Angry, Frustrated, Fearful, Neutral, Curious, Doubtful).
- **Theme Memory:** Light and dark visual modes with theme choices persisted automatically using `localStorage`.

#### 🧪 Mathematical Formulas

Moodline implements a deterministic mathematical framework to evaluate content:

##### 1. Primary Sentiment Score

The compound sentiment score is normalized between $-100$ and $+100$ using the formula:
$$\text{Sentiment Score} = \left( \frac{P - N}{P + N + Neu} \right) \times 100$$

##### 2. Classification Thresholds

- **Positive:** $\text{Sentiment Score} \ge +5$
- **Negative:** $\text{Sentiment Score} \le -5$
- **Neutral:** $-5 < \text{Sentiment Score} < +5$

##### 3. Emoji Repetition Factor

To account for repetitive emojis (e.g. `🔥🔥🔥`), Moodline applies a diminishing returns scaling function:
$$\text{Repetition Factor} = 1 + 0.2 \times (\text{count} - 1)$$
$$\text{Emoji Contribution} = \text{PolaritySign} \times \text{Intensity} \times \text{Repetition Factor} \times 1.5$$

---

## 🛠️ Technologies & Tools

The technologies used across this repository are listed below:

- **Programming Languages:** JavaScript (ES6+), HTML5, CSS3
- **Web APIs & Libraries:**
  - **Tesseract.js (v5.0.5):** Runs local Optical Character Recognition inside the browser via Web Workers.
  - **Google Fonts API:** Pulls high-legibility typography (`Inter`, `IBM Plex Mono`, and `Fraunces`).
  - **LocalStorage API:** Retains user settings (such as light/dark theme) across sessions.
- **Data Formats:**
  - **JSON/JS Objects:** Structured lexicon dictionaries for words and emojis.
  - **SVG:** Modern vector graphics used for the interface layout.
  - **Images (PNG, JPG, WEBP):** Support for local OCR input formats.

---

## ⚙️ Installation & Setup

### Prerequisites

To run the projects, you only need:

- A modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari).
- (Optional) [Python 3](https://www.python.org/) or [Node.js](https://nodejs.org/) installed if you wish to serve the directory locally.

### Clone the Repository

Clone the repository using the verified URL and navigate to the project directory:

```bash
git clone https://github.com/syedadils28/SMA-Projects.git
cd "SMA Projects"
```

---

## ▶️ Running the Projects

Because Moodline runs entirely client-side, you do not need to install complex dependencies or packages.

### Option A: Static Loading (No Server)

1. Navigate to the [`sentiment-emoji-analyzer`](./sentiment-emoji-analyzer) directory.
2. Double-click [`index.html`](./sentiment-emoji-analyzer/index.html) to open the modular dashboard, or [`sentiment.html`](./sentiment-emoji-analyzer/sentiment.html) for the standalone prototype, directly in your browser.

### Option B: Local HTTP Server (Recommended)

Running through an HTTP server ensures that Web Workers for client-side libraries load smoothly.

**Using Python:**

```bash
cd sentiment-emoji-analyzer
python -m http.server 8000
```

Open your browser and navigate to `http://localhost:8000` to view the application.

**Using Node.js:**

```bash
cd sentiment-emoji-analyzer
npx serve .
```

Open your browser and navigate to the address shown (usually `http://localhost:3000`).

---

## 🔮 Future Improvements

Roadmap of planned capabilities to extend the Social Media Analytics projects:

- [ ] **Interactive Visual Analytics:** Add charts (e.g. Chart.js) to show time-series sentiment trends from uploaded datasets.
- [ ] **Batch Text Processing:** Support importing CSV or JSON exports of tweets/comments to analyze and export bulk reports.
- [ ] **Multilingual Sentiment Support:** Introduce localized word and emoji lexicons for Spanish, French, and German.
- [ ] **Advanced Transformer models:** Provide an optional API bridge to lightweight transformer models (e.g., Xenova/transformers.js) to run small sentiment models directly in browser WASM.
- [ ] **API Pipelines:** Integrate standard social media public scrapers or mock APIs to ingest live streams.

---

## 📚 Learning Outcomes

Studying the codebase in this repository highlights several key concepts in Social Media Analytics and engineering:

- **Deterministic Algorithm Design:** Demonstrates how VADER-like text scoring engines are created using rule-based lexicons instead of black-box machine learning.
- **Linguistic Parsing Rules:** Showcases practical lookback techniques for handling negations, intensifiers, and diminishers.
- **Emoji Valence Mapping:** Integrates non-text components (Unicode emojis) into traditional lexical scoring models.
- **Local Web Worker Integration:** Shows how to load and control external libraries like Tesseract.js asynchronously without freezing the browser's UI thread.
- **State Persistence:** Implements clean, native settings storage (like UI themes) using local browser APIs.

---

## 🤝 Contributing

Contributions are welcome. If you would like to submit improvements:

1. **Fork** the repository.
2. **Create a branch** for your feature: `git checkout -b feature/cool-new-feature`
3. **Commit** your changes: `git commit -m "Add some cool feature"`
4. **Push** to the branch: `git push origin feature/cool-new-feature`
5. Open a **Pull Request**.

For significant changes, please open an issue first to discuss what you would like to modify.

---

## 📞 Contact & Support

For questions, feedback, or collaboration opportunities:

- 🐛 **GitHub Issues:** Report bugs or submit feature requests on the [Issues Tracker](https://github.com/syedadils28/SMA-Projects/issues).
- 💬 **GitHub Discussions:** Ask questions, share ideas, and engage with others on the [Discussions Tab](https://github.com/syedadils28/SMA-Projects/discussions).
- 🔗 **GitHub Profile:** Check out other projects by the developer: [syedadils28](https://github.com/syedadils28).

---

## 📄 License

This repository currently does not include a license file. The repository owner may consider licensing the project under an open-source standard like the **MIT License**, **Apache 2.0**, or **GPL-3.0** in the future.

---

## 🙏 Acknowledgments

- **Tesseract.js:** The open-source engine powering client-side Optical Character Recognition.
- **Google Fonts:** Providing the modern typography families `Inter`, `IBM Plex Mono`, and `Fraunces`.
- **cdnjs:** Serving fast, reliable access to client dependencies.

---

**Last Updated:** August 2026  
**Repository:** [SMA-Projects](https://github.com/syedadils28/SMA-Projects)
