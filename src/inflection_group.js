class InflectionGroup {
  /**
   * A group of inflections or groups of inflections
   *
   * @param {object} groupingKey features of the inflections in the group
   * @param {Inflection[]|InflectionGroup[]} inflections array of Inflections or InflectionGroups in this group
   * @param {string} sortKey optional property upon which inflections in the group can be sorted
   */
  constructor (groupingKey = {}, inflections = [], sortKey = null) {
    this.groupingKey = groupingKey
    this.inflections = inflections
    this.sortKey = sortKey
  }

  /**
   * Add an Inflection or InflectionGroup to the group
   * @param {Inflection|InflectionGroup} inflection
   */
  append (inflection) {
    this.inflections.push(inflection)
  }

  /**
   * TODO method which returns a comparator for the inflections in the group
   */
  static sortByOrder () {
    return (a, b) => {
      // let orderA = groupOrder.get(a)
      // let orderB = groupOrder.get(b)
      // return orderA > orderB ? -1 : orderB > orderA ? 1 : 0
    }
  }
}
export default InflectionGroup
