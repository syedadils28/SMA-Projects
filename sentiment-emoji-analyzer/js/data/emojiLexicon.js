/**
 * Sentiment Analyzer - Emoji Lexicon
 * Structured emoji database with polarity, emotion category, intensity, and sarcasm indicators.
 */

const EMOJI_LEXICON = {
  // Positive & Excited / Loving
  '🔥': { meaning: 'Excitement / Fire', emotion: 'excited', polarity: 'positive', intensity: 4, sarcasm: false },
  '❤️': { meaning: 'Love / Affection', emotion: 'love', polarity: 'positive', intensity: 4, sarcasm: false },
  '💖': { meaning: 'Sparkling Heart', emotion: 'love', polarity: 'positive', intensity: 4, sarcasm: false },
  '💕': { meaning: 'Two Hearts', emotion: 'love', polarity: 'positive', intensity: 3, sarcasm: false },
  '😍': { meaning: 'Adoration / Heart Eyes', emotion: 'love', polarity: 'positive', intensity: 4, sarcasm: false },
  '🥰': { meaning: 'Warm Affection', emotion: 'love', polarity: 'positive', intensity: 4, sarcasm: false },
  '😘': { meaning: 'Blow Kiss', emotion: 'love', polarity: 'positive', intensity: 3, sarcasm: false },
  '🙌': { meaning: 'Celebration / Praise', emotion: 'celebration', polarity: 'positive', intensity: 3, sarcasm: false },
  '🎉': { meaning: 'Party Popper', emotion: 'celebration', polarity: 'positive', intensity: 4, sarcasm: false },
  '🥳': { meaning: 'Partying Face', emotion: 'celebration', polarity: 'positive', intensity: 4, sarcasm: false },
  '🏆': { meaning: 'Trophy / Victory', emotion: 'celebration', polarity: 'positive', intensity: 4, sarcasm: false },
  '🚀': { meaning: 'Rocket / High Growth', emotion: 'excited', polarity: 'positive', intensity: 4, sarcasm: false },
  '⚡': { meaning: 'High Energy', emotion: 'excited', polarity: 'positive', intensity: 3, sarcasm: false },
  '🤩': { meaning: 'Star-Struck', emotion: 'excited', polarity: 'positive', intensity: 4, sarcasm: false },

  // Positive & Happy / Joyful / Appreciation
  '😊': { meaning: 'Smiling / Warmth', emotion: 'happy', polarity: 'positive', intensity: 2, sarcasm: false },
  '😀': { meaning: 'Grinning Face', emotion: 'happy', polarity: 'positive', intensity: 2, sarcasm: false },
  '😃': { meaning: 'Big Grin', emotion: 'happy', polarity: 'positive', intensity: 2, sarcasm: false },
  '😄': { meaning: 'Happy Eyes Grin', emotion: 'happy', polarity: 'positive', intensity: 3, sarcasm: false },
  '😁': { meaning: 'Beaming Joy', emotion: 'happy', polarity: 'positive', intensity: 2, sarcasm: false },
  '😂': { meaning: 'Tears of Joy', emotion: 'joy', polarity: 'positive', intensity: 3, sarcasm: false },
  '🤣': { meaning: 'Rolling Laughing', emotion: 'joy', polarity: 'positive', intensity: 4, sarcasm: false },
  '✨': { meaning: 'Sparkles / Delight', emotion: 'joy', polarity: 'positive', intensity: 2, sarcasm: false },
  '🌟': { meaning: 'Glowing Star', emotion: 'joy', polarity: 'positive', intensity: 2, sarcasm: false },
  '👍': { meaning: 'Thumbs Up / Approval', emotion: 'appreciation', polarity: 'positive', intensity: 2, sarcasm: false },
  '👏': { meaning: 'Clapping Hands', emotion: 'appreciation', polarity: 'positive', intensity: 3, sarcasm: false },
  '🙏': { meaning: 'Folded Hands / Thanks', emotion: 'appreciation', polarity: 'positive', intensity: 3, sarcasm: false },
  '💯': { meaning: 'Hundred Points', emotion: 'appreciation', polarity: 'positive', intensity: 3, sarcasm: false },
  '💪': { meaning: 'Flexed Biceps / Strength', emotion: 'excited', polarity: 'positive', intensity: 3, sarcasm: false },
  '🤝': { meaning: 'Handshake / Agreement', emotion: 'appreciation', polarity: 'positive', intensity: 2, sarcasm: false },

  // Negative - Sadness, Grief & Disappointment
  '😢': { meaning: 'Crying Face', emotion: 'sad', polarity: 'negative', intensity: 3, sarcasm: false },
  '😭': { meaning: 'Loudly Crying', emotion: 'sad', polarity: 'negative', intensity: 4, sarcasm: false },
  '💔': { meaning: 'Broken Heart', emotion: 'sad', polarity: 'negative', intensity: 4, sarcasm: false },
  '🥺': { meaning: 'Pleading / Vulnerable', emotion: 'sad', polarity: 'negative', intensity: 2, sarcasm: false },
  '😔': { meaning: 'Pensive / Regret', emotion: 'sad', polarity: 'negative', intensity: 2, sarcasm: false },
  '😞': { meaning: 'Disappointed Face', emotion: 'disappointed', polarity: 'negative', intensity: 3, sarcasm: false },
  '👎': { meaning: 'Thumbs Down', emotion: 'disappointed', polarity: 'negative', intensity: 2, sarcasm: false },
  '🥀': { meaning: 'Wilted Flower', emotion: 'sad', polarity: 'negative', intensity: 3, sarcasm: false },
  '😿': { meaning: 'Crying Cat', emotion: 'sad', polarity: 'negative', intensity: 2, sarcasm: false },

  // Negative - Anger & Frustration
  '😡': { meaning: 'Enraged / Angry Face', emotion: 'angry', polarity: 'negative', intensity: 4, sarcasm: false },
  '😠': { meaning: 'Angry / Grumpy Face', emotion: 'angry', polarity: 'negative', intensity: 3, sarcasm: false },
  '🤬': { meaning: 'Cursing / Outraged', emotion: 'angry', polarity: 'negative', intensity: 4, sarcasm: false },
  '😤': { meaning: 'Huffing / Frustrated', emotion: 'frustrated', polarity: 'negative', intensity: 3, sarcasm: false },
  '😩': { meaning: 'Weary / Exhausted', emotion: 'frustrated', polarity: 'negative', intensity: 3, sarcasm: false },
  '😫': { meaning: 'Tired / Stressed', emotion: 'frustrated', polarity: 'negative', intensity: 3, sarcasm: false },
  '🤦': { meaning: 'Facepalm / Exasperation', emotion: 'frustrated', polarity: 'negative', intensity: 3, sarcasm: false },
  '🤦‍♂️': { meaning: 'Man Facepalm', emotion: 'frustrated', polarity: 'negative', intensity: 3, sarcasm: false },
  '🤦‍♀️': { meaning: 'Woman Facepalm', emotion: 'frustrated', polarity: 'negative', intensity: 3, sarcasm: false },

  // Negative - Fear & Shock
  '😱': { meaning: 'Face Screaming in Fear', emotion: 'fearful', polarity: 'negative', intensity: 4, sarcasm: false },
  '😨': { meaning: 'Scared Face', emotion: 'fearful', polarity: 'negative', intensity: 3, sarcasm: false },
  '😰': { meaning: 'Anxious Sweat', emotion: 'fearful', polarity: 'negative', intensity: 3, sarcasm: false },
  '😬': { meaning: 'Grimacing / Nervous', emotion: 'fearful', polarity: 'negative', intensity: 2, sarcasm: false },

  // Sarcasm / Irony / Contradiction Markers
  '🙃': { meaning: 'Upside-Down Face / Irony', emotion: 'doubtful', polarity: 'neutral', intensity: 2, sarcasm: true },
  '💀': { meaning: 'Skull / Deadpan / Ironic Disbelief', emotion: 'doubtful', polarity: 'negative', intensity: 3, sarcasm: true },
  '☠️': { meaning: 'Skull & Crossbones', emotion: 'doubtful', polarity: 'negative', intensity: 3, sarcasm: true },
  '🙄': { meaning: 'Face with Rolling Eyes', emotion: 'frustrated', polarity: 'negative', intensity: 2, sarcasm: true },
  '🤡': { meaning: 'Clown Face / Mockery', emotion: 'disappointed', polarity: 'negative', intensity: 3, sarcasm: true },
  '💅': { meaning: 'Nail Polish / Sassy Nonchalance', emotion: 'curious', polarity: 'neutral', intensity: 2, sarcasm: true },

  // Neutral, Doubt & Curiosity
  '😐': { meaning: 'Neutral Face', emotion: 'neutral', polarity: 'neutral', intensity: 1, sarcasm: false },
  '😑': { meaning: 'Expressionless Face', emotion: 'neutral', polarity: 'neutral', intensity: 1, sarcasm: false },
  '🤔': { meaning: 'Thinking Face / Inquisitive', emotion: 'curious', polarity: 'neutral', intensity: 2, sarcasm: false },
  '🧐': { meaning: 'Face with Monocle', emotion: 'curious', polarity: 'neutral', intensity: 2, sarcasm: false },
  '😅': { meaning: 'Grinning with Sweat / Relief', emotion: 'curious', polarity: 'neutral', intensity: 1, sarcasm: false },
  '😕': { meaning: 'Confused Face', emotion: 'doubtful', polarity: 'neutral', intensity: 2, sarcasm: false },
  '🤨': { meaning: 'Raised Eyebrow / Skeptical', emotion: 'doubtful', polarity: 'neutral', intensity: 2, sarcasm: false },
  '🤷': { meaning: 'Shrug / Ambivalence', emotion: 'neutral', polarity: 'neutral', intensity: 1, sarcasm: false },
  '🤷‍♂️': { meaning: 'Man Shrug', emotion: 'neutral', polarity: 'neutral', intensity: 1, sarcasm: false },
  '🤷‍♀️': { meaning: 'Woman Shrug', emotion: 'neutral', polarity: 'neutral', intensity: 1, sarcasm: false }
};

if (typeof window !== 'undefined') {
  window.EMOJI_LEXICON = EMOJI_LEXICON;
}
