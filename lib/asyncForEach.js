/**
 * Provides async foreach loop.
 * @param {array} array to loop
 * @param {function} callback promise as function to be called with await on each element of array.
 * @returns {promise} Promise
 */
async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    if (await callback(array[index], index, array) === false) {
      break
    }
  }
}

export default asyncForEach
