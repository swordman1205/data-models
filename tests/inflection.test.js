/* eslint-env jest */
'use strict'
import Inflection from '../src/inflection.js'
import Feature from '../src/feature.js'
import * as Constants from '../src/constants.js'

describe('Inflection object', () => {
  let inflection, grc

  beforeAll(() => {
    // Create a test environment
    grc = Constants.STR_LANG_CODE_GRC
    inflection = new Inflection('stem', grc)
  })

  test('Should be initialized properly', () => {
    expect(inflection).toEqual({
      stem: 'stem',
      suffix: null,
      prefix: null,
      example: null,

      languageCode: grc,
      languageID: Constants.LANG_GREEK,
      model: expect.anything(),
      constraints: {
        fullFormBased: false,
        suffixBased: false,
        obligatoryMatches: expect.arrayContaining([]),
        optionalMatches: expect.arrayContaining([])
      }
    })
  })

  // grm": {"fullFormBased": false, "suffixBased": false}

  test('Should not allow empty arguments', () => {
    expect(() => new Inflection('stem', '')).toThrowError(/empty/)
  })

  test('Should not allow unsupported languages', () => {
    expect(() => new Inflection('stem', 'egyptian')).toThrowError(/not supported/) // eslint-disable-line  no-return-assign
  })

  test('feature method should add a single feature to the inflection', () => {
    inflection.addFeature(new Feature(Feature.types.gender, 'masculine', Constants.LANG_GREEK))
    expect(inflection).toMatchObject({
      gender: {
        languageID: Constants.LANG_GREEK,
        type: 'gender',
        '_data': [{value: 'masculine', sortOrder: 1}]
      }
    })
  })

  test('feature method should throw an error if no arguments are provided', () => {
    expect(() => inflection.addFeature('')).toThrowError(/empty/) // eslint-disable-line no-return-assign
  })

  test('feature method should throw an error if argument(s) are of the wrong type', () => {
    expect(() => inflection.addFeature('some value')).toThrowError(/Feature/) // eslint-disable-line no-return-assign
  })

  test('feature method should not allow a feature language to be different from a language of an inflection', () => {
    expect(() => inflection.addFeature(new Feature(Feature.types.gender, 'masculine', Constants.LANG_LATIN))) // eslint-disable-line no-return-assign
      .toThrowError(/not match/)
  })

  afterAll(() => {
    // Clean a test environment up
    inflection = undefined
  })
})
