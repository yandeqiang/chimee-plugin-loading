
/**
 * chimee-plugin-loading v0.0.1
 * (c) 2017 yandeqiang
 * Released under ISC
 */

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  return returnValue;
}

import _Object$keys from 'babel-runtime/core-js/object/keys';
import { isPromise } from 'chimee-helper';
import popupFactory from 'chimee-plugin-popup';
import { accessor, applyDecorators } from 'toxic-decorators';

__$styleInject("chimee-loading{position:absolute;background:#0d1018;color:#c1c1c1}chimee-loading-log{position:absolute;bottom:0;left:20px;width:200px;height:120px;line-height:18px;overflow:auto}chimee-loading-tip{display:block;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:24px}", undefined);

var chimeeLoading = popupFactory({
  name: 'chimeeLoading',
  tagName: 'chimee-loading',
  html: '\n    <chimee-loading-tip>\n      <chimee-loading-tip-animate></chimee-loading-tip-animate>\n      <chimee-loading-tip-word>\n        <span>Loading </span\n        ><span class="loading-percentage"></span\n        ><span> %</span>\n      </chimee-loading-tip-word>\n    </chimee-loading-tip>\n    <chimee-loading-log>\n    </chimee-loading-log>\n  ',
  offset: '0 0 0 0',
  hide: false,
  level: 199,
  init: function init() {
    this.checkProgress();
  },

  penetrate: false,
  operable: true,
  create: function create() {
    this.$percentege = this.$domWrap.find('.loading-percentage');
    this.$log = this.$domWrap.find('chimee-loading-log');
    this.$domWrap.on('click', this.click);
  },
  destroy: function destroy() {
    this.$domWrap.off('click', this.click);
  },

  events: {
    loadstart: function loadstart() {
      this.writeLog('加载视频地址...[完成]');
    },
    canplay: function canplay() {
      this.writeLog('加载视频内容...[完成]');
      this.close();
    },
    keydown: function keydown(e) {
      if (!this._hide) {
        return false;
      }
    }
  },
  methods: {
    checkProgress: function checkProgress() {
      this.pluginLen = _Object$keys(this.$plugins).length;
      this.percentage = 0;
      this.upPiece = Math.round(100 / this.pluginLen);
      for (var i in this.$plugins) {
        this.monitor(this.$plugins[i]);
      }
    },
    monitor: function monitor(obj) {
      var ready = obj.ready;
      var _this = this;
      applyDecorators(obj, {
        ready: accessor({
          get: function get() {
            return ready;
          },
          set: function set(value) {
            if (!isPromise(value)) return;
            value.then(function () {
              _this.updatePercentage();
            }).catch(function () {
              _this.writeLog('\u63D2\u4EF6\uFF1A' + obj.__id + '\u52A0\u8F7D...[\u5931\u8D25]');
            });
            ready = value;
          }
        })
      }, { self: true });
    },
    writeLog: function writeLog(txt) {
      var p = document.createElement('p');
      p.innerText = txt;
      this.$log.append(p);
    },
    updatePercentage: function updatePercentage() {
      this.percentage += this.upPiece;
      if (this.percentage >= 100) {
        this.writeLog('播放器初始化...[完成]');
        this.percentage = 100;
      }
      this.$percentege.text(this.percentage);
    },
    click: function click(e) {
      e.stopPropagation();
    }
  }
});

export default chimeeLoading;
