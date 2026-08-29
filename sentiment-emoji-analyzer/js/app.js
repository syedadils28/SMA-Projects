/**
 * Sentiment Analyzer - Main Application Controller
 * Orchestrates event handling, tab interactions, OCR integration, and sentiment analysis pipelines.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Initialize UI Core Components (Theme, Tabs, Hero Dial)
  UIController.initTheme();
  UIController.initTabs();
  UIController.initHeroDial();

  // 2. Initialize Emoji Quick Insert Palettes
  UIController.initEmojiPalette('emojiPaletteText', 'textInput');
  UIController.initEmojiPalette('emojiPaletteOcr', 'ocrExtractedText');
  UIController.initEmojiPalette('emojiPaletteCombined', 'combinedOcrText');

  // -------------------------------------------------------------
  // TAB 1: TEXT ANALYSIS
  // -------------------------------------------------------------
  const textInput = document.getElementById('textInput');
  const textCharCount = document.getElementById('textCharCount');
  const textWordCount = document.getElementById('textWordCount');
  const textEmojiCount = document.getElementById('textEmojiCount');
  const analyzeTextBtn = document.getElementById('analyzeTextBtn');
  const clearTextBtn = document.getElementById('clearTextBtn');
  const textNotice = document.getElementById('textNotice');

  if (textInput) {
    textInput.addEventListener('input', () => {
      UIController.updateInputMetrics(textInput.value, textCharCount, textWordCount, textEmojiCount);
      if (textNotice) textNotice.classList.remove('active');
    });
  }

  // Quick Preset Examples
  document.querySelectorAll('[data-example]').forEach(btn => {
    btn.addEventListener('click', () => {
      const exampleText = btn.getAttribute('data-example');
      if (textInput && exampleText) {
        textInput.value = exampleText;
        textInput.dispatchEvent(new Event('input'));
        textInput.focus();
      }
    });
  });

  if (clearTextBtn) {
    clearTextBtn.addEventListener('click', () => {
      if (textInput) {
        textInput.value = '';
        textInput.dispatchEvent(new Event('input'));
        textInput.focus();
      }
    });
  }

  if (analyzeTextBtn) {
    analyzeTextBtn.addEventListener('click', () => {
      const text = (textInput ? textInput.value : '').trim();
      if (!text) {
        if (textNotice) {
          textNotice.textContent = 'Please enter or paste some text to analyze.';
          textNotice.classList.add('active');
        }
        if (textInput) textInput.focus();
        return;
      }
      const result = SentimentEngine.analyze(text);
      UIController.renderResults(result);
    });
  }

  // -------------------------------------------------------------
  // TAB 2: IMAGE OCR
  // -------------------------------------------------------------
  const dropzoneOcr = document.getElementById('dropzoneOcr');
  const fileInputOcr = document.getElementById('fileInputOcr');
  const browseBtnOcr = document.getElementById('browseBtnOcr');
  const ocrImagePreview = document.getElementById('ocrImagePreview');
  const ocrProgress = document.getElementById('ocrProgress');
  const ocrProgressFill = document.getElementById('ocrProgressFill');
  const ocrProgressLabel = document.getElementById('ocrProgressLabel');
  const ocrError = document.getElementById('ocrError');
  const ocrResult = document.getElementById('ocrResult');
  const ocrExtractedText = document.getElementById('ocrExtractedText');
  const ocrDetectedEmojisBadge = document.getElementById('ocrDetectedEmojisBadge');
  const copyOcrBtn = document.getElementById('copyOcrBtn');
  const clearOcrBtn = document.getElementById('clearOcrBtn');
  const analyzeOcrBtn = document.getElementById('analyzeOcrBtn');
  const convertOcrEmoticonsBtn = document.getElementById('convertOcrEmoticonsBtn');

  if (dropzoneOcr && fileInputOcr) {
    OCREngine.setupDropzone({
      dropzoneEl: dropzoneOcr,
      inputEl: fileInputOcr,
      browseBtnEl: browseBtnOcr,
      onFileSelected: (file) => {
        OCREngine.processImage({
          file,
          imgPreviewEl: ocrImagePreview,
          progressWrapEl: ocrProgress,
          progressFillEl: ocrProgressFill,
          progressLabelEl: ocrProgressLabel,
          errorEl: ocrError,
          resultWrapEl: ocrResult,
          textAreaEl: ocrExtractedText,
          detectedEmojisBadgeEl: ocrDetectedEmojisBadge
        });
      }
    });
  }

  if (convertOcrEmoticonsBtn) {
    convertOcrEmoticonsBtn.addEventListener('click', () => {
      if (ocrExtractedText && ocrExtractedText.value) {
        ocrExtractedText.value = OCREngine.convertEmoticonsToEmojis(ocrExtractedText.value);
        ocrExtractedText.dispatchEvent(new Event('input'));
      }
    });
  }

  if (copyOcrBtn) {
    copyOcrBtn.addEventListener('click', () => {
      if (ocrExtractedText && ocrExtractedText.value) {
        navigator.clipboard.writeText(ocrExtractedText.value)
          .then(() => {
            const originalText = copyOcrBtn.textContent;
            copyOcrBtn.textContent = '✓ Copied!';
            setTimeout(() => { copyOcrBtn.textContent = originalText; }, 2000);
          })
          .catch(() => {
            ocrExtractedText.select();
            document.execCommand('copy');
          });
      }
    });
  }

  if (clearOcrBtn) {
    clearOcrBtn.addEventListener('click', () => {
      if (ocrExtractedText) ocrExtractedText.value = '';
      if (ocrResult) ocrResult.classList.remove('active');
      if (fileInputOcr) fileInputOcr.value = '';
      if (ocrImagePreview) ocrImagePreview.src = '';
      if (ocrError) ocrError.classList.remove('active');
      if (ocrDetectedEmojisBadge) ocrDetectedEmojisBadge.style.display = 'none';
    });
  }

  if (analyzeOcrBtn) {
    analyzeOcrBtn.addEventListener('click', () => {
      const text = (ocrExtractedText ? ocrExtractedText.value : '').trim();
      if (!text) {
        if (ocrError) {
          ocrError.textContent = 'No extracted text found. Please upload an image with readable text or emojis.';
          ocrError.classList.add('active');
        }
        return;
      }
      const result = SentimentEngine.analyze(text);
      UIController.renderResults(result);
    });
  }

  // -------------------------------------------------------------
  // TAB 3: COMBINED ANALYSIS (OCR + USER CONTEXT)
  // -------------------------------------------------------------
  const dropzoneCombined = document.getElementById('dropzoneCombined');
  const fileInputCombined = document.getElementById('fileInputCombined');
  const browseBtnCombined = document.getElementById('browseBtnCombined');
  const combinedImagePreview = document.getElementById('combinedImagePreview');
  const combinedProgress = document.getElementById('combinedProgress');
  const combinedProgressFill = document.getElementById('combinedProgressFill');
  const combinedProgressLabel = document.getElementById('combinedProgressLabel');
  const combinedError = document.getElementById('combinedError');
  const combinedResult = document.getElementById('combinedResult');
  const combinedOcrText = document.getElementById('combinedOcrText');
  const combinedExtraText = document.getElementById('combinedExtraText');
  const combinedDetectedEmojisBadge = document.getElementById('combinedDetectedEmojisBadge');
  const clearCombinedBtn = document.getElementById('clearCombinedBtn');
  const analyzeCombinedBtn = document.getElementById('analyzeCombinedBtn');
  const convertCombinedEmoticonsBtn = document.getElementById('convertCombinedEmoticonsBtn');

  if (dropzoneCombined && fileInputCombined) {
    OCREngine.setupDropzone({
      dropzoneEl: dropzoneCombined,
      inputEl: fileInputCombined,
      browseBtnEl: browseBtnCombined,
      onFileSelected: (file) => {
        OCREngine.processImage({
          file,
          imgPreviewEl: combinedImagePreview,
          progressWrapEl: combinedProgress,
          progressFillEl: combinedProgressFill,
          progressLabelEl: combinedProgressLabel,
          errorEl: combinedError,
          resultWrapEl: combinedResult,
          textAreaEl: combinedOcrText,
          detectedEmojisBadgeEl: combinedDetectedEmojisBadge
        });
      }
    });
  }

  if (convertCombinedEmoticonsBtn) {
    convertCombinedEmoticonsBtn.addEventListener('click', () => {
      if (combinedOcrText && combinedOcrText.value) {
        combinedOcrText.value = OCREngine.convertEmoticonsToEmojis(combinedOcrText.value);
        combinedOcrText.dispatchEvent(new Event('input'));
      }
    });
  }

  if (clearCombinedBtn) {
    clearCombinedBtn.addEventListener('click', () => {
      if (combinedOcrText) combinedOcrText.value = '';
      if (combinedExtraText) combinedExtraText.value = '';
      if (combinedResult) combinedResult.classList.remove('active');
      if (fileInputCombined) fileInputCombined.value = '';
      if (combinedImagePreview) combinedImagePreview.src = '';
      if (combinedError) combinedError.classList.remove('active');
      if (combinedDetectedEmojisBadge) combinedDetectedEmojisBadge.style.display = 'none';
    });
  }

  if (analyzeCombinedBtn) {
    analyzeCombinedBtn.addEventListener('click', () => {
      const ocrPart = (combinedOcrText ? combinedOcrText.value : '').trim();
      const extraPart = (combinedExtraText ? combinedExtraText.value : '').trim();
      const mergedText = [ocrPart, extraPart].filter(Boolean).join('\n\n');

      if (!mergedText) {
        if (combinedError) {
          combinedError.textContent = 'Please extract text/emojis from an image or enter context in the extra text field.';
          combinedError.classList.add('active');
        }
        return;
      }

      const result = SentimentEngine.analyze(mergedText);
      UIController.renderResults(result);
    });
  }
});
