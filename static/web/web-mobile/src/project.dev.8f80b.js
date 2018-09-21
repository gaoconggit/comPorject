__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  CatchItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9c46bjBXE1Iuo0Xfp2rQUQo", "CatchItem");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var RankItem = function(_super) {
      __extends(RankItem, _super);
      function RankItem() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.spritePhoto = null;
        _this.spriteDoll = null;
        _this.labelTime = null;
        _this.labelDesc = null;
        _this._urlPhoto = "";
        _this._urlDoll = "";
        return _this;
      }
      Object.defineProperty(RankItem.prototype, "urlPhoto", {
        get: function() {
          return this._urlPhoto;
        },
        set: function(value) {
          var _this = this;
          cc.log(value);
          this._urlPhoto = value;
          cc.loader.load({
            url: this._urlPhoto,
            type: "png"
          }, function(err, texture) {
            var frame = new cc.SpriteFrame(texture);
            _this.spritePhoto.spriteFrame = frame;
          });
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RankItem.prototype, "urlDoll", {
        get: function() {
          return this._urlDoll;
        },
        set: function(value) {
          var _this = this;
          this._urlDoll = value;
          cc.loader.load(this._urlDoll, function(err, texture) {
            var frame = new cc.SpriteFrame(texture);
            _this.spriteDoll.spriteFrame = frame;
          });
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RankItem.prototype, "desc", {
        get: function() {
          return this._desc;
        },
        set: function(value) {
          this._desc = value;
          this.labelDesc.string = value;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RankItem.prototype, "time", {
        get: function() {
          return this._time;
        },
        set: function(value) {
          this._time = value;
          this.labelTime.string = value;
        },
        enumerable: true,
        configurable: true
      });
      RankItem.prototype.createImage = function(sprite, url) {
        var image = new Image();
        image.onload = function() {
          var texture = new cc.Texture2D();
          texture.initWithElement(image);
          texture.handleLoadedTexture();
          sprite.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = url;
      };
      __decorate([ property(cc.Sprite) ], RankItem.prototype, "spritePhoto", void 0);
      __decorate([ property(cc.Sprite) ], RankItem.prototype, "spriteDoll", void 0);
      __decorate([ property(cc.Label) ], RankItem.prototype, "labelTime", void 0);
      __decorate([ property(cc.Label) ], RankItem.prototype, "labelDesc", void 0);
      RankItem = __decorate([ ccclass ], RankItem);
      return RankItem;
    }(cc.Component);
    exports.default = RankItem;
    cc._RF.pop();
  }, {} ],
  Doll: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "05383dN23RDc4dOqNh/Nf7B", "Doll");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var NewClass = function(_super) {
      __extends(NewClass, _super);
      function NewClass() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.sprite = null;
        return _this;
      }
      NewClass.prototype.init = function(id, url) {
        var _this = this;
        this.id = id;
        cc.loader.load(url, function(err, texture) {
          var frame = new cc.SpriteFrame(texture);
          _this.sprite.spriteFrame = frame;
        });
      };
      __decorate([ property(cc.Sprite) ], NewClass.prototype, "sprite", void 0);
      NewClass = __decorate([ ccclass ], NewClass);
      return NewClass;
    }(cc.Component);
    exports.default = NewClass;
    cc._RF.pop();
  }, {} ],
  Helloworld: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e1b90/rohdEk4SdmmEZANaD", "Helloworld");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var MProgressBar_1 = require("./MProgressBar");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Helloworld = function(_super) {
      __extends(Helloworld, _super);
      function Helloworld() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.giftList = [];
        _this.dolls = [];
        _this.dolls2 = [];
        _this.curDoll = null;
        _this.lastDollNode = null;
        _this.lastDollNode2 = null;
        _this.scrollSpeed = 3;
        _this.prefabDoll = null;
        _this.nodePaw = null;
        _this.dollContainer1 = null;
        _this.dollContainer2 = null;
        _this.framePaw1 = null;
        _this.framePaw2 = null;
        _this.framePaw3 = null;
        _this.nodeIntroduce = null;
        _this.labelCoin = null;
        _this.pbLucky = null;
        _this.pbBox = null;
        _this.labelBoxPercent = null;
        _this.nodeBoxOpen = null;
        _this.nodeBoxClose = null;
        _this.scvBoxHistory = null;
        _this.scvCatchHistory = null;
        _this.prefabCatchItem = null;
        _this.toast = null;
        _this.labelPrice = null;
        _this.nodeSuccess = null;
        _this.spCatchDoll = null;
        _this.nodeDetail = null;
        _this.spDetail = null;
        _this.labelDetail = null;
        return _this;
      }
      Object.defineProperty(Helloworld.prototype, "coin", {
        get: function() {
          return this._coin;
        },
        set: function(v) {
          this._coin = v;
          this.labelCoin.string = v.toString();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Helloworld.prototype, "progress", {
        get: function() {
          return this._progress;
        },
        set: function(v) {
          cc.log(v);
          this._progress = v;
          this.nodeTo(this.pbLucky, "progress", v / 100, 2);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Helloworld.prototype, "boxProgress", {
        get: function() {
          return this._boxProgress;
        },
        set: function(v) {
          var flag1 = 100 == this._boxProgress && 100 == v;
          var flag2 = 100 != this._boxProgress && 100 != v;
          cc.log(v);
          this._boxProgress = v;
          this.pbBox.progress = v / 100;
          this.labelBoxPercent.string = v + "%";
          if (100 == v) {
            this.nodeBoxOpen.active = true;
            this.nodeBoxClose.active = false;
          } else {
            this.nodeBoxOpen.active = false;
            this.nodeBoxClose.active = true;
          }
          flag1 || flag2 || this.updateDolls();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Helloworld.prototype, "isNewbee", {
        get: function() {
          return this._isNewbee;
        },
        set: function(v) {
          if (v === this._isNewbee) return;
          this._isNewbee = v;
          this.updateDolls();
        },
        enumerable: true,
        configurable: true
      });
      Helloworld.prototype.nodeTo = function(comp, attrName, toV, time) {
        return __awaiter(this, void 0, void 0, function() {
          var offset, per, _loop_1, this_1, i;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              offset = toV - comp[attrName];
              per = offset / time / 10;
              _loop_1 = function(i) {
                return __generator(this, function(_a) {
                  switch (_a.label) {
                   case 0:
                    return [ 4, this_1.asyncAction(comp.node, cc.callFunc(function() {
                      i === 10 * time - 1 ? comp[attrName] = toV : comp[attrName] += per;
                    })) ];

                   case 1:
                    _a.sent();
                    return [ 2 ];
                  }
                });
              };
              this_1 = this;
              i = 0;
              _a.label = 1;

             case 1:
              if (!(i < 10 * time)) return [ 3, 4 ];
              return [ 5, _loop_1(i) ];

             case 2:
              _a.sent();
              _a.label = 3;

             case 3:
              i++;
              return [ 3, 1 ];

             case 4:
              return [ 2 ];
            }
          });
        });
      };
      Helloworld.prototype.fetch = function(url) {
        var _this = this;
        return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if (4 == xhr.readyState && xhr.status >= 200 && xhr.status < 400) {
              var response = JSON.parse(xhr.responseText);
              resolve(response);
            }
          };
          xhr.onerror = function() {
            _this.showToast("\u51fa\u73b0\u9519\u8bef,2\u79d2\u540e\u81ea\u52a8\u91cd\u8bd5");
            _this.scheduleOnce(function() {
              return _this.fetch(url);
            }, 2);
          };
          xhr.ontimeout = function() {
            _this.showToast("\u51fa\u73b0\u9519\u8bef,2\u79d2\u540e\u81ea\u52a8\u91cd\u8bd5");
            _this.scheduleOnce(function() {
              return _this.fetch(url);
            }, 2);
          };
          xhr.open("POST", url, true);
          xhr.send();
        });
      };
      Helloworld.prototype.showToast = function(pName, dollName) {
        var node = cc.instantiate(this.toast);
        if (dollName) {
          node.getChildByName("Layout").getChildByName("playerName").getComponent(cc.Label).string = pName;
          node.getChildByName("Layout").getChildByName("dollName").getComponent(cc.Label).string = dollName;
        } else {
          node.getChildByName("Layout").getChildByName("playerName").getComponent(cc.Label).string = "";
          node.getChildByName("Layout").getChildByName("dollName").getComponent(cc.Label).string = "";
          node.getChildByName("Layout").getChildByName("txt").getComponent(cc.Label).string = pName;
        }
        node.parent = this.node;
        node.active = true;
        node.runAction(cc.sequence(cc.fadeIn(1), cc.fadeOut(2), cc.callFunc(function() {
          node.destroy();
        })));
      };
      Helloworld.prototype.onCloseSuccess = function() {
        this.nodeSuccess.active = false;
      };
      Helloworld.prototype.onLoad = function() {
        return __awaiter(this, void 0, void 0, function() {
          var onMsgCall;
          var _this = this;
          return __generator(this, function(_a) {
            cc.log("zhuawawa onload");
            this.nodeIntroduce.active = false;
            this.nodeSuccess.active = false;
            this.nodeDetail.active = false;
            this.scvCatchHistory.enabled = false;
            this.scvBoxHistory.enabled = false;
            onMsgCall = function(textValue) {
              return __awaiter(_this, void 0, void 0, function() {
                var res, url, response, d, desc;
                return __generator(this, function(_a) {
                  switch (_a.label) {
                   case 0:
                    cc.log(JSON.parse(textValue.data));
                    res = JSON.parse(textValue.data);
                    if (!("info" == res[0])) return [ 3, 2 ];
                    this.baseUrl = res[1][0];
                    this.uid = res[1][1];
                    this.token = res[1][2];
                    url = this.baseUrl + "/api/public/?service=SpinningWawa.joinRoom&token=" + this.token + "&uid=" + this.uid;
                    return [ 4, this.fetch(url) ];

                   case 1:
                    response = _a.sent();
                    cc.log(response);
                    this.coin = parseInt(response.data.coin);
                    this.price = parseInt(response.data.price);
                    this.progress = parseInt(response.data.lucky_value);
                    this.boxProgress = parseInt(response.data.box_progress);
                    this.labelPrice.string = response.data.price + "\u5e01/\u6b21";
                    this.giftList = response.data.gift_list;
                    this.isNewbee = 1 == response.data.is_newbee;
                    this.upCatchHistory();
                    this.upBoxHistory();
                    this.showBoxHistory();
                    _a.label = 2;

                   case 2:
                    if ("catch" == res[0]) {
                      d = res[1];
                      if (1 == d.success) {
                        desc = d.nickname + " \u6293\u4e2d\u4e86 " + d.goods_name;
                        cc.log(desc);
                        this.showToast(d.nickname, d.goods_name);
                        this.upBoxHistory();
                        this.upCatchHistory();
                      }
                    }
                    if ("progress" == res[0]) {
                      cc.log(this.boxProgress);
                      this.boxProgress = parseInt(res[1]);
                    }
                    "refresh" == res[0] && cc.director.loadScene("Helloworld");
                    window.document && window.document.addEventListener && window.document.addEventListener("message", onMsgCall);
                    window.parent && window.parent.addEventListenerXzww && window.parent.addEventListenerXzww("message", onMsgCall);
                    window.postMessage && window.postMessage("ready");
                    window.parent && window.parent.postMessageXzww && window.parent.postMessageXzww("ready");
                    return [ 2 ];
                  }
                });
              });
            };
            return [ 2 ];
          });
        });
      };
      Helloworld.prototype.upCatchHistory = function() {
        return __awaiter(this, void 0, void 0, function() {
          var url, response, i, info, node, item;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              url = this.baseUrl + "/api/public/?service=SpinningWawa.gameHistory&token=" + this.token + "&uid=" + this.uid;
              return [ 4, this.fetch(url) ];

             case 1:
              response = _a.sent();
              cc.log(response);
              this.scvCatchHistory.content.removeAllChildren();
              for (i = 0; i < response.data.length; i++) {
                info = response.data[i];
                node = cc.instantiate(this.prefabCatchItem);
                item = node.getComponent("CatchItem");
                item.urlPhoto = info.avatar_thumb;
                item.urlDoll = info.img;
                item.desc = info.user_nicename + " \u6293\u5230\u4e86 " + info.ret_name;
                item.time = info.passtime;
                node.parent = this.scvCatchHistory.content;
              }
              return [ 2 ];
            }
          });
        });
      };
      Helloworld.prototype.upBoxHistory = function() {
        return __awaiter(this, void 0, void 0, function() {
          var url, response, i, info, node, item;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              url = this.baseUrl + "/api/public/?service=SpinningWawa.boxHistory&token=" + this.token + "&uid=" + this.uid;
              return [ 4, this.fetch(url) ];

             case 1:
              response = _a.sent();
              cc.log(response);
              this.scvBoxHistory.content.removeAllChildren();
              for (i = 0; i < response.data.length; i++) {
                info = response.data[i];
                node = cc.instantiate(this.prefabCatchItem);
                item = node.getComponent("CatchItem");
                item.urlPhoto = info.avatar_thumb;
                item.urlDoll = info.img;
                item.desc = info.user_nicename + " \u6293\u5230\u4e86 " + info.ret_name;
                item.time = info.passtime;
                node.parent = this.scvBoxHistory.content;
              }
              return [ 2 ];
            }
          });
        });
      };
      Helloworld.prototype.showBoxHistory = function() {
        this.scvBoxHistory.node.active = true;
        this.scvCatchHistory.node.active = false;
        this.scvBoxHistory.scrollToTop(.1);
      };
      Helloworld.prototype.showCatchHistory = function() {
        this.scvBoxHistory.node.active = false;
        this.scvCatchHistory.node.active = true;
        this.scvCatchHistory.scrollToTop(.1);
      };
      Helloworld.prototype.updateDolls = function() {
        var _this = this;
        this.dolls.forEach(function(v) {
          v.node.destroy();
        });
        this.dolls2.forEach(function(v) {
          v.node.destroy();
        });
        this.dolls = [];
        this.dolls2 = [];
        if (this.giftList.length <= 0) return;
        var _loop_2 = function(i) {
          var dollInfo = this_2.giftList[i];
          if (this_2.isNewbee && 1 != dollInfo.is_newbee) return "continue";
          if (100 != this_2.boxProgress && 1 == dollInfo.is_box) return "continue";
          var node = cc.instantiate(this_2.prefabDoll);
          var doll = node.getComponent("Doll");
          doll.init(dollInfo.id, dollInfo.icon);
          node.parent = this_2.dollContainer1;
          node.x = this_2.dolls.length * node.width * 1.3 - this_2.node.width / 2 + node.width / 2;
          this_2.dolls.push(doll);
          node.on("click", function() {
            _this.onDetail(dollInfo);
          });
          node = cc.instantiate(this_2.prefabDoll);
          doll = node.getComponent("Doll");
          doll.init(dollInfo.id, dollInfo.icon);
          node.parent = this_2.dollContainer2;
          node.x = (this_2.dolls.length - 4) * node.width * 1.3 - this_2.node.width / 2 + node.width / 2;
          doll.sprite.node.color = cc.color(150, 150, 150);
          this_2.dolls2.push(doll);
          node.on("click", function() {
            _this.onDetail(dollInfo);
          });
        };
        var this_2 = this;
        for (var i = 0; i < this.giftList.length; i++) _loop_2(i);
        this.lastDollNode = this.dolls[this.dolls.length - 1].node;
        this.lastDollNode2 = this.dolls2[this.dolls.length - 1].node;
      };
      Helloworld.prototype.update = function() {
        this.curDoll = null;
        for (var i = 0; i < this.dolls.length; i++) {
          var doll = this.dolls[i];
          var node = doll.node;
          node.x -= this.scrollSpeed;
          if (null === this.curDoll) {
            node.x > -90 && node.x < 90 && (this.curDoll = doll);
            this.isNewbee && node.x > -161 && node.x < 161 && (this.curDoll = doll);
          }
          if (node.x < -this.dollContainer1.width / 2 - node.width / 2 - 10) {
            node.active = true;
            node.x = this.lastDollNode.x + 1.3 * node.width;
            this.lastDollNode = node;
          }
        }
        for (var i = 0; i < this.dolls2.length; i++) {
          var doll = this.dolls2[i];
          var node = doll.node;
          node.x -= this.scrollSpeed;
          if (node.x < -this.dollContainer2.width / 2 - node.width / 2 - 10) {
            node.active = true;
            node.x = this.lastDollNode2.x + 1.3 * node.width;
            this.lastDollNode2 = node;
          }
        }
      };
      Helloworld.prototype.asyncAction = function(node, action) {
        return new Promise(function(resolve, reject) {
          node.runAction(cc.sequence(action, cc.callFunc(resolve)));
        });
      };
      Helloworld.prototype.onIntroduce = function() {
        this.nodeIntroduce.active = true;
      };
      Helloworld.prototype.onCloseIntroduce = function() {
        this.nodeIntroduce.active = false;
      };
      Helloworld.prototype.onRecharge = function() {
        window.postMessage && window.postMessage("recharge");
        window.parent && window.parent.postMessageXzww && window.parent.postMessageXzww("recharge");
      };
      Helloworld.prototype.onCloseDetail = function() {
        this.nodeDetail.active = false;
      };
      Helloworld.prototype.onDetail = function(info) {
        var _this = this;
        this.nodeDetail.active = true;
        cc.loader.load(info.img, function(err, texture) {
          var frame = new cc.SpriteFrame(texture);
          _this.spDetail.spriteFrame = frame;
        });
        this.labelDetail.string = info.description;
      };
      Helloworld.prototype.onCatch = function(e) {
        return __awaiter(this, void 0, void 0, function() {
          var nodeTarget, btn, offsetY, dollClone_1, url, response, url, response;
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if (this.coin < this.price) {
                this.showToast("\u91d1\u5e01\u4e0d\u8db3\uff0c\u8bf7\u5145\u503c\u540e\u518d\u8bd5\uff01");
                return [ 2 ];
              }
              nodeTarget = e.target;
              btn = nodeTarget.getComponent(cc.Button);
              btn.interactable = false;
              offsetY = this.nodePaw.y - this.dollContainer1.y;
              return [ 4, this.asyncAction(this.nodePaw, cc.moveBy(.25, cc.p(0, .3 * -offsetY))) ];

             case 1:
              _a.sent();
              this.nodePaw.getComponent(cc.Sprite).spriteFrame = this.framePaw1;
              return [ 4, this.asyncAction(this.nodePaw, cc.moveBy(.75, cc.p(0, .7 * -offsetY))) ];

             case 2:
              _a.sent();
              this.nodePaw.getComponent(cc.Sprite).spriteFrame = this.framePaw2;
              if (!this.curDoll) return [ 3, 10 ];
              cc.log("\u6293\u8d77\u6765\u4e86", this.curDoll.id);
              dollClone_1 = cc.instantiate(this.curDoll.node);
              dollClone_1.x = 0;
              dollClone_1.y = 0;
              dollClone_1.parent = this.nodePaw;
              this.curDoll.node.active = false;
              url = this.baseUrl + "/api/public/?service=SpinningWawa.checkResult&goods_id=" + this.curDoll.id + "&token=" + this.token + "&uid=" + this.uid;
              return [ 4, this.fetch(url) ];

             case 3:
              response = _a.sent();
              cc.log(response);
              if (!(1 == response.code)) return [ 3, 8 ];
              this.coin = response.data.coin;
              this.progress = parseInt(response.data.lucky_value);
              this.isNewbee = 1 == response.data.is_newbee;
              this.boxProgress = parseInt(response.data.box_progress);
              if (!(1 == response.data.success)) return [ 3, 5 ];
              return [ 4, this.asyncAction(this.nodePaw, cc.moveBy(1, cc.p(0, offsetY))) ];

             case 4:
              _a.sent();
              dollClone_1.destroy();
              cc.log("\u6293\u4e2d\u4e86");
              btn.interactable = true;
              this.nodeSuccess.active = true;
              cc.loader.load({
                url: response.data.icon
              }, function(err, texture) {
                var frame = new cc.SpriteFrame(texture);
                _this.spCatchDoll.spriteFrame = frame;
              });
              return [ 3, 7 ];

             case 5:
              dollClone_1.runAction(cc.sequence(cc.delayTime(.75), cc.moveBy(.75, cc.p(0, 1.3 * -offsetY)), cc.callFunc(function() {
                dollClone_1.destroy();
                cc.error("\u6389\u4e86");
                btn.interactable = true;
              })));
              return [ 4, this.asyncAction(this.nodePaw, cc.moveBy(1, cc.p(0, offsetY))) ];

             case 6:
              _a.sent();
              _a.label = 7;

             case 7:
              return [ 3, 9 ];

             case 8:
              this.showToast(response.msg);
              _a.label = 9;

             case 9:
              return [ 3, 13 ];

             case 10:
              cc.error("\u6ca1\u6709\u6293\u5230");
              url = this.baseUrl + "/api/public/?service=SpinningWawa.checkResult&goods_id=0&token=" + this.token + "&uid=" + this.uid;
              return [ 4, this.fetch(url) ];

             case 11:
              response = _a.sent();
              cc.log(response);
              if (1 == response.code) {
                this.coin = response.data.coin;
                this.progress = parseInt(response.data.lucky_value);
                this.boxProgress = parseInt(response.data.box_progress);
                this.isNewbee = 1 == response.data.is_newbee;
              } else this.showToast(response.msg);
              return [ 4, this.asyncAction(this.nodePaw, cc.moveBy(1, cc.p(0, offsetY))) ];

             case 12:
              _a.sent();
              btn.interactable = true;
              _a.label = 13;

             case 13:
              this.nodePaw.getComponent(cc.Sprite).spriteFrame = this.framePaw3;
              return [ 2 ];
            }
          });
        });
      };
      __decorate([ property(cc.Prefab) ], Helloworld.prototype, "prefabDoll", void 0);
      __decorate([ property(cc.Node) ], Helloworld.prototype, "nodePaw", void 0);
      __decorate([ property(cc.Node) ], Helloworld.prototype, "dollContainer1", void 0);
      __decorate([ property(cc.Node) ], Helloworld.prototype, "dollContainer2", void 0);
      __decorate([ property(cc.SpriteFrame) ], Helloworld.prototype, "framePaw1", void 0);
      __decorate([ property(cc.SpriteFrame) ], Helloworld.prototype, "framePaw2", void 0);
      __decorate([ property(cc.SpriteFrame) ], Helloworld.prototype, "framePaw3", void 0);
      __decorate([ property(cc.Node) ], Helloworld.prototype, "nodeIntroduce", void 0);
      __decorate([ property(cc.Label) ], Helloworld.prototype, "labelCoin", void 0);
      __decorate([ property(MProgressBar_1.default) ], Helloworld.prototype, "pbLucky", void 0);
      __decorate([ property(cc.ProgressBar) ], Helloworld.prototype, "pbBox", void 0);
      __decorate([ property(cc.Label) ], Helloworld.prototype, "labelBoxPercent", void 0);
      __decorate([ property(cc.Node) ], Helloworld.prototype, "nodeBoxOpen", void 0);
      __decorate([ property(cc.Node) ], Helloworld.prototype, "nodeBoxClose", void 0);
      __decorate([ property(cc.ScrollView) ], Helloworld.prototype, "scvBoxHistory", void 0);
      __decorate([ property(cc.ScrollView) ], Helloworld.prototype, "scvCatchHistory", void 0);
      __decorate([ property(cc.Prefab) ], Helloworld.prototype, "prefabCatchItem", void 0);
      __decorate([ property(cc.Node) ], Helloworld.prototype, "toast", void 0);
      __decorate([ property(cc.Label) ], Helloworld.prototype, "labelPrice", void 0);
      __decorate([ property(cc.Node) ], Helloworld.prototype, "nodeSuccess", void 0);
      __decorate([ property(cc.Sprite) ], Helloworld.prototype, "spCatchDoll", void 0);
      __decorate([ property(cc.Node) ], Helloworld.prototype, "nodeDetail", void 0);
      __decorate([ property(cc.Sprite) ], Helloworld.prototype, "spDetail", void 0);
      __decorate([ property(cc.Label) ], Helloworld.prototype, "labelDetail", void 0);
      Helloworld = __decorate([ ccclass ], Helloworld);
      return Helloworld;
    }(cc.Component);
    exports.default = Helloworld;
    cc._RF.pop();
  }, {
    "./MProgressBar": "MProgressBar"
  } ],
  MProgressBar: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "79d5cMsxptO64yrd8M/bn13", "MProgressBar");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var NewClass = function(_super) {
      __extends(NewClass, _super);
      function NewClass() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.mask = null;
        _this.label = null;
        _this._progress = 1;
        return _this;
      }
      Object.defineProperty(NewClass.prototype, "progress", {
        get: function() {
          return this._progress;
        },
        set: function(v) {
          this._progress = v;
          this.mask.width = this.node.width;
          this.mask.height = this.node.height * v;
          var n = Math.floor(100 * v);
          this.label.string = n + "%";
        },
        enumerable: true,
        configurable: true
      });
      NewClass.prototype.onLoad = function() {
        this.mask.y = -this.node.height / 2;
      };
      __decorate([ property(cc.Node) ], NewClass.prototype, "mask", void 0);
      __decorate([ property(cc.Label) ], NewClass.prototype, "label", void 0);
      __decorate([ property(cc.Float) ], NewClass.prototype, "_progress", void 0);
      __decorate([ property ], NewClass.prototype, "progress", null);
      NewClass = __decorate([ ccclass ], NewClass);
      return NewClass;
    }(cc.Component);
    exports.default = NewClass;
    cc._RF.pop();
  }, {} ]
}, {}, [ "CatchItem", "Doll", "Helloworld", "MProgressBar" ]);
//# sourceMappingURL=project.dev.js.map