import Sentiment from 'sentiment';
import Filter from 'bad-words';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ToneAnalyzer {
  constructor() {
    this.sentiment = new Sentiment();
    this.filter = new Filter();

    // Load rules from config
    const rulesPath = join(__dirname, '../config/rules.json');
    this.rules = JSON.parse(readFileSync(rulesPath, 'utf-8'));

    // Add custom words to profanity filter
    this.filter.addWords(...this.rules.toxicPatterns);
  }

  /**
   * Analyze text for tone, sentiment, and rule violations
   * @param {string} text - Text to analyze
   * @param {string} speaker - Name of the speaker
   * @returns {Object} Analysis result with violations and scores
   */
  analyze(text, speaker = 'Unknown') {
    const lowerText = text.toLowerCase();
    const result = {
      speaker,
      text,
      timestamp: new Date().toISOString(),
      violations: [],
      scores: {
        sentiment: 0,
        toxic: 0,
        condescending: 0,
        dismissive: 0
      },
      shouldAlert: false,
      alertMessage: null
    };

    // Sentiment analysis
    const sentimentResult = this.sentiment.analyze(text);
    result.scores.sentiment = sentimentResult.score;

    // Check for profanity and toxic language
    if (this.filter.isProfane(text)) {
      result.violations.push('toxic_language');
      result.scores.toxic++;
    }

    // Check for specific toxic patterns
    for (const pattern of this.rules.toxicPatterns) {
      if (lowerText.includes(pattern.toLowerCase())) {
        result.violations.push('toxic_pattern');
        result.scores.toxic++;
        break;
      }
    }

    // Check for condescending patterns
    for (const pattern of this.rules.condescendingPatterns) {
      if (lowerText.includes(pattern.toLowerCase())) {
        result.violations.push('condescending');
        result.scores.condescending++;
        break;
      }
    }

    // Check for dismissive patterns
    for (const pattern of this.rules.dismissivePatterns) {
      if (lowerText.includes(pattern.toLowerCase())) {
        result.violations.push('dismissive');
        result.scores.dismissive++;
        break;
      }
    }

    // Determine if we should alert
    const thresholds = this.rules.thresholds;

    if (result.scores.toxic >= thresholds.toxicityCount) {
      result.shouldAlert = true;
      result.alertMessage = this.rules.warnings.toxic;
    } else if (result.scores.condescending >= thresholds.condescendingCount) {
      result.shouldAlert = true;
      result.alertMessage = this.rules.warnings.condescending;
    } else if (result.scores.dismissive >= thresholds.dismissiveCount) {
      result.shouldAlert = true;
      result.alertMessage = this.rules.warnings.dismissive;
    } else if (result.scores.sentiment <= thresholds.sentimentScore) {
      result.shouldAlert = true;
      result.alertMessage = this.rules.warnings.negative;
    }

    return result;
  }

  /**
   * Get rules of engagement
   * @returns {Object} Rules configuration
   */
  getRules() {
    return this.rules.rulesOfEngagement;
  }

  /**
   * Check if text is generally negative or hostile
   * @param {string} text - Text to check
   * @returns {boolean} True if negative/hostile
   */
  isNegative(text) {
    const result = this.analyze(text);
    return result.shouldAlert;
  }
}

export default ToneAnalyzer;
