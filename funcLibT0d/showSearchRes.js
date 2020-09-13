module.exports = {
  showSearchRes: function (rows, numQueryRes, pageLinkArray, srsObjArr, numPagesPlaceholder) {

    let countRows = rows[0]
    let totalRows = countRows[0]['COUNT(*)']
    let displayRows = rows[1]

    let numPages = Math.ceil(totalRows / numQueryRes) //round up to account for fractions of pages (i.e. 22.3 pages ==> 23 pages)
    console.log(`numPages==> ${numPages}`)
    numPagesPlaceholder.push(numPages)

    // let pageLinkObj = {}
    for (let j = 0; j < numPages; j++) {
      let pageLinkObj = {}
      pageLinkObj[`page${j}`] = j
      pageLinkArray.push(pageLinkObj)
    }

    for (let i = 0; i < displayRows.length; i++) {
      let srsObj = {}

      srsObj['ri_t0d'] = displayRows[i]['ri_t0d']
      srsObj['item_id'] = displayRows[i]['item_id']
      srsObj['dept_id'] = displayRows[i]['dept_id']
      srsObj['dept_name'] = displayRows[i]['dept_name']
      srsObj['recpt_alias'] = displayRows[i]['recpt_alias']
      srsObj['brand'] = displayRows[i]['brand']
      srsObj['item_name'] = displayRows[i]['item_name']
      srsObj['size'] = displayRows[i]['size']
      srsObj['sugg_retail'] = displayRows[i]['sugg_retail']
      srsObj['last_cost'] = displayRows[i]['last_cost']
      srsObj['base_price'] = displayRows[i]['base_price']
      srsObj['auto_discount'] = displayRows[i]['auto_discount']
      srsObj['ideal_margin'] = displayRows[i]['ideal_margin']
      srsObj['weight_profile'] = displayRows[i]['weight_profile']
      srsObj['tax1'] = displayRows[i]['tax1']
      srsObj['tax2'] = displayRows[i]['tax2']
      srsObj['tax3'] = displayRows[i]['tax3']
      srsObj['spec_tndr1'] = displayRows[i]['spec_tndr1']
      srsObj['spec_tndr2'] = displayRows[i]['spec_tndr2']
      srsObj['pos_prompt'] = displayRows[i]['pos_prompt']
      srsObj['location'] = displayRows[i]['location']
      srsObj['alternate_id'] = displayRows[i]['alternate_id']
      srsObj['alt_rcpt_alias'] = displayRows[i]['alt_rcpt_alias']
      srsObj['pkg_qty'] = displayRows[i]['pkg_qty']
      srsObj['supp_unit_id'] = displayRows[i]['supp_unit_id']
      srsObj['supplier_id'] = displayRows[i]['supplier_id']
      srsObj['unit'] = displayRows[i]['unit']
      srsObj['num_pkgs'] = displayRows[i]['num_pkgs']
      srsObj['category'] = displayRows[i]['category']
      srsObj['sub_category'] = displayRows[i]['sub_category']
      srsObj['product_group'] = displayRows[i]['product_group']
      srsObj['product_flag'] = displayRows[i]['product_flag']
      srsObj['rb_note'] = displayRows[i]['rb_note']
      srsObj['edi_default'] = displayRows[i]['edi_default']
      srsObj['powerfield_7'] = displayRows[i]['powerfield_7']
      srsObj['temp_group'] = displayRows[i]['temp_group']
      srsObj['onhand_qty'] = displayRows[i]['onhand_qty']
      srsObj['reorder_point'] = displayRows[i]['reorder_point']
      srsObj['mcl'] = displayRows[i]['mcl']
      srsObj['reorder_qty'] = displayRows[i]['reorder_qty']
      srsObj['memo'] = displayRows[i]['memo']
      srsObj['flrRsn'] = displayRows[i]['flrRsn']
      srsObj['dsd'] = displayRows[i]['dsd']
      srsObj['disc_mult'] = displayRows[i]['disc_mult']
      srsObj['case_pk_mult'] = displayRows[i]['case_pk_mult']
      srsObj['ovr'] = displayRows[i]['ovr']

      // srsObj['ri_t0d'] = displayRows[i]['ri_t0d']
      // srsObj['item_id'] = displayRows[i]['item_id']
      // srsObj['dept_id'] = displayRows[i]['dept_id']
      // srsObj['dept_name'] = displayRows[i]['dept_name']
      // srsObj['recpt_alias'] = displayRows[i]['recpt_alias']
      // srsObj['brand'] = displayRows[i]['brand']
      // srsObj['item_name'] = displayRows[i]['item_name']
      // srsObj['size'] = displayRows[i]['size']
      // srsObj['sugg_retail'] = displayRows[i]['sugg_retail']
      // srsObj['last_cost'] = displayRows[i]['last_cost']
      // srsObj['base_price'] = displayRows[i]['base_price']
      // srsObj['auto_discount'] = displayRows[i]['auto_discount']
      // srsObj['disc_mult'] = displayRows[i]['disc_mult']
      // srsObj['ideal_margin'] = displayRows[i]['ideal_margin']
      // srsObj['weight_profile'] = displayRows[i]['weight_profile']
      // srsObj['tax1'] = displayRows[i]['tax1']
      // srsObj['tax2'] = displayRows[i]['tax2']
      // srsObj['tax3'] = displayRows[i]['tax3']
      // srsObj['spec_tndr1'] = displayRows[i]['spec_tndr1']
      // srsObj['spec_tndr2'] = displayRows[i]['spec_tndr2']
      // srsObj['pos_prompt'] = displayRows[i]['pos_prompt']
      // srsObj['location'] = displayRows[i]['location']
      // srsObj['alternate_id'] = displayRows[i]['alternate_id']
      // srsObj['alt_rcpt_alias'] = displayRows[i]['alt_rcpt_alias']
      // srsObj['pkg_qty'] = displayRows[i]['pkg_qty']
      // srsObj['supp_unit_id'] = displayRows[i]['supp_unit_id']
      // srsObj['supplier_id'] = displayRows[i]['supplier_id']
      // srsObj['unit'] = displayRows[i]['unit']
      // srsObj['num_pkgs'] = displayRows[i]['num_pkgs']
      // srsObj['dsd'] = displayRows[i]['dsd']
      // srsObj['case_pk_mult'] = displayRows[i]['case_pk_mult']
      // srsObj['ovr'] = displayRows[i]['ovr']
      // srsObj['category'] = displayRows[i]['category']
      // srsObj['sub_category'] = displayRows[i]['sub_category']
      // srsObj['product_group'] = displayRows[i]['product_group']
      // srsObj['product_flag'] = displayRows[i]['product_flag']
      // srsObj['rb_note'] = displayRows[i]['rb_note']
      // srsObj['edi_default'] = displayRows[i]['edi_default']
      // srsObj['powerfield_7'] = displayRows[i]['powerfield_7']
      // srsObj['temp_group'] = displayRows[i]['temp_group']
      // srsObj['onhand_qty'] = displayRows[i]['onhand_qty']
      // srsObj['reorder_point'] = displayRows[i]['reorder_point']
      // srsObj['mcl'] = displayRows[i]['mcl']
      // srsObj['reorder_qty'] = displayRows[i]['reorder_qty']
      srsObjArr.push(srsObj)
    }
  }
}