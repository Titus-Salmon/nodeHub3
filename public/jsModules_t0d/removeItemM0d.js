const resTblBdy_itemsToAdd = document.getElementById('resTblBdy_itemsToAdd')

let tblCellsRemoveItem = resTblBdy_itemsToAdd.getElementsByTagName('td'); //targets all cells in table
let tblRowsRemoveItem = resTblBdy_itemsToAdd.getElementsByTagName('tr'); //targets all rows in table

let removeItemM0d = document.getElementById('removeItem')

// let inputsArrayRemoveItem = [removeItemM0d]


console.log(`tblCellsRemoveItem.length==> ${tblCellsRemoveItem.length}`)
console.log(`tblRowsRemoveItem.length==> ${tblRowsRemoveItem.length}`)

function populateRemoveItemInput() {

  for (let m = 0; m < tblRowsRemoveItem.length; m++) {
    tblRowsRemoveItem[m].addEventListener('click', function (event) {
      // for (let n = 0; n < inputsArrayRemoveItem.length; n++) {
      //   inputsArrayRemoveItem[n].value = tblCellsRemoveItem[(inputsArrayRemoveItem.length * m) + (m + n + 1)].innerHTML
      //   console.log(`inputsArrayRemoveItem[${n}].value==> ${inputsArrayRemoveItem[n].value}`)
      // }
      removeItemM0d.value = tblRowsRemoveItem[m].innerHTML
      console.log(`typeof removeItemM0d.value==> ${typeof removeItemM0d.value}`)
      console.log(`removeItemM0d.value==> ${removeItemM0d.value}`)
    })
  }
}

populateRemoveItemInput()