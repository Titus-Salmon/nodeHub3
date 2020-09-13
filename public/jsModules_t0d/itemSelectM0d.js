const resTblBdy_loadedTable = document.getElementById('resTblBdy_loadedTable')

let tblCellsLoadedTbl = resTblBdy_loadedTable.getElementsByTagName('td'); //targets all cells in table
let tblRowsLoadedTbl = resTblBdy_loadedTable.getElementsByTagName('tr'); //targets all rows in table

let itemIDm0d = document.getElementById('itemID')
let deptIDm0d = document.getElementById('deptID')
let deptNamem0d = document.getElementById('deptName')
let recptAliasm0d = document.getElementById('recptAlias')
let brandm0d = document.getElementById('brand')
let itemNamem0d = document.getElementById('itemName')
let sizem0d = document.getElementById('size')
let suggRtlm0d = document.getElementById('suggRtl')
let lastCostm0d = document.getElementById('lastCost')
let basePricem0d = document.getElementById('basePrice')
let autoDiscom0d = document.getElementById('autoDisco')

let idealMargm0d = document.getElementById('idealMarg')
let weightProfm0d = document.getElementById('weightProf')
let tax1m0d = document.getElementById('tax1')
let tax2m0d = document.getElementById('tax2')
let tax3m0d = document.getElementById('tax3')
let specTndr1m0d = document.getElementById('specTndr1')
let specTndr2m0d = document.getElementById('specTndr2')
let posPromptm0d = document.getElementById('posPrompt')
let locationm0d = document.getElementById('location')
let altIDm0d = document.getElementById('altID')
let altRcptAliasm0d = document.getElementById('altRcptAlias')
let pkgQtym0d = document.getElementById('pkgQty')
let suppUnitIDm0d = document.getElementById('suppUnitID')
let suppIDm0d = document.getElementById('suppID')
let unitm0d = document.getElementById('unit')
let numPkgsm0d = document.getElementById('numPkgs')
let categorym0d = document.getElementById('category')
let subCtgrym0d = document.getElementById('subCtgry')
let prodGroupm0d = document.getElementById('prodGroup')
let prodFlagm0d = document.getElementById('prodFlag')
let rbNotem0d = document.getElementById('rbNote')
let ediDefaultm0d = document.getElementById('ediDefault')
let pwrfld7m0d = document.getElementById('pwrfld7')
let tmpGroupm0d = document.getElementById('tmpGroup')
let onhndQtym0d = document.getElementById('onhndQty')
let reorderPtm0d = document.getElementById('reorderPt')
let mclm0d = document.getElementById('mcl')
let reorderQtym0d = document.getElementById('reorderQty')

let memom0d = document.getElementById('memo')
let flrRsnm0d = document.getElementById('flrRsn')

let dsdm0d = document.getElementById('dsd')
let discoMultm0d = document.getElementById('discoMult')
let csPkMltm0d = document.getElementById('csPkMlt')
let ovrm0d = document.getElementById('ovr')




let inputsArray = [itemIDm0d, deptIDm0d, deptNamem0d, recptAliasm0d, brandm0d, itemNamem0d, sizem0d, suggRtlm0d, lastCostm0d, basePricem0d, autoDiscom0d,
  idealMargm0d, weightProfm0d, tax1m0d, tax2m0d, tax3m0d, specTndr1m0d, specTndr2m0d, posPromptm0d, locationm0d, altIDm0d, altRcptAliasm0d, pkgQtym0d, suppUnitIDm0d,
  suppIDm0d, unitm0d, numPkgsm0d, categorym0d, subCtgrym0d, prodGroupm0d, prodFlagm0d, rbNotem0d, ediDefaultm0d, pwrfld7m0d, tmpGroupm0d, onhndQtym0d, reorderPtm0d,
  mclm0d, reorderQtym0d, memom0d, flrRsnm0d, dsdm0d, discoMultm0d, csPkMltm0d, ovrm0d
]

console.log(`tblCellsLoadedTbl.length==> ${tblCellsLoadedTbl.length}`)
console.log(`tblRowsLoadedTbl.length==> ${tblRowsLoadedTbl.length}`)

function populateInputsWithClickedRowData() {

  for (let m = 0; m < tblRowsLoadedTbl.length; m++) {
    tblRowsLoadedTbl[m].addEventListener('click', function (event) {
      for (let n = 0; n < inputsArray.length; n++) {
        inputsArray[n].value = tblCellsLoadedTbl[(inputsArray.length * m) + (n)].innerHTML
        //(inputsArray.length * m) gives you value of starting cell number per row (m)
        //add (n) to this to iterate through each cell of that particular row (m)
        console.log(`inputsArray[${n}].value==> ${inputsArray[n].value}`)
      }
    })
  }
}

populateInputsWithClickedRowData()