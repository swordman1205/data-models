/* eslint-env jest */
'use strict'
import SourceSelection from '../src/source_selection.js'
import * as Constants from '../src/constants.js'
const Jsdom = require('jsdom')

let polyfillClosest = function (selector) {
  var el = this
  do {
    if (el.matches(selector)) return el
    el = el.parentElement
  } while (el !== null)
  return null
}

describe('SourceSelection object', () => {
  beforeAll(() => {
  })

  test('we find an embedded language properly', () => {
    let doc = new Jsdom.jsdom('<!doctype html><html><body><div lang="grc"><div id="closest" lang="lat"><div id="latembed"></div></div></div></body></html>') // eslint-disable-line new-cap
    let el = doc.getElementById('latembed')
    el.closest = polyfillClosest
    let sw = new SourceSelection(el)
    expect(sw.language.sourceLanguage).toEqual(Constants.LANG_LATIN)
  })

  test('we find an embedded xml language properly', () => {
    let doc = new Jsdom.jsdom('<!doctype html><html><body><div lang="grc"><div id="closest" xml:lang="lat"><div id="latembed"></div></div></div></body></html>') // eslint-disable-line new-cap
    let el = doc.getElementById('latembed')
    el.closest = polyfillClosest
    let sw = new SourceSelection(el)
    expect(sw.language.sourceLanguage).toEqual(Constants.LANG_GREEK)
  })
})
