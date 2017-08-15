import {isPromise} from 'chimee-helper';
import './loading.css';
import popupFactory from 'chimee-plugin-popup';
import {applyDecorators, accessor} from 'toxic-decorators';

const chimeeLoading = popupFactory({
  name: 'chimeeLoading',
  tagName: 'chimee-loading',
  html: `
    <chimee-loading-tip>
      <chimee-loading-tip-animate></chimee-loading-tip-animate>
      <chimee-loading-tip-word>
        <span>Loading </span
        ><span class="loading-percentage"></span
        ><span> %</span>
      </chimee-loading-tip-word>
    </chimee-loading-tip>
    <chimee-loading-log>
    </chimee-loading-log>
  `,
  offset: '0 0 0 0',
  hide: false,
  level: 199,
  init () {
    this.checkProgress();
  },
  penetrate: false,
  operable: true,
  create () {
    this.$percentege = this.$domWrap.find('.loading-percentage');
    this.$log = this.$domWrap.find('chimee-loading-log');
    this.$domWrap.on('click', this.click);
  },
  destroy () {
    this.$domWrap.off('click', this.click);
  },
  events: {
    loadstart () {
      this.writeLog('加载视频地址...[完成]');
    },
    canplay () {
      this.writeLog('加载视频内容...[完成]');
      this.close();
    },
    keydown (e) {
      if(!this._hide) {
        return false;
      }
    }
  },
  methods: {
    checkProgress () {
      this.pluginLen = Object.keys(this.$plugins).length;
      this.percentage = 0;
      this.upPiece = Math.round(100 / this.pluginLen);
      for(const i in this.$plugins) {
        this.monitor(this.$plugins[i]);
      }
    },
    monitor (obj) {
      let ready = obj.ready;
      const _this = this;
      applyDecorators(obj, {
        ready: accessor({
          get () {
            return ready;
          },
          set (value) {
            if(!isPromise(value)) return;
            value.then(() => {
              _this.updatePercentage();
            })
            .catch(() => {
              _this.writeLog(`插件：${obj.__id}加载...[失败]`);
            });
            ready = value;
          }
        })
      }, {self: true});
    },
    writeLog (txt) {
      const p = document.createElement('p');
      p.innerText = txt;
      this.$log.append(p);
    },
    updatePercentage () {
      this.percentage += this.upPiece;
      if(this.percentage >= 100) {
        this.writeLog('播放器初始化...[完成]');
        this.percentage = 100;
      }
      this.$percentege.text(this.percentage);
    },
    click (e) {
      e.stopPropagation();
    }
  }
});

export default chimeeLoading;
