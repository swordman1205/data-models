/* eslint-env jest */
import Lexeme from '../src/lexeme.js'
import Lemma from '../src/lemma.js'
import Inflection from '../src/inflection.js'

describe('Lexeme object', () => {
  let lexeme, lemma, inflection1, inflection2

  beforeAll(() => {
    // Create a test environment

    inflection1 = new Inflection('stem1', 'grc')
    inflection2 = new Inflection('stem2', 'grc')
    lemma = new Lemma('word', 'grc')
    lexeme = new Lexeme(lemma, [inflection1, inflection2])
  })

  test('Should be initialized properly', () => {
    expect(lexeme.lemma).toEqual(lemma)
    expect(lexeme.inflections).toEqual([inflection1, inflection2])
  })

  test('Should not allow empty arguments', () => {
    expect(() => new Lexeme()).toThrowError(/empty/)
  })

  test('Should not allow arguments of incorrect type', () => {
    expect(() => new Lexeme(new Lemma('someword', 'grc'), 'some value')).toThrowError(/array/)
  })

  test('Should not allow arguments of incorrect type even within an array', () => {
    expect(() => new Lexeme(new Lemma('someword', 'grc'), ['some value'])).toThrowError(/Inflection/)
  })

  afterAll(() => {
    // Clean a test environment up
    lexeme = undefined
  })
})