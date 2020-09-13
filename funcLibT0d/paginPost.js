module.exports = {
  paginPost: function (postBodyData, paginPostObjData) {
    // paginPostObjDataArr = []
    // paginPostObjData = {}
    currentPage = parseInt(postBodyData['currentPagePost'])
    if (currentPage == undefined || isNaN(currentPage) == true) {
      currentPage = 0
    }
    paginPostObjData['currentPage'] = currentPage
    console.log(`currentPage from paginPost==> ${currentPage}`)
    numQueryRes = parseInt(postBodyData['numQueryResPost'])
    paginPostObjData['numQueryRes'] = numQueryRes
    console.log(`numQueryRes from paginPost==> ${numQueryRes}`)
    offsetPost = currentPage * numQueryRes
    paginPostObjData['offsetPost'] = offsetPost
    console.log(`JSON.stringify(paginPostObjData) from paginPost==> ${JSON.stringify(paginPostObjData)}`)
    // paginPostObjDataArr.push(paginPostObjData)

    // let numPages = Math.ceil(totalRows / numQueryRes) //round up to account for fractions of pages (i.e. 22.3 pages ==> 23 pages)
    // console.log(`numPages==> ${numPages}`)
    // numPagesPlaceholder.push(numPages)

    // // let pageLinkObj = {}
    // for (let j = 0; j < numPages; j++) {
    //   let pageLinkObj = {}
    //   pageLinkObj[`page${j}`] = j
    //   pageLinkArray.push(pageLinkObj)
    // }


  }
}