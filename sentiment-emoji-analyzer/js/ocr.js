/**
 * Sentiment Analyzer - OCR Module with Emoji Extraction
 * Integrates Tesseract.js for client-side Optical Character Recognition,
 * alongside an Emoticon/Shortcode converter and Canvas-based visual emoji scanner.
 */

const OCREngine = (function () {
  'use strict';

  // Emoticon & Shortcode to Unicode Emoji Mapping
  const EMOTICON_MAP = [
    { pattern: /<3|\u2665|\u2764/g, emoji: '❤️' },
    { pattern: /:\'\-?\(|:\'\(|;_\;/g, emoji: '😭' },
    { pattern: />:?[\-\^]?\(|>:\[|:-@|:@/g, emoji: '😡' },
    { pattern: /:[\-\^]?\)|;\)|\[\)|=\)/g, emoji: '😊' },
    { pattern: /:[\-\^]?D|XD|xD|=D/g, emoji: '😁' },
    { pattern: /:[\-\^]?\(|:\[|=\(/g, emoji: '😢' },
    { pattern: /:[\-\^]?P|:p|:-p|=P/g, emoji: '😋' },
    { pattern: /:[\-\^]?O|:o|:-o|=O/g, emoji: '😱' },
    { pattern: /:[\-\^]?\/|:\\|:-\\/g, emoji: '😕' },
    { pattern: /-_-|-_-'|;\-\//g, emoji: '😑' },
    { pattern: /:fire:|\[fire\]/gi, emoji: '🔥' },
    { pattern: /:100:|\[100\]/gi, emoji: '💯' },
    { pattern: /:skull:|\[skull\]/gi, emoji: '💀' },
    { pattern: /:heart:|\[heart\]/gi, emoji: '❤️' },
    { pattern: /:star:|\[star\]/gi, emoji: '⭐' },
    { pattern: /:thumb(up|\+1)|\[thumbsup\]|\(y\)/gi, emoji: '👍' },
    { pattern: /:thumb(down|\-1)|\[thumbsdown\]|\(n\)/gi, emoji: '👎' }
  ];

  /**
   * Converts ASCII emoticons, shortcodes, and symbols into Unicode emojis.
   * @param {string} text 
   * @returns {string} Text with converted emojis
   */
  function convertEmoticonsToEmojis(text) {
    if (!text) return '';
    let result = text;
    EMOTICON_MAP.forEach(({ pattern, emoji }) => {
      result = result.replace(pattern, emoji);
    });
    return result;
  }

  /**
   * Scans image canvas pixels for distinctive visual emoji color signatures.
   * (e.g. Yellow face emojis, Red heart emojis, Orange fire emojis, Blue tears)
   * @param {HTMLImageElement|Image} img 
   * @returns {string[]} Array of detected visual emoji characters
   */
  function scanCanvasVisualEmojis(img) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const w = Math.min(img.naturalWidth || img.width || 400, 400);
      const h = Math.min(img.naturalHeight || img.height || 400, 400);
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const totalPixels = w * h;

      let yellowCount = 0; // Yellow face emojis (😊, 😂, 😍)
      let redCount = 0;    // Red heart / Love / Angry (❤️, 😡)
      let orangeCount = 0; // Fire (🔥)
      let blueCount = 0;   // Tears / Crying (😢, 😭)

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) continue; // Skip transparent

        // Yellow face signature: High R, High G, Low B
        if (r > 220 && g > 180 && b < 80) {
          yellowCount++;
        }
        // Red heart signature: High R, Low G, Low B
        else if (r > 200 && g < 60 && b < 80) {
          redCount++;
        }
        // Orange fire signature: High R, Mid G, Low B
        else if (r > 230 && g >= 90 && g <= 170 && b < 60) {
          orangeCount++;
        }
        // Blue tear signature: Low R, Mid G, High B
        else if (r < 80 && g > 120 && b > 200) {
          blueCount++;
        }
      }

      const detected = [];
      const threshold = Math.max(12, totalPixels * 0.0008); // Sensitive to small emoji icons in comments

      if (orangeCount >= threshold) detected.push('🔥');
      if (redCount >= threshold) detected.push('❤️');
      if (yellowCount >= threshold) detected.push('😊');
      if (blueCount >= threshold) detected.push('😢');

      return detected;
    } catch (e) {
      console.warn('Canvas visual emoji scan skipped:', e);
      return [];
    }
  }

  /**
   * Validates uploaded file type and size.
   * @param {File} file 
   * @returns {string|null} Error string if invalid, null if valid
   */
  function validateImageFile(file) {
    if (!file) return 'Please select an image file to proceed.';
    const config = window.CONFIG || {
      MAX_OCR_FILE_SIZE: 10 * 1024 * 1024,
      SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    };

    if (!config.SUPPORTED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      return 'Unsupported file type. Please upload a JPG, JPEG, PNG, or WEBP image.';
    }

    if (file.size > config.MAX_OCR_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return `File size is ${sizeMB}MB, which exceeds the 10MB limit. Please upload a smaller image.`;
    }

    return null;
  }

  /**
   * Configures an interactive drag-and-drop zone.
   */
  function setupDropzone({ dropzoneEl, inputEl, browseBtnEl, onFileSelected }) {
    if (!dropzoneEl || !inputEl) return;

    if (browseBtnEl) {
      browseBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        inputEl.click();
      });
    }

    dropzoneEl.addEventListener('click', () => inputEl.click());

    inputEl.addEventListener('change', () => {
      if (inputEl.files && inputEl.files[0]) {
        onFileSelected(inputEl.files[0]);
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzoneEl.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneEl.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzoneEl.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneEl.classList.remove('dragover');
      });
    });

    dropzoneEl.addEventListener('drop', (e) => {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelected(e.dataTransfer.files[0]);
      }
    });
  }

  /**
   * Executes OCR on an image file and extracts text + emojis.
   */
  function processImage({
    file,
    imgPreviewEl,
    progressWrapEl,
    progressFillEl,
    progressLabelEl,
    errorEl,
    resultWrapEl,
    textAreaEl,
    detectedEmojisBadgeEl,
    onSuccess,
    onError
  }) {
    if (errorEl) {
      errorEl.classList.remove('active');
      errorEl.textContent = '';
    }
    if (resultWrapEl) {
      resultWrapEl.classList.remove('active');
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      if (errorEl) {
        errorEl.textContent = validationError;
        errorEl.classList.add('active');
      }
      if (onError) onError(validationError);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    if (imgPreviewEl) {
      imgPreviewEl.src = objectUrl;
    }

    if (progressWrapEl) progressWrapEl.classList.add('active');
    if (progressFillEl) progressFillEl.style.width = '8%';
    if (progressLabelEl) progressLabelEl.textContent = 'Initializing OCR & Emoji Detection...';

    if (typeof Tesseract === 'undefined') {
      const msg = 'Tesseract OCR engine is unavailable. Please check your internet connection and refresh the page.';
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.add('active');
      }
      if (progressWrapEl) progressWrapEl.classList.remove('active');
      if (onError) onError(msg);
      return;
    }

    // Step 1: Run Tesseract text recognition
    Tesseract.recognize(file, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          const pct = Math.max(15, Math.round((m.progress || 0) * 100));
          if (progressFillEl) progressFillEl.style.width = `${pct}%`;
          if (progressLabelEl) progressLabelEl.textContent = `Extracting text & emojis: ${pct}%...`;
        } else if (m.status) {
          const statusText = m.status.charAt(0).toUpperCase() + m.status.slice(1);
          if (progressLabelEl) progressLabelEl.textContent = `${statusText}...`;
          if (progressFillEl) progressFillEl.style.width = '20%';
        }
      }
    })
    .then(({ data }) => {
      if (progressFillEl) progressFillEl.style.width = '100%';
      if (progressLabelEl) progressLabelEl.textContent = 'Extraction complete!';

      let rawExtracted = (data && data.text ? data.text.trim() : '');

      // Step 2: Convert ASCII emoticons, shortcodes, and artifacts to Unicode emojis
      let finalExtractedText = convertEmoticonsToEmojis(rawExtracted);

      // Step 3: Scan visual image pixels for prominent emoji color signatures
      const imgObj = new Image();
      imgObj.onload = () => {
        const visualEmojis = scanCanvasVisualEmojis(imgObj);
        
        // If visual emojis were found and are not already in text, append them
        if (visualEmojis.length > 0) {
          const existingText = finalExtractedText;
          const missingEmojis = visualEmojis.filter(emo => !existingText.includes(emo));
          if (missingEmojis.length > 0) {
            finalExtractedText = (finalExtractedText ? finalExtractedText + ' ' : '') + missingEmojis.join(' ');
          }

          if (detectedEmojisBadgeEl) {
            detectedEmojisBadgeEl.innerHTML = `✨ Visual Emojis Detected: <strong>${visualEmojis.join(' ')}</strong>`;
            detectedEmojisBadgeEl.style.display = 'inline-flex';
          }
        } else {
          if (detectedEmojisBadgeEl) {
            detectedEmojisBadgeEl.style.display = 'none';
          }
        }

        if (textAreaEl) {
          textAreaEl.value = finalExtractedText;
          textAreaEl.dispatchEvent(new Event('input'));
        }

        if (!finalExtractedText) {
          if (errorEl) {
            errorEl.textContent = 'No readable text or emojis were recognized in the image. Try uploading a clearer, higher-contrast screenshot.';
            errorEl.classList.add('active');
          }
        }

        if (resultWrapEl) {
          resultWrapEl.classList.add('active');
        }

        setTimeout(() => {
          if (progressWrapEl) progressWrapEl.classList.remove('active');
        }, 600);

        if (onSuccess) onSuccess(finalExtractedText);
      };

      imgObj.onerror = () => {
        if (textAreaEl) {
          textAreaEl.value = finalExtractedText;
          textAreaEl.dispatchEvent(new Event('input'));
        }
        if (resultWrapEl) resultWrapEl.classList.add('active');
        setTimeout(() => {
          if (progressWrapEl) progressWrapEl.classList.remove('active');
        }, 600);
        if (onSuccess) onSuccess(finalExtractedText);
      };

      imgObj.src = objectUrl;
    })
    .catch(err => {
      console.error('OCR processing error:', err);
      const errMsg = 'OCR processing encountered an unexpected issue. Please try a different image.';
      if (errorEl) {
        errorEl.textContent = errMsg;
        errorEl.classList.add('active');
      }
      if (progressWrapEl) progressWrapEl.classList.remove('active');
      if (onError) onError(errMsg);
    });
  }

  return {
    convertEmoticonsToEmojis,
    scanCanvasVisualEmojis,
    validateImageFile,
    setupDropzone,
    processImage
  };
})();

if (typeof window !== 'undefined') {
  window.OCREngine = OCREngine;
}
