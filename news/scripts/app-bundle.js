define('resources',['resources/index'],function(m){return m;});;
define('app',["exports", "fast-xml-parser", "fast-html-parser"], function (_exports, _fastXmlParser, _fastHtmlParser) {
  "use strict";

  _exports.__esModule = true;
  _exports.App = void 0;
  _fastXmlParser = _interopRequireDefault(_fastXmlParser);
  _fastHtmlParser = _interopRequireDefault(_fastHtmlParser);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  /**
   * Security/Hacker news app
   */
  var App = /*#__PURE__*/function () {
    function App() {
      var _this = this;

      this.hnTitle = 'ycombinator';
      this.hnEntries = [];
      this.nsTitle = '/r/netsec';
      this.nsEntries = [];
      this.corsURL = 'https://cors-anywhere.herokuapp.com/'; // allows cors requests from client

      document.addEventListener('aurelia-composed', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.fetchEntries('https://news.ycombinator.com/rss', true);

              case 2:
                _this.hnEntries = _context.sent;
                _context.next = 5;
                return _this.fetchEntries('https://www.reddit.com/r/netsec.rss', false);

              case 5:
                _this.nsEntries = _context.sent;

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })));
    }
    /**
     * Gets the entries from a given page
     * @param {string} url destination homepage url
     * @param {boolean} hn set to true if url is hacker news url
     */


    var _proto = App.prototype;

    _proto.fetchEntries =
    /*#__PURE__*/
    function () {
      var _fetchEntries = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url, hn) {
        var req, resText;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return fetch(this.corsURL + url);

              case 2:
                req = _context2.sent;
                _context2.next = 5;
                return req.text();

              case 5:
                resText = _context2.sent;

                if (!hn) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", this.getHNEntries(resText));

              case 8:
                return _context2.abrupt("return", this.getNSEntries(resText));

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetchEntries(_x, _x2) {
        return _fetchEntries.apply(this, arguments);
      }

      return fetchEntries;
    }()
    /**
     * Gets the hackernews entries
     * @param {string} textContent page content
     */
    ;

    _proto.getHNEntries = function getHNEntries(textContent) {
      var xml = _fastXmlParser.default.parse(textContent);

      var items = xml.rss.channel.item; // Constructing new array because we want to format the dates provided

      var fItems = [];

      for (var _iterator = _createForOfIteratorHelperLoose(items), _step; !(_step = _iterator()).done;) {
        var item = _step.value;
        // Creating temp div to convert html character entities to their actual display characters
        var tempTitleEl = document.createElement('div');
        tempTitleEl.innerHTML = item.title;
        var title = tempTitleEl.firstChild.data;
        fItems.push({
          title: title,
          link: item.link,
          date: this.formatDate(item.pubDate)
        });
      }

      return fItems;
    }
    /**
     * Gets the /r/netsec entries from the reddit page rss
     * @param {string} textContent page contents 
     */
    ;

    _proto.getNSEntries = function getNSEntries(textContent) {
      var xml = _fastXmlParser.default.parse(textContent); // rss xml is structured weird so we need to parse it further


      var links = this.parseEntries(xml.feed.entry);
      return links;
    }
    /**
     * Parses each entry and packages the information gathered
     * @param {array} entries entries from rss feed 
     */
    ;

    _proto.parseEntries = function parseEntries(entries) {
      var results = [];

      for (var _iterator2 = _createForOfIteratorHelperLoose(entries), _step2; !(_step2 = _iterator2()).done;) {
        var entry = _step2.value;

        // if the entry is the monthly discussion or the hiring thread we skip them
        if (entry.title.match(/(\/r\/netsec.+Q[1-4].+Hiring|([mM]onthly)? [dD]iscussion)/)) {
          continue;
        }

        var title = entry.title;
        var date = this.formatDate(entry.updated); // each entry has a "link" where one could think the would be but nah, it's empty.
        // The link is actually hidden inside the "content" key which is a jumbled mess
        // of text and html character entities.
        // So to extract it we need to parse it:
        // 1. We take the contents of the "content" key and set it as innerHTML of a temp div.
        //    This converts the character entities into actual characters. Which is good.

        var tempHTMLElement = document.createElement('div');
        tempHTMLElement.innerHTML = entry.content; // 2. Then we extract the text with the good formatting and remove the crap we dont need.

        var value = tempHTMLElement.firstChild.data.slice(25); // 3. Now we can put the text into a html parser to grab the link.

        var html = _fastHtmlParser.default.parse(value); // 4. The link is always last in the line so we grab the rawAttrs from there.


        var link = html.childNodes[html.childNodes.length - 1].childNodes[0].rawAttrs; // 5. Lastly we remove the attribute name and the quotation marks around it, and voila!

        link = link.replace(/(href="|")/g, ''); // 6. rss masters PogU @reddit

        results.push({
          title: title,
          link: link,
          date: date
        });
      }

      return results;
    }
    /**
     * Formats date string into a more readable format
     * @param {string} dateString unformatted date 
     */
    ;

    _proto.formatDate = function formatDate(dateString) {
      var date = new Date(dateString).toDateString();
      var time = new Date(dateString).toLocaleTimeString();
      return date + " " + time;
    };

    return App;
  }();

  _exports.App = App;
});;
define('app.html!text',[],function(){return "<template><link rel=\"shortcut icon\" href=hacker.png type=image/x-icon><div class=main><div class=section id=hacker-news><h1 class=title>${hnTitle}</h1><ul class=entries><li class=entry repeat.for=\"entry of hnEntries\"><a href=\"${entry.link}\"><h2 class=entry-title> ${entry.title} </h2><p class=pub-date>${entry.date}</p></a></li></ul></div><div class=section id=netsec><h1 class=title>${nsTitle}</h1><ul class=entries><li class=entry repeat.for=\"entry of nsEntries\"><a href=\"${entry.link}\"><h2 class=entry-title> ${entry.title} </h2><p class=pub-date>${entry.date}</p></a></li></ul></div></div><script src=./switch.js></script></template>";});;
define('environment',["exports"], function (_exports) {
  "use strict";

  _exports.__esModule = true;
  _exports.default = void 0;
  var _default = {
    debug: true,
    testing: true
  };
  _exports.default = _default;
});;
define('main',["exports", "regenerator-runtime/runtime", "./environment"], function (_exports, _runtime, _environment) {
  "use strict";

  _exports.__esModule = true;
  _exports.configure = configure;
  _environment = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // regenerator-runtime is to support async/await syntax in ESNext.
  // If you target latest browsers (have native support), or don't use async/await, you can remove regenerator-runtime.
  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');
    aurelia.use.developmentLogging(_environment.default.debug ? 'debug' : 'warn');

    if (_environment.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});;
define('resources/index',["exports"], function (_exports) {
  "use strict";

  _exports.__esModule = true;
  _exports.configure = configure;

  function configure(config) {//config.globalResources([]);
  }
});
//# sourceMappingURL=app-bundle.js.map