/**
 * A model for a translation of lemma
 */
class Translation {
  /**
   * Initializes a Translation object.
   * @param {String} input - A translated lemma.
   * @param {String} map
   * @param {String[]} translations - A result of translation into destination language
   */
  constructor (input, map, translations) {
    this.input = input
    this.map = map
    this.translations = translations
  }

  static readObject (jsonObject) {
    return new Translation(jsonObject.in, jsonObject.map, jsonObject.translations)
  }
}

export default Translation
