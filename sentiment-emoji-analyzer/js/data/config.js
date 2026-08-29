/**
 * Sentiment Analyzer - Central Configuration
 * All analysis parameters, weights, and classification thresholds are defined here.
 */

const CONFIG = {
  // Classification Thresholds
  SENTIMENT_POSITIVE_THRESHOLD: 5,
  SENTIMENT_NEGATIVE_THRESHOLD: -5,

  // Mathematical Weights and Normalization Factors
  EMOJI_WEIGHT: 1.5,
  WORD_WEIGHT: 1.0,
  NEGATION_FACTOR: -0.74,
  NEGATION_LOOKBACK: 3,
  NORMALIZATION_ALPHA: 15, // Alpha parameter in compound normalization: sqrt(x^2 + 15)
  EMOJI_REPETITION_FACTOR: 0.2, // 1 + 0.2 * (count - 1)

  // Maximum allowed image size for OCR in bytes (10MB)
  MAX_OCR_FILE_SIZE: 10 * 1024 * 1024,
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],

  // Intensifier Modifiers (Lookback: 1 token)
  INTENSIFIERS: {
    'very': 1.30,
    'really': 1.25,
    'extremely': 1.50,
    'absolutely': 1.40,
    'so': 1.20,
    'totally': 1.30,
    'incredibly': 1.40,
    'super': 1.25,
    'highly': 1.30,
    'deeply': 1.35,
    'exceptionally': 1.45,
    'genuinely': 1.25,
    'tremendously': 1.40,
    'immensely': 1.45,
    'hugely': 1.30,
    'extraordinarily': 1.50,
    'ultra': 1.35,
    'massively': 1.40
  },

  // Diminisher Modifiers (Lookback: 1 or 2 tokens)
  DIMINISHERS: {
    'slightly': 0.60,
    'somewhat': 0.70,
    'kinda': 0.70,
    'kind of': 0.70,
    'a bit': 0.75,
    'barely': 0.50,
    'hardly': 0.50,
    'marginally': 0.65,
    'moderately': 0.75,
    'partially': 0.70,
    'scarcely': 0.50,
    'a little': 0.75,
    'sort of': 0.70
  },

  // Negation tokens
  NEGATIONS: new Set([
    'not', 'never', 'no', "can't", 'cant', 'cannot', "don't", 'dont',
    "didn't", 'didnt', "won't", 'wont', "isn't", 'isnt', "wasn't", 'wasnt',
    "aren't", 'arent', "weren't", 'werent', "haven't", 'havent', "hasn't", 'hasnt',
    "hadn't", 'hadnt', "couldn't", 'couldnt', "shouldn't", 'shouldnt', "wouldn't", 'wouldnt',
    'without', 'hardly', 'barely', 'scarcely', 'neither', 'nor', 'nothing', 'nowhere'
  ]),

  // Emotion Display Properties
  EMOTION_LABELS: {
    happy: 'Happy',
    excited: 'Excited',
    love: 'Love',
    joy: 'Joy',
    celebration: 'Celebration',
    appreciation: 'Appreciation',
    sad: 'Sad',
    disappointed: 'Disappointed',
    angry: 'Angry',
    frustrated: 'Frustrated',
    fearful: 'Fearful',
    neutral: 'Neutral',
    curious: 'Curious',
    doubtful: 'Doubtful'
  },

  EMOTION_ICONS: {
    happy: '😊',
    excited: '🔥',
    love: '❤️',
    joy: '😁',
    celebration: '🎉',
    appreciation: '🙏',
    sad: '😢',
    disappointed: '😞',
    angry: '😡',
    frustrated: '😤',
    fearful: '😨',
    neutral: '😐',
    curious: '🤔',
    doubtful: '🙃'
  },

  // Quick Emoji Insertion List for UI
  QUICK_EMOJIS: ['🔥', '❤️', '😍', '🙌', '🎉', '😊', '😂', '👍', '😢', '💔', '😭', '😡', '😤', '👎', '💀', '🙃', '🤔', '💯']
};

if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
