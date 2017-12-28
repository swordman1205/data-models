import Feature from './feature.js'
import * as Constants from './constants.js'
import LanguageModelFactory from './language_model_factory.js'
import InflectionGroup from './inflection_group.js'
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

  static groupForDisplay (inflections) {
    let grouped = new Map()

    // group inflections by part of speech
    for (let infl of inflections) {
      let pofskey, sortkey
      if (infl[Feature.types.part]) {
        pofskey = infl[Feature.types.part].map((f) => { return f.value }).join(',')
        sortkey = Math.max(infl[Feature.types.part].map((f) => { return f.sortOrder }))
      } else {
        pofskey = ''
        sortkey = 1
      }
      let dialkey = infl[Feature.types.dialect] ? infl[Feature.types.dialect].map((f) => { return f.value }).join(',') : ''
      let compkey = infl[Feature.types.comparison] ? infl[Feature.types.comparison].map((f) => { return f.value }).join(',') : ''
      let prefkey = infl.prefix ? infl.prefix : ''
      let suffkey = infl.suffix ? infl.suffix : ''
      let key = [prefkey, infl.stem, suffkey, pofskey, compkey, dialkey].filter((x) => x).join(' ')
      if (grouped.has(key)) {
        grouped.get(key).append(infl)
      } else {
        let props = {
          prefix: infl.prefix,
          suffix: infl.suffix,
          stem: infl.stem
        }
        props[Feature.types.part] = infl[Feature.types.part]
        props[Feature.types.dialect] = infl[Feature.types.dialect]
        props[Feature.types.comparison] = infl[Feature.types.comparison]
        grouped.set(key, new InflectionGroup(props, [infl], sortkey))
      }
    }

    // iterate through each group key to group the inflections in that group
    for (let kv of grouped) {
      let inflgrp = new Map()
      for (let infl of kv[1].inflections) {
        let setkey
        let keyprop
        let props = {}
        if (infl[Feature.types.grmCase]) {
          // grouping on number if case is defined
          setkey = infl[Feature.types.number] ? infl[Feature.types.number].map((f) => { return f.value }).join(',') : ''
          keyprop = Feature.types.number
          props[keyprop] = infl[Feature.types.number]
          props.isCaseInflectionSet = true
        } else if (infl[Feature.types.tense]) {
          // grouping on tense if tense is defined but not case
          setkey = infl[Feature.types.tense].map((f) => { return f.value }).join(',')
          keyprop = Feature.types.tense
          props[keyprop] = infl[Feature.types.tense]
          props.isCaseInflectionSet = false
        } else if (infl[Feature.types.part] === Constants.POFS_VERB) {
          // grouping on no case or tense but a verb
          setkey = Constants.POFS_VERB
          keyprop = Feature.types.part
          props[keyprop] = infl[Feature.types.part]
          props.isCaseInflectionSet = false
        } else if (infl[Feature.types.part] === Constants.POFS_ADVERB) {
          keyprop = Feature.types.part
          setkey = Constants.POFS_ADVERB
          props[keyprop] = infl[Feature.types.part]
          props.isCaseInflectionSet = false
          // grouping on adverbs without case or tense
        } else {
          keyprop = 'misc'
          setkey = ''
          props[keyprop] = setkey
          props.isCaseInflectionSet = false
          // grouping on adverbs without case or tense
          // everything else
        }
        if (inflgrp.has(setkey)) {
          inflgrp.get(setkey).append(infl)
        } else {
          inflgrp.set(setkey, new InflectionGroup(props, [infl]))
        }
      }
      // inflgrp is now a map of groups of inflections grouped by
      //  inflections with number
      //  inflections without number but with tense
      //  inflections of verbs without tense
      //  inflections of adverbs
      //  everything else
      // iterate through each inflection group key to group the inflections in that group by tense and voice
      for (let kv of inflgrp) {
        let nextGroup = new Map()
        for (let infl of kv[1].inflections) {
          let tensekey = infl[Feature.types.tense] ? infl[Feature.types.tense].map((f) => { return f.value }).join(',') : ''
          let voicekey = infl[Feature.types.voice] ? infl[Feature.types.voice].map((f) => { return f.value }).join(',') : ''
          let setkey = [tensekey, voicekey].filter((x) => x).join(' ')
          let sortkey = infl[Feature.types.grmCase] ? Math.max(infl[Feature.types.grmCase].map((f) => { return f.sortOrder })) : 1
          if (nextGroup.has(setkey)) {
            nextGroup.get(setkey).append(infl)
          } else {
            let props = {}
            props[Feature.types.tense] = infl[Feature.types.tense]
            props[Feature.types.voice] = infl[Feature.types.voice]
            nextGroup.set(setkey, new InflectionGroup(props, [infl], sortkey))
          }
        }
        kv[1].inflections = Array.from(nextGroup.values())
      }

      // inflgrp is now a Map of groups of groups of inflections

      for (let kv of inflgrp) {
        let groups = kv[1]
        for (let group of groups.inflections) {
          let nextGroup = new Map()
          for (let infl of group.inflections) {
            // set key is case comp gend pers mood sort
            let casekey = infl[Feature.types.grmCase] ? infl[Feature.types.grmCase].map((f) => { return f.value }).join(',') : ''
            let compkey = infl[Feature.types.comparison] ? infl[Feature.types.comparison].map((f) => { return f.value }).join(',') : ''
            let gendkey = infl[Feature.types.gender] ? infl[Feature.types.gender].map((f) => { return f.value }).join(',') : ''
            let numkey = infl[Feature.types.number] ? infl[Feature.types.number].map((f) => { return f.value }).join(',') : ''
            let perskey = infl[Feature.types.person] ? infl[Feature.types.person].map((f) => { return f.value }).join(',') : ''
            let tensekey = infl[Feature.types.tense] ? infl[Feature.types.tense].map((f) => { return f.value }).join(',') : ''
            let voicekey = infl[Feature.types.voice] ? infl[Feature.types.voice].map((f) => { return f.value }).join(',') : ''
            let moodkey = infl[Feature.types.mood] ? infl[Feature.types.mood].map((f) => { return f.value }).join(',') : ''
            let sortkey = infl[Feature.types.sort] ? infl[Feature.types.sort].map((f) => { return f.value }).join(',') : ''
            let setkey = [casekey, compkey, gendkey, numkey, perskey, tensekey, moodkey, sortkey, voicekey].filter((x) => x).join(' ')
            if (nextGroup.has(setkey)) {
              nextGroup.get(setkey).append(infl)
            } else {
              let props = {}
              props[Feature.types.grmCase] = infl[Feature.types.grmCase]
              props[Feature.types.comparison] = infl[Feature.types.comparison]
              props[Feature.types.gender] = infl[Feature.types.gender]
              props[Feature.types.number] = infl[Feature.types.number]
              props[Feature.types.person] = infl[Feature.types.person]
              props[Feature.types.tense] = infl[Feature.types.tense]
              props[Feature.types.mood] = infl[Feature.types.mood]
              props[Feature.types.sort] = infl[Feature.types.sort]
              props[Feature.types.voice] = infl[Feature.types.voice]
              nextGroup.set(setkey, new InflectionGroup(props, [infl]))
            }
          }
          group.inflections = Array.from(nextGroup.values()) // now a group of inflection groups
        }
      }
      kv[1].inflections = Array.from(inflgrp.values())
    }
    return Array.from(grouped.values())
  }
}
export default Inflection
