import LanguageModel from './language_model.js'
import * as Constants from './constants.js'
import Feature from './feature.js'
import FeatureType from './feature_type.js'

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class GreekLanguageModel extends LanguageModel {
   /**
   * @constructor
   */
  constructor () {
    super()
    this.sourceLanguage = Constants.LANG_GREEK
    this.contextForward = 0
    this.contextBackward = 0
    this.direction = Constants.LANG_DIR_LTR
    this.baseUnit = Constants.LANG_UNIT_WORD
    this.languageCodes = [Constants.STR_LANG_CODE_GRC]
    this.features = this._initializeFeatures()
  }

  _initializeFeatures () {
    let features = {}
    let code = this.toCode()
    features[Feature.types.part] = new FeatureType(Feature.types.part, ['noun', 'adjective', 'verb', 'pronoun', 'article', 'numeral', 'conjunction'], code)
    features[Feature.types.number] = new FeatureType(Feature.types.number, ['singular', 'plural', 'dual'], code)
    features[Feature.types.grmCase] = new FeatureType(Feature.types.grmCase, ['nominative', 'genitive', 'dative', 'accusative', 'vocative'], code)
    features[Feature.types.declension] = new FeatureType(Feature.types.declension, ['first', 'second', 'third'], code)
    features[Feature.types.gender] = new FeatureType(Feature.types.gender, ['masculine', 'feminine', 'neuter'], code)
    features[Feature.types.type] = new FeatureType(Feature.types.type, ['regular', 'irregular'], code)
    features[Feature.types.tense] = new FeatureType(Feature.types.tense, ['present', 'future', 'perfect', 'pluperfect', 'future perfect', 'aorist'], code)
    features[Feature.types.voice] = new FeatureType(Feature.types.voice, ['passive', 'active', 'mediopassive', 'middle'], code)
    features[Feature.types.mood] = new FeatureType(Feature.types.mood, ['indicative', 'subjunctive', 'optative', 'imperative'], code)
    features[Feature.types.person] = new FeatureType(Feature.types.person, ['first', 'second', 'third'], code)
    features[Feature.types.dialect] = new FeatureType(Feature.types.person, ['attic', 'epic', 'doric'], code)
    return features
  }

  toCode () {
    return Constants.STR_LANG_CODE_GRC
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return true
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {String} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    return word
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return ".,;:!?'\"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r"
  }
}
export default GreekLanguageModel
