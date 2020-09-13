module.exports = {
  itmLstAccSntzr: function (postBodyData, ItmLstAcc_obj) {

    // const postBody = req.body
    let itemID = postBodyData['itemIDPost']
    let suppUnitID = postBodyData['suppUnitIDPost']
    ItmLstAcc_obj.ItmLstAcc_obj.itemListAccumulator = postBodyData['ItmLstAcc_obj.itemListAccumulatorPost']
    let imwProductValObj = {}
    let imwProductArr = []
    // var ItmLstAcc_obj.itemListAccumulator
    let objectifiedImwProdArr = []

    if (ItmLstAcc_obj.itemListAccumulator !== undefined) {
      let sanitizerRegex1 = /(\\)|(\[)|(\])/g
      let sanitizerRegex2 = /("")/g
      let sanitizerRegex3 = /("{)/g
      let sanitizerRegex4 = /(}")/g
      sanitizedItemListAcc = ItmLstAcc_obj.itemListAccumulator.replace(sanitizerRegex1, "")
        .replace(sanitizerRegex2, `"`).replace(sanitizerRegex3, `{`).replace(sanitizerRegex4, `}`)
      console.log(`sanitizedItemListAcc==> ${sanitizedItemListAcc}`)
    }
  }
}