module.exports = {
  showSearchResults: function (rows, genericHeaderObj, frmInptsObj, searchResults, searchResultsForCSV,
    searchResultsForCSVreview, searchResultsForXLS, edlpRows, nejRowsToggle) {

    console.log(`rows.length==>${rows.length}`)
    // let nejRows = rows[0] //targets 1st query on NEJ table
    // let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table
    // // let rainbowCatRows = rows[2] //targets 3rd query on rcth (rainbow--cat table hub) table
    // let nejRowsNonPagin = rows[2] //targets 3rd query on NEJ table

    // console.log(`JSON.stringify(nejRowsToggle[0])==> ${JSON.stringify(nejRowsToggle[0])}`)
    // console.log(`JSON.stringify(edlpRows[0])==> ${JSON.stringify(edlpRows[0])}`)

    console.log(`nejRowsToggle.length from showSearchResults==> ${nejRowsToggle.length}`)

    for (let i = 0; i < nejRowsToggle.length; i++) { //Add searched-for table entries from db to searchResults array, for
      //displaying in the dynamic DOM table. Also add margin data, & retail & charm calcs to display in DOM table
      let srcRsObj = {}
      let reviewObj = {} //push data to this obj for review CSV

      let oupNameVar = nejRowsToggle[i][genericHeaderObj.oupName] //define variable for oupName
      oupNameSplit = oupNameVar.split(/([0-9]+)/) //should split oupName into array with the digit as the 2nd array element

      function numPkgsHandler_case() {
        if (oupNameSplit[0].toLowerCase().includes('cs') || oupNameSplit[0].toLowerCase().includes('case')) { //handle numPkgs value for CS-#n items

          if (oupNameSplit[1] <= 1 || oupNameSplit[0].toLowerCase() == 'cs' || oupNameSplit[0].toLowerCase() == 'case') {
            reviewObj['numPkgs'] = srcRsObj['numPkgs'] = "INVALID # FOR CS-#N"
            reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = "INVALID # FOR CS-#N"
          } else {
            reviewObj['numPkgs'] = srcRsObj['numPkgs'] = oupNameSplit[1] //set numPkgs to numerical portion of CS-#n
            reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = 1 //set csPkgMltpl to 1 for CS-#n items
          }

        } else { //if item is not CASE item (i.e., it is EACH)
          if (oupNameSplit[0].toLowerCase().includes('ea')) {
            if (oupNameSplit[0].toLowerCase() == 'ea' || oupNameSplit[0].toLowerCase() == 'each') {
              reviewObj['numPkgs'] = srcRsObj['numPkgs'] = 1 //set numPkgs to 1
              reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = 1 //set csPkgMltpl to 1 for strictly 'ea' or 'each'
            } else { //set numPkgs & csPkgMltpl for 'ea-#n' or 'each-#n'
              reviewObj['numPkgs'] = srcRsObj['numPkgs'] = 1 //set numPkgs to 1
              reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = oupNameSplit[1] //set csPkgMltpl to numerical portion of oupName
            }

          } else {
            reviewObj['numPkgs'] = srcRsObj['numPkgs'] = 'invalid oupName' //set numPkgs to 'invalid oupName' if oupNameSplit[0] doesn't = CS or EA
            reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = 'invalid oupName' //set numPkgs to 'invalid oupName' if oupNameSplit[0] doesn't = CS or EA
          }
        }
      }

      //v//handle skuMismatchFlagOption////////////////////////////////////////////////////////////////////////////////
      function skuMismatchFlagOptionHandler() { //Flag SKU mismatch & leave SKU blank for IMW if skuMismatchFlagOption = "yes"
        //ACTUALLY, CATAPULT WONT UPDATE RECORD UNLESS SKU IS INCLUDED, SO CAN'T LEAVE SKU BLANK -t0d
        if (nejRowsToggle[i][genericHeaderObj.cpltSKUHeader] !== nejRowsToggle[i][genericHeaderObj.ediSKUHeader]) {
          if (frmInptsObj.skuMismatchOption == "yes") {
            // console.log(`frmInptsObj.skuMismatchOption==> ${frmInptsObj.skuMismatchOption}`)
            // srcRsObj['imwSKU'] = reviewObj['imwSKU'] = "" //ACTUALLY, CATAPULT WONT UPDATE RECORD UNLESS SKU IS INCLUDED, SO CAN'T LEAVE SKU BLANK -t0d
            srcRsObj['pf7'] = reviewObj['pf7'] = "skuMismatch"
            // console.log(`nejRowsToggle[${i}][genericHeaderObj.cpltSKUHeader]==> ${nejRowsToggle[i][genericHeaderObj.cpltSKUHeader]}`)
            // console.log(`nejRowsToggle[${i}][genericHeaderObj.ediSKUHeader]==> ${nejRowsToggle[i][genericHeaderObj.ediSKUHeader]}`)
            // console.log(`srcRsObj['imwSKU']==> ${srcRsObj['imwSKU']}`)
            // console.log(`srcRsObj['pf7']==> ${srcRsObj['pf7']}`)
          }
        }
      }
      //v//handle skuMismatchFlagOption////////////////////////////////////////////////////////////////////////////////

      var wsDiscoVar
      var rtlDiscoVar

      //v//Wholesale applied vendor discount (math is dependent on these variables)****************************************************
      function wsDiscoVarSetter() {
        if (srcRsObj['edlpVar'] !== 'EDLP') { //we actually don't want to apply ongoing discount (discountToApply) OR edplDisco
          //at the RETAIL level, since we should have already applied it at the WHOLESALE level. VERY IMPORTANT!!!
          wsDiscoVar = frmInptsObj.discountToApply_WS
        } else {
          wsDiscoVar = frmInptsObj.edlpDisco
        }
      }
      //^//Wholesale applied vendor discount (math is dependent on these variables)****************************************************

      //v//Retail applied vendor discount (math is dependent on these variables)****************************************************
      function rtlDiscoVarSetter() {
        if (srcRsObj['edlpVar'] !== 'EDLP') { //we actually don't want to apply ongoing discount (discountToApply) OR edplDisco
          //at the RETAIL level, since we should have already applied it at the WHOLESALE level. VERY IMPORTANT!!!
          //BUT SOMETIMES WE WANT TO APPLY DISCOUNT AT BOTH WS AND RTL LEVELS (THIS IS WHEN WE PASS THE SAVINGS ON TO CUSTOMER)
          //IN SUCH CASES, WE UTILIZE BOTH wsDiscoVarSetter() at the WS level, and rtlDiscoVarSetter() at the retail level
          rtlDiscoVar = frmInptsObj.discountToApply_Rtl
          console.log(`showSearchResults.js says: rtlDiscoVar==> ${rtlDiscoVar}`)
          if (rtlDiscoVar == null) {
            rtlDiscoVar = 0
          }
        } else {
          rtlDiscoVar = frmInptsObj.edlpDisco
        }
      }
      //v//Retail applied vendor discount (math is dependent on these variables)****************************************************

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //v//Wholesale applied vendor discount (math is dependent on these variables)****************************************************
      function divideCostByOupNameSplit_1() {
        reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameSplit[1]) * 100) / 100 //divide ediCost by oupName parsed value (index 1 = numerical value)
        //AND deduct any vendor discount from ediCost
        reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameSplit[1]) * 100) / 100 //change lastCost to ediCostMod for retail IMWs
        //AND deduct any vendor discount from ediCost
      }

      function divideCostByOupNameVar() {
        reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameVar) * 100) / 100 //divide ediCost by oupName non-parsed value
        //AND deduct any vendor discount from ediCost
        reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameVar) * 100) / 100 //change lastCost to ediCostMod for retail IMWs
        //AND deduct any vendor discount from ediCost
        reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = oupNameVar //set csPkgMltpl to oupNameVar (since at this point, oupName should just be a number)
      }

      function divideCostBy_1() {
        reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / 1) * 100) / 100 //divide ediCost by 1 for items with oupName value of just "each", "ea", "case", or "cs"
        //AND deduct any vendor discount from ediCost
        reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / 1) * 100) / 100 //change lastCost to ediCostMod for retail IMWs
        //AND deduct any vendor discount from ediCost
      }
      //^//Wholesale applied vendor discount (math is dependent on these variables)****************************************************
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      function divideCostToUnitRetail() {
        if (oupNameSplit[1] !== undefined) { //if there is something after 'EA' or 'CS' (i.e. #n)
          divideCostByOupNameSplit_1()
          numPkgsHandler_case()
        } else {
          if (oupNameVar.trim().toLowerCase() == 'each' || oupNameVar.trim().toLowerCase() == 'ea' ||
            oupNameVar.trim().toLowerCase() == 'case' || oupNameVar.trim().toLowerCase() == 'cs' ||
            oupNameVar.trim().toLowerCase() == 'pound' || oupNameVar.trim().toLowerCase() == 'lb') {
            divideCostBy_1()
            numPkgsHandler_case()
          } else {
            divideCostByOupNameVar()
          }
        }
      }

      function divideCostToUnitWholesale() {
        if (!oupNameSplit[0].trim().toLowerCase().includes('lb') &&
          !oupNameSplit[0].trim().toLowerCase().includes('pound')) { // if oupName DOESNT include 'lb' or 'pound'
          if (oupNameSplit[1] !== undefined) { //if there is something after 'EA' or 'CS' (i.e. #n)
            testCostDivideByOupNameSplit_1()
          } else {
            if (oupNameVar.trim().toLowerCase() == 'each' || oupNameVar.trim().toLowerCase() == 'ea' ||
              oupNameVar.trim().toLowerCase() == 'case' || oupNameVar.trim().toLowerCase() == 'cs') {
              testCostDivideBy_1()
            } else {
              testCostDivideByOupNameVar()
            }
          }
        } else { // if oupName DOES include 'lb' or 'pound'
          testCostDivideBy_1() //DONT change cost from what EDI catalog shows
        }
      }

      function divideCostOrNotRetail() {
        if (frmInptsObj.divideCostByEachOption == 'yes' && frmInptsObj.divideCostByCaseOption == 'yes') {
          if (oupNameSplit[1] !== undefined) { //if there is something after 'EA' or 'CS' (i.e. #n)
            divideCostByOupNameSplit_1()
            numPkgsHandler_case()
          } else {
            if (oupNameVar.trim().toLowerCase() == 'each' || oupNameVar.trim().toLowerCase() == 'ea' ||
              oupNameVar.trim().toLowerCase() == 'case' || oupNameVar.trim().toLowerCase() == 'cs') {
              divideCostBy_1()
              numPkgsHandler_case()
            } else {
              divideCostByOupNameVar() // reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = oupNameVar //set csPkgMltpl to oupNameVar (since at this point, oupName should just be a number)
            }
          }
        }
        if (frmInptsObj.divideCostByEachOption == 'no' && frmInptsObj.divideCostByCaseOption == 'yes') {
          if (!oupNameVar.trim().toLowerCase().includes('ea')) {
            divideCostToUnitRetail()
          } else {
            divideCostBy_1()
            numPkgsHandler_case()
          }
        }
        if (frmInptsObj.divideCostByEachOption == 'yes' && frmInptsObj.divideCostByCaseOption == 'no') {
          if (!oupNameVar.trim().toLowerCase().includes('cs') && !oupNameVar.trim().toLowerCase().includes('case')) {
            divideCostToUnitRetail()
          } else {
            divideCostBy_1()
            numPkgsHandler_case()
          }
        }
        if (frmInptsObj.divideCostByEachOption == 'no' && frmInptsObj.divideCostByCaseOption == 'no') {
          divideCostBy_1()
          numPkgsHandler_case()
        }
      }

      function divideCostOrNotWholesale() {
        if (frmInptsObj.divideCostByEachOption == 'yes' && frmInptsObj.divideCostByCaseOption == 'yes') {
          if (oupNameSplit[1] !== undefined) { //if there is something after 'EA' or 'CS' (i.e. #n)
            testCostDivideByOupNameSplit_1()
          } else {
            if (oupNameVar.trim().toLowerCase() == 'each' || oupNameVar.trim().toLowerCase() == 'ea' ||
              oupNameVar.trim().toLowerCase() == 'case' || oupNameVar.trim().toLowerCase() == 'cs') {
              testCostDivideBy_1()
            } else {
              testCostDivideByOupNameVar()
            }
          }
        }
        if (frmInptsObj.divideCostByEachOption == 'no' && frmInptsObj.divideCostByCaseOption == 'yes') {
          if (!oupNameVar.trim().toLowerCase().includes('ea')) {
            divideCostToUnitWholesale()
          } else {
            testCostDivideBy_1()
          }
        }
        if (frmInptsObj.divideCostByEachOption == 'yes' && frmInptsObj.divideCostByCaseOption == 'no') {
          if (!oupNameVar.trim().toLowerCase().includes('cs') && !oupNameVar.trim().toLowerCase().includes('case')) {
            divideCostToUnitWholesale()
          } else {
            testCostDivideBy_1()
          }
        }
        if (frmInptsObj.divideCostByEachOption == 'no' && frmInptsObj.divideCostByCaseOption == 'no') {
          testCostDivideBy_1()
        }
      }

      srcRsObj['invPK'] = reviewObj['invPK'] = nejRowsToggle[i]['invPK'] //populate srcRsObj & reviewObj with invPK from Catapult
      srcRsObj['invCPK'] = reviewObj['invCPK'] = nejRowsToggle[i]['invCPK'] //populate srcRsObj & reviewObj with invCPK from Catapult

      function divideCostToUOS_Rtl_IMW() {
        // wsDiscoVarSetter()
        wsDiscoVar = 0 //set wsDiscoVar to 0, so wholesales won't have vendor discounts applied FOR typeOFIMW = RETAIL
        divideCostOrNotRetail()
      }

      function testCostDivideByOupNameSplit_1() {
        //v//Wholesale applied vendor discount (math is dependent on these variables)
        wsDiscoVarSetter()
        //^//Wholesale applied vendor discount (math is dependent on these variables)
        // console.log(`wsDiscoVar==> ${wsDiscoVar}`)
        let ediTestCost1 = `${(srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameSplit[1]}` //apply vendor WS discount, if applicable
        let ediTstCst1Tr = ediTestCost1.trim().replace(/"/g, '')
        let ediTstCst1TrRnd = Math.round(ediTstCst1Tr * 100) / 100 //converts the result to a number with just 2 decimal places
        let cpltTstCst1Tr = srcRsObj['cpltCost'].trim().replace(/"/g, '')
        let cpltTstCst1TrRnd = Math.round(cpltTstCst1Tr * 100) / 100 //converts the result to a number with just 2 decimal places

        if (ediTstCst1TrRnd !== cpltTstCst1TrRnd) { //only handle items where new edi cat cost not equal to exist. catapult cost
          divideCostByOupNameSplit_1()
          numPkgsHandler_case()
        } else {}
      }

      function testCostDivideBy_1() {
        //v//Wholesale applied vendor discount (math is dependent on these variables)
        wsDiscoVarSetter()
        //^//Wholesale applied vendor discount (math is dependent on these variables)
        let ediTestCost2 = `${(srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / 1}` //apply vendor WS discount, if applicable
        let ediTstCst2Tr = ediTestCost2.trim().replace(/"/g, '')
        let ediTstCst2TrRnd = Math.round(ediTstCst2Tr * 100) / 100 //converts the result to a number with just 2 decimal places
        let cpltTstCst2Tr = srcRsObj['cpltCost'].trim().replace(/"/g, '')
        let cpltTstCst2TrRnd = Math.round(cpltTstCst2Tr * 100) / 100 //converts the result to a number with just 2 decimal places
        if (ediTstCst2TrRnd !== cpltTstCst2TrRnd) { //only handle items where new edi cat cost not equal to exist. catapult cost  
          divideCostBy_1()
          reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = 1 //set csPkgMltpl to 1 for just "EA", "EACH", "CS", or "CASE"
        } else {}
      }

      function testCostDivideByOupNameVar() {
        //v//Wholesale applied vendor discount (math is dependent on these variables)
        wsDiscoVarSetter()
        //^//Wholesale applied vendor discount (math is dependent on these variables)
        let ediTestCost3 = `${(srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameVar}` //apply vendor WS discount, if applicable
        let ediTestCost3Tr = ediTestCost3.trim().replace(/"/g, '')
        let ediTestCost3TrRnd = Math.round(ediTestCost3Tr * 100) / 100 //converts the result to a number with just 2 decimal places
        let cpltTstCst3Tr = srcRsObj['cpltCost'].trim().replace(/"/g, '')
        let cpltTstCst3TrRnd = Math.round(cpltTstCst3Tr * 100) / 100 //converts the result to a number with just 2 decimal places
        if (ediTestCost3TrRnd !== cpltTstCst3TrRnd) { //only handle items where new edi cat cost not equal to exist. catapult cost
          divideCostByOupNameVar()
        } else {}
      }

      function divideCostToUOS_WS_IMW() {
        if (frmInptsObj.typeOfIMW.toLowerCase() == 'wholesale') {
          //v//Wholesale applied vendor discount (math is dependent on these variables)
          wsDiscoVarSetter()
          //^//Wholesale applied vendor discount (math is dependent on these variables)
          divideCostOrNotWholesale()
        }
      }

      function calcCharm(departmentMargin, lowerCutRqdRtl, lowerCutoffCharm1, lowerCutoffCharm2, lowerCutoffCharm3, lowerCutoffCharm4,
        lowerCutoffCharm5, lowerCutoffCharm6, lowerCutoffCharm7, upperCharmRqdRtl, defaultCharm1, defaultCharm2, defaultCharm3, defaultCharm4) {

        if (frmInptsObj.typeOfIMW.toLowerCase() == 'retail') {
          //v//Retail applied vendor discount (math is dependent on these variables)
          rtlDiscoVarSetter()
          //^//Retail applied vendor discount (math is dependent on these variables)

          if (srcRsObj['ediCost'] > 0) {

            divideCostToUOS_Rtl_IMW()
            srcRsObj['lastCost'] = '' //**HERE WE RESET LAST COST TO BE EMPTY, BECAUSE WE DON'T WANT TO INCLUDE LAST COST IN RETAIL IMWs

            //v//Retail applied vendor discount (math is dependent on these variables)
            srcRsObj['reqdRetail'] = reviewObj['reqdRetail'] = Math.round((-(srcRsObj['ediCostMod'] - srcRsObj['ediCostMod'] * rtlDiscoVar) / (departmentMargin - 1)) * 100) / 100 //applies margin to WS
            //^//Retail applied vendor discount (math is dependent on these variables)

            console.log(`calcCharm() from showSearchResults.js says: srcRsObj['ediCostMod']==> ${srcRsObj['ediCostMod']}`)
            console.log(`calcCharm() from showSearchResults.js says: rtlDiscoVar==> ${rtlDiscoVar}`)
            console.log(`calcCharm() from showSearchResults.js says: srcRsObj['ediCostMod'] * rtlDiscoVar==> ${srcRsObj['ediCostMod'] * rtlDiscoVar}`)
            //v//ACTUALLY, IT APPEARS WE DO NOT want to apply ongoing discount (discountToApply) OR edplDisco at the RETAIL level/////////////////////
            //BUT SOMETIMES WE DO WANT TO APPLY THE DISCOUNT AT THE RETAIL LEVEL ALSO; THAT IS WHEN WE'RE PASSING THE SAVINGS ON TO THE CUSTOMER
            // if (srcRsObj['edlpVar'] !== 'EDLP') { //we actually DO want to apply ongoing discount (discountToApply) OR edplDisco
            //   //at the RETAIL level, since even though we should have already applied it at the WHOLESALE level, we are using
            //   //cost from the EDI Vendor catalog (which has not yet had the disco applied) to calc updated retail VERY IMPORTANT!!!
            //   srcRsObj['reqdRetail'] = reviewObj['reqdRetail'] = Math.round((-(srcRsObj['ediCostMod'] - srcRsObj['ediCostMod'] * discountToApply) / (departmentMargin - 1)) * 100) / 100
            //   //applies margin to WS for NON-EDLP
            // } else {
            //   srcRsObj['reqdRetail'] = reviewObj['reqdRetail'] = Math.round((-(srcRsObj['ediCostMod'] - srcRsObj['ediCostMod'] * edlpDisco) / (departmentMargin - 1)) * 100) / 100 //applies margin to WS
            //   //applies margin to WS for EDLP
            // }
            //^//ACTUALLY, IT APPEARS WE DO NOT want to apply ongoing discount (discountToApply) OR edplDisco at the RETAIL level/////////////////////
            // srcRsObj['reqdRetail'] = reviewObj['reqdRetail'] = Math.round((-(srcRsObj['ediCostMod'] - srcRsObj['ediCostMod'] * discountToApply) / (departmentMargin - 1)) * 100) / 100 //applies margin to WS
            //AND also applies any % discount; discountToApply is set at default 0
            //Finally, Math.round(number*100)/100 converts the result to a number with just 2 decimal places.
            if (srcRsObj['reqdRetail'] % 1 < .10 && srcRsObj['reqdRetail'] > 0) { //change charm price to (#-1).99 if req'd rtl is #.00 -> #.10
              dbl0Or10CharmResult = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 - .01
              // reviewObj['charm'] = srcRsObj['charm'] = '"' + dbl0Or10CharmResult + '"'
              reviewObj['charm'] = srcRsObj['charm'] = dbl0Or10CharmResult
              return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm']
            } else {
              if (srcRsObj['reqdRetail'] > 0) {
                if (srcRsObj['reqdRetail'] < lowerCutRqdRtl) { //if req'd rtl is below lower cutoff
                  if ((srcRsObj['reqdRetail'] % 1) < .20) {
                    if (lowerCutoffCharm1 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm1
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm2
                    }
                  }
                  if ((srcRsObj['reqdRetail'] % 1) < .30) {
                    if (lowerCutoffCharm2 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm2
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm3
                    }
                  }
                  if ((srcRsObj['reqdRetail'] % 1) < .40) {
                    if (lowerCutoffCharm3 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm3
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm4
                    }
                  }
                  if ((srcRsObj['reqdRetail'] % 1) < .50) {
                    if (lowerCutoffCharm4 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm4
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm5
                    }
                  }
                  if ((srcRsObj['reqdRetail'] % 1) < .60) {
                    if (lowerCutoffCharm5 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm5
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm6
                    }
                  }
                  if ((srcRsObj['reqdRetail'] % 1) < .80) {
                    if (lowerCutoffCharm6 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm6
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm7
                    }
                  }
                  if ((srcRsObj['reqdRetail'] % 1) > .80) {
                    if (lowerCutoffCharm7 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm7
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail']
                    }
                  }
                } else {
                  if (srcRsObj['reqdRetail'] < upperCharmRqdRtl) { //if req'd rtl is below upper charm cutoff ($12 for Brad & $9999 for Andrea)
                    if ((srcRsObj['reqdRetail'] % 1) <= .35) { //bump anything from #.10 to #.35 ==> #.29
                      if (defaultCharm1 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm1
                      } else {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm2
                      }
                    }
                    if ((srcRsObj['reqdRetail'] % 1) <= .55) { //bump anything from #.36 to #.55 ==> #.49
                      if (defaultCharm2 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm2
                      } else {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm3
                      }
                    }
                    if (srcRsObj['reqdRetail'] % 1 <= .855) { //bump anything from #.56 to #.85 ==> #.79 (Brad); Andrea gets bumped
                      //to #.99 for anything from #.56 to #.85 (because defaultCharm3 for Brad is .79, but for Andrea it is .99)
                      if (defaultCharm3 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm3
                      } else {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm4
                      }
                    }
                    if (srcRsObj['reqdRetail'] % 1 > .856) { //bump anything from #.85+ and higher ==> #.99
                      if (lowerCutoffCharm4 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm4
                      }
                    }
                  } else {
                    return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm4
                  }
                }
              }
            }
          } else {
            srcRsObj['reqdRetail'] = ""
            srcRsObj['charm'] = ""
          }
        }
      }

      function revealAppliedMarg(departmentMargin) {
        srcRsObj['appldMrgn'] = reviewObj['appldMrgn'] = departmentMargin * 100
      }

      srcRsObj['ri_t0d'] = nejRowsToggle[i][genericHeaderObj.primarykeyHeader] //for every row returned from sql query of NEJ table,
      //populate search results onject (srcRsObj) with corresponding primary key mapped to a key of 'ri_t0d' 
      srcRsObj['upc'] = nejRowsToggle[i][genericHeaderObj.upcHeader] //Item ID
      // console.log('calcResults says: srcRsObj[\'upc\']~~~>', srcRsObj['upc'])
      reviewObj['upc'] = nejRowsToggle[i][genericHeaderObj.upcHeader] //Item ID


      //v//EDLP HANDLER///////////////////////////////////////////////////////////////////////////////////////
      for (let j = 0; j < edlpRows.length; j++) {
        srcRsObj['edlpUPC'] = edlpRows[j]['edlp_upc']
        reviewObj['edlpUPC'] = edlpRows[j]['edlp_upc'] //INCLUDE in save2CSVreview export data

        if (srcRsObj['upc'] == srcRsObj['edlpUPC']) {
          srcRsObj['edlpVar'] = "EDLP"
          reviewObj['edlpVar'] = "EDLP"
        } else {
          srcRsObj['edlpVar'] = ""
          reviewObj['edlpVar'] = ""
        }
      }
      //^//EDLP HANDLER///////////////////////////////////////////////////////////////////////////////////////

      srcRsObj['cpltCost'] = reviewObj['cpltCost'] = nejRowsToggle[i][genericHeaderObj.invLastcostHeader]

      srcRsObj['deptID'] = "" //Department ID
      srcRsObj['deptName'] = "" //Department Name
      srcRsObj['rcptAlias'] = "" //Receipt Alias
      srcRsObj['brand'] = "" //Brand

      if (frmInptsObj.typeOfIMW.toLowerCase() == 'new') {
        if (nejRowsToggle[i][genericHeaderObj.nameHeader].includes(',')) { //remove any commas from item names, so csv isn't horked
          var cleanedName = nejRowsToggle[i][genericHeaderObj.nameHeader].replace(',', '')
          srcRsObj['itemName'] = cleanedName
        } else {
          srcRsObj['itemName'] = nejRowsToggle[i][genericHeaderObj.nameHeader]
        }
      } else {
        srcRsObj['itemName'] = "" //Item Name
      }

      srcRsObj['size'] = "" //Size
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //v//20191122 moved SUGGESTED RETAIL to pf8 & now populating the IMW sugstdRtl column with RB charm price
      // srcRsObj['sugstdRtl'] = nejRowsToggle[i][genericHeaderObj.msrpHeader] //Suggested Retail
      //TODO: May need to change this to srcRsObj['sugstdRtl'] = srcRsObj['charm'] (will have to declare it in calcCharm() function,
      //where you are actually calculating srcRsObj['charm']. I don't think this is a good idea AT ALL, especially given the fact
      //that Catapult specifically defines suggested retail as MSRP, so the way you're currently doing it is the correct way.
      //For now, if it is an issue with Tom, just manually change sugstdRtl column to be same as charm column)
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // srcRsObj['charm'] = "" //Base Price ==>INCLUDE in save2CSVreview export data
      srcRsObj['autoDiscount'] = "" //Auto Discount

      // srcRsObj['idealMarg'] = "" //Ideal Margin
      srcRsObj['idealMarg'] = nejRowsToggle[i][genericHeaderObj.sibIdealMarginHeader] //set idealMarg to what it actually is in Catapult
      // srcRsObj['actualMargT0d'] = nejRowsToggle[i][genericHeaderObj.actualMargT0dHeader]

      srcRsObj['wtPrfl'] = "" //Weight Profile
      srcRsObj['tax1'] = "" //Tax1
      srcRsObj['tax2'] = "" //Tax2
      srcRsObj['tax3'] = "" //Tax3
      srcRsObj['spclTndr1'] = "" //Special Tender 1
      srcRsObj['spclTndr2'] = "" //Special Tender 2
      srcRsObj['posPrmpt'] = "" //POS Prompt
      srcRsObj['lctn'] = "" //Location
      srcRsObj['altID'] = "" //Alternate ID
      srcRsObj['altRcptAlias'] = "" //Alternate Receipt Alias
      srcRsObj['pkgQnt'] = "" //Package Quantity
      srcRsObj['cpltSKU'] = nejRowsToggle[i][genericHeaderObj.cpltSKUHeader] //Supplier Unit ID
      reviewObj['cpltSKU'] = nejRowsToggle[i][genericHeaderObj.cpltSKUHeader] //Supplier Unit ID
      srcRsObj['ediSKU'] = nejRowsToggle[i][genericHeaderObj.ediSKUHeader] //Supplier Unit ID
      reviewObj['ediSKU'] = nejRowsToggle[i][genericHeaderObj.ediSKUHeader] //Supplier Unit ID

      if (frmInptsObj.skuToggle.toLowerCase() == 'edi') { //provide option to choose which SKU (EDI vs Catapult) to populate IMW with
        srcRsObj['imwSKU'] = reviewObj['imwSKU'] = srcRsObj['ediSKU']
      } else {
        srcRsObj['imwSKU'] = reviewObj['imwSKU'] = srcRsObj['cpltSKU']
      }

      if (reviewObj['ediSKU'] !== reviewObj['cpltSKU']) {
        srcRsObj['skuMismatch'] = reviewObj['skuMismatch'] = reviewObj['upc']
      } else {
        srcRsObj['skuMismatch'] = reviewObj['skuMismatch'] = ''
      }

      srcRsObj['splrID'] = nejRowsToggle[i][genericHeaderObj.rbSupplierHeader] //Supplier ID (EDI-VENDORNAME)
      srcRsObj['unit'] = "" //Unit

      srcRsObj['oupName'] = nejRowsToggle[i][genericHeaderObj.oupName] //oupName from catapult
      reviewObj['oupName'] = nejRowsToggle[i][genericHeaderObj.oupName] //oupName from catapult

      srcRsObj['stoNumber'] = nejRowsToggle[i][genericHeaderObj.stoNumber] //stoNumber from catapult
      reviewObj['stoNumber'] = nejRowsToggle[i][genericHeaderObj.stoNumber] //stoNumber from catapult

      srcRsObj['stoName'] = nejRowsToggle[i][genericHeaderObj.stoName] //stoName from catapult
      reviewObj['stoName'] = nejRowsToggle[i][genericHeaderObj.stoName] //stoName from catapult

      // srcRsObj['numPkgs'] = "" //Number of Packages

      // srcRsObj['numPkgs'] = reviewObj['numPkgs'] = 1 //set numPkgs (for IMW) to 1 FOR EVERYTHING (CRITICAL)

      srcRsObj['pf1'] = `${nejRowsToggle[i][genericHeaderObj.pi1Description]}` //Power Field 1 SPINS category
      reviewObj['pf1'] = `${nejRowsToggle[i][genericHeaderObj.pi1Description]}` //Power Field 1 SPINS category
      srcRsObj['pf2'] = `${nejRowsToggle[i][genericHeaderObj.pi2Description]}` //Power Field 2 SPINS sub-category
      reviewObj['pf2'] = `${nejRowsToggle[i][genericHeaderObj.pi2Description]}` //Power Field 2 SPINS sub-category
      srcRsObj['pf3'] = "" //Power Field 3 try to get department margin
      // reviewObj['pf3'] = //Power Field 3 revealAppliedMarg()
      srcRsObj['pf4'] = "" //Power Field 4
      //v//provide different update messages, based on what type of update you're doing (i.e. ws IMW, retail IMW, new item IMW)
      if (frmInptsObj.typeOfIMW.toLowerCase() == 'wholesale') {
        srcRsObj['pf5'] = new Date().toISOString().split('T', 1)[0] + " WS UPDT (pf5)" //Power Field 5 - today's date
        srcRsObj['pf8'] = "" //Power Field 8
      }
      if (frmInptsObj.typeOfIMW.toLowerCase() == 'retail') {
        srcRsObj['pf5'] = new Date().toISOString().split('T', 1)[0] + " RTL UPDT (pf5)" //Power Field 5 - today's date
        srcRsObj['pf8'] = `ACTUAL MSRP: ${nejRowsToggle[i][genericHeaderObj.msrpHeader]}` //Suggested Retail //Power Field 8 - this will target the ACTUAL MSRP
      }
      if (frmInptsObj.typeOfIMW.toLowerCase() == 'new') {
        srcRsObj['pf5'] = new Date().toISOString().split('T', 1)[0] + " NEW ITEM UPDT (pf5)" //Power Field 5 - today's date
        srcRsObj['pf8'] = "" //Power Field 8
      }
      //^//provide different update messages, based on what type of update you're doing (i.e. ws IMW, retail IMW, new item IMW)

      srcRsObj['pf6'] = nejRowsToggle[i][genericHeaderObj.rbSupplierHeader] //Power Field 6 //EDI-VENDORNAME INCLUDE in save2CSVreview export data
      reviewObj['pf6'] = nejRowsToggle[i][genericHeaderObj.rbSupplierHeader] //Power Field 6 //EDI-VENDORNAME INCLUDE in save2CSVreview export data
      srcRsObj['pf7'] = "" //Power Field 7
      // srcRsObj['pf8'] = "" //Power Field 8

      srcRsObj['onhndQnt'] = "" //On Hand Quantity
      srcRsObj['rdrPnt'] = "" //Reorder Point
      srcRsObj['mcl'] = "" //Maintain Constant Level
      srcRsObj['rdrQnt'] = "" //Reorder Quantity

      srcRsObj['memo'] = "" //Memo

      srcRsObj['flrRsn'] = "" //Failure Reason

      srcRsObj['dsd'] = "" //DSD

      srcRsObj['dscMltplr'] = "" //Discount Multiplier

      srcRsObj['ovr'] = reviewObj['ovr'] = 1 //20191224 set ovr (for IMW) to 1 FOR EVERYTHING per MaryKate's request
      //this WILL give buyers the option to override to buy "eaches" for items vendors sell to us in "cases"

      // srcRsObj['name'] = nejRowsToggle[i][genericHeaderObj.nameHeader] //INCLUDE in save2CSVreview export data

      //remove any commas from item names, so Review csv isn't horked
      var cleanedNameTest = nejRowsToggle[0][genericHeaderObj.nameHeader].replace(',', '')
      // console.log(`cleanedNameTest==> ${cleanedNameTest}`)
      var cleanedName2 = nejRowsToggle[i][genericHeaderObj.nameHeader].replace(',', '')
      srcRsObj['name'] = cleanedName2
      // console.log(`srcRsObj['name']==> ${srcRsObj['name']}`)
      reviewObj['name'] = cleanedName2
      // console.log(`reviewObj['name']==> ${reviewObj['name']}`)
      // console.log(`cleanedName2 <<${i}>>==> ${cleanedName2}`)

      // reviewObj['name'] = nejRowsToggle[i][genericHeaderObj.nameHeader]

      //v//this should get set as the value from edi catalog & never changed 
      reviewObj['ediCost'] = srcRsObj['ediCost'] = nejRowsToggle[i][genericHeaderObj.ediCostHeader] //INCLUDE in save2CSVreview export data
      //^//this should get set as the value from edi catalog & never changed 


      if (frmInptsObj.typeOfIMW.toLowerCase() == 'retail') { //only apply this if running retail
        //v//this should get initially set as the value from edi catalog & then changed according to division to UOS in calcCharm()
        reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = nejRowsToggle[i][genericHeaderObj.ediCostHeader] //NEED TO CHECK
        //^//this should get initially set as the value from edi catalog & then changed according to division to UOS in calcCharm()

        //v//Wholesale versus Retail applied vendor discount (just for retail reviews; no math is dependent on these variables)
        srcRsObj['discountToApply_WS'] = 0
        reviewObj['discountToApply_WS'] = 0 //INCLUDE in save2CSVreview export data

        srcRsObj['discountToApply_Rtl'] = frmInptsObj.discountToApply_Rtl * 100
        reviewObj['discountToApply_Rtl'] = frmInptsObj.discountToApply_Rtl * 100 //INCLUDE in save2CSVreview export data
        //^//Wholesale versus Retail applied vendor discount (just for retail reviews; no math is dependent on these variables)

      }


      if (nejRowsToggle[i][genericHeaderObj.ediCostHeaderItemCost] == "") { //generate blankEdiCostUPC entry to flag any margin report item_cost
        //values that are blank. This will then appear in the retail review worksheet under column name blankEdiCost. THESE ITEMS NEED
        //TO BE INVESTIGATED TO SEE IF SKUs ARE INACCURATE, OR WHATEVER ELSE IS GOING ON
        reviewObj['blankEdiCostUPC'] = srcRsObj['blankEdiCostUPC'] = nejRowsToggle[i][genericHeaderObj.upcHeader]
      }

      srcRsObj['ediPrice'] = nejRowsToggle[i][genericHeaderObj.msrpHeader] //INCLUDE in csv to export data
      reviewObj['ediPrice'] = nejRowsToggle[i][genericHeaderObj.msrpHeader] //INCLUDE in save2CSVreview export data

      srcRsObj['sibBasePrice'] = nejRowsToggle[i][genericHeaderObj.sibBasePriceHeader] //INCLUDE in csv to export data
      reviewObj['sibBasePrice'] = nejRowsToggle[i][genericHeaderObj.sibBasePriceHeader] //INCLUDE in save2CSVreview export data

      srcRsObj['globalMargin'] = frmInptsObj.globalMargin //do not include in csv to export data

      srcRsObj['dptName'] = nejRowsToggle[i][genericHeaderObj.rbDeptHeader]
      reviewObj['dptName'] = nejRowsToggle[i][genericHeaderObj.rbDeptHeader] //INCLUDE in save2CSVreview export data 

      srcRsObj['dptNumber'] = nejRowsToggle[i][genericHeaderObj.rbDeptIDHeader]
      reviewObj['dptNumber'] = nejRowsToggle[i][genericHeaderObj.rbDeptIDHeader] //INCLUDE in save2CSVreview export data

      for (let m = 0; m < frmInptsObj.deptFilterArr.length; m++) {
        if (srcRsObj['dptNumber'] == Object.keys(frmInptsObj.deptFilterArr[m])) {
          srcRsObj['defaultMarg'] = reviewObj['defaultMarg'] = frmInptsObj.deptFilterArr[m][Object.keys(frmInptsObj.deptFilterArr[m])]['dfltMrg'] //populate defaultMarg column in retail review
          //with default rb margin for a particular department number
        }
      }

      srcRsObj['sibIdealMargin'] = nejRowsToggle[i][genericHeaderObj.sibIdealMarginHeader]
      reviewObj['sibIdealMargin'] = nejRowsToggle[i][genericHeaderObj.sibIdealMarginHeader] //INCLUDE in save2CSVreview export data

      srcRsObj['actualMargT0d'] = nejRowsToggle[i][genericHeaderObj.actualMargT0dHeader]
      reviewObj['actualMargT0d'] = nejRowsToggle[i][genericHeaderObj.actualMargT0dHeader]

      srcRsObj['sale_flag'] = nejRowsToggle[i][genericHeaderObj.saleFlagHeader]
      reviewObj['sale_flag'] = nejRowsToggle[i][genericHeaderObj.saleFlagHeader] //INCLUDE in save2CSVreview export data

      // srcRsObj['discountToApply_WS'] = frmInptsObj.discountToApply_WS * 100
      // reviewObj['discountToApply_WS'] = frmInptsObj.discountToApply_WS * 100 //INCLUDE in save2CSVreview export data

      // srcRsObj['discountToApply_Rtl'] = frmInptsObj.discountToApply_Rtl * 100
      // reviewObj['discountToApply_Rtl'] = frmInptsObj.discountToApply_Rtl * 100 //INCLUDE in save2CSVreview export data

      if (frmInptsObj.typeOfIMW.toLowerCase() == 'wholesale') { //start dept filtering handling with wholesale imw,
        //because lower down, we will be filtering for retail imw after running calcCharm()

        //v//Wholesale versus Retail applied vendor discount (just for retail reviews; no math is dependent on these variables)
        srcRsObj['discountToApply_WS'] = frmInptsObj.discountToApply_WS * 100
        reviewObj['discountToApply_WS'] = frmInptsObj.discountToApply_WS * 100 //INCLUDE in save2CSVreview export data

        srcRsObj['discountToApply_Rtl'] = 0
        reviewObj['discountToApply_Rtl'] = 0 //INCLUDE in save2CSVreview export data
        //^//Wholesale versus Retail applied vendor discount (just for retail reviews; no math is dependent on these variables)

        divideCostToUOS_WS_IMW()
        skuMismatchFlagOptionHandler()
        if (srcRsObj['ediCostMod'] !== undefined) { //only push items that have ediCostMod value (which means that exist cplt cost
          //is different than new divided-to-uos edi cost, as determined in divideCostToUOS_WS_IMW())

          // console.log(`srcRsObj['upc'](${i})...srcRsObj['ediCostMod'](${i})==>${srcRsObj['upc']}...${srcRsObj['ediCostMod']}`)
          if (frmInptsObj.skuOveride.toLowerCase() == 'matchonly') { //option for including or excluding matching catapult/edi SKUs
            if (nejRowsToggle[i][genericHeaderObj.cpltSKUHeader] == nejRowsToggle[i][genericHeaderObj.ediSKUHeader]) {
              srcRsObj['sugstdRtl'] = "" //set sugstdRtl to empty if frmInptsObj.typeOfIMW = 'wholesale'
              srcRsObj['charm'] = "" //set charm to empty if frmInptsObj.typeOfIMW = 'wholesale'
              if (frmInptsObj.deptFilterToApply !== null) { //if a valid dept filter option is entered,
                if (srcRsObj['dptNumber'] == frmInptsObj.deptFilterToApply) { //only push that dept into searchResults
                  searchResults.push(srcRsObj)
                  searchResultsForCSV.push(srcRsObj)
                  searchResultsForCSVreview.push(reviewObj)
                  searchResultsForXLS.push(reviewObj)
                }
              } else { //otherwise, push all depts into searchResults
                searchResults.push(srcRsObj)
                searchResultsForCSV.push(srcRsObj)
                searchResultsForCSVreview.push(reviewObj)
                searchResultsForXLS.push(reviewObj)
              }
            }
          } else {
            srcRsObj['sugstdRtl'] = "" //set sugstdRtl to empty if frmInptsObj.typeOfIMW = 'wholesale'
            srcRsObj['charm'] = "" //set charm to empty if frmInptsObj.typeOfIMW = 'wholesale'
            if (frmInptsObj.deptFilterToApply !== null) { //if a valid dept filter option is entered,
              if (srcRsObj['dptNumber'] == frmInptsObj.deptFilterToApply) { //only push that dept into searchResults
                searchResults.push(srcRsObj)
                searchResultsForCSV.push(srcRsObj)
                searchResultsForCSVreview.push(reviewObj)
                searchResultsForXLS.push(reviewObj)
              }
            } else { //otherwise, push all depts into searchResults
              searchResults.push(srcRsObj)
              searchResultsForCSV.push(srcRsObj)
              searchResultsForCSVreview.push(reviewObj)
              searchResultsForXLS.push(reviewObj)
            }
          }
        }
      } else { //if typeOfIMW = retail
        //v//need to run calcCharm for edi catalogs, thus there will be no rb_dept_id key; use value input for frmInptsObj.globalMargin
        if (frmInptsObj.formInput0.includes('edi_')) {
          calcCharm(frmInptsObj.globalMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad,
            frmInptsObj.lowerCutoffCharm3Brad, frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad,
            frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad, frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad,
            frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
        }
        //^//need to run calcCharm for edi catalogs, thus there will be no rb_dept_id key; use value input for frmInptsObj.globalMargin

        if (srcRsObj['dptNumber'] == '54') { //Beer & Alcohol
          //apply Department margin to calculate charm pricing
          calcCharm(frmInptsObj.beerAlcMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad, frmInptsObj.lowerCutoffCharm3Brad,
            frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad, frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad,
            frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad, frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
          revealAppliedMarg(frmInptsObj.beerAlcMargin)
        }
        if (srcRsObj['dptNumber'] == '152') { //Body Care
          calcCharm(frmInptsObj.bodyCareMargin, frmInptsObj.lowerCutRqdRtlAndrea, frmInptsObj.lowerCutoffCharm1Andrea, frmInptsObj.lowerCutoffCharm2Andrea, frmInptsObj.lowerCutoffCharm3Andrea,
            frmInptsObj.lowerCutoffCharm4Andrea, frmInptsObj.lowerCutoffCharm5Andrea, frmInptsObj.lowerCutoffCharm6Andrea, frmInptsObj.lowerCutoffCharm7Andrea, frmInptsObj.upperCharmRqdRtlAndrea,
            frmInptsObj.defaultCharm1Andrea, frmInptsObj.defaultCharm2Andrea, frmInptsObj.defaultCharm3Andrea, frmInptsObj.defaultCharm4Andrea)
          revealAppliedMarg(frmInptsObj.bodyCareMargin)
        }
        if (srcRsObj['dptNumber'] == '9') { //Books
          calcCharm(frmInptsObj.booksMargin, frmInptsObj.lowerCutRqdRtlAndrea, frmInptsObj.lowerCutoffCharm1Andrea, frmInptsObj.lowerCutoffCharm2Andrea, frmInptsObj.lowerCutoffCharm3Andrea,
            frmInptsObj.lowerCutoffCharm4Andrea, frmInptsObj.lowerCutoffCharm5Andrea, frmInptsObj.lowerCutoffCharm6Andrea, frmInptsObj.lowerCutoffCharm7Andrea, frmInptsObj.upperCharmRqdRtlAndrea,
            frmInptsObj.defaultCharm1Andrea, frmInptsObj.defaultCharm2Andrea, frmInptsObj.defaultCharm3Andrea, frmInptsObj.defaultCharm4Andrea)
          revealAppliedMarg(frmInptsObj.booksMargin)
        }
        if (srcRsObj['dptNumber'] == '19') { //Bulk
          calcCharm(frmInptsObj.bulkMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad, frmInptsObj.lowerCutoffCharm3Brad,
            frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad, frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad,
            frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad, frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
          revealAppliedMarg(frmInptsObj.bulkMargin)
        }
        if (srcRsObj['dptNumber'] == '30') { //Bulk & Herb Prepack
          calcCharm(frmInptsObj.bulkHrbPrpkMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad, frmInptsObj.lowerCutoffCharm3Brad,
            frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad, frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad,
            frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad, frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
          revealAppliedMarg(frmInptsObj.bulkHrbPrpkMargin)
        }
        if (srcRsObj['dptNumber'] == '175') { //CBD - Grocery
          calcCharm(frmInptsObj.cbdGrocMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad, frmInptsObj.lowerCutoffCharm3Brad,
            frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad, frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad,
            frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad, frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
          revealAppliedMarg(frmInptsObj.cbdGrocMargin)
        }
        if (srcRsObj['dptNumber'] == '176') { //CBD - Supplements
          calcCharm(frmInptsObj.cbdSuppMargin, frmInptsObj.lowerCutRqdRtlAndrea, frmInptsObj.lowerCutoffCharm1Andrea, frmInptsObj.lowerCutoffCharm2Andrea, frmInptsObj.lowerCutoffCharm3Andrea,
            frmInptsObj.lowerCutoffCharm4Andrea, frmInptsObj.lowerCutoffCharm5Andrea, frmInptsObj.lowerCutoffCharm6Andrea, frmInptsObj.lowerCutoffCharm7Andrea, frmInptsObj.upperCharmRqdRtlAndrea,
            frmInptsObj.defaultCharm1Andrea, frmInptsObj.defaultCharm2Andrea, frmInptsObj.defaultCharm3Andrea, frmInptsObj.defaultCharm4Andrea)
          revealAppliedMarg(frmInptsObj.cbdSuppMargin)
        }
        if (srcRsObj['dptNumber'] == '177') { //CBD - Topicals
          calcCharm(frmInptsObj.cbdTopMargin, frmInptsObj.lowerCutRqdRtlAndrea, frmInptsObj.lowerCutoffCharm1Andrea, frmInptsObj.lowerCutoffCharm2Andrea, frmInptsObj.lowerCutoffCharm3Andrea,
            frmInptsObj.lowerCutoffCharm4Andrea, frmInptsObj.lowerCutoffCharm5Andrea, frmInptsObj.lowerCutoffCharm6Andrea, frmInptsObj.lowerCutoffCharm7Andrea, frmInptsObj.upperCharmRqdRtlAndrea,
            frmInptsObj.defaultCharm1Andrea, frmInptsObj.defaultCharm2Andrea, frmInptsObj.defaultCharm3Andrea, frmInptsObj.defaultCharm4Andrea)
          revealAppliedMarg(frmInptsObj.cbdTopMargin)
        }
        if (srcRsObj['dptNumber'] == '148') { //Consignments
          calcCharm(frmInptsObj.consignMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad, frmInptsObj.lowerCutoffCharm3Brad,
            frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad, frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad,
            frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad, frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
          revealAppliedMarg(frmInptsObj.consignMargin)
        }
        if (srcRsObj['dptNumber'] == '18') { //Frozen
          calcCharm(frmInptsObj.frozenMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad, frmInptsObj.lowerCutoffCharm3Brad,
            frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad, frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad,
            frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad, frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
          revealAppliedMarg(frmInptsObj.frozenMargin)
        }
        if (srcRsObj['dptNumber'] == '150') { //General Merchandise
          calcCharm(frmInptsObj.genMerchMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad, frmInptsObj.lowerCutoffCharm3Brad,
            frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad, frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad,
            frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad, frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
          revealAppliedMarg(frmInptsObj.genMerchMargin)
        }
        if (srcRsObj['dptNumber'] == '13') { //Gift Items
          calcCharm(frmInptsObj.giftMargin, frmInptsObj.lowerCutRqdRtlAndrea, frmInptsObj.lowerCutoffCharm1Andrea, frmInptsObj.lowerCutoffCharm2Andrea, frmInptsObj.lowerCutoffCharm3Andrea,
            frmInptsObj.lowerCutoffCharm4Andrea, frmInptsObj.lowerCutoffCharm5Andrea, frmInptsObj.lowerCutoffCharm6Andrea, frmInptsObj.lowerCutoffCharm7Andrea, frmInptsObj.upperCharmRqdRtlAndrea,
            frmInptsObj.defaultCharm1Andrea, frmInptsObj.defaultCharm2Andrea, frmInptsObj.defaultCharm3Andrea, frmInptsObj.defaultCharm4Andrea)
          revealAppliedMarg(frmInptsObj.giftMargin)
        }
        if (srcRsObj['dptNumber'] == '62') { //Grab & Go
          calcCharm(frmInptsObj.grabGoMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad, frmInptsObj.lowerCutoffCharm3Brad,
            frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad, frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad,
            frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad, frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
          revealAppliedMarg(frmInptsObj.grabGoMargin)
        }
        if (srcRsObj['dptNumber'] == '25') { //Grocery
          calcCharm(frmInptsObj.grocMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad, frmInptsObj.lowerCutoffCharm3Brad,
            frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad, frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad,
            frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad, frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
          revealAppliedMarg(frmInptsObj.grocMargin)
        }
        if (srcRsObj['dptNumber'] == '179') { //Grocery - Local
          calcCharm(frmInptsObj.grocLocMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad, frmInptsObj.lowerCutoffCharm3Brad,
            frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad, frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad,
            frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad, frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
          revealAppliedMarg(frmInptsObj.grocLocMargin)
        }
        if (srcRsObj['dptNumber'] == '38') { //Grocery - Local Meat
          calcCharm(frmInptsObj.grocLcMtMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad, frmInptsObj.lowerCutoffCharm3Brad,
            frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad, frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad,
            frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad, frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
          revealAppliedMarg(frmInptsObj.grocLcMtMargin)
        }
        if (srcRsObj['dptNumber'] == '12') { //HBA - had this as 17 & was causing hba items not to get charm applied
          calcCharm(frmInptsObj.hbaMargin, frmInptsObj.lowerCutRqdRtlAndrea, frmInptsObj.lowerCutoffCharm1Andrea, frmInptsObj.lowerCutoffCharm2Andrea, frmInptsObj.lowerCutoffCharm3Andrea,
            frmInptsObj.lowerCutoffCharm4Andrea, frmInptsObj.lowerCutoffCharm5Andrea, frmInptsObj.lowerCutoffCharm6Andrea, frmInptsObj.lowerCutoffCharm7Andrea, frmInptsObj.upperCharmRqdRtlAndrea,
            frmInptsObj.defaultCharm1Andrea, frmInptsObj.defaultCharm2Andrea, frmInptsObj.defaultCharm3Andrea, frmInptsObj.defaultCharm4Andrea)
          revealAppliedMarg(frmInptsObj.hbaMargin)
        }
        if (srcRsObj['dptNumber'] == '158') { //Herbs & Homeopathic
          calcCharm(frmInptsObj.herbsHomeoMargin, frmInptsObj.lowerCutRqdRtlAndrea, frmInptsObj.lowerCutoffCharm1Andrea, frmInptsObj.lowerCutoffCharm2Andrea, frmInptsObj.lowerCutoffCharm3Andrea,
            frmInptsObj.lowerCutoffCharm4Andrea, frmInptsObj.lowerCutoffCharm5Andrea, frmInptsObj.lowerCutoffCharm6Andrea, frmInptsObj.lowerCutoffCharm7Andrea, frmInptsObj.upperCharmRqdRtlAndrea,
            frmInptsObj.defaultCharm1Andrea, frmInptsObj.defaultCharm2Andrea, frmInptsObj.defaultCharm3Andrea, frmInptsObj.defaultCharm4Andrea)
          revealAppliedMarg(frmInptsObj.herbsHomeoMargin)
        }
        if (srcRsObj['dptNumber'] == '80') { //LifeBar
          calcCharm(frmInptsObj.lfBrMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad, frmInptsObj.lowerCutoffCharm3Brad,
            frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad, frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad,
            frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad, frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
          revealAppliedMarg(frmInptsObj.lfBrMargin)
        }
        if (srcRsObj['dptNumber'] == '151') { //Other
          calcCharm(frmInptsObj.otherMargin, frmInptsObj.lowerCutRqdRtlAndrea, frmInptsObj.lowerCutoffCharm1Andrea, frmInptsObj.lowerCutoffCharm2Andrea, frmInptsObj.lowerCutoffCharm3Andrea,
            frmInptsObj.lowerCutoffCharm4Andrea, frmInptsObj.lowerCutoffCharm5Andrea, frmInptsObj.lowerCutoffCharm6Andrea, frmInptsObj.lowerCutoffCharm7Andrea, frmInptsObj.upperCharmRqdRtlAndrea,
            frmInptsObj.defaultCharm1Andrea, frmInptsObj.defaultCharm2Andrea, frmInptsObj.defaultCharm3Andrea, frmInptsObj.defaultCharm4Andrea)
          revealAppliedMarg(frmInptsObj.otherMargin)
        }
        if (srcRsObj['dptNumber'] == '155') { //Refrigerated
          calcCharm(frmInptsObj.refrigMargin, frmInptsObj.lowerCutRqdRtlBrad, frmInptsObj.lowerCutoffCharm1Brad, frmInptsObj.lowerCutoffCharm2Brad, frmInptsObj.lowerCutoffCharm3Brad,
            frmInptsObj.lowerCutoffCharm4Brad, frmInptsObj.lowerCutoffCharm5Brad, frmInptsObj.lowerCutoffCharm6Brad, frmInptsObj.lowerCutoffCharm7Brad, frmInptsObj.upperCharmRqdRtlBrad,
            frmInptsObj.defaultCharm1Brad, frmInptsObj.defaultCharm2Brad, frmInptsObj.defaultCharm3Brad, frmInptsObj.defaultCharm4Brad)
          revealAppliedMarg(frmInptsObj.refrigMargin)
        }
        if (srcRsObj['dptNumber'] == '157') { //Vitamins & Supplements
          calcCharm(frmInptsObj.vitSuppMargin, frmInptsObj.lowerCutRqdRtlAndrea, frmInptsObj.lowerCutoffCharm1Andrea, frmInptsObj.lowerCutoffCharm2Andrea, frmInptsObj.lowerCutoffCharm3Andrea,
            frmInptsObj.lowerCutoffCharm4Andrea, frmInptsObj.lowerCutoffCharm5Andrea, frmInptsObj.lowerCutoffCharm6Andrea, frmInptsObj.lowerCutoffCharm7Andrea, frmInptsObj.upperCharmRqdRtlAndrea,
            frmInptsObj.defaultCharm1Andrea, frmInptsObj.defaultCharm2Andrea, frmInptsObj.defaultCharm3Andrea, frmInptsObj.defaultCharm4Andrea)
          revealAppliedMarg(frmInptsObj.vitSuppMargin)
        }


        function populateResultsObj_Rtl() {
          skuMismatchFlagOptionHandler()
          if (srcRsObj['charm'] !== "" && Math.round((srcRsObj['charm']) * 100) / 100 !== Math.round((srcRsObj['sibBasePrice']) * 100) / 100) { // only push results that have some
            //value for "charm" column, AND ALSO select only items whose updated price is different than the exist. price in cplt
            if (frmInptsObj.skuOveride.toLowerCase() == 'matchonly') { //option for including or excluding matching catapult/edi SKUs
              if (nejRowsToggle[i][genericHeaderObj.cpltSKUHeader] == nejRowsToggle[i][genericHeaderObj.ediSKUHeader]) {
                if (frmInptsObj.deptFilterToApply !== null) { //if a valid dept filter option is entered,
                  if (srcRsObj['dptNumber'] == frmInptsObj.deptFilterToApply) { //only push that dept into searchResults
                    searchResults.push(srcRsObj)
                    searchResultsForCSV.push(srcRsObj)
                    searchResultsForCSVreview.push(reviewObj)
                    searchResultsForXLS.push(reviewObj)
                  }
                } else { //otherwise, push all depts into searchResults
                  searchResults.push(srcRsObj)
                  searchResultsForCSV.push(srcRsObj)
                  searchResultsForCSVreview.push(reviewObj)
                  searchResultsForXLS.push(reviewObj)
                }
              }
            } else {
              if (frmInptsObj.deptFilterToApply !== null) { //if a valid dept filter option is entered,
                if (srcRsObj['dptNumber'] == frmInptsObj.deptFilterToApply) { //only push that dept into searchResults
                  searchResults.push(srcRsObj)
                  searchResultsForCSV.push(srcRsObj)
                  searchResultsForCSVreview.push(reviewObj)
                  searchResultsForXLS.push(reviewObj)
                }
              } else { //otherwise, push all depts into searchResults
                searchResults.push(srcRsObj)
                searchResultsForCSV.push(srcRsObj)
                searchResultsForCSVreview.push(reviewObj)
                searchResultsForXLS.push(reviewObj)
              }
            }
          }
        }
        //v//EDLP switch handler. This should exclude EDLPS from calcCharm results if switch is set to 'no', but include them if set to 'yes'
        if (frmInptsObj.edlpSwitch == 'no') {
          if (srcRsObj['edlpVar'] !== 'EDLP') {
            populateResultsObj_Rtl()
          }
        } else {
          populateResultsObj_Rtl()
        }
        //^//EDLP switch handler. This should exclude EDLPS from calcCharm results if switch is set to 'no', but include them if set to 'yes'
      }

    }
    console.log('showSearchResults says: searchResults.length from showSearchResults()==->', searchResults.length)
    console.log('showSearchResults says: searchResults[0] from showSearchResults()==>', searchResults[0])
    // console.log('showSearchResults says: searchResultsForCSVreview[0] from showSearchResults()==>', searchResultsForCSVreview[0])
  }
}