(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.AlpheiosDataModels = {})));
}(this, (function (exports) { 'use strict';

const LANG_UNIT_WORD = Symbol('word');
const LANG_UNIT_CHAR = Symbol('char');
const LANG_DIR_LTR = Symbol('ltr');
const LANG_DIR_RTL = Symbol('rtl');
const LANG_LATIN = Symbol('latin');
const LANG_GREEK = Symbol('greek');
const LANG_ARABIC = Symbol('arabic');
const LANG_PERSIAN = Symbol('persian');
const STR_LANG_CODE_LAT = 'lat';
const STR_LANG_CODE_LA = 'la';
const STR_LANG_CODE_GRC = 'grc';
const STR_LANG_CODE_ARA = 'ara';
const STR_LANG_CODE_AR = 'ar';
const STR_LANG_CODE_FAR = 'far';
const STR_LANG_CODE_PER = 'per';


var constants = Object.freeze({
	LANG_UNIT_WORD: LANG_UNIT_WORD,
	LANG_UNIT_CHAR: LANG_UNIT_CHAR,
	LANG_DIR_LTR: LANG_DIR_LTR,
	LANG_DIR_RTL: LANG_DIR_RTL,
	LANG_LATIN: LANG_LATIN,
	LANG_GREEK: LANG_GREEK,
	LANG_ARABIC: LANG_ARABIC,
	LANG_PERSIAN: LANG_PERSIAN,
	STR_LANG_CODE_LAT: STR_LANG_CODE_LAT,
	STR_LANG_CODE_LA: STR_LANG_CODE_LA,
	STR_LANG_CODE_GRC: STR_LANG_CODE_GRC,
	STR_LANG_CODE_ARA: STR_LANG_CODE_ARA,
	STR_LANG_CODE_AR: STR_LANG_CODE_AR,
	STR_LANG_CODE_FAR: STR_LANG_CODE_FAR,
	STR_LANG_CODE_PER: STR_LANG_CODE_PER
});

/**
 * @class  LanguageModel is the base class for language-specific behavior
 */
class LanguageModel {
   /**
   */
  constructor () {
    this.sourceLanguage = null;
    this.contextForward = 0;
    this.context_backward = 0;
    this.direction = LANG_DIR_LTR;
    this.baseUnit = LANG_UNIT_WORD;
    this.codes = [];
    this.features = {}; // Grammatical feature types (definitions) within supported by a specific language.
  }

  /**
   * Handler which can be used as the contextHander.
   * It uses language-specific configuration to identify
   * the elements from the alph-text popup which should produce links
   * to the language-specific grammar.
   * @see #contextHandler
   */
  grammarContext (doc) {
      // used to bind a click handler on the .alph-entry items in the
      // popup which retrieved the context attribute from the clicked
      // term and used that to construct a link and open the grammar
      // at the apporopriate place.
      // var links = this.getGrammarLinks();

      // for (var link_name in links)
      // {
      //   if (links.hasOwnProperty(link_name))
      //    {
              // Alph.$(".alph-entry ." + link_name,a_doc).bind('click',link_name,
              //   function(a_e)
              //    {
                        // build target inside grammar
                        // var target = a_e.data;
                        // var rngContext = Alph.$(this).attr("context");
                        // if (rngContext != null)
                        // {
                        //  target += "-" + rngContext.split(/-/)[0];
                        // }
                        // myobj.openGrammar(a_e.originaEvent,this,target);
               //   }
              // );
       //   }
      // }
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return false
  }

  /**
   * Check to see if the supplied language code is supported by this tool
   * @param {string} code the language code
   * @returns true if supported false if not
   * @type Boolean
   */
  static supportsLanguage (code) {
    return this.codes.includes[code]
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {string} word the source word
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

  toString () {
    return String(this.sourceLanguage)
  }

  isEqual (model) {
    return this.sourceLanguage === model.sourceLanguage
  }

  toCode () {
    return null
  }
}

/**
 * Wrapper class for a (grammatical, usually) feature, such as part of speech or declension. Keeps both value and type information.
 */
class Feature {
    /**
     * Initializes a Feature object
     * @param {string | string[]} value - A single feature value or, if this feature could have multiple
     * values, an array of values.
     * @param {string} type - A type of the feature, allowed values are specified in 'types' object.
     * @param {string} language - A language of a feature, allowed values are specified in 'languages' object.
     */
  constructor (value, type, language) {
    if (!Feature.types.isAllowed(type)) {
      throw new Error('Features of "' + type + '" type are not supported.')
    }
    if (!value) {
      throw new Error('Feature should have a non-empty value.')
    }
    if (!type) {
      throw new Error('Feature should have a non-empty type.')
    }
    if (!language) {
      throw new Error('Feature constructor requires a language')
    }
    this.value = value;
    this.type = type;
    this.language = language;
  };

  isEqual (feature) {
    if (Array.isArray(feature.value)) {
      if (!Array.isArray(this.value) || this.value.length !== feature.value.length) {
        return false
      }
      let equal = this.type === feature.type && this.language === feature.language;
      equal = equal && this.value.every(function (element, index) {
        return element === feature.value[index]
      });
      return equal
    } else {
      return this.value === feature.value && this.type === feature.type && this.language === feature.language
    }
  }
}
// Should have no spaces in values in order to be used in HTML templates
Feature.types = {
  word: 'word',
  part: 'part of speech', // Part of speech
  number: 'number',
  grmCase: 'case',
  declension: 'declension',
  gender: 'gender',
  type: 'type',
  conjugation: 'conjugation',
  tense: 'tense',
  voice: 'voice',
  mood: 'mood',
  person: 'person',
  frequency: 'frequency', // How frequent this word is
  meaning: 'meaning', // Meaning of a word
  source: 'source', // Source of word definition
  footnote: 'footnote', // A footnote for a word's ending
  dialect: 'dialect', // a dialect iderntifier
  isAllowed (value) {
    let v = `${value}`;
    return Object.values(this).includes(v)
  }
};

/**
 * Definition class for a (grammatical) feature. Stores type information and (optionally) all possible values of the feature.
 * It serves as a feature generator. If list of possible values is provided, it can generate a Feature object
 * each time a property that corresponds to a feature value is accessed. If no list of possible values provided,
 * a Feature object can be generated with get(value) method.
 *
 * An order of values determines a default sort and grouping order. If two values should have the same order,
 * they should be grouped within an array: value1, [value2, value3], value4. Here 'value2' and 'value3' have
 * the same priority for sorting and grouping.
 */
class FeatureType {
    // TODO: value checking
    /**
     * Creates and initializes a Feature Type object.
     * @param {string} type - A type of the feature, allowed values are specified in 'types' object.
     * @param {string[] | string[][]} values - A list of allowed values for this feature type.
     * If an empty array is provided, there will be no
     * allowed values as well as no ordering (can be used for items that do not need or have a simple order,
     * such as footnotes).
     * @param {string} language - A language of a feature, allowed values are specified in 'languages' object.
     */
  constructor (type, values, language) {
    if (!Feature.types.isAllowed(type)) {
      throw new Error('Features of "' + type + '" type are not supported.')
    }
    if (!values || !Array.isArray(values)) {
      throw new Error('Values should be an array (or an empty array) of values.')
    }
    if (!language) {
      throw new Error('FeatureType constructor requires a language')
    }

    this.type = type;
    this.language = language;

        /*
         This is a sort order index for a grammatical feature values. It is determined by the order of values in
         a 'values' array.
         */
    this._orderIndex = [];
    this._orderLookup = {};

    for (const [index, value] of values.entries()) {
      this._orderIndex.push(value);
      if (Array.isArray(value)) {
        for (let element of value) {
          this[element] = new Feature(element, this.type, this.language);
          this._orderLookup[element] = index;
        }
      } else {
        this[value] = new Feature(value, this.type, this.language);
        this._orderLookup[value] = index;
      }
    }
  };

    /**
     * Return a Feature with an arbitrary value. This value would not be necessarily present among FeatureType values.
     * This can be especially useful for features that do not set: a list of predefined values, such as footnotes.
     * @param value
     * @returns {Feature}
     */
  get (value) {
    if (value) {
      return new Feature(value, this.type, this.language)
    } else {
      throw new Error('A non-empty value should be provided.')
    }
  }

    /**
     * Creates and returns a new importer with a specific name. If an importer with this name already exists,
     * an existing Importer object will be returned.
     * @param {string} name - A name of an importer object
     * @returns {Importer} A new or existing Importer object that matches a name provided
     */
  addImporter (name) {
    if (!name) {
      throw new Error('Importer should have a non-empty name.')
    }
    this.importer = this.importer || {};
    this.importer[name] = this.importer[name] || new Importer();
    return this.importer[name]
  }

    /**
     * Return copies of all feature values as Feature objects in a sorted array, according to feature type's sort order.
     * For a similar function that returns strings instead of Feature objects see orderedValues().
     * @returns {Feature[] | Feature[][]} Array of feature values sorted according to orderIndex.
     * If particular feature contains multiple feature values (i.e. `masculine` and `feminine` values combined),
     * an array of Feature objects will be returned instead of a single Feature object, as for single feature values.
     */
  get orderedFeatures () {
    return this.orderedValues.map((value) => new Feature(value, this.type, this.language))
  }

    /**
     * Return all feature values as strings in a sorted array, according to feature type's sort order.
     * This is a main method that specifies a sort order of the feature type. orderedFeatures() relies
     * on this method in providing a sorted array of feature values. If you want to create
     * a custom sort order for a particular feature type that will depend on some options that are not type-related,
     * create a wrapper around this function providing it with options arguments so it will be able to decide
     * in what order those features will be based on those arguments.
     * For a similar function that returns Feature objects instead of strings see orderedValues().
     * @returns {string[]} Array of feature values sorted according to orderIndex.
     * If particular feature contains multiple feature values (i.e. `masculine` and `feminine` values combined),
     * an array of strings will be returned instead of a single strings, as for single feature values.
     */
  get orderedValues () {
    return this._orderIndex
  }

    /**
     * Returns a lookup table for type values as:
     *  {value1: order1, value2: order2}, where order is a sort order of an item. If two items have the same sort order,
     *  their order value will be the same.
     * @returns {object}
     */
  get orderLookup () {
    return this._orderLookup
  }

    /**
     * Sets an order of grammatical feature values for a grammatical feature. Used mostly for sorting, filtering,
     * and displaying.
     *
     * @param {Feature[] | Feature[][]} values - a list of grammatical features that specify their order for
     * sorting and filtering. Some features can be grouped as [[genders.masculine, genders.feminine], LibLatin.genders.neuter].
     * It means that genders.masculine and genders.feminine belong to the same group. They will have the same index
     * and will be stored inside an _orderIndex as an array. genders.masculine and genders.feminine will be grouped together
     * during filtering and will be in the same bin during sorting.
     *
     */
  set order (values) {
    if (!values || (Array.isArray(values) && values.length === 0)) {
      throw new Error('A non-empty list of values should be provided.')
    }

        // If a single value is provided, convert it into an array
    if (!Array.isArray(values)) {
      values = [values];
    }

    for (let value of values) {
      if (Array.isArray(value)) {
        for (let element of value) {
          if (!this.hasOwnProperty(element.value)) {
            throw new Error('Trying to order an element with "' + element.value + '" value that is not stored in a "' + this.type + '" type.')
          }

          if (element.type !== this.type) {
            throw new Error('Trying to order an element with type "' + element.type + '" that is different from "' + this.type + '".')
          }

          if (element.language !== this.language) {
            throw new Error('Trying to order an element with language "' + element.language + '" that is different from "' + this.language + '".')
          }
        }
      } else {
        if (!this.hasOwnProperty(value.value)) {
          throw new Error('Trying to order an element with "' + value.value + '" value that is not stored in a "' + this.type + '" type.')
        }

        if (value.type !== this.type) {
          throw new Error('Trying to order an element with type "' + value.type + '" that is different from "' + this.type + '".')
        }

        if (value.language !== this.language) {
          throw new Error('Trying to order an element with language "' + value.language + '" that is different from "' + this.language + '".')
        }
      }
    }

        // Erase whatever sort order was set previously
    this._orderLookup = {};
    this._orderIndex = [];

        // Define a new sort order
    for (const [index, element] of values.entries()) {
      if (Array.isArray(element)) {
                // If it is an array, all values should have the same order
        let elements = [];
        for (const subElement of element) {
          this._orderLookup[subElement.value] = index;
          elements.push(subElement.value);
        }
        this._orderIndex[index] = elements;
      } else {
                // If is a single value
        this._orderLookup[element.value] = index;
        this._orderIndex[index] = element.value;
      }
    }
  }
}

/**
 * This is a hash table that maps values to be imported from an external file or service to library standard values.
 */
class Importer {
  constructor () {
    this.hash = {};
    return this
  }

    /**
     * Sets mapping between external imported value and one or more library standard values. If an importedValue
     * is already in a hash table, old libraryValue will be overwritten with the new one.
     * @param {string} importedValue - External value
     * @param {Object | Object[] | string | string[]} libraryValue - Library standard value
     */
  map (importedValue, libraryValue) {
    if (!importedValue) {
      throw new Error('Imported value should not be empty.')
    }

    if (!libraryValue) {
      throw new Error('Library value should not be empty.')
    }

    this.hash[importedValue] = libraryValue;
    return this
  }

    /**
     * Checks if value is in a map.
     * @param {string} importedValue - A value to test.
     * @returns {boolean} - Tru if value is in a map, false otherwise.
     */
  has (importedValue) {
    return this.hash.hasOwnProperty(importedValue)
  }

    /**
     * Returns one or more library standard values that match an external value
     * @param {string} importedValue - External value
     * @returns {Object | string} One or more of library standard values
     */
  get (importedValue) {
    if (this.has(importedValue)) {
      return this.hash[importedValue]
    } else {
      throw new Error('A value "' + importedValue + '" is not found in the importer.')
    }
  }
}

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class LatinLanguageModel extends LanguageModel {
   /**
   */
  constructor () {
    super();
    this.sourceLanguage = LANG_LATIN;
    this.contextForward = 0;
    this.contextBackward = 0;
    this.direction = LANG_DIR_LTR;
    this.baseUnit = LANG_UNIT_WORD;
    this.codes = [STR_LANG_CODE_LA, STR_LANG_CODE_LAT];
    this.features = this._initializeFeatures();
  }

  _initializeFeatures () {
    let features = {};
    let code = this.toCode();
    features[Feature.types.part] = new FeatureType(Feature.types.part, ['noun', 'adjective', 'verb'], code);
    features[Feature.types.number] = new FeatureType(Feature.types.number, ['singular', 'plural'], code);
    features[Feature.types.grmCase] = new FeatureType(Feature.types.grmCase, ['nominative', 'genitive', 'dative', 'accusative', 'ablative', 'locative', 'vocative'], code);
    features[Feature.types.declension] = new FeatureType(Feature.types.declension, ['first', 'second', 'third', 'fourth', 'fifth'], code);
    features[Feature.types.gender] = new FeatureType(Feature.types.gender, ['masculine', 'feminine', 'neuter'], code);
    features[Feature.types.type] = new FeatureType(Feature.types.type, ['regular', 'irregular'], code);
    features[Feature.types.tense] = new FeatureType(Feature.types.tense, ['present', 'imperfect', 'future', 'perfect', 'pluperfect', 'future perfect'], code);
    features[Feature.types.voice] = new FeatureType(Feature.types.voice, ['passive', 'active'], code);
    features[Feature.types.mood] = new FeatureType(Feature.types.mood, ['indicative', 'subjunctive'], code);
    features[Feature.types.person] = new FeatureType(Feature.types.person, ['first', 'second', 'third'], code);
    features[Feature.types.conjugation] = new FeatureType(Feature.types.conjugation, ['first', 'second', 'third', 'fourth'], code);
    return features
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

  toCode () {
    return STR_LANG_CODE_LAT
  }
}

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class GreekLanguageModel extends LanguageModel {
   /**
   * @constructor
   */
  constructor () {
    super();
    this.sourceLanguage = LANG_GREEK;
    this.contextForward = 0;
    this.contextBackward = 0;
    this.direction = LANG_DIR_LTR;
    this.baseUnit = LANG_UNIT_WORD;
    this.languageCodes = [STR_LANG_CODE_GRC];
    this.features = this._initializeFeatures();
  }

  _initializeFeatures () {
    let features = {};
    let code = this.toCode();
    features[Feature.types.part] = new FeatureType(Feature.types.part, ['noun', 'adjective', 'verb', 'pronoun', 'article', 'numeral', 'conjunction', 'preoposition', 'interjection'], code);
    features[Feature.types.number] = new FeatureType(Feature.types.number, ['singular', 'plural', 'dual'], code);
    features[Feature.types.grmCase] = new FeatureType(Feature.types.grmCase, ['nominative', 'genitive', 'dative', 'accusative', 'vocative'], code);
    features[Feature.types.declension] = new FeatureType(Feature.types.declension, ['first', 'second', 'third'], code);
    features[Feature.types.gender] = new FeatureType(Feature.types.gender, ['masculine', 'feminine', 'neuter'], code);
    features[Feature.types.type] = new FeatureType(Feature.types.type, ['regular', 'irregular'], code);
    features[Feature.types.tense] = new FeatureType(Feature.types.tense, ['present', 'future', 'imperfect', 'perfect', 'pluperfect', 'future perfect', 'aorist'], code);
    features[Feature.types.voice] = new FeatureType(Feature.types.voice, ['passive', 'active', 'mediopassive', 'middle'], code);
    features[Feature.types.mood] = new FeatureType(Feature.types.mood, ['indicative', 'subjunctive', 'optative', 'imperative'], code);
    features[Feature.types.person] = new FeatureType(Feature.types.person, ['first', 'second', 'third'], code);
    features[Feature.types.dialect] = new FeatureType(Feature.types.dialect, ['attic', 'epic', 'doric'], code);
    return features
  }

  toCode () {
    return STR_LANG_CODE_GRC
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

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class ArabicLanguageModel extends LanguageModel {
   /**
   * @constructor
   */
  constructor () {
    super();
    this.sourceLanguage = LANG_ARABIC;
    this.contextForward = 0;
    this.contextBackward = 0;
    this.direction = LANG_DIR_RTL;
    this.baseUnit = LANG_UNIT_WORD;
    this.languageCodes = [STR_LANG_CODE_ARA, STR_LANG_CODE_AR];
    this.features = this._initializeFeatures();
  }

  _initializeFeatures () {
    let features = {};
    features[Feature.types.part] = new FeatureType(Feature.types.part, ['noun', 'adjective', 'verb', 'pronoun', 'article', 'numeral', 'conjunction', 'preoposition', 'interjection'], this.toCode());
    return features
  }

  toCode () {
    return STR_LANG_CODE_ARA
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return false
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {String} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    // TODO
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

const MODELS = new Map([
  [ STR_LANG_CODE_LA, LatinLanguageModel ],
  [ STR_LANG_CODE_LAT, LatinLanguageModel ],
  [ STR_LANG_CODE_GRC, GreekLanguageModel ],
  [ STR_LANG_CODE_ARA, ArabicLanguageModel ],
  [ STR_LANG_CODE_AR, ArabicLanguageModel ]
]);

class LanguageModelFactory {
  static supportsLanguage (code) {
    return MODELS.has(code)
  }

  static getLanguageForCode (code = null) {
    let Model = MODELS.get(code);
    if (Model) {
      return new Model()
    }
    // for now return a default Model
    // TODO may want to throw an error
    return new LanguageModel()
  }
}

class SourceSelection {
  constructor (target, defaultLanguage) {
    this.target = target;
    let targetLang;
    try {
      targetLang = this.getAttribute('lang') || this.getAttribute('xml:lang');
    } catch (e) {
      // if we don't have an element
      console.log('getAttribute not accessible on target');
    }
    if (!targetLang) {
      let closestLangElement = target.closest('[lang]') || this.target.closest('[xml\\:lang]');
      if (closestLangElement) {
        targetLang = closestLangElement.getAttribute('lang') || closestLangElement.getAttribute('xml:lang');
      }
    }
    if (!targetLang) {
      targetLang = defaultLanguage;
    }
    this.language = LanguageModelFactory.getLanguageForCode(targetLang);
    this.initialize({word: null, normalized_word: null, start: 0, end: 0, context: null, position: 0});
  }

  initialize (wordObj) {
    this.in_margin = this.selectionInMargin();
    if (this.in_margin) {
      this.word_selection = wordObj;
      return
    }
    try {
      this.original_selection = this.target.ownerDocument.getSelection();
    } catch (e) {
      this.original_selection = null;
      console.log('No selection found in target owner document');
      return
    }
    let separator = this.language.base_unit;
    switch (separator) {
      case LanguageModel.UNIT_WORD:
        wordObj = this.doSpaceSeparatedWordSelection();
        break
      case LanguageModel.UNIT_CHAR:
        wordObj = this.doCharacterBasedWordSelection();
        break
      default:
        throw new Error(`unknown base_unit ${separator.toString()}`)
    }
    this.word_selection = wordObj;
  }

  reset () {
    if (this.word_selection.word) {
      this.word_selection.reset();
    }
  }

  /**
   * Helper function to determine if the user's selection
   * is in the margin of the document
   * @private
   * @returns true if in the margin, false if not
   * @type Boolean
   */
  selectionInMargin () {
      // Sometimes mouseover a margin seems to set the range offset
      // greater than the string length, so check that condition,
      // as well as looking for whitepace at the offset with
      // only whitespace to the right or left of the offset
      // TODO - not sure if it's necessary anymore?
      // var inMargin =
       //   this.original_selection.anchorOffset >= this.original_selection.toString().length ||
      //    ( a_rngstr[a_ro].indexOf(" ") == 0 &&
      //          (a_rngstr.slice(0,a_ro).search(/\S/) == -1 ||
      //         a_rngstr.slice(a_ro+1,-1).search(/\S/) == -1)
      //    );
    return false
  };

  /**
  * Helper method for {@link #findSelection} which
  * identifies target word and surrounding
  * context for languages whose words are
  * space-separated
  * @see #findSelection
  * @private
  */
  doSpaceSeparatedWordSelection () {
    let selection = this.original_selection;
    let anchor = selection.anchorNode;
    let focus = selection.focusNode;
    let anchorText = anchor.data;
    let ro = selection.anchorOffset;
    // clean string:
    //   convert punctuation to spaces
    anchorText = anchorText.replace(new RegExp('[' + this.language.getPunctuation() + ']', 'g'), ' ');

    let newRo = ro;
    while ((newRo > 0) && (anchorText[--newRo] === ' '));
    if (newRo > 0 && newRo < ro) {
      // we backed up so position ourselves at the first whitespace before
      // the selected word
      // this is based upon the original Alpheios code before the SelectionAPI
      // was available. It's unclear if it's still needed but we'll keep it in
      // place, modified, for now
      ro = newRo + 1;
    }

    // remove leading white space
    // find word
    let wordStart = anchorText.lastIndexOf(' ', ro) + 1;
    let wordEnd = anchorText.indexOf(' ', wordStart);

    if (wordEnd === -1) {
      wordEnd = anchorText.length;
    }

    // if empty, nothing to do
    if (wordStart === wordEnd) {
      return {}
    }

    // extract word
    let word = anchorText.substring(wordStart, wordEnd);

    /* Identify the words preceeding and following the focus word
    * TODO - query the type of node in the selection to see if we are
    * dealing with something other than text nodes
    * We also need to be able to pull surrounding context for text
    * nodes that are broken up by formatting tags (<br/> etc))
    */

    let contextStr = null;
    let contextPos = 0;

    if (this.language.context_forward || this.language.context_backward) {
      let startstr = anchorText.substring(0, wordEnd);
      let endstr = anchorText.substring(wordEnd + 1, anchorText.length);
      let preWordlist = startstr.split(/\s+/);
      let postWordlist = endstr.split(/\s+/);

      // limit to the requested # of context words
      // prior to the selected word
      // the selected word is the last item in the
      // preWordlist array
      if (preWordlist.length > this.language.context_backward + 1) {
        preWordlist = preWordlist.slice(preWordlist.length - (this.language.context_backward + 1));
      }
      // limit to the requested # of context words
      // following to the selected word
      if (postWordlist.length > this.language.context_forward) {
        postWordlist = postWordlist.slice(0, this.language.context_forward);
      }

      /* TODO: should we put the punctuation back in to the
      * surrounding context? Might be necessary for syntax parsing.
      */
      contextStr =
          preWordlist.join(' ') + ' ' + postWordlist.join(' ');
      contextPos = preWordlist.length - 1;
    }

    let wordObj = { word: word,
      normalized_word: this.language.normalizeWord(word),
      start: wordStart,
      end: wordEnd,
      context: contextStr,
      position: contextPos,
      reset: () => { selection.setBaseAndExtent(anchor, wordStart, focus, wordEnd); }
    };
    return wordObj
  }

  /**
   * Helper method for {@link #findSelection} which identifies
   * target word and surrounding context for languages
   * whose words are character based
   * @see #findSelection
   * @private
   */
  doCharacterBasedWordSelection () {
    // TODO
  }

  toString () {
    return `language:${this.language} word: ${this.word_selection.normalized_word}`
  }
}

/**
 * A list of grammatical features that characterizes a language unit. Has some additional service methods,
 * compared with standard storage objects.
 */
class FeatureList {
    /**
     * Initializes a feature list.
     * @param {FeatureType[]} features - Features that build the list (optional, can be set later).
     */
  constructor (features = []) {
    this._features = [];
    this._types = {};
    this.add(features);
  }

  add (features) {
    if (!features || !Array.isArray(features)) {
      throw new Error('Features must be defined and must come in an array.')
    }

    for (let feature of features) {
      this._features.push(feature);
      this._types[feature.type] = feature;
    }
  }

    /**
     * Returns an array of grouping features.
     * @returns {FeatureType[]} - An array of grouping features.
     */
  get items () {
    return this._features
  }

  forEach (callback) {
    this._features.forEach(callback);
  }

    /**
     * Returns a feature of a particular type. If such feature does not exist in a list, returns undefined.
     * @param {string} type - Feature type as defined in `types` object.
     * @return {FeatureType | undefined} A feature if a particular type if contains it. Undefined otherwise.
     */
  ofType (type) {
    if (this.hasType(type)) {
      return this._types[type]
    }
  }

    /**
     * Checks whether a feature list has a feature of a specific type.
     * @param {string} type - Feature type as defined in `types` object.
     * @return {boolean} Whether a feature list has a feature of a particular type.
     */
  hasType (type) {
    return this._types.hasOwnProperty(type)
  }
}

class FeatureImporter {
  constructor () {
    this.hash = {};
    return this
  }

    /**
     * Sets mapping between external imported value and one or more library standard values. If an importedValue
     * is already in a hash table, old libraryValue will be overwritten with the new one.
     * @param {string} importedValue - External value
     * @param {Object | Object[] | string | string[]} libraryValue - Library standard value
     */
  map (importedValue, libraryValue) {
    if (!importedValue) {
      throw new Error('Imported value should not be empty.')
    }

    if (!libraryValue) {
      throw new Error('Library value should not be empty.')
    }

    this.hash[importedValue] = libraryValue;
    return this
  }

    /**
     * Checks if value is in a map.
     * @param {string} importedValue - A value to test.
     * @returns {boolean} - Tru if value is in a map, false otherwise.
     */
  has (importedValue) {
    return this.hash.hasOwnProperty(importedValue)
  }

    /**
     * Returns one or more library standard values that match an external value
     * @param {string} importedValue - External value
     * @returns {Object | string} One or more of library standard values
     */
  get (importedValue) {
    if (this.has(importedValue)) {
      return this.hash[importedValue]
    } else {
      throw new Error('A value "' + importedValue + '" is not found in the importer.')
    }
  }
}

/**
 * Lemma, a canonical form of a word.
 */
class Lemma {
    /**
     * Initializes a Lemma object.
     * @param {string} word - A word.
     * @param {string} language - A language of a word.
     */
  constructor (word, language) {
    if (!word) {
      throw new Error('Word should not be empty.')
    }

    if (!language) {
      throw new Error('Langauge should not be empty.')
    }

        // if (!languages.isAllowed(language)) {
        //    throw new Error('Language "' + language + '" is not supported.');
        // }

    this.word = word;
    this.language = language;
  }

  static readObject (jsonObject) {
    return new Lemma(jsonObject.word, jsonObject.language)
  }
}

/*
 Hierarchical structure of return value of a morphological analyzer:

 Homonym (a group of words that are written the same way, https://en.wikipedia.org/wiki/Homonym)
    Lexeme 1 (a unit of lexical meaning, https://en.wikipedia.org/wiki/Lexeme)
        Have a lemma and one or more inflections
        Lemma (also called a headword, a canonical form of a group of words https://en.wikipedia.org/wiki/Lemma_(morphology) )
        Inflection 1
            Stem
            Suffix (also called ending)
        Inflection 2
            Stem
            Suffix
    Lexeme 2
        Lemma
        Inflection 1
            Stem
            Suffix
 */

/**
 * Represents an inflection of a word
 */
class Inflection {
    /**
     * Initializes an Inflection object.
     * @param {string} stem - A stem of a word.
     * @param {string} language - A word's language.
     */
  constructor (stem, language) {
    if (!stem) {
      throw new Error('Stem should not be empty.')
    }

    if (!language) {
      throw new Error('Langauge should not be empty.')
    }

    if (!LanguageModelFactory.supportsLanguage(language)) {
      throw new Error(`language ${language} not supported.`)
    }

    this.stem = stem;
    this.language = language;

    // Suffix may not be present in every word. If missing, it will set to null.
    this.suffix = null;

    // Prefix may not be present in every word. If missing, it will set to null.
    this.prefix = null;

    // Example may not be provided
    this.example = null;
  }

  static readObject (jsonObject) {
    let inflection = new Inflection(jsonObject.stem, jsonObject.language);
    if (jsonObject.suffix) {
      inflection.suffix = jsonObject.suffix;
    }
    if (jsonObject.prefix) {
      inflection.prefix = jsonObject.prefix;
    }
    if (jsonObject.example) {
      inflection.example = jsonObject.example;
    }
    return inflection
  }

    /**
     * Sets a grammatical feature in an inflection. Some features can have multiple values, In this case
     * an array of Feature objects will be provided.
     * Values are taken from features and stored in a 'feature.type' property as an array of values.
     * @param {Feature | Feature[]} data
     */
  set feature (data) {
    if (!data) {
      throw new Error('Inflection feature data cannot be empty.')
    }
    if (!Array.isArray(data)) {
      data = [data];
    }

    let type = data[0].type;
    this[type] = [];
    for (let element of data) {
      if (!(element instanceof Feature)) {
        throw new Error('Inflection feature data must be a Feature object.')
      }

      if (element.language !== this.language) {
        throw new Error('Language "' + element.language + '" of a feature does not match a language "' +
                this.language + '" of an Inflection object.')
      }

      this[type].push(element.value);
    }
  }
}

/**
 * A basic unit of lexical meaning. Contains a Lemma object and one or more Inflection objects.
 */
class Lexeme {
    /**
     * Initializes a Lexeme object.
     * @param {Lemma} lemma - A lemma object.
     * @param {Inflection[]} inflections - An array of inflections.
     * @param {string} meaning - a short definition
     */
  constructor (lemma, inflections, meaning = '') {
    if (!lemma) {
      throw new Error('Lemma should not be empty.')
    }

    if (!(lemma instanceof Lemma)) {
      throw new Error('Lemma should be of Lemma object type.')
    }

    if (!inflections) {
      throw new Error('Inflections data should not be empty.')
    }

    if (!Array.isArray(inflections)) {
      throw new Error('Inflection data should be provided in an array.')
    }

    for (let inflection of inflections) {
      if (!(inflection instanceof Inflection)) {
        throw new Error('All inflection data should be of Inflection object type.')
      }
    }

    this.lemma = lemma;
    this.inflections = inflections;
    this.meaning = meaning;
  }

  static readObject (jsonObject) {
    let lemma = Lemma.readObject(jsonObject.lemma);
    let inflections = [];
    for (let inflection of jsonObject.inflections) {
      inflections.push(Inflection.readObject(inflection));
    }
    return new Lexeme(lemma, inflections)
  }
}

class Homonym {
    /**
     * Initializes a Homonym object.
     * @param {Lexeme[]} lexemes - An array of Lexeme objects.
     * @param {string} form - the form which produces the homonyms
     */
  constructor (lexemes, form) {
    if (!lexemes) {
      throw new Error('Lexemes data should not be empty.')
    }

    if (!Array.isArray(lexemes)) {
      throw new Error('Lexeme data should be provided in an array.')
    }

    for (let lexeme of lexemes) {
      if (!(lexeme instanceof Lexeme)) {
        throw new Error('All lexeme data should be of Lexeme object type.')
      }
    }

    this.lexemes = lexemes;
    this.targetWord = form;
  }

  static readObject (jsonObject) {
    let lexemes = [];
    if (jsonObject.lexemes) {
      for (let lexeme of jsonObject.lexemes) {
        lexemes.push(Lexeme.readObject(lexeme));
      }
    }
    let homonym = new Homonym(lexemes);
    if (jsonObject.targetWord) {
      homonym.targetWord = jsonObject.targetWord;
    }
    return homonym
  }

    /**
     * Returns language of a homonym.
     * Homonym does not have a language property, only lemmas and inflections do. We assume that all lemmas
     * and inflections within the same homonym will have the same language, and we can determine a language
     * by using language property of the first lemma. We chan change this logic in the future if we'll need to.
     * @returns {string} A language code, as defined in the `languages` object.
     */
  get language () {
    if (this.lexemes && this.lexemes[0] && this.lexemes[0].lemma && this.lexemes[0].lemma.language) {
      return this.lexemes[0].lemma.language
    } else {
      throw new Error('Homonym has not been initialized properly. Unable to obtain language information.')
    }
  }
}

exports.Constants = constants;
exports.SourceSelection = SourceSelection;
exports.Feature = Feature;
exports.FeatureType = FeatureType;
exports.FeatureList = FeatureList;
exports.FeatureImporter = FeatureImporter;
exports.Inflection = Inflection;
exports.LanguageModelFactory = LanguageModelFactory;
exports.Homonym = Homonym;
exports.Lexeme = Lexeme;
exports.Lemma = Lemma;
exports.LatinLanguageModel = LatinLanguageModel;
exports.GreekLanguageModel = GreekLanguageModel;
exports.ArabicLanguageModel = ArabicLanguageModel;

Object.defineProperty(exports, '__esModule', { value: true });

})));
