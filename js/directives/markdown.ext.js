module.exports = function() {
  var floatleft = {
    type: 'lang',
    regex: /<<(.*)<</g,
    replace: '<span class="left">$1</span>'
  };
  var floatright = {
    type: 'lang',
    regex: />>(.*)>>/g,
    replace: '<span class="right">$1</span>'
  };
  var floatcenter = {
    type: 'lang',
    regex: /\|\|(.*?)\|\|/g,
    replace: '<span class="center">$1</span>'
  };
  var facebook = {
      type: 'lang',
      regex: /\[facebook\|(.*?)\]/g,
      replace: '<iframe src="http://www.facebook.com/plugins/like.php?href=https://www.facebook.com/therapie.Annick.Lengelle&amp;layout=standard&amp;show_faces=true&amp;width=450&amp;action=like&amp;font=verdana&amp;colorscheme=dark" scrolling="no" frameborder="0" allowtransparency="true" style="border:none; overflow:hidden; width:273px; height:100px"></iframe>'
  }
  var classify = {
      type: 'lang',
      filter: function (text, converter, options) {
          return text.replace(/\|\|\|+([^ ]+)\n([\s\S]+?)\n\|\|\|\n/g, function(substring, classname, inner) {
                return '<div class="' + classname + '">\n' + converter.makeHtml(inner) + '</div>\n'
          })
      }
  }
  return [floatleft, floatcenter, floatright, facebook, classify];
}
