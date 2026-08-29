/**
 * Sentiment Analyzer - Emoji Engine
 * Handles emoji extraction, frequency counting, and deterministic emoji sentiment scoring.
 */

const EmojiEngine = (function () {
  'use strict';

  // Comprehensive Unicode Emoji regular expression covering standard emojis, skin tones, and variation selectors
  const EMOJI_REGEX = /(?:[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\u{2190}-\u{21FF}]|[\u{2B00}-\u{2BFF}]|[\u{1F1E6}-\u{1F1FF}]{2})(?:\uFE0F|\uFE0E)?(?:\u{1F3FB}|\u{1F3FC}|\u{1F3FD}|\u{1F3FE}|\u{1F3FF})?(?:\u200D(?:[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\u{2190}-\u{21FF}]|[\u{2B00}-\u{2BFF}]|[\u{1F1E6}-\u{1F1FF}]{2})(?:\uFE0F|\uFE0E)?(?:\u{1F3FB}|\u{1F3FC}|\u{1F3FD}|\u{1F3FE}|\u{1F3FF})?)*/gu;

  /**
   * Extracts emojis from raw text and counts their occurrences.
   * @param {string} text 
   * @returns {Object.<string, number>} Map of emoji -> count
   */
  function extractEmojis(text) {
    if (!text) return {};
    const matches = text.match(EMOJI_REGEX) || [];
    const counts = {};
    matches.forEach(emoji => {
      // Normalize variation selectors for lexicon lookup if exact key isn't found
      counts[emoji] = (counts[emoji] || 0) + 1;
    });
    return counts;
  }

  /**
   * Strips all emojis from text to allow clean word tokenization.
   * @param {string} text 
   * @returns {string} Text with emojis replaced by spaces
   */
  function stripEmojis(text) {
    if (!text) return '';
    return text.replace(EMOJI_REGEX, ' ');
  }

  /**
   * Scores extracted emojis according to the deterministic formula.
   * Formula:
   *   repetition factor = 1 + EMOJI_REPETITION_FACTOR * (count - 1)
   *   emoji contribution = polarity_sign * intensity * repetition factor
   *   Emoji Score = sum(emoji contributions)
   * 
   * @param {Object.<string, number>} emojiCounts 
   * @returns {Object} Emoji scoring result with breakdown, detected list, and sarcasm signal
   */
  function scoreEmojis(emojiCounts) {
    const config = window.CONFIG || { EMOJI_REPETITION_FACTOR: 0.2 };
    const lexicon = window.EMOJI_LEXICON || {};

    let rawSum = 0;
    let totalCount = 0;
    let sarcasmSignal = false;
    const categoryTotals = {};
    const detected = [];

    Object.entries(emojiCounts).forEach(([emoji, count]) => {
      // Find info in lexicon, fallback to normalized or default neutral
      let info = lexicon[emoji];
      if (!info) {
        // Try stripping variation selector \uFE0F
        const clean = emoji.replace(/[\uFE0F\uFE0E]/g, '');
        info = lexicon[clean] || {
          meaning: 'Emoji',
          emotion: 'neutral',
          polarity: 'neutral',
          intensity: 1,
          sarcasm: false
        };
      }

      const polaritySign = info.polarity === 'positive' ? 1 : info.polarity === 'negative' ? -1 : 0;
      const repetitionFactor = 1 + config.EMOJI_REPETITION_FACTOR * (count - 1);
      const contribution = polaritySign * info.intensity * repetitionFactor;

      rawSum += contribution;
      totalCount += count;

      if (info.sarcasm) {
        sarcasmSignal = true;
      }

      // Add to emotion category weights
      const emoCat = info.emotion || 'neutral';
      categoryTotals[emoCat] = (categoryTotals[emoCat] || 0) + (info.intensity * count);

      detected.push({
        emoji,
        count,
        meaning: info.meaning,
        emotion: info.emotion,
        polarity: info.polarity,
        intensity: info.intensity,
        sarcasm: !!info.sarcasm,
        contribution: parseFloat(contribution.toFixed(2))
      });
    });

    return {
      rawSum: parseFloat(rawSum.toFixed(3)),
      totalCount,
      sarcasmSignal,
      categoryTotals,
      detected
    };
  }

  return {
    extractEmojis,
    stripEmojis,
    scoreEmojis,
    EMOJI_REGEX
  };
})();

if (typeof window !== 'undefined') {
  window.EmojiEngine = EmojiEngine;
}
