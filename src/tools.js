// This libraries need jquery
var ucase = new RegExp("[A-Z]+");
var lcase = new RegExp("[a-z]+");
var num = new RegExp("[0-9]+");
var schar = new RegExp("[-!$%^&*()_+|~={}:/?,.@#[\\\]]+");
var phonec = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
var mailc = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export let DtLib = {
  set: {
    init(id = '', options = {
      select: true,
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: true,
      dom: "Bfrtip",
      lengthMenu: [
        [5, 10, 25, 50, -1],
        ['5 rows', '10 rows', '25 rows', '50 rows', 'Show all']
      ],
      buttons: ["pageLength", "copy", "excel"]
    }, footerEnabled = false) {
      let table = $("#" + id).DataTable(options);

      if (footerEnabled) {
        $("#" + id + " tfoot th").each(function() {
          var title = $(this).text();
          if (title != 'Action') {
            $(this).html('<input type="text" placeholder="Search ' + title + '" />');
          }
        });

        table.columns().every(function() {
          var that = this;

          $("input", this.footer()).on("keyup change", function() {
            if (that.search() !== this.value) {
              that.search(this.value).draw();
            }
          });
        });
      }
      return table
    },
    destroy(id = '') {
      $("#" + id).DataTable().destroy()
    }
  }
}

export let BsLib = {
  set: {
    form: {
      group: {
        error(id = '', enabled = false, message = '') {
          if (enabled) {
            $("#" + id + "Group").addClass('has-error')
            $("#" + id + "Span").html(message)
          } else {
            $("#" + id + "Group").removeClass('has-error')
            $("#" + id + "Span").html('')
          }
        }
      }
    }
  }
}

export let JqLib = {
  get: {
    http(data = null, options = {
      method: '',
      url: '',
      parse: false,
      headers: {},
      progress: ''
    }, setup = {}) {
      return new Promise((resolve, reject) => {
        let tmp = {
          status: false,
          output: null
        }

        $.ajaxSetup(setup)
        $.ajax({
          method: options.method,
          url: options.url,
          headers: options.headers,
          data: data,
          xhr: function() {
            var xhr = $.ajaxSettings.xhr();
            xhr.onprogress = function e() {
              // For downloads
              if (e.lengthComputable) {
                // console.log(e.loaded / e.total);
              }
            };
            xhr.upload.onprogress = function(e) {
              // For uploads
              if (e.lengthComputable) {
                // console.log(e.loaded / e.total);
                $('#' + options.progress).css('width', (e.loaded * 100 / e.total) + '%')
              }
            };
            return xhr;
          },
        }).done((response) => {
          tmp.status = true
          if (options.parse) {
            response = JSON.parse(response)
            tmp.output = response
          } else {
            tmp.output = response
          }
          resolve(tmp)
        }).fail(function(jqXHR, textStatus, errorThrown) {
          tmp.status = false
          tmp.output = {
            code: jqXHR.responseJSON.code,
            message: jqXHR.responseJSON.message,
            jqXHR: jqXHR,
            textStatus: textStatus,
            errorThrown: errorThrown
          }
          resolve(tmp)
        });
      })
    },
    axios(data = null, options = {
      method: '',
      url: '',
      headers: {},
      progress: ''
    }) {
      return new Promise((resolve, reject) => {
        let tmp = {
          status: false,
          output: null
        }
        axios({
            method: options.method,
            url: options.url,
            data: data,
            config: { headers: options.headers },
            onUploadProgress: function(progressEvent) {
              var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              $('#' + options.progress).css('width', percentCompleted + '%')
            }
          })
          .then(function(response) {
            tmp.status = true
            tmp.output = response.data
            resolve(tmp)
          })
          .catch(function(response) {
            tmp.status = false
            tmp.output = response
            resolve(tmp)
          });
      })
    },
    form: {
      val(id = '') {
        return $('#' + id).val()
      }
    },
    element: {
      hasClass(id = '', hasClass = '') {
        return $("#" + id).hasClass(hasClass)
      }
    }
  },
  set: {
    element: {
      addClass(id = '', addClass = '') {
        $("#" + id).addClass(addClass)
      },
      removeClass(id = '', removeClass = '') {
        $("#" + id).removeClass(removeClass)
      },
      text(id = '', text = '') {
        $("#" + id).text(text)
      },
      attr(id = '', attribute = '', mode = false) {
        $("#" + id).attr(attribute, mode)
      },
      html(id = '', html = '') {
        $("#" + id).html(html)
      }
    }
  }
}
export let JsLib = {
  get: {
    validate: {
      min1Uppercase(string = '') {
        return ucase.test(string)
      },
      min1Lowercase(string = '') {
        return lcase.test(string)
      },
      min1Number(string = '') {
        return num.test(string)
      },
      min1SpecialChar(string = '') {
        return schar.test(string)
      },
      email(email) {
        return mailc.test(email);
      },
      phone(phoneNumber) {
        return phonec.test(phoneNumber)
      }
    },
    month: {
      // Style is full or minimalist
      string(monthNumber = 0, style = 'full') {
        let monthNames = []
        if (style == 'full') {
          monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
        } else if (style == 'minimalist') {
          monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ];
        }
        return monthNames[monthNumber];
      }
    },
    time: {
      diff(timeStart = new Date(), timeEnd = new Date()) {
        var timeStart = new Date(timeStart).getTime();
        var timeEnd = new Date(timeEnd).getTime();
        var hourDiff = timeEnd - timeStart; //in ms
        var secDiff = hourDiff / 1000; //in s
        var minDiff = hourDiff / 60 / 1000; //in minutes
        var hDiff = hourDiff / 3600 / 1000; //in hours
        var humanReadable = {};
        humanReadable.hours = Math.floor(hDiff);
        humanReadable.minutes = minDiff - 60 * humanReadable.hours;
        return humanReadable;
      },
      diffMinutes(startDate, endDate) {
        var diff = endDate.getTime() - startDate.getTime();
        return (diff / 60000);
      },
      number(time, fromDate = false) {
        if (fromDate) {
          time = time.substring(11, 16)
        }

        time = time.replace(":", "");
        time = time * 1
        return time;
      }
    },
    date: {
      init(date = null) {
        let _date;
        if (date == null) {
          _date = new Date();
        } else {
          _date = new Date(date)
        }
        return _date;
      },
      property(date = new Date(), utc = false, string = false) {
        if (date == '' || date == null || date == undefined) {
          date = new Date()
        } else {
          date = new Date(date)
        }

        var _dd = utc ? date.getUTCDate() : date.getDate();
        var _mm = utc ? date.getUTCMonth() : date.getMonth(); //January is 0!
        var _yyyy = utc ? date.getUTCFullYear() : date.getFullYear();
        var _h = utc ? date.getUTCHours() : date.getHours();
        var _m = utc ? date.getUTCMinutes() : date.getMinutes();
        var _s = utc ? date.getUTCSeconds() : date.getSeconds();

        let fix = {
          string(d) {
            if (d <= 9) {
              d = '0' + d
            } else {
              let _dd = d
              _dd = _dd.toString()
              d = _dd
            }
            return d
          }
        }

        if (string) {
          _yyyy = _yyyy.toString()
          _dd = fix.string(_dd)
          _mm = fix.string((_mm + 1))

          _h = fix.string(_h)
          _m = fix.string(_m)
          _s = fix.string(_s)
        }

        let property = {
          original: date,
          year: _yyyy,
          month: _mm,
          day: _dd,
          hour: _h,
          minute: _m,
          second: _s
        }
        return property;
      },
      UTC(date = null, plusDate = 0) {
        let set = {
          UTC(_date = {
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            second: 0
          }) {
            let _yyyy = _date.year
            let _mm = _date.month
            let _dd = _date.day
            let _h = _date.hour
            let _m = _date.minute
            let _s = _date.second

            if (_dd < 10) {
              _dd = "0" + _dd;
            }

            _mm = _mm + 1
            if (_mm < 10) {
              _mm = "0" + _mm;
            }

            if (_h < 10) {
              _h = "0" + _h;
            }

            if (_m < 10) {
              _m = "0" + _m;
            }

            if (_s < 10) {
              _s = "0" + _s;
            }

            let _utc = _yyyy + "-" + _mm + "-" + _dd + " " + _h + ":" + _m + ":" + _s;
            return _utc;
          }
        }

        date = JsLib.get.date.init(date)
        if (plusDate) {
          date.setDate(date.getDate() + plusDate)
        }
        date = JsLib.get.date.property(date, true)
        date = set.UTC(date)
        return date;
      },
      custom(date = null, plusDate = 0, includeTime = false) {
        date = JsLib.get.date.init(date)
        if (plusDate) {
          date.setDate(date.getDate() + plusDate)
        }
        var _dd = date.getDate();
        var _mm = date.getMonth() + 1; //January is 0!

        var _yyyy = date.getFullYear();
        if (_dd < 10) {
          _dd = "0" + _dd;
        }

        if (_mm < 10) {
          _mm = "0" + _mm;
        }

        if (includeTime) {
          var _h = date.getHours();
          var _m = date.getMinutes();
          var _s = date.getSeconds();
          if (_h < 10) {
            _h = "0" + _h;
          }

          if (_m < 10) {
            _m = "0" + _m;
          }

          if (_s < 10) {
            _s = "0" + _s;
          }
          date = _yyyy + "-" + _mm + "-" + _dd + " " + _h + ":" + _m + ":" + _s;
          return date;
        } else {
          date = _yyyy + "-" + _mm + "-" + _dd;
          return date;
        }
      },
      custom2(date = null, monthStyle = 'full') {
        date = JsLib.get.date.init(date)

        var _d = date.getDate();
        var _mmm = date.getMonth(); //January is 0!
        _mmm = JsLib.get.month.string(_mmm, monthStyle)
        var _yyyy = date.getFullYear();

        date = _d + ' ' + _mmm + ' ' + _yyyy;
        return date;
      },
      number(date, fromFullDate = false) {
        if (fromFullDate) {
          date = date.substring(0, 10)
        }

        date = date.replace("-", "");
        date = date.replace("-", "");
        date = date * 1
        return date;
      }
    },
    // data.sort(tools.dynamicSort("name"))
    sort: {
      array(property = "") {
        var sortOrder = 1;
        if (property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function(a, b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
        }
      },
      nestedProperty(prop, arr) {
        prop = prop.split('.');
        var len = prop.length;

        arr.sort(function(a, b) {
          var i = 0;
          while (i < len) {
            a = a[prop[i]];
            b = b[prop[i]];
            i++;
          }
          if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          } else {
            return 0;
          }
        });
        return arr;
      }
    }
  },
  set: {
    date: {
      plus(date = null, dayPlus = 0) {
        let _date;
        if (date == null) {
          _date = new Date();
        } else {
          _date = new Date(date)
        }
        return new Date(_date.setDate(_date.getDate() + dayPlus))
      }
    }
  }
}