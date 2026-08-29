/**
 * Sentiment Analyzer - Deterministic Sentiment Engine
 * Implements Social Media Analytics sentiment formula:
 * 
 *   Sentiment Score = [ (Positive - Negative) / (Positive + Negative + Neutral) ] × 100
 * 
 * where:
 *   Positive (P)   = Positive Words + Positive Emojis
 *   Negative (N)   = Negative Words + Negative Emojis
 *   Neutral (Neu)  = Neutral Words  + Neutral Emojis
 *   Total Signals  = Positive + Negative + Neutral
 */

const SentimentEngine = (function () {
  'use strict';

  /**
   * Tokenizes text into words after stripping emojis.
   * @param {string} text 
   * @returns {string[]} Array of tokenized words
   */
  function tokenize(text) {
    if (!text) return [];
    const stripped = window.EmojiEngine ? window.EmojiEngine.stripEmojis(text) : text;
    return (stripped.match(/[a-zA-Z']+/g) || []);
  }

  /**
   * Evaluates word-level sentiment tokens, detects negations and keywords.
   * @param {string[]} tokens 
   * @returns {Object} Token counts, category totals, annotated tokens, and keyword lists
   */
  function scoreWords(tokens) {
    const config = window.CONFIG || {};
    const lexicon = window.WORD_LEXICON || {};
    const negations = config.NEGATIONS || new Set();

    let posWordCount = 0;
    let negWordCount = 0;
    let neuWordCount = 0;
    let recognizedCount = 0;

    const categoryTotals = {};
    const annotatedTokens = [];
    const positiveKeywords = [];
    const negativeKeywords = [];
    const neutralWordsList = [];

    for (let i = 0; i < tokens.length; i++) {
      const rawToken = tokens[i];
      const lowerToken = rawToken.toLowerCase();

      if (lexicon[lowerToken]) {
        let [baseValence, emotionCat] = lexicon[lowerToken];
        recognizedCount++;

        // Negation lookback (up to 3 tokens)
        let isNegated = false;
        let negationWord = '';
        const startLookback = Math.max(0, i - (config.NEGATION_LOOKBACK || 3));
        for (let j = startLookback; j < i; j++) {
          const prevLower = tokens[j].toLowerCase();
          if (negations.has(prevLower)) {
            isNegated = true;
            negationWord = tokens[j];
            break;
          }
        }

        let polarity = 'neutral';
        let effectiveValence = baseValence;

        if (isNegated) {
          if (baseValence > 0) {
            polarity = 'negative';
            effectiveValence = baseValence * (config.NEGATION_FACTOR || -0.74);
          } else if (baseValence < 0) {
            polarity = 'neutral';
            effectiveValence = 0;
          }
        } else {
          if (baseValence > 0.15) {
            polarity = 'positive';
          } else if (baseValence < -0.15) {
            polarity = 'negative';
          } else {
            polarity = 'neutral';
          }
        }

        let cat = emotionCat || 'neutral';
        if (isNegated) {
          cat = (baseValence > 0) ? 'disappointed' : 'neutral';
        }

        if (polarity === 'positive') {
          posWordCount++;
          positiveKeywords.push(rawToken);
          categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(effectiveValence);
          annotatedTokens.push({
            word: rawToken,
            polarity: 'positive',
            valence: baseValence,
            isNegated: false,
            emotion: cat
          });
        } else if (polarity === 'negative') {
          negWordCount++;
          negativeKeywords.push(isNegated ? `${negationWord} ${rawToken}` : rawToken);
          categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(effectiveValence);
          annotatedTokens.push({
            word: rawToken,
            polarity: 'negative',
            valence: effectiveValence,
            isNegated,
            negationWord,
            emotion: cat
          });
        } else {
          neuWordCount++;
          neutralWordsList.push(rawToken);
          categoryTotals['neutral'] = (categoryTotals['neutral'] || 0) + 1;
          annotatedTokens.push({
            word: rawToken,
            polarity: 'neutral',
            valence: 0,
            isNegated: false,
            emotion: 'neutral'
          });
        }
      } else {
        // Non-lexicon words are neutral tokens
        neuWordCount++;
        neutralWordsList.push(rawToken);
        annotatedTokens.push({
          word: rawToken,
          polarity: 'neutral',
          valence: 0,
          isNegated: false,
          emotion: 'neutral'
        });
      }
    }

    return {
      posWordCount,
      negWordCount,
      neuWordCount,
      recognizedCount,
      categoryTotals,
      annotatedTokens,
      positiveKeywords,
      negativeKeywords,
      neutralWordsList
    };
  }

  /**
   * Merges two emotion category weight maps.
   */
  function mergeCategories(a, b) {
    const out = Object.assign({}, a);
    Object.entries(b || {}).forEach(([k, v]) => {
      out[k] = (out[k] || 0) + v;
    });
    return out;
  }

  /**
   * Calculates deterministic signal confidence score (0 to 97%).
   */
  function calculateConfidence(score, recognizedWords, emojiCount, totalTokens, sarcasmPossible) {
    if (totalTokens === 0 && emojiCount === 0) return 0;

    const absScore = Math.abs(score) / 100;
    const signalCount = recognizedWords + emojiCount;
    const tokenCoverage = Math.min(1.0, signalCount / Math.max(1, totalTokens));

    let confidence = 35 + (absScore * 45) + (tokenCoverage * 15) + Math.min(emojiCount, 4) * 2;

    if (signalCount === 0) {
      confidence = 20;
    }

    if (sarcasmPossible) {
      confidence = Math.min(confidence, 68);
    }

    return Math.round(Math.max(10, Math.min(97, confidence)));
  }

  /**
   * Generates a natural human-readable summary.
   */
  function generateSummary({ text, sentiment, score, primaryEmotion, emojiDetected, sarcasmPossible, sarcasmReason, posKeywords, negKeywords }) {
    if (!text || text.trim().length === 0) {
      return 'Enter some text, or upload an image to generate an analysis.';
    }

    const config = window.CONFIG || {};
    const labels = config.EMOTION_LABELS || {};
    const emotionLabel = labels[primaryEmotion] || 'Neutral';
    const emotionLower = emotionLabel.toLowerCase();

    if (sarcasmPossible) {
      return `This message features positive wording combined with irony-indicating emojis. ${sarcasmReason} The system flags this as Possible Sarcasm.`;
    }

    let summaryText = '';
    if (sentiment === 'Positive') {
      if (score >= 60) {
        summaryText = `Overall, this message reads as strongly positive and ${emotionLower}.`;
      } else {
        summaryText = `Overall, this message conveys a positive emotional tone, leaning towards ${emotionLower}.`;
      }
    } else if (sentiment === 'Negative') {
      if (score <= -60) {
        summaryText = `Overall, this message reads as strongly negative and ${emotionLower}.`;
      } else {
        summaryText = `Overall, this message reflects negative sentiment with signals of ${emotionLower}.`;
      }
    } else {
      summaryText = `Overall, this message reads as neutral with balanced or limited emotional signals.`;
    }

    // Keyword commentary
    if (posKeywords.length > 0 && negKeywords.length === 0) {
      summaryText += ` Positive keywords detected: "${posKeywords.slice(0, 3).join('", "')}".`;
    } else if (negKeywords.length > 0 && posKeywords.length === 0) {
      summaryText += ` Negative keywords detected: "${negKeywords.slice(0, 3).join('", "')}".`;
    }

    // Emoji commentary
    if (emojiDetected && emojiDetected.length > 0) {
      const posEmojis = emojiDetected.filter(e => e.polarity === 'positive').map(e => e.emoji);
      const negEmojis = emojiDetected.filter(e => e.polarity === 'negative').map(e => e.emoji);

      if (posEmojis.length > 0 && negEmojis.length === 0) {
        summaryText += ` ${posEmojis.join(' ')} amplifies the positive emotional intensity.`;
      } else if (negEmojis.length > 0 && posEmojis.length === 0) {
        summaryText += ` ${negEmojis.join(' ')} reinforces negative emotional markers.`;
      } else if (posEmojis.length > 0 && negEmojis.length > 0) {
        summaryText += ` Mixed emojis (${posEmojis.join(' ')} and ${negEmojis.join(' ')}) introduce contrasting undertones.`;
      }
    } else {
      summaryText += ` No emoji were detected, so the analysis is based primarily on wording.`;
    }

    return summaryText;
  }

  /**
   * Main analysis entry point using exact token metrics:
   *   Sentiment Score = [ (Positive - Negative) / (Positive + Negative + Neutral) ] × 100
   * 
   * @param {string} rawText 
   * @returns {Object} Complete analysis result
   */
  function analyze(rawText) {
    const text = (rawText || '').trim();
    const config = window.CONFIG || {
      SENTIMENT_POSITIVE_THRESHOLD: 5,
      SENTIMENT_NEGATIVE_THRESHOLD: -5
    };

    // 1. Emoji Extraction & Scoring
    const emojiCounts = window.EmojiEngine ? window.EmojiEngine.extractEmojis(text) : {};
    const emojiResult = window.EmojiEngine ? window.EmojiEngine.scoreEmojis(emojiCounts) : {
      rawSum: 0,
      totalCount: 0,
      sarcasmSignal: false,
      categoryTotals: {},
      detected: []
    };

    // 2. Word Tokenization & Scoring
    const tokens = tokenize(text);
    const wordResult = scoreWords(tokens);

    // 3. Exact Token Counts for Social Media Analytics Formula:
    let posEmojiCount = 0;
    let negEmojiCount = 0;
    let neuEmojiCount = 0;

    emojiResult.detected.forEach(e => {
      if (e.polarity === 'positive') {
        posEmojiCount += e.count;
      } else if (e.polarity === 'negative') {
        negEmojiCount += e.count;
      } else {
        neuEmojiCount += e.count;
      }
    });

    // P = Positive Words + Positive Emojis
    // N = Negative Words + Negative Emojis
    // Neu = Neutral Words + Neutral Emojis
    const P = wordResult.posWordCount + posEmojiCount;
    const N = wordResult.negWordCount + negEmojiCount;
    const Neu = wordResult.neuWordCount + neuEmojiCount;
    const Total = P + N + Neu;

    // 4. Exact Social Media Analytics Formula Calculation:
    // Sentiment Score = [ (Positive - Negative) / (Positive + Negative + Neutral) ] × 100
    let finalScore = Total > 0 ? Math.round(((P - N) / Total) * 100) : 0;
    finalScore = Math.max(-100, Math.min(100, finalScore));

    // 5. Classification
    let sentiment = 'Neutral';
    if (finalScore >= (config.SENTIMENT_POSITIVE_THRESHOLD || 5)) {
      sentiment = 'Positive';
    } else if (finalScore <= (config.SENTIMENT_NEGATIVE_THRESHOLD || -5)) {
      sentiment = 'Negative';
    }

    // 6. Sarcasm / Contradiction Check
    let sarcasmPossible = false;
    let sarcasmReason = '';

    if (emojiResult.sarcasmSignal && wordResult.posWordCount > 0) {
      sarcasmPossible = true;
      sarcasmReason = 'Contradictory emotional signals detected between positive wording and sarcastic emoji.';
      sentiment = 'Negative';
      finalScore = -Math.max(15, Math.abs(finalScore));
    }

    // 7. Confidence Calculation
    const confidence = calculateConfidence(
      finalScore,
      wordResult.recognizedCount,
      emojiResult.totalCount,
      tokens.length,
      sarcasmPossible
    );

    // 8. Emotion Categories Breakdown
    const mergedCategoryTotals = mergeCategories(wordResult.categoryTotals, emojiResult.categoryTotals);
    let activeCategories = Object.entries(mergedCategoryTotals)
      .filter(([cat]) => cat !== 'neutral')
      .sort((a, b) => b[1] - a[1]);

    if (activeCategories.length === 0) {
      activeCategories = [['neutral', 1]];
    }

    const maxWeight = activeCategories[0][1] || 1;
    const emotionLabels = config.EMOTION_LABELS || {};
    const emotionBreakdown = activeCategories.slice(0, 6).map(([cat, weight]) => ({
      category: cat,
      label: emotionLabels[cat] || cat,
      weight: parseFloat(weight.toFixed(2)),
      pct: Math.round(Math.min(100, (weight / maxWeight) * 100))
    }));

    const primaryEmotion = activeCategories[0][0];

    // 9. Tone Descriptor
    const tone = sentiment + (primaryEmotion && primaryEmotion !== 'neutral' ? ` / ${(emotionLabels[primaryEmotion] || primaryEmotion)}` : '');

    // 10. Natural Language Summary
    const summary = generateSummary({
      text,
      sentiment,
      score: finalScore,
      primaryEmotion,
      emojiDetected: emojiResult.detected,
      sarcasmPossible,
      sarcasmReason,
      posKeywords: wordResult.positiveKeywords,
      negKeywords: wordResult.negativeKeywords
    });

    return {
      text,
      tokens,
      wordResult,
      emojiCounts,
      emojiDetected: emojiResult.detected,
      sentiment,
      score: finalScore,
      formulaDetails: {
        positive: P,
        negative: N,
        neutral: Neu,
        total: Total,
        formulaStr: `Score = [ (${P} - ${N}) / (${P} + ${N} + ${Neu}) ] × 100 = ${finalScore > 0 ? '+' : ''}${finalScore}`
      },
      positiveKeywords: wordResult.positiveKeywords,
      negativeKeywords: wordResult.negativeKeywords,
      annotatedTokens: wordResult.annotatedTokens,
      confidence,
      tone,
      primaryEmotion,
      emotionBreakdown,
      sarcasmPossible,
      sarcasmReason,
      insights: {
        positiveWords: wordResult.posWordCount,
        negativeWords: wordResult.negWordCount,
        neutralWords: wordResult.neuWordCount,
        emojisDetected: emojiResult.totalCount,
        characters: text.length,
        words: tokens.length
      },
      summary
    };
  }

  return {
    tokenize,
    scoreWords,
    calculateConfidence,
    generateSummary,
    analyze
  };
})();

if (typeof window !== 'undefined') {
  window.SentimentEngine = SentimentEngine;
}
