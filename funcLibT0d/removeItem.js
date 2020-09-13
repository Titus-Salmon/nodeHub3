const sanitizerFuncs = require('../funcLibT0d/sanitizerFuncs')

module.exports = {

  removeItemPrepper: function (removeItem, removeItemSPLITsanArr) {
    let regexRemoveItem1 = /(<\/td><td>)/g
    let removeItemReplace = removeItem.replace(regexRemoveItem1, '</td>,<td>')
    removeItemSPLIT = removeItemReplace.split(',')
    console.log(`removeItemSPLIT from removeItemPrepper==> ${removeItemSPLIT}`)
    let regexRemoveItem2 = /(<td>)|(<\/td>)/g
    for (let i = 0; i < removeItemSPLIT.length; i++) {
      let removeItemSPLITsan = removeItemSPLIT[i].replace(regexRemoveItem2, '')
      removeItemSPLITsanArr.push(removeItemSPLITsan)
    }
  },

  // removeItemSPLITsanitizer: function (removeItemSPLIT, removeItemSPLITsanArr) {
  //   let regexRemoveItem2 = /(<td>)|(<\/td>)/g
  //   for (let i = 0; i < removeItemSPLIT.length; i++) {
  //     let removeItemSPLITsan = removeItemSPLIT[i].replace(regexRemoveItem2, '')
  //     removeItemSPLITsanArr.push(removeItemSPLITsan)
  //   }
  // },

  removeItemSPLITsanArrObjectifier: function (objKeyArr, removeItemSPLITsanArrObject, removeItemSPLITsanArr) {
    for (let i = 0; i < objKeyArr.length; i++) {
      removeItemSPLITsanArrObject[`${objKeyArr[i]}`] = removeItemSPLITsanArr[i]
    }
  },

  removeItemHandler: function (imwProductArr, removeItemSPLITsanArrObject, objectifiedImwProdArr) {
    for (let i = 0; i < imwProductArr.length; i++) {
      sanitizerFuncs.thingSanitizer(imwProductArr[i])
      if (sanitizedThing == JSON.stringify(removeItemSPLITsanArrObject)) {
        imwProductArr.splice(i, 1)
        objectifiedImwProdArr.splice(i, 1) //need this to update tbody#resTblBdy_itemsToAdd table
      }
    }
  }


}