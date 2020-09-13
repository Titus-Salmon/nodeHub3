module.exports = {
  thingSanitizer: function (thingToSanitize) {
    if (thingToSanitize !== undefined) {
      console.log(`thingToSanitize pre-regex==> ${thingToSanitize}`)
      let sanitizerRegex1 = /(\\)|(\[)|(\])/g
      let sanitizerRegex3 = /("{)/g
      let sanitizerRegex4 = /(}")/g
      sanitizedThing = thingToSanitize.replace(sanitizerRegex1, "").replace(sanitizerRegex3, `{`).replace(sanitizerRegex4, `}`)
      console.log(`sanitizedThing==> ${sanitizedThing}`)
    }
  },

  sanitizedItemListObjGenerator: function (thingToSanitize, thingSanitizer, imwProductArr,
    imwProductValObj, itemID, deptID, deptName, recptAlias, brand, itemName, size, suggRtl, lastCost, basePrice, autoDisco,
    idealMarg, weightProf, tax1, tax2, tax3, specTndr1, specTndr2, posPrompt, location, altID, altRcptAlias, pkgQty, suppUnitID,
    suppID, unit, numPkgs, category, subCtgry, prodGroup, prodFlag, rbNote, ediDefault, pwrfld7, tmpGroup, onhndQty,
    reorderPt, mcl, reorderQty, memo, flrRsn, dsd, discoMult, csPkMlt, ovr) {
    if (thingToSanitize !== undefined) {
      thingSanitizer(thingToSanitize)
      /* X(?=Y) 	Positive lookahead 	X if followed by Y
       * (?<=Y)X 	Positive lookbehind 	X if after Y
       * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
      let splitRegex1 = /(?<=}),(?={)/g
      let sanitizedThingSPLIT = sanitizedThing.split(splitRegex1)
      for (let i = 0; i < sanitizedThingSPLIT.length; i++) {
        imwProductArr.push(sanitizedThingSPLIT[i])
      }
    }
    imwProductValObj['itemID'] = itemID
    imwProductValObj['deptID'] = deptID
    imwProductValObj['deptName'] = deptName
    imwProductValObj['recptAlias'] = recptAlias
    imwProductValObj['brand'] = brand
    imwProductValObj['itemName'] = itemName
    imwProductValObj['size'] = size
    imwProductValObj['suggRtl'] = suggRtl
    imwProductValObj['lastCost'] = lastCost
    imwProductValObj['basePrice'] = basePrice
    imwProductValObj['autoDisco'] = autoDisco

    imwProductValObj['idealMarg'] = idealMarg
    imwProductValObj['weightProf'] = weightProf
    imwProductValObj['tax1'] = tax1
    imwProductValObj['tax2'] = tax2
    imwProductValObj['tax3'] = tax3
    imwProductValObj['specTndr1'] = specTndr1
    imwProductValObj['specTndr2'] = specTndr2
    imwProductValObj['posPrompt'] = posPrompt
    imwProductValObj['location'] = location
    imwProductValObj['altID'] = altID
    imwProductValObj['altRcptAlias'] = altRcptAlias
    imwProductValObj['pkgQty'] = pkgQty
    imwProductValObj['suppUnitID'] = suppUnitID
    imwProductValObj['suppID'] = suppID
    imwProductValObj['unit'] = unit
    imwProductValObj['numPkgs'] = numPkgs

    imwProductValObj['category'] = category
    imwProductValObj['subCtgry'] = subCtgry
    imwProductValObj['prodGroup'] = prodGroup
    imwProductValObj['prodFlag'] = prodFlag
    imwProductValObj['rbNote'] = rbNote
    imwProductValObj['ediDefault'] = ediDefault
    imwProductValObj['pwrfld7'] = pwrfld7
    imwProductValObj['tmpGroup'] = tmpGroup
    imwProductValObj['onhndQty'] = onhndQty
    imwProductValObj['reorderPt'] = reorderPt
    imwProductValObj['mcl'] = mcl
    imwProductValObj['reorderQty'] = reorderQty

    imwProductValObj['memo'] = memo
    imwProductValObj['flrRsn'] = flrRsn

    imwProductValObj['dsd'] = dsd
    imwProductValObj['discoMult'] = discoMult
    imwProductValObj['csPkMlt'] = csPkMlt
    imwProductValObj['ovr'] = ovr


    let stringifiedImwProductValObj = JSON.stringify(imwProductValObj)

    function pushHandler() { //only push stringifiedImwProductValObj to imwProductArr if values for imwProductValObj aren't
      //all empty
      var push = false
      for (let i = 0; i < Object.keys(imwProductValObj).length; i++) {
        // console.log(`typeof Object.values(imwProductValObj)==> ${typeof Object.values(imwProductValObj)}`)
        if (Object.values(imwProductValObj)[i] !== '' && Object.values(imwProductValObj)[i] !== undefined && Object.values(imwProductValObj)[i] !== null) {
          push = true
          console.log(`push==> ${push}`)
        }
      }
      if (push == true) {
        imwProductArr.push(stringifiedImwProductValObj)
      }
    }
    pushHandler()
  },

  objectifyImwProductArr: function (imwProductArr, objectifiedImwProdArr) { //this objectifies imwProductArr for easy DOM template display
    for (let i = 0; i < imwProductArr.length; i++) {
      if (imwProductArr.length > 0) {
        console.log(`typeof imwProductArr[${i}]==> ${typeof imwProductArr[i]}`)
        console.log(`imwProductArr[${i}]==> ${imwProductArr[i]}`)
        if ((imwProductArr[i]) !== '' && typeof imwProductArr[i] == 'string') {
          let objectifiedImwProd = JSON.parse(imwProductArr[i])
          objectifiedImwProdArr.push(objectifiedImwProd)
        } else {
          let objectifiedImwProd = imwProductArr[i]
          objectifiedImwProdArr.push(objectifiedImwProd)
        }
      }
    }
  },

  itemsToAddArrayGenerator: function (itemsToAdd, thingSanitizer, itemsToAddArr) {
    if (itemsToAdd !== undefined) {
      // itemsToAddSanitizer()
      thingSanitizer(itemsToAdd)
      /* X(?=Y) 	Positive lookahead 	X if followed by Y
       * (?<=Y)X 	Positive lookbehind 	X if after Y
       * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/

      let splitRegex1 = /(?<=}),(?={)/g
      let sanitizedThingSPLIT = sanitizedThing.split(splitRegex1)
      for (let i = 0; i < sanitizedThingSPLIT.length; i++) {
        itemsToAddArr.push(sanitizedThingSPLIT[i])
      }
    }
  }

}