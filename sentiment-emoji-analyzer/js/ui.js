/**
 * Sentiment Analyzer - UI Controller
 * Manages DOM updates, theme toggle, tab navigation, KPI cards,
 * sentiment meter rendering, emotion bars, and hero demo dial.
 */

const UIController = (function () {
  'use strict';

  const SENTIMENT_ICONS = {
    Positive: '😊',
    Negative: '😞',
    Neutral: '😐'
  };

  const SENTIMENT_COLORS = {
    Positive: 'var(--positive)',
    Negative: 'var(--negative)',
    Neutral: 'var(--neutral)'
  };

  /**
   * Initializes theme toggle and loads stored preference.
   */
  function initTheme() {
    const root = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    const themeIcon = document.getElementById('themeIcon');

    const storedTheme = localStorage.getItem('moodline_theme') || 'dark';
    root.setAttribute('data-theme', storedTheme);
    updateThemeButton(storedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', nextTheme);
        localStorage.setItem('moodline_theme', nextTheme);
        updateThemeButton(nextTheme);
      });
    }

    function updateThemeButton(theme) {
      if (themeLabel) {
        themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
      }
      if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
      }
    }
  }

  /**
   * Sets up tab navigation.
   */
  function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    function activateTab(tabName) {
      tabButtons.forEach(btn => {
        const isActive = btn.dataset.tab === tabName;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      tabPanels.forEach(panel => {
        const isActive = panel.dataset.panel === tabName;
        panel.classList.toggle('active', isActive);
      });
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn.dataset.tab));
    });

    document.querySelectorAll('[data-tab-target]').forEach(el => {
      el.addEventListener('click', (e) => {
        const targetTab = el.getAttribute('data-tab-target');
        if (targetTab) {
          activateTab(targetTab);
        }
      });
    });
  }

  /**
   * Initializes quick emoji palette into a target container.
   */
  function initEmojiPalette(containerId, inputId) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    if (!container || !input) return;

    const emojis = (window.CONFIG && window.CONFIG.QUICK_EMOJIS) || ['🔥', '❤️', '😍', '🙌', '🎉', '😊', '😢', '💔', '😭', '😡', '💀', '🙃', '👍', '💯'];

    container.innerHTML = '';
    emojis.forEach(emoji => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'emoji-quick-btn';
      btn.textContent = emoji;
      btn.setAttribute('aria-label', `Insert emoji ${emoji}`);
      btn.addEventListener('click', () => {
        const start = input.selectionStart || input.value.length;
        const end = input.selectionEnd || input.value.length;
        const text = input.value;
        const insertText = (start > 0 && text[start - 1] !== ' ' ? ' ' : '') + emoji + ' ';
        input.value = text.slice(0, start) + insertText + text.slice(end);
        input.selectionStart = input.selectionEnd = start + insertText.length;
        input.dispatchEvent(new Event('input'));
        input.focus();
      });
      container.appendChild(btn);
    });
  }

  /**
   * Updates real-time character, word, and emoji counts for an input.
   */
  function updateInputMetrics(text, charCountEl, wordCountEl, emojiCountEl) {
    if (charCountEl) charCountEl.textContent = text.length;
    
    if (wordCountEl) {
      const stripped = window.EmojiEngine ? window.EmojiEngine.stripEmojis(text) : text;
      const words = (stripped.trim().match(/[a-zA-Z0-9']+/g) || []).length;
      wordCountEl.textContent = words;
    }

    if (emojiCountEl && window.EmojiEngine) {
      const counts = window.EmojiEngine.extractEmojis(text);
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      emojiCountEl.textContent = total;
    }
  }

  /**
   * Renders the complete analysis results on the dashboard.
   * @param {Object} result Analysis output from SentimentEngine.analyze()
   */
  function renderResults(result) {
    const resultsSection = document.getElementById('results');
    if (!resultsSection) return;

    resultsSection.classList.add('active');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // 1. Sarcasm / Contradiction Flag
    const sarcasmContainer = document.getElementById('sarcasmFlagWrap');
    if (sarcasmContainer) {
      if (result.sarcasmPossible) {
        sarcasmContainer.innerHTML = `
          <div class="alert-banner warning" role="alert">
            <span class="alert-icon">⚠️</span>
            <div class="alert-content">
              <strong>Possible Sarcasm Detected:</strong> ${result.sarcasmReason}
            </div>
          </div>
        `;
      } else {
        sarcasmContainer.innerHTML = '';
      }
    }

    // 2. KPI Cards
    const glyphEl = document.getElementById('resGlyph');
    const sentimentEl = document.getElementById('resSentiment');
    const scoreValEl = document.getElementById('resScoreVal');
    const scoreSubEl = document.getElementById('resScoreSub');
    const confidenceEl = document.getElementById('resConfidence');
    const primaryEmotionEl = document.getElementById('resPrimaryEmotion');
    const toneEl = document.getElementById('resTone');

    const sentimentColor = SENTIMENT_COLORS[result.sentiment] || 'var(--neutral)';
    const sentimentIcon = SENTIMENT_ICONS[result.sentiment] || '😐';

    if (glyphEl) glyphEl.textContent = sentimentIcon;
    if (sentimentEl) {
      sentimentEl.textContent = result.sentiment;
      sentimentEl.style.color = sentimentColor;
    }

    if (scoreValEl) {
      const prefix = result.score > 0 ? '+' : '';
      scoreValEl.textContent = `${prefix}${result.score}`;
      scoreValEl.style.color = sentimentColor;
    }

    if (scoreSubEl) {
      scoreSubEl.textContent = `Score range: -100 to +100`;
    }

    if (confidenceEl) {
      confidenceEl.textContent = `${result.confidence}%`;
    }

    if (primaryEmotionEl) {
      const config = window.CONFIG || {};
      const emotionIcons = config.EMOTION_ICONS || {};
      const emotionLabels = config.EMOTION_LABELS || {};
      const icon = emotionIcons[result.primaryEmotion] || '🙂';
      const label = emotionLabels[result.primaryEmotion] || result.primaryEmotion;
      primaryEmotionEl.textContent = `${icon} ${label}`;
    }

    if (toneEl) {
      toneEl.textContent = result.tone;
    }

    // 3. Sentiment Meter Positioning
    const meterFillEl = document.getElementById('meterFill');
    const meterNeedleEl = document.getElementById('meterNeedle');
    const meterScoreLabelEl = document.getElementById('meterScoreLabel');

    if (meterNeedleEl) {
      // Score ranges from -100 to +100. Normalize to percentage 0% to 100%
      const percentage = ((result.score + 100) / 200) * 100;
      meterNeedleEl.style.left = `${percentage}%`;
    }
    if (meterFillEl) {
      const percentage = ((result.score + 100) / 200) * 100;
      meterFillEl.style.width = `${percentage}%`;
    }
    if (meterScoreLabelEl) {
      const prefix = result.score > 0 ? '+' : '';
      meterScoreLabelEl.textContent = `${prefix}${result.score} (${result.sentiment})`;
    }

    // 3.1 Live Formula Calculation Breakdown
    const resFormulaCalcEl = document.getElementById('resFormulaCalc');
    const formulaPosValEl = document.getElementById('formulaPosVal');
    const formulaNegValEl = document.getElementById('formulaNegVal');
    const formulaNeuValEl = document.getElementById('formulaNeuVal');
    const formulaTotalValEl = document.getElementById('formulaTotalVal');

    if (result.formulaDetails) {
      const fd = result.formulaDetails;
      if (resFormulaCalcEl) {
        resFormulaCalcEl.textContent = fd.formulaStr;
      }
      if (formulaPosValEl) formulaPosValEl.textContent = `${fd.positive}`;
      if (formulaNegValEl) formulaNegValEl.textContent = `${fd.negative}`;
      if (formulaNeuValEl) formulaNeuValEl.textContent = `${fd.neutral}`;
      if (formulaTotalValEl) formulaTotalValEl.textContent = `${fd.total}`;
    }

    // 3.2 Analyzed Text & Keyword Highlighting
    const highlightedTextBoxEl = document.getElementById('highlightedTextBox');
    const posKeywordsBadgesEl = document.getElementById('posKeywordsBadges');
    const negKeywordsBadgesEl = document.getElementById('negKeywordsBadges');

    if (highlightedTextBoxEl && result.annotatedTokens) {
      highlightedTextBoxEl.innerHTML = '';
      result.annotatedTokens.forEach(t => {
        const span = document.createElement('span');
        span.textContent = t.word + ' ';
        if (t.polarity === 'positive') {
          span.className = 'hl-token hl-pos';
          span.title = `Positive keyword (+${t.valence})`;
        } else if (t.polarity === 'negative') {
          span.className = 'hl-token hl-neg';
          span.title = t.isNegated ? `Negated keyword (${t.negationWord} ${t.word})` : `Negative keyword (${t.valence})`;
        } else {
          span.className = 'hl-token hl-neu';
        }
        highlightedTextBoxEl.appendChild(span);
      });

      // Append emojis if any
      if (result.emojiDetected && result.emojiDetected.length > 0) {
        result.emojiDetected.forEach(e => {
          const eSpan = document.createElement('span');
          eSpan.textContent = e.emoji + ' ';
          eSpan.className = e.polarity === 'positive' ? 'hl-token hl-pos hl-emoji' : (e.polarity === 'negative' ? 'hl-token hl-neg hl-emoji' : 'hl-token hl-neu hl-emoji');
          eSpan.title = `${e.meaning} (${e.polarity})`;
          highlightedTextBoxEl.appendChild(eSpan);
        });
      }
    }

    if (posKeywordsBadgesEl) {
      posKeywordsBadgesEl.innerHTML = '';
      if (result.positiveKeywords && result.positiveKeywords.length > 0) {
        result.positiveKeywords.forEach(kw => {
          const badge = document.createElement('span');
          badge.className = 'keyword-badge badge-green';
          badge.textContent = kw;
          posKeywordsBadgesEl.appendChild(badge);
        });
      } else {
        posKeywordsBadgesEl.innerHTML = `<span class="empty-badge-text">None</span>`;
      }
    }

    if (negKeywordsBadgesEl) {
      negKeywordsBadgesEl.innerHTML = '';
      if (result.negativeKeywords && result.negativeKeywords.length > 0) {
        result.negativeKeywords.forEach(kw => {
          const badge = document.createElement('span');
          badge.className = 'keyword-badge badge-red';
          badge.textContent = kw;
          negKeywordsBadgesEl.appendChild(badge);
        });
      } else {
        negKeywordsBadgesEl.innerHTML = `<span class="empty-badge-text">None</span>`;
      }
    }

    // 4. Emotion Breakdown Bars
    const emotionBarsContainer = document.getElementById('emotionBars');
    if (emotionBarsContainer) {
      emotionBarsContainer.innerHTML = '';
      if (!result.emotionBreakdown || result.emotionBreakdown.length === 0) {
        emotionBarsContainer.innerHTML = `<div class="empty-text">No distinct emotion signals detected.</div>`;
      } else {
        result.emotionBreakdown.forEach(item => {
          const isNegativeCategory = ['sad', 'disappointed', 'angry', 'frustrated', 'fearful'].includes(item.category);
          const isNeutralCategory = ['neutral', 'curious', 'doubtful'].includes(item.category);
          const barColor = isNegativeCategory ? 'var(--negative)' : (isNeutralCategory ? 'var(--neutral)' : 'var(--positive)');

          const row = document.createElement('div');
          row.className = 'emotion-bar-row';
          row.innerHTML = `
            <div class="emotion-bar-label">${item.label}</div>
            <div class="emotion-bar-track">
              <div class="emotion-bar-fill" style="background:${barColor}; width: 0%;"></div>
            </div>
            <div class="emotion-bar-pct">${item.pct}%</div>
          `;
          emotionBarsContainer.appendChild(row);

          // Animate fill smoothly
          requestAnimationFrame(() => {
            const fill = row.querySelector('.emotion-bar-fill');
            if (fill) fill.style.width = `${item.pct}%`;
          });
        });
      }
    }

    // 5. Text Insights Grid
    const insightsContainer = document.getElementById('insightsGrid');
    if (insightsContainer) {
      insightsContainer.innerHTML = '';
      const ins = result.insights;
      const metrics = [
        { label: 'Positive Words', value: ins.positiveWords, color: 'var(--positive)' },
        { label: 'Negative Words', value: ins.negativeWords, color: 'var(--negative)' },
        { label: 'Neutral Words', value: ins.neutralWords, color: 'var(--muted)' },
        { label: 'Emojis Detected', value: ins.emojisDetected, color: 'var(--primary)' },
        { label: 'Characters', value: ins.characters, color: 'var(--ink)' },
        { label: 'Total Words', value: ins.words, color: 'var(--ink)' }
      ];

      metrics.forEach(m => {
        const card = document.createElement('div');
        card.className = 'insight-metric-card';
        card.innerHTML = `
          <div class="metric-val" style="color:${m.color}">${m.value}</div>
          <div class="metric-lab">${m.label}</div>
        `;
        insightsContainer.appendChild(card);
      });
    }

    // 6. Detected Emojis Cards
    const emojiCardsContainer = document.getElementById('emojiCards');
    if (emojiCardsContainer) {
      emojiCardsContainer.innerHTML = '';
      if (!result.emojiDetected || result.emojiDetected.length === 0) {
        emojiCardsContainer.innerHTML = `
          <div class="empty-state-box">
            <span class="empty-icon">🔍</span>
            <p>No emojis detected in this input.</p>
          </div>
        `;
      } else {
        result.emojiDetected.forEach(e => {
          const card = document.createElement('div');
          card.className = 'detected-emoji-card';
          const intensityMap = ['—', 'Low', 'Moderate', 'High', 'Very High'];
          const intensityLabel = intensityMap[e.intensity] || 'Moderate';
          const polarityTag = e.polarity ? e.polarity.charAt(0).toUpperCase() + e.polarity.slice(1) : 'Neutral';
          const polarityClass = `tag-${e.polarity}`;

          card.innerHTML = `
            <div class="emoji-glyph">${e.emoji}</div>
            <div class="emoji-meaning">${e.meaning}</div>
            <div class="emoji-tags">
              <span class="tag-pill ${polarityClass}">${polarityTag}</span>
              <span class="tag-pill">Intensity: ${intensityLabel}</span>
              <span class="tag-pill">Count: ×${e.count}</span>
            </div>
          `;
          emojiCardsContainer.appendChild(card);
        });
      }
    }

    // 7. Natural Language Summary
    const summaryEl = document.getElementById('resSummary');
    if (summaryEl) {
      summaryEl.textContent = result.summary;
    }
  }

  /**
   * Initializes hero live demo dial animation.
   */
  function initHeroDial() {
    const demoPhrases = [
      'Loved this tutorial! 🔥❤️',
      'This service is terrible 😡💔',
      'The update is okay.',
      'What a brilliant system 🙃💀'
    ];

    let currentIdx = 0;
    const needleEl = document.getElementById('heroDialNeedle');
    const scoreEl = document.getElementById('heroDialScore');
    const tagEl = document.getElementById('heroDialTag');
    const exampleEl = document.getElementById('heroDialExample');
    const emojisEl = document.getElementById('heroDialEmojis');

    function updateHeroDemo(text) {
      if (!window.SentimentEngine) return;
      const res = window.SentimentEngine.analyze(text);
      if (!res) return;

      // Needle angle calculation (-90 deg to +90 deg)
      const deg = (Math.max(-100, Math.min(100, res.score)) / 100) * 85;
      if (needleEl) {
        needleEl.style.transform = `rotate(${deg}deg)`;
      }

      if (scoreEl) {
        const prefix = res.score > 0 ? '+' : '';
        scoreEl.textContent = `${prefix}${res.score}`;
        scoreEl.style.color = SENTIMENT_COLORS[res.sentiment] || 'var(--ink)';
      }

      if (tagEl) {
        const config = window.CONFIG || {};
        const labels = config.EMOTION_LABELS || {};
        const emoStr = res.primaryEmotion && res.primaryEmotion !== 'neutral'
          ? ` · ${(labels[res.primaryEmotion] || res.primaryEmotion).toUpperCase()}`
          : '';
        const tagText = (res.sarcasmPossible ? 'POSSIBLE SARCASM' : res.sentiment.toUpperCase()) + emoStr;
        tagEl.textContent = tagText;
      }

      if (exampleEl) {
        exampleEl.textContent = `"${text}"`;
      }

      if (emojisEl) {
        const detected = res.emojiDetected.map(e => e.emoji).join(' ');
        emojisEl.textContent = detected || '—';
      }
    }

    updateHeroDemo(demoPhrases[0]);

    // Cycle every 4.5 seconds
    setInterval(() => {
      currentIdx = (currentIdx + 1) % demoPhrases.length;
      updateHeroDemo(demoPhrases[currentIdx]);
    }, 4500);
  }

  return {
    initTheme,
    initTabs,
    initEmojiPalette,
    updateInputMetrics,
    renderResults,
    initHeroDial
  };
})();

if (typeof window !== 'undefined') {
  window.UIController = UIController;
}
