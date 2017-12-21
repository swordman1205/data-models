import Feature from './feature.js'
import * as Constants from './constants.js'
import LanguageModelFactory from './language_model_factory.js'
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
     * @param {string} suffix - a suffix of a word
     * @param {prefix} prefix - a prefix of a word
     * @param {example} example - example
     */
  constructor (stem, language, suffix = null, prefix = null, example = null) {
    if (!stem) {
      throw new Error('Stem should not be empty.')
    }

    if (!language) {
      throw new Error('Langauge should not be empty.')
    }

    if (!LanguageModelFactory.supportsLanguage(language)) {
      throw new Error(`language ${language} not supported.`)
    }

    this.stem = stem
    this.language = language

    // Suffix may not be present in every word. If missing, it will set to null.
    this.suffix = suffix

    // Prefix may not be present in every word. If missing, it will set to null.
    this.prefix = prefix

    // Example may not be provided
    this.example = example
  }

  static readObject (jsonObject) {
    let inflection =
      new Inflection(
        jsonObject.stem, jsonObject.language, jsonObject.suffix, jsonObject.prefix, jsonObject.example)
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
      data = [data]
    }

    let type = data[0].type
    this[type] = []
    for (let element of data) {
      if (!(element instanceof Feature)) {
        throw new Error('Inflection feature data must be a Feature object.')
      }

      if (element.language !== this.language) {
        throw new Error('Language "' + element.language + '" of a feature does not match a language "' +
                this.language + '" of an Inflection object.')
      }

      this[type].push(element)
      // this[type].push(element.value)
    }
  }

  featureMatch (featureName, otherInflection) {
    let matches = false
    for (let f of this[featureName]) {
      if (otherInflection[featureName] && otherInflection[featureName].filter((x) => x.isEqual(f)).length > 0) {
        matches = true
        break
      }
    }
    return matches
  }

  static groupForDisplay (inflections) {
    let groupOrder = new Map()
    let sortByOrder = (a, b) => {
      let orderA = groupOrder.get(a)
      let orderB = groupOrder.get(b)
      return orderA > orderB ? -1 : orderB > orderA ? 1 : 0
    }
    let grouped = new Map()

    // group inflections by part of speech
    for (let infl of inflections) {
      let pofskey, sortkey
      if (infl[Feature.types.part]) {
        pofskey = infl[Feature.types.part].map((f) => { return f.value }).join('--')
        sortkey = Math.max(infl[Feature.types.part].map((f) => { return f.sortOrder }))
      } else {
        pofskey = ''
        sortkey = 1
      }
      let dialkey = infl[Feature.types.dialect] ? infl[Feature.types.dialect].map((f) => { return f.value }).join('--') : ''
      let compkey = infl[Feature.types.comparison] ? infl[Feature.types.comparison].map((f) => { return f.value }).join('--') : ''
      let prefkey = infl.prefix ? infl.prefix : ''
      let suffkey = infl.suffix ? infl.suffix : ''
      let key = [prefkey, infl.stem, suffkey, pofskey, compkey, dialkey].filter((x) => x).join(' ')
      if (grouped.has(key)) {
        grouped.get(key).push(infl)
      } else {
        grouped.set(key, [infl])
        groupOrder.set(key, sortkey)
      }
    }

    // sort the keys of the groupings by their sort order
    let keys = Array.from(groupOrder.keys())
    keys.sort(sortByOrder)

    // iterate through each group key to group the inflections in that group
    for (let key of keys) {
      let inflgrp = new Map()
      // iterate through the inflections of this group,
      // grouping on case, tense, verbs w/o tense, adverbs and everything else
      for (let infl of grouped.get(key)) {
        let setkey
        if (infl[Feature.types.grmCase]) {
          setkey = infl[Feature.types.number] ? infl[Feature.types.number].map((f) => { return f.value }).join(',') : ''
        } else if (infl[Feature.types.tense]) {
          setkey = infl[Feature.types.tense].map((f) => { return f.value }).join(',')
        } else if (infl[Feature.types.part] === Constants.POFS_VERB) {
          setkey = Constants.POFS_VERB
        } else if (infl[Feature.types.part] === Constants.POFS_ADVERB) {
          setkey = Constants.POFS_ADVERB
        } else {
          setkey = ''
        }
        if (inflgrp.has(setkey)) {
          inflgrp.get(setkey).push(infl)
        } else {
          inflgrp.set(setkey, [infl])
        }
      }
      // inflgrp is now a map of groups of inflections grouped by
      //  inflections with number
      //  inflections without number but with tense
      //  inflections of verbs without tense
      //  inflections of adverbs
      //  everything else
      // iterate through each inflection group key to group the inflections in that group
      for (let kv of inflgrp) {
        let infls = kv[1]
        let nextGroup = new Map()
        groupOrder.clear()
        for (let infl of infls) {
          let tensekey = infl[Feature.types.tense] ? infl[Feature.types.tense].map((f) => { return f.value }).join(',') : ''
          let voicekey = infl[Feature.types.voice] ? infl[Feature.types.voice].map((f) => { return f.value }).join(',') : ''
          let setkey = [tensekey, voicekey].filter((x) => x).join(' ')
          let sortkey = infl[Feature.types.grmCase] ? Math.max(infl[Feature.types.grmCase].map((f) => { return f.sortOrder })) : 1
          if (nextGroup.has(setkey)) {
            nextGroup.get(setkey).push(infl)
          } else {
            nextGroup.set(setkey, [infl])
            groupOrder.set(setkey, sortkey)
          }
        }
        console.log(nextGroup)
        inflgrp.set(kv[0], Array.from(nextGroup))
      }
      grouped.set(key, Array.from(inflgrp))
    }
    console.log(grouped)
    return Array.from(grouped)
  }
}
export default Inflection
