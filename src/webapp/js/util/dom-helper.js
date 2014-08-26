define({
  getWidthPropertyFromComputedStyle: function(compStyle, propName) {
    var res, tmp;
    tmp = compStyle.getPropertyValue(propName);
    res = parseInt(tmp.substr(0, tmp.indexOf("px")));
    return res;
  }
});