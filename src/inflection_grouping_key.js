class InflectionGroupingKey {
  /**
   * @constructor
   * @param {Inflection} infl inflection with features which are used as a grouping key
   * @param {string[]} features array of feature names which are used as the key
   * @param {Map} extras extra property name and value pairs used in the key
   */
  constructor (infl, features, extras = {}) {
    for (let feature of features) {
      this[feature] = infl[feature]
    }
    Object.assign(this, extras)
  }

  hasFeatureValue (feature, value) {
    for (let f of this[feature]) {
      if (f.hasValue(value)) {
        return true
      }
    }
    return false
  }
}

export default InflectionGroupingKey
