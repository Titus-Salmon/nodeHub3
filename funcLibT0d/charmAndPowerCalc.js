module.exports = {
  charmAndPowerCalc: function (dptNumber, rsltsObj, reqdRtl) {
    if (dptNumber == '152' || dptNumber == '9' || dptNumber == '176' || dptNumber == '177' || dptNumber == '13' ||
      dptNumber == '12' || dptNumber == '158' || dptNumber == '151' || dptNumber == '157') {
      powerVsCharm = 'charm'
    } else {
      powerVsCharm = 'power'
    }
    console.log(`powerVsCharm==> ${powerVsCharm}`)
    if (powerVsCharm == 'charm') {
      if (reqdRtl % 1 < .10 && reqdRtl % 1 > 0) { //change charm price to (#-1).99 if req'd rtl is #.00 -> #.10
        dbl0Or10CharmResult = reqdRtl - reqdRtl % 1 - .01
        rsltsObj['PL1AdjustedPrice'] = `${dbl0Or10CharmResult}`
        // return rsltsObj['PL1AdjustedPrice']
      } else {
        if (reqdRtl > 0) {
          if (reqdRtl < 10) { //if reqdRtl < 10, charm at .29, .49, .79 & .99
            if (reqdRtl % 1 < .20) {
              let adjPrice = reqdRtl - (reqdRtl % 1) + .29
              rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
              console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
            } else {
              if (reqdRtl % 1 < .30) {
                let adjPrice = reqdRtl - (reqdRtl % 1) + .29
                rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
              } else {
                if (reqdRtl % 1 < .40) {
                  let adjPrice = reqdRtl - (reqdRtl % 1) + .49
                  rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                  console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                } else {
                  if (reqdRtl % 1 < .50) {
                    let adjPrice = reqdRtl - (reqdRtl % 1) + .49
                    rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                    console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                  } else {
                    if (reqdRtl % 1 < .60) {
                      let adjPrice = reqdRtl - (reqdRtl % 1) + .79
                      rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                      console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                    } else {
                      if (reqdRtl % 1 < .70) {
                        let adjPrice = reqdRtl - (reqdRtl % 1) + .79
                        rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                        console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                      } else {
                        if (reqdRtl % 1 < .80) {
                          let adjPrice = reqdRtl - (reqdRtl % 1) + .79
                          rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                          console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                        } else {
                          if (reqdRtl % 1 > .80) {
                            let adjPrice = reqdRtl - (reqdRtl % 1) + .99
                            rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                            console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

          } else { //if reqdRtl > 10, charm at .29, .49, & .99
            if (reqdRtl % 1 <= .35) { //bump anything from #.10 to #.35 ==> #.29
              let adjPrice = reqdRtl - (reqdRtl % 1) + .29
              rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
              console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
            } else {
              if (reqdRtl % 1 <= .55) { //bump anything from #.36 to #.55 ==> #.49
                let adjPrice = reqdRtl - (reqdRtl % 1) + .49
                rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
              } else {
                if (reqdRtl % 1 <= .855) { //bump anything from #.56 to #.85 ==> #.99
                  let adjPrice = reqdRtl - (reqdRtl % 1) + .99
                  rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                  console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                } else {
                  if (reqdRtl % 1 > .856) { //bump anything from #.85+ and higher ==> #.99
                    let adjPrice = reqdRtl - (reqdRtl % 1) + .99
                    rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                    console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                  }
                }
              }
            }
          }
        }
      }
    } else { // if powerVsCharm == 'power'
      if (reqdRtl % 1 < .10 && reqdRtl % 1 > 0) { //change charm price to (#-1).99 if req'd rtl is #.00 -> #.10
        dbl0Or10CharmResult = reqdRtl - reqdRtl % 1 - .01
        rsltsObj['PL1AdjustedPrice'] = `${dbl0Or10CharmResult}`
        console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
      } else {
        if (reqdRtl > 0) {
          if (reqdRtl < 2) { //if reqdRtl < 2, power at .19, .29, .39, .49, .59, .79, .99
            if (reqdRtl % 1 < .20) {
              let adjPrice = reqdRtl - (reqdRtl % 1) + .19
              rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
              console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
            } else {
              if (reqdRtl % 1 < .30) {
                let adjPrice = reqdRtl - (reqdRtl % 1) + .29
                rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
              } else {
                if (reqdRtl % 1 < .40) {
                  let adjPrice = reqdRtl - (reqdRtl % 1) + .39
                  rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                  console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                } else {
                  if (reqdRtl % 1 < .50) {
                    let adjPrice = reqdRtl - (reqdRtl % 1) + .49
                    rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                    console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                  } else {
                    if (reqdRtl % 1 < .60) {
                      let adjPrice = reqdRtl - (reqdRtl % 1) + .59
                      rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                      console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                    } else {
                      if (reqdRtl % 1 < .70) {
                        let adjPrice = reqdRtl - (reqdRtl % 1) + .79
                        rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                        console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                      } else {
                        if (reqdRtl % 1 < .80) {
                          let adjPrice = reqdRtl - (reqdRtl % 1) + .79
                          rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                          console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                        } else {
                          if (reqdRtl % 1 > .80) {
                            let adjPrice = reqdRtl - (reqdRtl % 1) + .99
                            rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                            console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

          } else { //if reqdRtl > 2, power at .29, .49, .79, .99
            if (reqdRtl % 1 <= .35) { //bump anything from #.10 to #.35 ==> #.29
              let adjPrice = reqdRtl - (reqdRtl % 1) + .29
              rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
              console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
            } else {
              if (reqdRtl % 1 <= .55) { //bump anything from #.36 to #.55 ==> #.49
                let adjPrice = reqdRtl - (reqdRtl % 1) + .49
                rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
              } else {
                if (reqdRtl % 1 <= .855) { //bump anything from #.56 to #.85 ==> #.99
                  let adjPrice = reqdRtl - (reqdRtl % 1) + .79
                  rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                  console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                } else {
                  if (reqdRtl % 1 > .856) { //bump anything from #.85+ and higher ==> #.99
                    let adjPrice = reqdRtl - (reqdRtl % 1) + .99
                    rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                    console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                  }
                }
              }
            }

          }
        }
      }
    }
  }
}