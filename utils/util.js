// util.js
const PH = '__PH__'
const PH_LEN = PH.length

function isPlaceHolderStr(val) {
  return (typeof val === "string") && (val.startsWith(PH)) && (val.endsWith(PH))
}

function string2type(value) {
  // Python脚本传过来的值是json字串，直接parse的话无法处理js特殊类型
  // 故测试的时候，在python脚本处，将特殊type的值用placeholder包裹一下
  // 然后通过这个函数再转换为js类型
  if (value === "undefined") return undefined;
  if (value === 'null') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'NaA') return NaN;
  if (value === 'Infinity') return Infinity;
  if (value === '-Infinity') return -Infinity;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

function trimPlaceHolder(val) {
  return isPlaceHolderStr(val) ? val.slice(PH_LEN).slice(0, -PH_LEN) : val
}

function translatePlaceHolder(parsed) {
  let obj = {}
  for (let k in parsed) {
    // 处理python脚本传过来的用place holder包裹后的字串，将其恢复为js期望的type
    let _val = parsed[k]
    if (Array.isArray(_val)) {
      let _replaced = _val.map((e) => {
        if (isPlaceHolderStr(e)) {
          return string2type(e.slice(PH_LEN).slice(0, -PH_LEN))
        } else {
          return e
        }
      })
      obj[k] = _replaced
    } else if (isPlaceHolderStr(_val)) {
      let _replace = string2type(_val.slice(PH_LEN).slice(0, -PH_LEN))
      obj[k] = _replace
    } else {
      obj[k] = _val
    }
  }
  return obj
}


module.exports = {
  isPlaceHolderStr,
  string2type,
  trimPlaceHolder,
  translatePlaceHolder
}