! function (e) {
  function t(a) {
    if (n[a]) return n[a].exports;
    var i = n[a] = {
      i: a,
      l: !1,
      exports: {}
    };
    return e[a].call(i.exports, i, i.exports, t), i.l = !0, i.exports
  }
  var n = {};
  t.m = e, t.c = n, t.d = function (e, n, a) {
    t.o(e, n) || Object.defineProperty(e, n, {
      configurable: !1,
      enumerable: !0,
      get: a
    })
  }, t.n = function (e) {
    var n = e && e.__esModule ? function () {
      return e.default
    } : function () {
      return e
    };
    return t.d(n, "a", n), n
  }, t.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t)
  }, t.p = "", t(t.s = 1)
}({
  1: function (e, t, n) {
    e.exports = n("sV/x")
  },
  "5pS3": function (e, t) {
    window.braintreeDropInV1Loaded = !1, window.loadBraintreeDropInV1 = function () {
      var e = !1;
      if (!window.braintreeDropInV1Loaded && "undefined" != typeof braintree && void 0 !== braintree.client && void 0 !== braintree.dropin) {
        window.braintreeDropInV1Loaded = !0;
        var t = {
          authorization: $("#braintree-token").text(),
          container: "#dropin-container",
          dataCollector: {
            kount: !0
          },
          paypal: !1
        };
        return "enabledPaymentTypes" in backEndVars && backEndVars.enabledPaymentTypes.includes("braintree_drop_in") && (t.googlePay = {
          merchantId: $("#google-pay-merchant-id").text(),
          transactionInfo: {
            totalPriceStatus: "FINAL",
            totalPrice: parseFloat($(".total").text()),
            currencyCode: $(".currency").text(),
            checkoutOption: "COMPLETE_IMMEDIATE_PURCHASE"
          },
          cardRequirements: {
            billingAddressRequired: !0
          }
        }, t.applePay = {
          displayName: $(".product-label").text(),
          paymentRequest: {
            total: {
              label: $(".product-label").text(),
              amount: parseFloat($(".total").text())
            },
            requiredBillingContactFields: ["postalAddress"]
          }
        }, t.paypal = {
          flow: "vault",
          amount: parseFloat($(".total").text()),
          currency: $(".currency").text()
        }), braintree.dropin.create(t, function (t, n) {
          if (t) return window.failedPayments("braintree", $("#braintree-payment-failed").text()), void(window.location.href = window.getHost() + "/" + $(".final .finalPage-slug").text() + "#get-plan");
          $(".js-paypal-loader").fadeOut(), n.on("paymentOptionSelected", function () {
            $.ajax({
              type: "post",
              url: getHost() + "/contact-info/fill/email-first",
              data: {
                _method: "patch",
                paymentMethod: "braintree_drop_in",
                status: "paymentMethodSelectedAfterPersonalDataInserted",
                uuid: getAnswersData("uuid")
              },
              success: function (e) {
                window.setUUID(e.uuid)
              },
              error: function (e) {
                window.failedPayments($("#payment-method-selected").text(), e.responseJSON.error), window.location.href = window.getHost() + "/" + $(".final .finalPage-slug").text() + "#get-plan"
              }
            })
          }), $("#card-details").on("submit", function (t) {
            t.preventDefault(), e || (e = !0, n.requestPaymentMethod(function (t, n) {
              t ? e = !1 : (n.uuid = getAnswersData("uuid"), n.email = $("#email-field").val(), "enabledPaymentTypes" in backEndVars && backEndVars.enabledPaymentTypes.includes("braintree_drop_in") ? n.paymentMethod = "braintree_drop_in" : n.paymentMethod = "braintree", $("#dropin-container").hide(), $(".js-paypal-loader").show(), $.ajax({
                type: "post",
                url: backEndVars.braintreeDropInFormUrl,
                data: n,
                success: function (e) {
                  e && e.ok ? (history.replaceState(null, null, getHost() + "/diets/" + getAnswersData("uuid") + "/week/1"), window.location.href = getHost() + "/diets/" + getAnswersData("uuid")) : window.location.href = window.getHost() + "/155"
                },
                error: function (e) {
                  455 !== e.status ? (window.failedPayments($("#payment-method-selected").text()), window.location.href = window.getHost() + "/" + $(".final .finalPage-slug").text() + "#get-plan") : window.location.href = window.getHost() + "/meal-plan-error"
                }
              }))
            }))
          })
        }), !0
      }
    }, $(document).ready(function (e) {
      if (e(".braintree-drop-in-v1").length) var t = setInterval(function () {
        window.loadBraintreeDropInV1() && clearInterval(t)
      }, 1e3)
    })
  },
  NhfK: function (e, t) {
    function n() {
      function e(a, r) {
        if (r > 20) return t();
        $.ajax({
          type: "get",
          url: getHost() + "/diets/show-plan?" + n(a),
          success: function (e) {
            var t = e.path;
            o.attr("disabled", !1), i.css("display", "none"), a.path = t,
              function (e) {
                window.location.href = getHost() + "/diets/download-plan?" + n(e)
              }(a)
          },
          error: function () {
            setTimeout(function () {
              return e(a, r + 1)
            }, 1e3)
          }
        })
      }

      function t() {
        o.attr("disabled", !1), i.css("display", "none"), r.show()
      }

      function n(e) {
        return Object.entries(e).map(function (e) {
          var t = a(e, 2);
          return t[0] + "=" + t[1]
        }).join("&")
      }
      var i = $(".loader"),
        o = $(".download-plan-button"),
        r = $("#error_generate_pdf"),
        s = {
          uuid: location.pathname.match(/diets\/(.*)\/week/)[1],
          userId: $("#userId").text(),
          week: location.pathname.replace(/^.+\/week\//, "")
        };
      i.css("display", "inline-flex"), o.attr("disabled", !0), r.hide(), $.ajax({
        method: "post",
        url: getHost() + "/diets/generate-pdf-meal-plan",
        data: s,
        success: function (t) {
          s.fileName = t, e(s, 1)
        },
        error: function () {
          t()
        }
      })
    }
    var a = function () {
      return function (e, t) {
        if (Array.isArray(e)) return e;
        if (Symbol.iterator in Object(e)) return function (e, t) {
          var n = [],
            a = !0,
            i = !1,
            o = void 0;
          try {
            for (var r, s = e[Symbol.iterator](); !(a = (r = s.next()).done) && (n.push(r.value), !t || n.length !== t); a = !0);
          } catch (e) {
            i = !0, o = e
          } finally {
            try {
              !a && s.return && s.return()
            } finally {
              if (i) throw o
            }
          }
          return n
        }(e, t);
        throw new TypeError("Invalid attempt to destructure non-iterable instance")
      }
    }();
    $(document).on("click", "#buttonDownload", function () {
      n()
    })
  },
  OQde: function (e, t) {
    window.performance && 2 === window.performance.navigation.type && window.location.reload(), navigator.onLine && setTimeout(function () {
      window.location.reload()
    }, 864e5), window.getAnswers = function () {
      return store.get("answers") || {}
    }, window.setAnswer = function (e, t) {
      var n = getAnswers();
      n[e] = t, store.set("answers", n)
    }, window.getProducts = function () {
      return store.get("noMeatProducts") || {}
    }, window.getNoMeatChecked = function () {
      return store.get("noMeatIconChecked") || {}
    }, window.removeNoMeatProducts = function () {
      return localStorage.removeItem("noMeatProducts")
    }, window.setNoMeatProducts = function (e, t) {
      var n = getProducts();
      n[e] = t.id, store.set("noMeatProducts", n)
    }, window.setNoMeatChecked = function (e, t) {
      var n = getNoMeatChecked();
      n[e] = t, store.set("noMeatIconChecked", n)
    }, window.removeAnswer = function (e) {
      var t = getAnswers();
      delete t[e], store.set("answers", t)
    }, window.getAnswersData = function (e) {
      return getAnswers().data ? getAnswers().data[e] : ""
    }, window.removeAnswersData = function () {
      var e = getAnswers();
      delete e.data, store.set("answers", e)
    }, window.setPixelData = function (e, t, n) {
      var a = store.get("pixelData") || {};
      a[e] || (a[e] = {}), a[e][t] = n, store.set("pixelData", a)
    }, window.getPixelData = function (e) {
      return store.get("pixelData") ? store.get("pixelData")[e] || {} : {}
    }, window.convertFootToInch = function (e) {
      return 12 * e
    }, window.converInchToCm = function (e) {
      return 2.54 * e
    }, window.convertFootToCm = function (e) {
      return window.converInchToCm(window.convertFootToInch(e))
    }, window.convertPoundToKg = function (e) {
      return .45359237 * e
    }, window.checkLoseOrGainWeight = function () {
      var e = getPixelData("User Profile").weight,
        t = getPixelData("User Profile").target_weight;
      if (e && t) return e > t ? "lose_weight" : e < t ? "gain_weight" : "keep_weight"
    }, window.setPixelDataMeasurements = function (e, t) {
      var n = JSON.parse(JSON.stringify(t));
      switch (n.type) {
        case "metric_age":
        case "imperial_age":
          n.type = "age";
          break;
        case "height_cm":
          n.type = "height";
          break;
        case "height_ft":
          n.type = "height", n.value = getPixelData(e).height ? getPixelData(e).height + window.convertFootToCm(n.value) : window.convertFootToCm(n.value);
          break;
        case "height_inch":
          n.type = "height", n.value = getPixelData(e).height ? getPixelData(e).height + window.converInchToCm(n.value) : window.converInchToCm(n.value);
          break;
        case "weight_kg":
          n.type = "weight";
          break;
        case "weight_lb":
          n.type = "weight", n.value = convertPoundToKg(n.value);
          break;
        case "weight_target_kg":
          n.type = "target_weight";
          break;
        case "weight_target_lb":
          n.type = "target_weight", n.value = convertPoundToKg(n.value)
      }
      window.setPixelData(e, n.type, Math.round(n.value)), window.checkLoseOrGainWeight() && window.setPixelData(e, window.checkLoseOrGainWeight(), 1)
    }, window.trackFacebookUserDiet = function (e) {
      var t = JSON.parse(JSON.stringify(e));
      t.achievable_weight = Math.round(convertPoundToKg(t.achievable_weight)), t.ideal_weight_from = Math.round(convertPoundToKg(t.ideal_weight_from)), t.ideal_weight_to = Math.round(convertPoundToKg(t.ideal_weight_to)), t.can_generate = t.can_generate ? 1 : 0, t[t.measurement] = 1, delete t.measurement, delete t.uuid, Object.keys(t).forEach(function (e) {
        window.setPixelData("User Profile", e, t[e])
      }), window.trackFacebookCustomEvent("User Profile")
    }, window.removePixelData = function () {
      store.set("pixelData", {})
    }, window.trackFacebookCustomEvent = function (e) {
      window.getPixelData(e) && window.fbq && "jen" !== backEndVars.design && window.fbq("trackCustom", e, window.getPixelData(e))
    }, window.setFingerprint = function (e) {
      store.set("fingerprint", e)
    }, window.getFingerprint = function () {
      return store.get("fingerprint") ? store.get("fingerprint") : []
    }, window.removeFingerprint = function () {
      store.set("fingerprint", [])
    }, window.setUUID = function (e) {
      if (e) {
        var t = getAnswers();
        t.data || (t.data = {}), t.data.uuid = e, store.set("answers", t)
      }
    }, window.getHost = function () {
      var e = window.location;
      return e.protocol + "//" + e.hostname + (e.port ? ":" + e.port : "")
    }, window.failedPayments = function (e, t) {
      var n = getAnswers().failedPayments || [];
      n.push(e), window.setAnswer("failedPayments", n), window.setAnswer("showPaymentError", t || !0)
    }, window.toDecimal = function (e) {
      return parseFloat(e).toFixed(1)
    };
    var n = navigator.userAgent.toLowerCase();
    window.isAndroidMobile = n.indexOf("android") > -1 && (n.indexOf("mobile") > -1 || -1 === n.indexOf("chrome")), window.isIOSMobile = /ipad|iphone|ipod/.test(n) && !window.MSStream, window.isNewestIos = function () {
        var e = n.match(/os (\d{1,})_\d/);
        return !!e && (window.isIOSMobile && e[1] > 11)
      }, String.prototype.insertBeforeLastOccurrence = function (e, t) {
        var n = this.lastIndexOf(e);
        if (n > -1) return this.substring(0, n) + t + this.substring(n)
      }, $.fn.isInViewport = function () {
        var e = $(this).offset().top,
          t = e + $(this).outerHeight(),
          n = $(window).scrollTop(),
          a = n + $(window).height();
        return t > n && e < a
      }, window.isIE10 = navigator.userAgent.match(/MSIE 10/i), window.isIE11 = /Trident.*rv:/.test(navigator.userAgent), window.loadScript = function (e, t) {
        var n = document.createElement("script");
        n.type = "text/javascript", n.readyState ? n.onreadystatechange = function () {
          "loaded" !== n.readyState && "complete" !== n.readyState || (n.onreadystatechange = null, t())
        } : n.onload = function () {
          t()
        }, n.src = e, document.getElementsByTagName("head")[0].appendChild(n)
      }, $(document).ready(function (e) {
        e.ajaxSetup({
          beforeSend: function (t) {
            t.setRequestHeader("X-CSRF-TOKEN", e('meta[name="csrf-token"]').attr("content"))
          }
        }), e("#back-button").click(function (e) {
          e.preventDefault(), window.history.back()
        }), e("select.subject").change(function () {
          "meal_plan_not_received" === e(this).find(":selected").attr("data-type") ? window.location.href = "/contacts/email-check" : (e(".subject-controlled").show(), e(".back-btn-container-js").removeClass("col-xs-12"), e(".back-btn-container-js").removeClass("col-xs-offset-2"), e(".back-btn-container-js").addClass("col-xs-6"))
        }), e(".subject-controlled").is(":hidden") || (e(".back-btn-container-js").removeClass("col-xs-12"), e(".back-btn-container-js").removeClass("col-xs-8"), e(".back-btn-container-js").removeClass("col-xs-offset-2"), e(".back-btn-container-js").addClass("col-xs-6")), e(".scroll-top").click(function () {
          e("html, body").animate({
            scrollTop: 0
          }, "slow")
        });
        ({
          form: "#emailfill",
          init: function () {
            var t = e(this.form),
              n = t.find(".theme_tail_circle"),
              a = t.find("#email-form-submit"),
              i = function () {
                t.off("submit"), t.submit()
              },
              o = function () {
                n.fadeOut(150), a.prop("disabled", !1)
              },
              r = t.validate({
                errorClass: "a-input__input--error",
                rules: {
                  email: {
                    required: !0,
                    email: !0
                  }
                },
                submitHandler: function () {
                  var s = t.find(e('input[name="email"]')[0]).val();
                  n.fadeIn(150), a.prop("disabled", !0), e.ajax({
                    type: "post",
                    url: getHost() + "/contact-info/validate-email",
                    dataType: "json",
                    data: {
                      email: s
                    },
                    success: function (e) {
                      !0 === e.status ? i() : r.showErrors({
                        email: "Please enter a valid email address"
                      }), o()
                    },
                    error: function (e) {
                      429 == e.status ? r.showErrors({
                        email: e.responseJSON.error
                      }) : i(), o()
                    }
                  })
                }
              })
          }
        }).init()
      }),
      function () {
        var e = {
          dom: {
            resultSlider: ".js-result-slider",
            next: ".js-result-slider-next",
            prev: ".js-result-slider-prev"
          },
          init: function () {
            var e = this;
            this.resultSlider = $(this.dom.resultSlider), this.next = $(this.dom.next), this.prev = $(this.dom.prev), this.resultSlider.slick({
              variableWidth: !1,
              slidesToShow: 2,
              dots: !1,
              prevArrow: !1,
              nextArrow: !1,
              responsive: [{
                breakpoint: 1024,
                settings: {
                  slidesToShow: 1,
                  variableWidth: !1
                }
              }, {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                  variableWidth: !1,
                  dots: !0
                }
              }]
            }), this.next.on("click", function () {
              return e.resultSlider.slick("slickNext")
            }), this.prev.on("click", function () {
              return e.resultSlider.slick("slickPrev")
            })
          }
        };
        $(function () {
          e.init()
        })
      }(), Array.from || (Array.from = function () {
        var e = Object.prototype.toString,
          t = function (t) {
            return "function" == typeof t || "[object Function]" === e.call(t)
          },
          n = Math.pow(2, 53) - 1;
        return function (e) {
          var a = Object(e);
          if (null == e) throw new TypeError("Array.from requires an array-like object - not null or undefined");
          var i, o = arguments.length > 1 ? arguments[1] : void 0;
          if (void 0 !== o) {
            if (!t(o)) throw new TypeError("Array.from: when provided, the second argument must be a function");
            arguments.length > 2 && (i = arguments[2])
          }
          for (var r, s = function (e) {
              var t = function (e) {
                var t = Number(e);
                return isNaN(t) ? 0 : 0 !== t && isFinite(t) ? (t > 0 ? 1 : -1) * Math.floor(Math.abs(t)) : t
              }(e);
              return Math.min(Math.max(t, 0), n)
            }(a.length), c = t(this) ? Object(new this(s)) : new Array(s), d = 0; d < s;) r = a[d], c[d] = o ? void 0 === i ? o(r, d) : o.call(i, r, d) : r, d += 1;
          return c.length = s, c
        }
      }()), Array.prototype.includes || Object.defineProperty(Array.prototype, "includes", {
        value: function (e, t) {
          function n(e, t) {
            return e === t || "number" == typeof e && "number" == typeof t && isNaN(e) && isNaN(t)
          }
          if (null == this) throw new TypeError('"this" is null or not defined');
          var a = Object(this),
            i = a.length >>> 0;
          if (0 === i) return !1;
          for (var o = 0 | t, r = Math.max(o >= 0 ? o : i - Math.abs(o), 0); r < i;) {
            if (n(a[r], e)) return !0;
            r++
          }
          return !1
        }
      })
  },
  Zeim: function (e, t) {
    $(document).ready(function (e) {
      e.each(e(".md-trigger"), function (t, n) {
        var a = e("#" + n.getAttribute("data-modal")),
          i = e(a).find(".md-close"),
          o = function (t) {
            e(a).removeClass("md-show"), e("body").css("overflow", ""), t.stopPropagation()
          };
        window.repositionModal = function () {
          e(a).css("height", "");
          var t = e(window).height(),
            n = e(a).height();
          e(a).css("height", Math.min(t, n) + "px").css("overflow-y", t < n ? "scroll" : "hidden")
        }, e(window).resize(function () {
          repositionModal()
        }), e(n).on("click", function () {
          e(a).addClass("md-show"), repositionModal(), e("body").css("overflow", "hidden")
        }), e(".md-overlay").on("click", o), e(i).on("click", o)
      })
    })
  },
  g6DD: function (e, t) {
    window.checkWomanChangeColors = function () {
      var e = $(".o-section-content--meal").data("check-sex");
      if (window.ketoChangeGenderImages(), "man" === e) $("body").removeClass("woman-theme"), $("body").addClass("men-theme"), ketoChangeGenderImages("men-theme");
      else if ("woman" === e) $("body").removeClass("men-theme"), $("body").addClass("woman-theme"), ketoChangeGenderImages("woman-theme");
      else {
        var t = window.getAnswers().bodyClass;
        if (!t) return;
        $.each(t, function (e, t) {
          "/" !== window.location.pathname ? ($("body").addClass(t), window.ketoChangeGenderImages(t), "men-theme" === t ? ($("#b-steps-back-button").attr("src", backEndVars.designImgCdn + "/icons/back-men.svg"), $("#b-steps-help-button").attr("src", backEndVars.designImgCdn + "/icons/help-men.svg"), $(".highlighted--woman").removeClass("highlighted--woman"), $("#graph-age-man").removeClass("hidden"), $(".close-button-icon").attr("src", backEndVars.designImgCdn + "/icons/close-2-men.svg"), $(".m-credit-card__background").attr("src", backEndVars.cdn + "/img/card-2.svg"), $(".m-credit-card__back img").attr("src", backEndVars.cdn + "/img/card-back-2.svg")) : "woman-theme" === t && ($("#b-steps-back-button").attr("src", backEndVars.designImgCdn + "/icons/back.svg"), $("#b-steps-help-button").attr("src", backEndVars.designImgCdn + "/icons/help.svg"), $("#graph-age-woman").removeClass("hidden"), $(".close-button-icon").attr("src", backEndVars.designImgCdn + "/icons/close-2.svg"), $(".m-credit-card__background").attr("src", backEndVars.cdn + "/img/card-2.svg"), $(".m-credit-card__back img").attr("src", backEndVars.cdn + "/img/card-back-2.svg"))) : $("body").removeClass(t)
        })
      }
    }, window.ketoChangeGenderImages = function (e) {
      for (var t = [".a-input__icon--good", ".a-button--with-gradient", ".m-item-reason__icon", ".m-item-condition__number", ".o-meal-modal__detail-icon", ".o-meal-modal__timer-icon", ".m-block-contacts__icon", ".m-meal-item__icon", ".m-meal-item__timer-icon", ".m-meal-item__detail-icon", ".m-meal-item__detail-icon--preparation", ".o-section-benefits__image", ".a-icon m-item-reason__icon", ".o-section-recs__icon"], n = 0; n < t.length; n++) $(t[n]).each(function () {
        var t = $(this),
          n = t.data("src");
        n && ("men-theme" === e ? (t.attr("src", n.insertBeforeLastOccurrence(".svg", "-men")), t.attr("src", n.insertBeforeLastOccurrence(".png", "-men"))) : t.attr("src", n)), void 0 !== t.data("image") && void 0 !== t.data("image-mobile") && "men-theme" === e && (t.css("background-image", t.css("background-image").insertBeforeLastOccurrence(".png", "-men")), t.attr("data-image", t.data("image").insertBeforeLastOccurrence(".png", "-men")), t.attr("data-image-mobile", t.attr("data-image-mobile").insertBeforeLastOccurrence(".png", "-men"))), t.css("visibility", "visible"), $(".o-meal-modal__detail-icon, .o-meal-modal__timer-icon").css("visibility", "inherit")
      })
    }, window.lazarChangeHeaderGenderImages = function (e) {
      for (var t = ["#header-image"], n = 0; n < t.length; n++) $(t[n]).each(function () {
        var t = $(this);
        void 0 !== t.data("image-" + e + "-url") ? t.css("background-image", "url(" + t.data("image-" + e + "-url") + ")") : t.css("background-image", "url(" + t.data("image-man-theme-url") + ")"), t.css("visibility", "visible")
      })
    }
  },
  nHbD: function (e, t) {
    $(document).ready(function (e) {
      function t(e) {
        for (var t = window.location.search.substring(1).split("&"), n = 0; n < t.length; n++) {
          var a = t[n].split("=");
          if (a[0] == e) return a[1]
        }
        return !1
      }

      function n(t) {
        var n = e(t).closest(".dietMove");
        n.hasClass("measurements") ? n.submit() : a(n)
      }

      function a(t) {
        ! function (t) {
          window.removePixelData();
          var n = e(".clearAll input");
          if (e(n).length && window.setAnswer(e(n).data("key"), ""), e(t).hasClass("measurements")) {
            var a = {};
            e('input[type="number"]:visible').each(function (n, i) {
              if (!n) {
                var o = parseInt(e(i).data("key").toString().split(".")[0]),
                  r = Object.keys(getAnswers());
                for (var s in r) {
                  var c = r[s],
                    d = c.split(".");
                  parseInt(d[0]) === o && window.removeAnswer(c)
                }
              }
              var l = {};
              l.name = e(i).data("measurement"), l.type = e(i).attr("name"), l.measuring_in = e(i).data("measuring_in"), l.value = e(i).val(), a[e(i).data("key")] = l, window.setAnswer("measurements", a), window.setAnswer(e(i).data("key"), e(i).val()), window.setPixelDataMeasurements(e(t).data("pixel-event"), l)
            })
          } else e('input[type="checkbox"]', e(t)).each(function (t, n) {
            "noMeat" !== e(n)[0].id && (window.setAnswer(e(n).data("key"), e(n).is(":checked") ? e(n).data("value") : 0), window.setPixelData(e(n).data("pixel-event"), e(n).data("pixel-key"), e(n).is(":checked") ? e(n).data("value") : 0))
          }), e('input[type="radio"]', e(t)).each(function () {
            var t = e("input:radio[name=" + e(this).attr("name") + "]:checked").data("value");
            window.setAnswer(e(this).data("key"), t || 0), window.setPixelData(e(this).data("pixel-event"), e(this).data("pixel-key"), t || 0)
          }), e("#noMeat").length && window.setNoMeatChecked(0, e("#noMeat").is(":checked"))
        }(t), window.location.href = window.getHost() + (t.data("href") ? t.data("href") : t.attr("action")), window.trackFacebookCustomEvent(t.data("pixel-event"))
      }

      function i(t) {
        e.get({
          url: t
        }).done(function (t) {
          e(".js-meal-body").fadeOut("fast", function () {
            e(this).html(t.view), e.each(e("body").attr("class").split(/\s+/), function (e, t) {
              window.ketoChangeGenderImages(t)
            }), e(this).fadeIn("fast")
          })
        })
      }

      function o() {
        var t = e('select[name="week"]').find("option:selected").text();
        e(".a-meal-week__text").length ? e(".a-meal-week__text").text(t) : e(".a-meal-week").text(t)
      }

      function r(t) {
        var n = e('select[name="week"] option:selected')[t]();
        if (n.length) {
          var a = e(this).closest(".js-week-form").find(".nice-select"),
            i = a.find('li[data-value="' + n[0].value + '"]');
          n.prop("selected", !0).trigger("change"), a.find("li").removeClass("selected"), i.addClass("selected"), a.find(".current").text(e.trim(i.text())), window.dataLayer = window.dataLayer || [], dataLayer.push({
            vpv: "spaPageview",
            uuid: e("#uuid").text(),
            weekNumber: location.pathname.replace(/^.+\/week\//, "")
          })
        }
      }

      function s(e, t, n) {
        e.data("desktop-img", n), e.attr("src", t)
      } ["#select-payment-method", "#subscription"].indexOf(window.location.hash) > -1 && (e("#email-first-payment-method-select").removeClass("hidden-2").show(), e("#email-form").hide()), t("trid") && setAnswer("transaction_id", t("trid")), window.redirectUnfilledPage = function () {
        var t = [],
          n = [],
          a = window.location.pathname.substr(1);
        e.each(e(".page .page-id"), function (t, a) {
          n.push(parseInt(e(a).text()))
        }), e.each(Object.keys(getAnswers()), function (e, n) {
          var a = n.split("."),
            i = parseInt(a[0]);
          isNaN(i) || -1 !== t.indexOf(i) || t.push(i)
        });
        for (var i in n) {
          var o = n[i],
            r = e(".page .page-slug").eq(i).text();
          if (r === a) break;
          if (-1 === t.indexOf(o)) return window.location.href = window.getHost() + "/" + r, !0
        }
      };
      var c = function () {
        var t = e(e(".js-paypal-loader").is(":visible") ? ".js-paypal-loader:visible" : ".js-secured-parent:visible"),
          n = e(t).is(":visible") ? e(t).offset().top + (e(t).height() - e(window).height()) / 2 : 0;
        e("html, body").animate({
          scrollTop: n
        }, "fast")
      };
      if (e(".diet-refresh").length && setTimeout(function () {
          window.location.reload(!0)
        }, 3e3), e("#page-type").length && -1 === document.referrer.indexOf(document.location.hostname) && redirectUnfilledPage(), e(".clearAll").on("click", function () {
          var t = e(this).find("input"),
            n = e(t).prop("checked");
          e('input[type="checkbox"]:not("#' + e(t).attr("id") + '")').prop("checked", !n)
        }), e('input[type="checkbox"]').on("click", function () {
          if (e(".clearAll").length && !e(this).closest(".clearAll").length) {
            var t = e(".clearAll").find("input"),
              n = e('input[type="checkbox"]:not("#' + e(t).attr("id") + '"):checked').length > 0;
            e(t).prop("checked", !n)
          }
        }), e(".dietAnswer").on("click", function () {
          window.removePixelData(), e(this).hasClass("bodyClass") && function (t) {
            var n = getAnswers().bodyClass;
            n || (n = {}), n[e(t).data("key")] = e(t).data("body-class-value"), window.setAnswer("bodyClass", n)
          }(e(this)), window.setAnswer(e(this).data("key"), e(this).data("value")), window.setPixelData(e(this).data("pixel-event"), e(this).data("pixel-key"), e(this).data("pixel-value")), window.location.href = window.getHost() + e(this).data("href"), window.trackFacebookCustomEvent(e(this).data("pixel-event"))
        }), e(".dietMove button").on("click", function (t) {
          t.preventDefault();
          parseInt(e("#warningModalIsEnabled").text()) ? function (t) {
            0 == e(".number-of-checked:checked").length && e(".js-on-products-number").length && !e("#noMeat").is(":checked") ? (e(".products-modal").css("display", "block"), e(".m-progress-bar__overlay").css("opacity", "1"), e(".m-progress-bar__overlay").css("visibility", "visible"), e(".m-progress-bar__overlay").css("z-index", "103")) : n(t)
          }(this) : n(this)
        }), e(".dietMove #continue").on("click", function (e) {
          n(this)
        }), e(".dietMove.measurements").on("submit", function (t) {
          t.preventDefault();
          var n = e(this);
          if (!n.valid()) return !1;
          a(n)
        }), e("body").hasClass("pb") && e("input").each(function (t, n) {
          var a = getAnswers();
          if (void 0 !== a[e(n).data("key")]) switch (e(n).attr("type")) {
            case "radio":
            case "checkbox":
              var i = e(n).data("value") === a[e(n).data("key")];
              e(n).attr("checked", i);
              break;
            case "number":
              e(n).val(a[e(n).data("key")]).focus().blur()
          }
        }), e("#generateDiet").length) {
        var d = Math.floor(500 * Math.random()) + 500;
        setTimeout(function () {
          e.ajax({
            type: "post",
            url: "/diets",
            data: {
              data: getAnswers(),
              fingerprint: getFingerprint()
            },
            success: function (t) {
              t.error ? window.location.href = window.getHost() + "/161" : t.user_diet ? (window.setAnswer(e("#processing").data("key"), e("#processing").data("value")), window.removeAnswersData(), window.setAnswer("data", t.user_diet), window.trackFacebookUserDiet(t.user_diet), window.generateDietSuccess = !0) : window.location.href = window.getHost() + "/162"
            },
            error: function (t, n, a) {
              if (400 === t.status) {
                TweenMax.killAll();
                var i = e("#processing .m-progress__circle-wrap").data("text-error");
                e(".m-progress__text").text(i)
              }
              window.generateDietSuccess = !0
            }
          })
        }, d)
      }
      if (e("body").delegate("form.patch", "submit", function (t) {
          window.cookiePolicyAnswer("persistent") && window.setAnswer("saved-email", e(".js-save-email:first").val());
          var n = this,
            a = setInterval(function () {
              clearInterval(a), e.ajax({
                type: "post",
                url: getHost() + "/diets",
                data: {
                  _method: "patch",
                  email: e(n).find('input[name="email"]').val(),
                  uuid: getAnswersData("uuid"),
                  receive_newsletter: e("#accept-subscribe-to-our-newsletter").is(":checked"),
                  paymentMethod: e("#payment-method-selected").text()
                },
                success: function (t) {
                  if (t)
                    if (t.error) window.location.href = window.getHost() + "/158";
                    else if (!1 !== t.canGenerate) {
                    window.setUUID(t.uuid);
                    var n = window.location.pathname;
                    backEndVars.isPaymentFlowTypeSubscription ? n += "#subscription" : n += "#select-payment-method", history.replaceState(null, null, n), e("#email-first-payment-method-select").removeClass("hidden-2").show(), e("#email-form").hide()
                  } else window.location.href = window.getHost() + "/meal-plan-error";
                  else window.location.href = window.getHost() + "/157"
                },
                error: function () {
                  window.failedPayments(e("#payment-method-selected").text()), window.location.href = window.getHost() + "/" + e(".final .finalPage-slug").text() + "#get-plan"
                }
              })
            }, 60);
          t.preventDefault()
        }), e("div.o-profile-summary").length || e("div.o-section-summary")) {
        var l = window.toDecimal(getAnswersData("bmi")),
          u = l.toString().split("."),
          w = "";
        e("#bmi").text(u[0] + ","), w = u[1] < 10 ? 10 * u[1] : u[1] || 0, l < 16.5 ? e("#bmi-text-1").removeClass("hidden-bmi") : l < 18.5 ? e("#bmi-text-2").removeClass("hidden-bmi") : l < 25 ? e("#bmi-text-3").removeClass("hidden-bmi") : l < 30 ? e("#bmi-text-4").removeClass("hidden-bmi") : l < 35 ? e("#bmi-text-5").removeClass("hidden-bmi") : l < 40 ? e("#bmi-text-6").removeClass("hidden-bmi") : l > 40 && e("#bmi-text-7").removeClass("hidden-bmi"), e("#bmi-sup").text(0 !== w ? w : "00"), e.each(getAnswers().measurements, function (t, n) {
          getAnswersData("measurement") === n.name && ("age" === n.type || "age" === n.type.split("_").pop() ? (e("#metabolic-age").text(getAnswersData("metabolic_age") + " " + n.measuring_in), e("#years").text(n.value), e("#years-text").text(n.measuring_in)) : -1 !== n.type.indexOf("height") ? "height_inch" === n.type ? n.value ? e("#fp-height").text(e("#fp-height").text() + "." + n.value) : e("#fp-height").text(toDecimal(e("#fp-height").text())) : (e("#fp-height").text(n.value), e("#fp-height-text").text(n.measuring_in)) : -1 !== n.type.indexOf("weight") && -1 === n.type.indexOf("target") && (e("#u-weight").text(n.value), e("#u-weight-text").text(n.measuring_in)))
        }), e(".m-profile-card__content").length && (e("body").hasClass("men-theme") ? (e(".m-profile-card__content img").attr("src", backEndVars.designImgCdn + "/icons/man.svg"), e(".m-profile-card__content #men").show()) : (e(".m-profile-card__content img").attr("src", backEndVars.designImgCdn + "/icons/woman.svg"), e(".m-profile-card__content #women").show()))
      }
      e(".button-weeks-right").on("click", function () {
        r.call(this, "next")
      }), e(".button-weeks-left").on("click", function () {
        r.call(this, "prev")
      }), e('select[name="week"]').on("change", function () {
        o();
        var t = e(this).find("option:selected").val(),
          n = e(".o-section-content--meal").data("lds-loader-color") || "",
          a = location.href.replace(/week\/.+$/, ""),
          r = a + "week-view/" + t;
        e(".js-meal-body").fadeOut("fast", function () {
          e(this).html('<div class="lds-container"><div class="lds-default ' + n + '"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>').fadeIn("fast")
        }), history.pushState(null, null, a + "week/" + t), i(r)
      }), e("#diet-cache-exists").length && "0" === e("#diet-cache-exists").text() && e('select[name="week"]').trigger("change"), e('select[name="week"]').length && (window.onpopstate = function (t) {
        var n = location.pathname.replace(/^.+\/week\//, ""),
          a = location.href.replace(/week\/.+$/, "") + "week-view/" + n;
        e('select[name="week"]').val(n), o(), i(a), window.dataLayer = window.dataLayer || [], dataLayer.push({
          vpv: "spaPageview",
          uuid: e("#uuid").text(),
          weekNumber: n
        })
      }), e(".emailmeal").submit(function (t) {
        if (t.preventDefault(), e(this).valid()) {
          var n = e(this).find("input[name=uuid]").val(),
            a = e(this).find("input[name=email]").val();
          e.ajax({
            type: "post",
            url: getHost() + "/diets/resend",
            data: {
              uuid: n,
              email: a
            },
            success: function (t) {
              t ? t.error ? window.location.href = window.getHost() + "/165" : t.success && (e("#resend-email-block").hide(), e(".m-email-sent-notification").removeAttr("style")) : window.location.href = window.getHost() + "/164"
            }
          })
        }
      }), getAnswers().showPaymentError && (!0 !== getAnswers().showPaymentError && e("#error_payment").text(getAnswers().showPaymentError), e("#error_payment").show(), removeAnswer("showPaymentError")), e("#measurements-button").on("click", function () {
        e("#metric-form").valid() && e(".measurement-age").each(function (t, n) {
          e(n).attr("name", "age")
        })
      });
      e(".m-block-contacts").length && e(".o-footer").addClass("o-footer--shadow"), e.validator.addMethod("onlyOneDigitAfterTheDecimalPoint", function (e, t) {
        return this.optional(t) || /^(\d{1,}|\d{1,}\.\d{1})$/.test(e)
      }, "Please enter only one digit after the decimal point"), e(window).resize(function () {
        var t = e("[data-desktop-img]"),
          n = t.data("desktop-img"),
          a = t.attr("src");
        t.one("load", function () {
          e(this).fadeIn(250)
        }).each(function () {
          this.complete && e(this).fadeIn(250)
        }), e(this).width() >= 978 && !t.hasClass("desktop") && (s(t, n, a), t.addClass("desktop")), e(this).width() < 978 && t.hasClass("desktop") && (s(t, n, a), t.removeClass("desktop"))
      }).trigger("resize"), e("#accept-data-protect-conditions").on("change", function () {
        var t = e("#email-form-submit");
        e("#accept-data-protect-conditions").is(":checked") ? (t.attr("disabled", !1), e("#email-button-wrapper").addClass("a-button--with-gradient").css("visibility", "visible")) : (t.attr("disabled", !0), e("#email-button-wrapper").removeClass("a-button--with-gradient").css("visibility", ""))
      }), e("#data-protect-mark-checkbox").on("click", function (t) {
        e(t.target).is("#data-protect-link") && e("#accept-data-protect-conditions").is(":checked") ? window.open(getHost() + "/data-protection-policy", "_blank") : e("#accept-data-protect-conditions").trigger("click")
      }), e("#select-more").on("click", function () {
        e(".products-modal").css("display", "none"), e(".m-progress-bar__overlay").css("opacity", "0"), e(".m-progress-bar__overlay").css("visibility", "hidden"), e(".m-progress-bar__overlay").css("z-index", "101")
      }), e(".o-meal-table__body").on("click", ".recipe-steps-view-link", function (e) {
        e.stopPropagation()
      }), e(".email-first-payment-method-selected").on("click", function (t) {
        var n = e(t.target).closest(".paymentType").data("special");
        e.ajax({
          type: "post",
          url: getHost() + "/contact-info/fill/email-first",
          data: {
            _method: "patch",
            paymentMethod: n,
            status: "paymentMethodSelectedAfterPersonalDataInserted",
            uuid: getAnswersData("uuid")
          },
          success: function (t) {
            window.setUUID(t.uuid), "braintree" === n ? (history.replaceState(null, null, window.location.pathname + "#card-payment"), e("#card-payment-form").show(), setTimeout(function () {
              e(".js-paypal-loader").fadeOut(c)
            }, 1500)) : (history.replaceState(null, null, window.location.pathname + "#paypal"), e('#payment-form-external-redirect input[name="custom"]').val(t.uuid), e("#paypal-old-payment-form").show(), e("#payment-form-external-redirect").submit(), e(".js-paypal-loader").show()), e("#email-first-payment-method-select").hide()
          },
          error: function (t) {
            window.failedPayments(e("#payment-method-selected").text(), t.responseJSON.error), window.location.href = window.getHost() + "/" + e(".final .finalPage-slug").text() + "#get-plan"
          }
        })
      }), e("#noMeat").length && getNoMeatChecked()[0] && (e("#noMeat").prop("checked", !0), e(".a-checkbox").closest(".a-bradio").removeClass("a-checkbox--false")), e("#noMeat").on("click", function () {
        if (e(this).is(":checked")) {
          removeNoMeatProducts();
          var t = 0;
          e(".number-of-checked").each(function () {
            e(this).is(":checked") && (setNoMeatProducts(t++, this), e(this).closest(".a-bradio").addClass("a-bradio--false"))
          }), e(".a-checkbox").closest(".a-bradio").removeClass("a-checkbox--false"), e(".number-of-checked").prop("checked", !1), e(".no-meat-disabled").prop("checked", !0)
        } else window.getProducts()[0] ? (e(".a-checkbox").closest(".a-bradio").addClass("a-checkbox--false"), e.each(getProducts(), function (t, n) {
          e("#" + n).prop("checked", !0), e("#" + n).closest(".a-bradio").removeClass("a-bradio--false")
        }), removeNoMeatProducts()) : e(".number-of-checked").prop("checked", !0)
      }), e(".number-of-checked, .no-meat-disabled").on("click", function () {
        e("#noMeat").is(":checked") && (removeNoMeatProducts(), e("#noMeat").prop("checked", !1), e("#noMeat").closest(".a-bradio").addClass("a-checkbox--false")), 0 == e(".number-of-checked:checked").length && (e("#noMeat").prop("checked", !0), e("#noMeat").closest(".a-bradio").removeClass("a-checkbox--false"))
      }), e("#metric-form, #metric-imperial-form").length > 0 && e("#metric-form, #metric-imperial-form").find("a[class*=active]").each(function () {
        e(e(this).attr("href")).find("input").each(function () {
          "" !== e(this).val() && e(this).addClass("valid")
        })
      })
    })
  },
  oCYw: function (e, t, n) {
    $(document).ready(function () {
      var e = $("#paypal-button");
      $(e).length && ($("form").on("submit", function () {
        return !1
      }), paypal.Button.render({
        env: "production",
        locale: $(e).find(".locale").text(),
        style: {
          size: "responsive",
          color: "gold",
          shape: "rect",
          label: "pay",
          tagline: !1
        },
        client: {
          sandbox: $("#paypal-client-id").text(),
          production: $("#paypal-client-id").text()
        },
        commit: !0,
        payment: function (t, n) {
          window.ga && window.ga("send", "event", "Payment", "Click", window.location.hostname), $.ajax({
            type: "post",
            url: getHost() + "/contact-info/paypal",
            data: {
              _method: "patch",
              uuid: getAnswersData("uuid")
            },
            success: function (e) {
              getAnswersData("can_generate") || (window.location.href = window.getHost() + "/meal-plan-error"), window.setUUID(e.uuid)
            },
            error: function () {
              window.failedPayments($("#paypal-button").data("special")), window.location.reload()
            }
          });
          var a = $(e).find(".total").text(),
            i = $(e).find(".currency").text(),
            o = $(e).find(".descriptor").text();
          return n.payment.create({
            payment: {
              intent: "sale",
              transactions: [{
                amount: {
                  total: a,
                  currency: i,
                  details: {
                    subtotal: a
                  }
                },
                custom: getAnswersData("uuid"),
                description: o,
                soft_descriptor: o,
                item_list: {
                  items: [{
                    name: o,
                    description: o,
                    price: a,
                    quantity: 1,
                    currency: i
                  }]
                }
              }]
            },
            experience: {
              input_fields: {
                no_shipping: 1
              }
            }
          })
        },
        onAuthorize: function (e, t) {
          return t.payment.execute().then(function () {
            e._method = "patch", e.uuid = getAnswersData("uuid"), $.ajax({
              type: "post",
              url: "/payments/paypal/request",
              data: e,
              success: function (e) {
                e && e.uuid ? e.error ? window.location.href = window.getHost() + "/168" : t.redirect(window, getHost() + "/diets/" + e.uuid) : window.location.href = window.getHost() + "/167"
              },
              error: function () {
                window.failedPayments($("#paypal-button").data("special")), window.location.reload()
              }
            })
          })
        },
        onError: function (e) {
          window.failedPayments($("#paypal-button").data("special"), $("#paypal-button-error").text()), window.location.reload()
        }
      }, "#paypal-button"))
    })
  },
  "sV/x": function (e, t, n) {
    n("t8Kf"), n("OQde"), n("g6DD"), n("nHbD"), n("oCYw"), n("5pS3"), n("NhfK"), n("Zeim")
  },
  t8Kf: function (e, t) {
    var n = store.get("cookie-policy") || {},
      a = function (e, t) {
        n[e] = t, store.set("cookie-policy", n)
      };
    window.cookiePolicyAnswer = function (e) {
      return function (e) {
        return !1 !== n[e]
      }(e)
    }, $(document).ready(function () {
      $(".js-cookies-accept").on("click", function (e) {
        return e.preventDefault(), n = {}, store.remove("cookie-policy"), a("cookie-notification", !1), $("#cookies-popup-div").remove(), !1
      }), "cookie-policy-disagree" === $("body").data("page") && ($("input").on("change", function () {
        ! function (e) {
          a($(e).attr("name"), "1" === $(e).val())
        }($(this))
      }), $.each(n, function (e, t) {
        $("body").find('input[name="' + e + '"][value="' + (0 | t) + '"]').click()
      }))
    })
  }
});