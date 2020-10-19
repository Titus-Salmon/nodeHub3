module.exports = {
  clcRsFrmInpts: function (postBodyData, formInputsObj) { //this function is exported
    formInputsObj.deptFilterArr = [{
        '54': {
          'name': 'Beer & Alcohol',
          'dfltMrg': '20'
        }
      },
      {
        '152': {
          'name': 'Body Care',
          'dfltMrg': '45'
        }
      },
      {
        '9': {
          'name': 'Books',
          'dfltMrg': '40'
        }
      },
      {
        '19': {
          'name': 'Bulk',
          'dfltMrg': '45'
        }
      },
      {
        '30': {
          'name': 'Bulk & Herb Prepack',
          'dfltMrg': '45'
        }
      },
      {
        '175': {
          'name': 'CBD - Grocery',
          'dfltMrg': '45'
        }
      },
      {
        '176': {
          'name': 'CBD - Supplements',
          'dfltMrg': '50'
        }
      },
      {
        '177': {
          'name': 'CBD - Topicals',
          'dfltMrg': '45'
        }
      },
      {
        '148': {
          'name': 'Consignments',
          'dfltMrg': '20'
        }
      },
      {
        '150': {
          'name': 'General Merchandise',
          'dfltMrg': '38'
        }
      },
      {
        '13': {
          'name': 'Gift Items',
          'dfltMrg': '50'
        }
      },
      {
        '62': {
          'name': 'Grab & Go',
          'dfltMrg': '33'
        }
      },
      {
        '25': {
          'name': 'Grocery',
          'dfltMrg': '38'
        }
      },
      {
        '179': {
          'name': 'Grocery - Local',
          'dfltMrg': '33'
        }
      },
      {
        '38': {
          'name': 'Grocery - Local Meat',
          'dfltMrg': '25'
        }
      },
      {
        '12': {
          'name': 'HBA',
          'dfltMrg': '45'
        }
      },
      {
        '158': {
          'name': 'Herbs & Homeopathic',
          'dfltMrg': '50' //changed from 40% per Andrea 20200715
        }
      },
      {
        '80': {
          'name': 'LifeBar',
          'dfltMrg': '0'
        }
      },
      {
        '151': {
          'name': 'Other',
          'dfltMrg': '45'
        }
      },
      {
        '155': {
          'name': 'Refrigerated',
          'dfltMrg': '33'
        }
      },
      {
        '157': {
          'name': 'Vitamins & Supplements',
          'dfltMrg': '50' //changed from 40% per Andrea 20200715
        }
      }
    ]

    console.log(`Object.keys(formInputsObj.deptFilterArr[0])==> ${Object.keys(formInputsObj.deptFilterArr[0])}`)
    console.log(`JSON.stringify(formInputsObj.deptFilterArr[0][Object.keys(formInputsObj.deptFilterArr[0])])==> ${JSON.stringify(formInputsObj.deptFilterArr[0][Object.keys(formInputsObj.deptFilterArr[0])])}`)
    console.log(`formInputsObj.deptFilterArr[0][Object.keys(formInputsObj.deptFilterArr[0])]['dfltMrg']==> ${formInputsObj.deptFilterArr[0][Object.keys(formInputsObj.deptFilterArr[0])]['dfltMrg']}`)

    console.log('calcResFormInputs says: postBodyData==>', postBodyData)
    console.log(`calcResFormInputs says: postBodyData['fldArrToPostPost']==> ${postBodyData['fldArrToPostPost']}`)
    console.log(`calcResFormInputs says: postBodyData['fldArrToPostPost'][0]==> ${postBodyData['fldArrToPostPost'][0]}`)

    //v//create variables for form POST data from #retailCalcUniversal form ('Search Loaded Table')
    // let formInput0 = Object.values(postBodyData)[0] = loadedSqlTbl = postBodyData['tblNameToPostPost'] //tblNameToPostPost (damage control revert1)
    formInputsObj.formInput0 = Object.values(postBodyData)[0] = formInputsObj.loadedSqlTbl = postBodyData['tblNameToPostPost'] //tblNameToPostPost
    // console.log('formInput0==>', formInput0)
    // formInputsObj.formInputObj0 = formInput0 (damage control revert1)
    formInputsObj.formInput1 = Object.values(postBodyData)[1] //fldArrToPostPost

    // formInputsObj.formInput2 = Object.values(postBodyData)[2] = formInputsObj.paginPostOption = postBodyData['paginPostOptionPost'] //paginPostOptionPost
    formInputsObj.formInput2 = Object.values(postBodyData)[2] = formInputsObj.currentPage = postBodyData['currentPagePost'] //currentPagePost
    formInputsObj.formInput3 = Object.values(postBodyData)[3] = formInputsObj.numQueryRes = postBodyData['numQueryResPost'] //numQueryResPost

    formInputsObj.formInput4 = Object.values(postBodyData)[4] = formInputsObj.beerAlcMargin = postBodyData['beerAlcMargPost'] //beerAlcMargPost
    formInputsObj.formInput5 = Object.values(postBodyData)[5] = formInputsObj.bodyCareMargin = postBodyData['bodyCareMargPost'] //bodyCareMargPost
    formInputsObj.formInput6 = Object.values(postBodyData)[6] = formInputsObj.booksMargin = postBodyData['booksMargPost'] //booksMargPost
    formInputsObj.formInput7 = Object.values(postBodyData)[7] = formInputsObj.bulkMargin = postBodyData['bulkMargPost'] //bulkMargPost
    formInputsObj.formInput8 = Object.values(postBodyData)[8] = formInputsObj.bulkHrbPrpkMargin = postBodyData['bulkHrbPrpkMargPost'] //bulkHrbPrpkMargPost
    formInputsObj.formInput9 = Object.values(postBodyData)[9] = formInputsObj.cbdGrocMargin = postBodyData['cbdGrocMargPost'] //cbdGrocMargPost
    formInputsObj.formInput10 = Object.values(postBodyData)[10] = formInputsObj.cbdSuppMargin = postBodyData['cbdSuppMargPost'] //cbdSuppMargPost
    formInputsObj.formInput11 = Object.values(postBodyData)[11] = formInputsObj.cbdTopMargin = postBodyData['cbdTopMargPost'] //cbdTopMargPost
    formInputsObj.formInput12 = Object.values(postBodyData)[12] = formInputsObj.consignMargin = postBodyData['consignMargPost'] //consignMargPost
    formInputsObj.formInput13 = Object.values(postBodyData)[13] = formInputsObj.frozenMargin = postBodyData['frozenMargPost'] //frozenMargPost
    formInputsObj.formInput14 = Object.values(postBodyData)[14] = formInputsObj.genMerchMargin = postBodyData['genMerchMargPost'] //genMerchMargPost
    formInputsObj.formInput15 = Object.values(postBodyData)[15] = formInputsObj.giftMargin = postBodyData['giftMargPost'] //giftMargPost
    formInputsObj.formInput16 = Object.values(postBodyData)[16] = formInputsObj.grabGoMargin = postBodyData['grabGoMargPost'] //grabGoMargPost
    formInputsObj.formInput17 = Object.values(postBodyData)[17] = formInputsObj.grocMargin = postBodyData['grocMargPost'] //grocMargPost
    formInputsObj.formInput18 = Object.values(postBodyData)[18] = formInputsObj.grocLocMargin = postBodyData['grocLocMargPost'] //grocLocMargPost
    formInputsObj.formInput19 = Object.values(postBodyData)[19] = formInputsObj.grocLcMtMargin = postBodyData['grocLcMtMargPost'] //grocLcMtMargPost
    formInputsObj.formInput20 = Object.values(postBodyData)[20] = formInputsObj.hbaMargin = postBodyData['hbaMargPost'] //hbaMargPost
    formInputsObj.formInput21 = Object.values(postBodyData)[21] = formInputsObj.herbsHomeoMargin = postBodyData['herbsHomeoMargPost'] //herbsHomeoMargPost
    formInputsObj.formInput22 = Object.values(postBodyData)[22] = formInputsObj.lfBrMargin = postBodyData['lfBrMargPost'] //lfBrMargPost
    formInputsObj.formInput23 = Object.values(postBodyData)[23] = formInputsObj.otherMargin = postBodyData['otherMargPost'] //otherMargPost
    formInputsObj.formInput24 = Object.values(postBodyData)[24] = formInputsObj.refrigMargin = postBodyData['refrigMargPost'] //refrigMargPost
    formInputsObj.formInput25 = Object.values(postBodyData)[25] = formInputsObj.vitSuppMargin = postBodyData['vitSuppMargPost'] //vitSuppMargPost
    formInputsObj.formInput26 = Object.values(postBodyData)[26] = formInputsObj.globalMargin = postBodyData['globalMargPost'] //globalMargPost

    formInputsObj.formInput27 = Object.values(postBodyData)[27] = formInputsObj.lowerCutRqdRtlAndrea = postBodyData['lowerCutRqdRtlAndreaPost'] //lowerCutRqdRtlAndreaPost
    formInputsObj.formInput28 = Object.values(postBodyData)[28] = formInputsObj.lowerCutRqdRtlBrad = postBodyData['lowerCutRqdRtlBradPost'] //lowerCutRqdRtlBradPost

    formInputsObj.formInput29 = Object.values(postBodyData)[29] = formInputsObj.lowerCutoffCharm1Andrea = postBodyData['lowerCutoffCharm1AndreaPost'] //lowerCutoffCharm1AndreaPost
    formInputsObj.formInput30 = Object.values(postBodyData)[30] = formInputsObj.lowerCutoffCharm1Brad = postBodyData['lowerCutoffCharm1BradPost'] //lowerCutoffCharm1BradPost

    formInputsObj.formInput31 = Object.values(postBodyData)[31] = formInputsObj.lowerCutoffCharm2Andrea = postBodyData['lowerCutoffCharm2AndreaPost'] //lowerCutoffCharm2AndreaPost
    formInputsObj.formInput32 = Object.values(postBodyData)[32] = formInputsObj.lowerCutoffCharm2Brad = postBodyData['lowerCutoffCharm2BradPost'] //lowerCutoffCharm2BradPost

    formInputsObj.formInput33 = Object.values(postBodyData)[33] = formInputsObj.lowerCutoffCharm3Andrea = postBodyData['lowerCutoffCharm3AndreaPost'] //lowerCutoffCharm3AndreaPost
    formInputsObj.formInput34 = Object.values(postBodyData)[34] = formInputsObj.lowerCutoffCharm3Brad = postBodyData['lowerCutoffCharm3BradPost'] //lowerCutoffCharm3BradPost

    formInputsObj.formInput35 = Object.values(postBodyData)[35] = formInputsObj.lowerCutoffCharm4Andrea = postBodyData['lowerCutoffCharm4AndreaPost'] //lowerCutoffCharm4AndreaPost
    formInputsObj.formInput36 = Object.values(postBodyData)[36] = formInputsObj.lowerCutoffCharm4Brad = postBodyData['lowerCutoffCharm4BradPost'] //lowerCutoffCharm4BradPost

    formInputsObj.formInput37 = Object.values(postBodyData)[37] = formInputsObj.lowerCutoffCharm5Andrea = postBodyData['lowerCutoffCharm5AndreaPost'] //lowerCutoffCharm5AndreaPost
    formInputsObj.formInput38 = Object.values(postBodyData)[38] = formInputsObj.lowerCutoffCharm5Brad = postBodyData['lowerCutoffCharm5BradPost'] //lowerCutoffCharm5BradPost

    formInputsObj.formInput39 = Object.values(postBodyData)[39] = formInputsObj.lowerCutoffCharm6Andrea = postBodyData['lowerCutoffCharm6AndreaPost'] //lowerCutoffCharm6AndreaPost
    formInputsObj.formInput40 = Object.values(postBodyData)[40] = formInputsObj.lowerCutoffCharm6Brad = postBodyData['lowerCutoffCharm6BradPost'] //lowerCutoffCharm6BradPost

    formInputsObj.formInput41 = Object.values(postBodyData)[41] = formInputsObj.lowerCutoffCharm7Andrea = postBodyData['lowerCutoffCharm7AndreaPost'] //lowerCutoffCharm7AndreaPost
    formInputsObj.formInput42 = Object.values(postBodyData)[42] = formInputsObj.lowerCutoffCharm7Brad = postBodyData['lowerCutoffCharm7BradPost'] //lowerCutoffCharm7BradPost

    formInputsObj.formInput43 = Object.values(postBodyData)[43] = formInputsObj.upperCharmRqdRtlAndrea = postBodyData['upperCharmRqdRtlAndreaPost'] //upperCharmRqdRtlAndreaPost
    formInputsObj.formInput44 = Object.values(postBodyData)[44] = formInputsObj.upperCharmRqdRtlBrad = postBodyData['upperCharmRqdRtlBradPost'] //upperCharmRqdRtlBradPost

    formInputsObj.formInput45 = Object.values(postBodyData)[45] = formInputsObj.defaultCharm1Andrea = postBodyData['defaultCharm1AndreaPost'] //defaultCharm1AndreaPost
    formInputsObj.formInput46 = Object.values(postBodyData)[46] = formInputsObj.defaultCharm1Brad = postBodyData['defaultCharm1BradPost'] //defaultCharm1BradPost

    formInputsObj.formInput47 = Object.values(postBodyData)[47] = formInputsObj.defaultCharm2Andrea = postBodyData['defaultCharm2AndreaPost'] //defaultCharm2AndreaPost
    formInputsObj.formInput48 = Object.values(postBodyData)[48] = formInputsObj.defaultCharm2Brad = postBodyData['defaultCharm2BradPost'] //defaultCharm2BradPost

    formInputsObj.formInput49 = Object.values(postBodyData)[49] = formInputsObj.defaultCharm3Andrea = postBodyData['defaultCharm3AndreaPost'] //defaultCharm3AndreaPost
    formInputsObj.formInput50 = Object.values(postBodyData)[50] = formInputsObj.defaultCharm3Brad = postBodyData['defaultCharm3BradPost'] //defaultCharm3BradPost

    formInputsObj.formInput51 = Object.values(postBodyData)[51] = formInputsObj.defaultCharm4Andrea = postBodyData['defaultCharm4AndreaPost'] //defaultCharm4AndreaPost
    formInputsObj.formInput52 = Object.values(postBodyData)[52] = formInputsObj.defaultCharm4Brad = postBodyData['defaultCharm4BradPost'] //defaultCharm4BradPost

    formInputsObj.formInput53 = Object.values(postBodyData)[53] = formInputsObj.discountToApply_WS = postBodyData['discountToApplyPost_WS'] //discountToApplyPost_WS
    formInputsObj.formInput54 = Object.values(postBodyData)[54] = formInputsObj.discountToApply_Rtl = postBodyData['discountToApplyPost_Rtl'] //discountToApplyPost_Rtl
    console.log(`typeof formInputsObj.discountToApply==> ${typeof formInputsObj.discountToApply}`)
    // console.log(`formInputsObj.discountToApply==> ${formInputsObj.discountToApply}`)
    // console.log(`formInputsObj.discountToApply * 5==> ${formInputsObj.discountToApply * 5}`)
    formInputsObj.formInput55 = Object.values(postBodyData)[55] = formInputsObj.edlpDisco = postBodyData['edlpDiscoPost'] //edlpDiscoPost

    // formInputsObj.formInput53 = Object.values(postBodyData)[53] //wsDiffResultsPost

    // formInputsObj.formInput55 = Object.values(postBodyData)[55] = formInputsObj.typeOfIMW //typeOfIMWPost
    formInputsObj.typeOfIMW = Object.values(postBodyData)[56] //typeOfIMWPost
    console.log('formInputsObj.typeOfIMW==>', formInputsObj.typeOfIMW)
    // formInputsObj.formInput56 = Object.values(postBodyData)[56] = formInputsObj.skuOveride //skuOveridePost
    formInputsObj.skuOveride = Object.values(postBodyData)[57] //skuOveridePost
    console.log('formInputsObj.skuOveride==>', formInputsObj.skuOveride)
    // formInputsObj.formInput57 = Object.values(postBodyData)[57] = formInputsObj.deptFilter //deptFilterPost
    formInputsObj.deptFilter = Object.values(postBodyData)[58] //deptFilterPost
    console.log('formInputsObj.deptFilter==>', formInputsObj.deptFilter)
    // formInputsObj.deptFilter = deptFilter
    // formInputsObj.formInput58 = Object.values(postBodyData)[58] = formInputsObj.edlpSwitch //edlpSwitchPost
    formInputsObj.edlpSwitch = Object.values(postBodyData)[59] //edlpSwitchPost
    console.log('formInputsObj.edlpSwitch==>', formInputsObj.edlpSwitch)
    // formInputsObj.formInput59 = Object.values(postBodyData)[59] = formInputsObj.skuToggle
    formInputsObj.skuToggle = Object.values(postBodyData)[60] //skuTogglePost
    console.log('formInputsObj.skuToggle==>', formInputsObj.skuToggle)
    // formInputsObj.formInput60 = Object.values(postBodyData)[60] = formInputsObj.ediTblName //ediTblNamePost
    formInputsObj.ediTblName = Object.values(postBodyData)[61] //ediTblNamePost
    console.log('formInputsObj.ediTblName==>', formInputsObj.ediTblName)
    // formInputsObj.formInput61 = Object.values(postBodyData)[61] = formInputsObj.skuMismatchOption //skuMismatchOptionPost
    formInputsObj.skuMismatchOption = Object.values(postBodyData)[62]
    console.log('formInputsObj.skuMismatchOption==>', formInputsObj.skuMismatchOption)

    // formInputsObj.formInput62 = Object.values(postBodyData)[62] = formInputsObj.divideCostByEachOption //divideCostByEachOptionPost
    formInputsObj.divideCostByEachOption = Object.values(postBodyData)[63] //divideCostByEachOptionPost
    console.log('formInputsObj.divideCostByEachOption==>', formInputsObj.divideCostByEachOption)
    // formInputsObj.formInput63 = Object.values(postBodyData)[63] = formInputsObj.divideCostByCaseOption //divideCostByCaseOptionPost
    formInputsObj.divideCostByCaseOption = Object.values(postBodyData)[64] //divideCostByCaseOptionPost
    console.log('formInputsObj.divideCostByCaseOption==>', formInputsObj.divideCostByCaseOption)

    formInputsObj.deptFilterToApply = null

    for (let k = 0; k < formInputsObj.deptFilterArr.length; k++) {
      console.log(`Object.keys(formInputsObj.deptFilterArr[${k}]==> ${Object.keys(formInputsObj.deptFilterArr[k])}`)
      if (Object.keys(formInputsObj.deptFilterArr[k]) == formInputsObj.deptFilter) { //sets department filter (by dept #)
        formInputsObj.deptFilterToApply = formInputsObj.deptFilter
      }
    }

    console.log(`formInputsObj.deptFilterToApply==> ${formInputsObj.deptFilterToApply}`)
    console.log(`calcResFormInputs says: JSON.stringify(formInputsObj)==> ${JSON.stringify(formInputsObj)}`)

    console.log(`Object.keys(postBodyData).length==> ${Object.keys(postBodyData).length}`)

    for (let i = 0; i < Object.keys(postBodyData).length; i++) {
      console.log(`Object.keys(postBodyData)[${i}] **>> Object.values(postBodyData)[${i}]==> ${Object.keys(postBodyData)[i]} **>> ${Object.values(postBodyData)[i]}`)
    }
  }
}