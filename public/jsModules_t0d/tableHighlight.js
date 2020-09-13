const ResTblBdy = document.getElementById("resTblBdy")

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

    let exist_ws = cells[i].parentNode.childNodes[14]
    let edi_cost_mod = cells[i].parentNode.childNodes[16]
    let charm_price = cells[i].parentNode.childNodes[19]
    let crnt_pr_cplt = cells[i].parentNode.childNodes[21]

    if (Math.abs((edi_cost_mod.innerHTML - exist_ws.innerHTML) / (edi_cost_mod.innerHTML)) > .35) {
      edi_cost_mod.style.backgroundColor = "#ffb3ca"
    }
    if (Math.abs((edi_cost_mod.innerHTML - exist_ws.innerHTML) / (edi_cost_mod.innerHTML)) > .50) {
      edi_cost_mod.style.backgroundColor = "#ff8533"
    }

    if (Math.abs((charm_price.innerHTML - crnt_pr_cplt.innerHTML) / (charm_price.innerHTML)) > .35) {
      charm_price.style.backgroundColor = "#ffdb4b"
    }
    if (Math.abs((charm_price.innerHTML - crnt_pr_cplt.innerHTML) / (charm_price.innerHTML)) > .50) {
      charm_price.style.backgroundColor = "#ff0000"
    }
  }
}
if (ResTblBdy) { //only call highlight_row() if there is a results table generated
  highlight_row()
}