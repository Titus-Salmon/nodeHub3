module.exports = {
  gnrcHdrObj: function (postBodyData, genHeadObj) {
    //v//sanitize table column header post results from #retailCalcUniversal form ('Search Loaded Table')
    let toSplitField = postBodyData['fldArrToPostPost']
    // console.log('calcResults says: toSplitField before replace==>', toSplitField)
    let sanitizeColumnFields = /(\[)|(\])|(")/g
    let toSplitFieldReplace = toSplitField.replace(sanitizeColumnFields, "")
    // console.log('calcResults says: toSplitFieldReplace after replace==>', toSplitFieldReplace)
    let splitFieldResult = toSplitFieldReplace.split(',')
    //^//sanitize table column header post results from #retailCalcUniversal form ('Search Loaded Table')


    //****************************************************************************************************************** */
    //v//generate generic column headers corresponding to nhcrtEdiJoin table column headers that are associated with
    //primary key, upc, sku, name, cost, msrp, etc...
    // let genHeadObj = {}

    for (let i = 0; i < splitFieldResult.length; i++) {
      if (splitFieldResult[i].includes('ri_t0d')) { //primary key - don't think this will be needed for inv mnt wksht
        genHeadObj.primarykeyHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'invScanCode') { //Item ID (1); targets upc from catapult v_InventoryMaster table
        genHeadObj.upcHeader = splitFieldResult[i]
        // console.log('calcResults says: genHeadObj.upcHeader==>', genHeadObj.upcHeader)
      }
      if (splitFieldResult[i] == 'ordSupplierStockNumber') { //Supplier Unit ID (25); targets SKU from catapult v_InventoryMaster portion of
        //nhcrtEdiJoin table; ALSO NEED TO TARGET ediSKU from EDI portion of nhcrtEdiJoin table & THEN CHECK TO SEE IF THEY'RE THE SAME
        genHeadObj.cpltSKUHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'ediSKU') { //Supplier Unit ID (25); targets SKU from catapult v_InventoryMaster portion of
        //nhcrtEdiJoin table; ALSO NEED TO TARGET ediSKU from EDI portion of nhcrtEdiJoin table & THEN CHECK TO SEE IF THEY'RE THE SAME
        genHeadObj.ediSKUHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'invName') { //Item Name (6); targets prod name from catapult v_InventoryMaster portion of nhcrtEdiJoin table
        genHeadObj.nameHeader = splitFieldResult[i]
      }
      //v//20191121 MARGIN REPORT ISSUE///////////////////////////////////////////////////////////////////////////////////////////////////////////
      if (splitFieldResult[i] == 'ediCost') { //Last Cost(?) ==>updated WS; cost from EDI portion of nhcrtEdiJoin
        genHeadObj.ediCostHeader = splitFieldResult[i]
      } //targeting ediCost from vendor catalog
      if (splitFieldResult[i] == 'invLastcost') { //Last Cost(?) ==>updated WS; cost from EDI portion of nhcrtEdiJoin
        genHeadObj.invLastcostHeader = splitFieldResult[i]
      } //targeting invLastcost from catapult v_InventoryMaster table -- probably going to want to check if ediCost == invLastCost
      //^//20191121 MARGIN REPORT ISSUE///////////////////////////////////////////////////////////////////////////////////////////////////////////

      if (splitFieldResult[i].includes('ediPrice')) { //Suggested Retail ==>msrp?
        //targets msrp from edi table
        genHeadObj.msrpHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'sibBasePrice') { //
        genHeadObj.sibBasePriceHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'dptName') { //
        genHeadObj.rbDeptHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'dptNumber') {
        genHeadObj.rbDeptIDHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'sibIdealMargin') {
        genHeadObj.sibIdealMarginHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'actualMargT0d') {
        genHeadObj.actualMargT0dHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'venCompanyname') {
        genHeadObj.rbSupplierHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'oupName') { //need to target catapult uos(oupName) in order to divide by that for any items sold by case
        genHeadObj.oupName = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'ordQuantityInOrderUnit') { //need to target catapult uos(oupName) in order to divide by that for any items sold by case
        genHeadObj.ordQuantityInOrderUnit = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'stoNumber') { //targets Catapult nhcrt stoNumber column
        genHeadObj.stoNumber = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'stoName') { //targets Catapult nhcrt stoName column
        genHeadObj.stoName = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'pi1Description') { //targets Catapult nhcrt pi1Description column
        genHeadObj.pi1Description = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'pi2Description') { //targets Catapult nhcrt pi2Description column
        genHeadObj.pi2Description = splitFieldResult[i]
      }
    }

    console.log('calcResults says: genHeadObj==>', genHeadObj)
    //^//generate generic column headers corresponding to margin_report table column headers that are associated with
    //primary key, upc, sku, name, cost, & msrp
    //****************************************************************************************************************** */
  }

}