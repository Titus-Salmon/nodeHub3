const ResTblBdy = document.getElementById("resTblBdy_loadedTable")

function highlight_row() {
  let cells = ResTblBdy.getElementsByTagName('td'); //targets all cells in table
  let rows = ResTblBdy.getElementsByTagName('tr'); //targets all rows in table
  console.log('cells.length==>', cells.length)
  console.log('rows.length==>', rows.length)

  for (let i = 0; i < cells.length; i++) { //loop through all table cells
    // Take each cells
    console.log('cells[' + i + ']', cells[i])
    //let cells = cells[i];
    console.log('cells[' + i + '][' + i + ']', cells[i][i])
    //console.log('cells[' + i + '].innerHTML', cells[i].innerHTML)
    console.log('cells[i].parentNode==>', cells[i].parentNode)
    console.log('cells[i].parentNode.childNodes==>', cells[i].parentNode.childNodes)
    console.log('cells[i].parentNode.childNodes[0].innerHTML==>', cells[i].parentNode.childNodes[0].innerHTML)

    let keheUnitType = cells[i].parentNode.childNodes[3]
    let unfiUnitType = cells[i].parentNode.childNodes[4]
    let keheUnitCost = cells[i].parentNode.childNodes[5]
    let unfiUnitCost = cells[i].parentNode.childNodes[6]

    if (keheUnitCost.innerHTML !== 'NA') {
      if (Math.abs((keheUnitCost.innerHTML - unfiUnitCost.innerHTML) / (keheUnitCost.innerHTML)) > .25) {
        keheUnitType.style.backgroundColor = "#ffdb4b"
        unfiUnitType.style.backgroundColor = "#ffdb4b"
        keheUnitCost.style.backgroundColor = "#ffdb4b"
        unfiUnitCost.style.backgroundColor = "#ffdb4b"
      }
      if (Math.abs((keheUnitCost.innerHTML - unfiUnitCost.innerHTML) / (keheUnitCost.innerHTML)) > .5) {
        keheUnitType.style.backgroundColor = "#ff8533"
        unfiUnitType.style.backgroundColor = "#ff8533"
        keheUnitCost.style.backgroundColor = "#ff8533"
        unfiUnitCost.style.backgroundColor = "#ff8533"
      }
      if (Math.abs((keheUnitCost.innerHTML - unfiUnitCost.innerHTML) / (keheUnitCost.innerHTML)) > .75) {
        keheUnitType.style.backgroundColor = "#ff0000"
        unfiUnitType.style.backgroundColor = "#ff0000"
        keheUnitCost.style.backgroundColor = "#ff0000"
        unfiUnitCost.style.backgroundColor = "#ff0000"
      }
    }

    // if (Math.abs((edi_cost_mod.innerHTML - exist_ws.innerHTML) / (edi_cost_mod.innerHTML)) > .50) {
    //   edi_cost_mod.style.backgroundColor = "#ff8533"
    // }

    // if (Math.abs((charm_price.innerHTML - crnt_pr_cplt.innerHTML) / (charm_price.innerHTML)) > .35) {
    //   charm_price.style.backgroundColor = "#ffdb4b"
    // }
    // if (Math.abs((charm_price.innerHTML - crnt_pr_cplt.innerHTML) / (charm_price.innerHTML)) > .50) {
    //   charm_price.style.backgroundColor = "#ff0000"
    // }
  }
}
if (ResTblBdy) { //only call highlight_row() if there is a results table generated
  highlight_row()
}