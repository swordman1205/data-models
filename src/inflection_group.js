class InflectionGroup {
  /**
   * A group of inflections
   * @param {object} groupingKey properties of the group
   * @param {Inflection[]|InflectionGroup[]} inflections array of inflections or inflection groups
   * @param {string} sortKey optional property upon which inflections in the group can be sorted
   */
  constructor (groupingKey = {}, inflections = [], sortKey = null) {
    this.groupingKey = groupingKey
    this.inflections = inflections
    this.sortKey = sortKey
  }

  append (inflection) {
    this.inflections.push(inflection)
  }

  static sortByOrder () {
    return (a, b) => {
      // let orderA = groupOrder.get(a)
      // let orderB = groupOrder.get(b)
      // return orderA > orderB ? -1 : orderB > orderA ? 1 : 0
    }
  }
}
export default InflectionGroup
