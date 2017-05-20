var Showdown = require('showdown')

module.exports = function(myAppModule) {
  myAppModule.provider('markdownConverter', function () {
    var opts = {};
    return {
      config: function (newOpts) {
        opts = newOpts;
      },
      $get: function () {
        return new Showdown.Converter(opts);
      }
    };
  }).directive('markdown', function ($sanitize, markdownConverter) {
    return {
      restrict: 'AE',
      link: function (scope, element, attrs) {
        var trust = function(html) {
            return html // this could be $sanitize(html) if needed
        }
        if (attrs.markdown) {
          scope.$watch(attrs.markdown, function (newVal) {
            var html = newVal ? trust(markdownConverter.makeHtml(newVal)) : '';
            element.html(html);
          });
        } else {
          var html = trust(markdownConverter.makeHtml(element.text()));
          element.html(html);
        }
      }
    };
  });
}