// This libraries need jquery

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
      parse: false
    }) {
      return new Promise((resolve, reject) => {
        let tmp = {
          status: false,
          output: null
        }

        $.ajax({
          method: options.method,
          url: options.url,
          headers: options.header,
          data: data,
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
    month: {
      string(monthNumber) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        return monthNames[monthNumber];
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
      property(date = new Date(), utc = false) {
        var _dd = utc ? date.getUTCDate() : date.getDate();
        var _mm = utc ? date.getUTCMonth() : date.getMonth(); //January is 0!
        var _yyyy = utc ? date.getUTCFullYear() : date.getFullYear();
        var _h = utc ? date.getUTCHours() : date.getHours();
        var _m = utc ? date.getUTCMinutes() : date.getMinutes();
        var _s = utc ? date.getUTCSeconds() : date.getSeconds();
        let property = {
          year: _yyyy,
          month: _mm,
          day: _dd,
          hour: _h,
          minute: _m,
          second: _s
        }
        return property;
      },
      UTC(date = null) {
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
        date = JsLib.get.date.property(date, true)
        date = set.UTC(date)
        return date;
      },
      custom(date = null) {
        date = JsLib.get.date.init(date)

        var _dd = date.getDate();
        var _mm = date.getMonth() + 1; //January is 0!

        var _yyyy = date.getFullYear();
        if (_dd < 10) {
          _dd = "0" + _dd;
        }

        if (_mm < 10) {
          _mm = "0" + _mm;
        }
        date = _yyyy + "-" + _mm + "-" + _dd;
        return date;
      },
      number(date) {
        date = date.replace("-", "");
        date = date.replace("-", "");
        return date;
      }
    },
    sort: {
      array(property = []) {
        var sortOrder = 1;
        if (property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function(a, b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
        }
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