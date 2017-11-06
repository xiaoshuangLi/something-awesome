import Animate from 'js/components/Animate';
import Raven from 'js/components/Raven';

import Canvas from '../../components/View';
import { batchAddListeners } from '../../common/base';

const songs = [
  {
    name: 'I See Fire',
    author: 'Kygo,Ed Sheeran',
    src: 'http://oxnb4ky01.bkt.clouddn.com/Kygo,Ed%20Sheeran%20-%20I%20See%20Fire%20%28Kygo%20Remix%29.mp3',
    measure: {},
  },
  {
    name: 'Escape',
    author: 'Rupert Holmes',
    src: 'http://oxnb4ky01.bkt.clouddn.com/Rupert%20Holmes%20-%20Escape%20%28The%20Pin%CC%83a%20Colada%20Song%29.mp3',
    measure: {},
  },
  {
    name: 'In The End',
    author: 'Linkin Park',
    src: 'http://oxnb4ky01.bkt.clouddn.com/Linkin%20Park%20-%20In%20The%20End.mp3',
    measure: {},
  },
  {
    name: 'Issues',
    author: 'Julia Michaels',
    src: 'http://oxnb4ky01.bkt.clouddn.com/Julia%20Michaels%20-%20Issues.mp3',
    measure: {},
  },
];

const exit = {
  text: 'EXIT',
  measure: {},
};

const bg = 'rgb(51, 51, 51)';
const color = 'rgb(255, 151, 1)';
const colorLight = 'rgba(255, 151, 1, 0.7)';
const colorLighter = 'rgba(255, 151, 1, 0.3)';

const sizeLg = 28;
const sizeSm = 18;
const fontName = 'Hiragino Sans GB,Microsoft YaHei,simsun,Helvetica';
const fontLg = `${sizeLg}px ${fontName}`;
const fontSm = `${sizeSm}px ${fontName}`;

const dRatio = window.devicePixelRatio;

let audio;
let voice = [];

let mouseX = 0;
let mouseY = 0;

const setDots = () => {
  if (!audio) {
    return null;
  }

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioCtx;
  const source = audioCtx.createMediaElementSource(audio);
  const gainNode = audioCtx.createGain();
  const processor = audioCtx.createScriptProcessor(4096, 1, 1);

  source.connect(gainNode);
  gainNode.connect(processor);
  processor.connect(audioCtx.destination);

  processor.onaudioprocess = (e) => {
    const inData = e.inputBuffer.getChannelData(0);
    const outData = e.outputBuffer.getChannelData(0);

    for (let v = 0; v < inData.length; v += 1) {
      outData[v] = inData[v];
      voice[v] = inData[v];
    }
  };
};

const setAudio = (src) => {
  if (!audio) {
    audio = new Audio();
    audio.preload = 'true';
    audio.autoplay = 'true';
    audio.loop = 'true';
    audio.crossOrigin = 'anonymous';
    setDots();
  }

  if (audio.src === src) {
    return audio.pause();
  }

  audio.src = src;
};

const isActive = (e, rect = {}) => {
  const { clientX, clientY, target } = e;
  const { x, y, width, height } = rect;

  if (clientY < y) {
    return false;
  }

  if (clientY > y + height) {
    return false;
  }

  if (clientX < x) {
    return false;
  }

  if (clientX > x + width) {
    return false;
  }

  return true;
};

const isActiveNow = () => {
  const songStatus = songs.some(({ active } = {}) => !!active);
  const exitStatus = !!exit.active;

  return songStatus || exitStatus;
};

const setWhenActive = (target) => {
  target.style.cursor = isActiveNow() ? 'pointer' : '';
};

const addScreenControl = (selector, status) => {
  batchAddListeners([
    {
      listeners: 'mousemove',
      cb(e) {
        // if (!status.getScreen()) {
        //   return null;
        // }

        let { clientX, clientY } = e;
        const { target } = e;

        clientX *= dRatio;
        clientY *= dRatio;

        mouseX = clientX;
        mouseY = clientY;

        const fakeEvent = { clientY, clientX, target };

        songs.forEach((song = {}) => {
          const { measure: { name = {}, author = {} } = {} } = song;
          song.active = isActive(fakeEvent, name) || isActive(fakeEvent, author);
        });

        exit.active = isActive(fakeEvent, exit.measure);

        setWhenActive(target);
      },
    },
    {
      listeners: 'click',
      cb(e) {
        if (!status.getScreen()) {
          return null;
        }

        const active = isActiveNow();

        if (!active) {
          return null;
        }

        const song = songs.find((item = {}) => !!item.active);

        if (song) {
          return setAudio(song.src);
        }

        if (exit.active) {
          return status.setScreen(false);
        }
      },
    },
  ])(selector);
};

const getTextRect = ({ ctx, text, x, y, size } = {}) => {
  const measure = ctx.measureText(text);
  const { width = 0 } = measure;

  return {
    x,
    y: y - size,
    width,
    height: size,
    text,
  };
};

const renderText = (res = {}) => {
  const { ctx, text = '', fillStyle = color, font = fontLg, size = sizeLg, x = 0, y = 0 } = res;

  ctx.fillStyle = fillStyle;
  ctx.font = font;
  ctx.fillText(text, x, y);

  return getTextRect({ ctx, text, x, y, size });
};

const renderSongs = (ctx) => {
  const margin = 20;
  const marginSm = 10;
  const left = 30;
  let height = sizeLg + left;

  songs.forEach((song = {}) => {
    const { src, name, active, author, measure = {} } = song;

    measure.name = renderText({
      ctx,
      text: name,
      fillStyle: active ? colorLighter : color,
      font: fontLg,
      size: sizeLg,
      x: left,
      y: height,
    });

    height += sizeSm;
    height += marginSm;

    measure.author = renderText({
      ctx,
      text: author,
      fillStyle: active ? colorLighter : colorLight,
      font: fontSm,
      size: sizeSm,
      x: left,
      y: height,
    });

    height += sizeLg;
    height += margin;
  });
};

const renderDots = (ctx) => {
  const { length } = voice;

  if (!length) {
    return null;
  }

  const mouseD = 100;
  const num = Math.pow(length, 0.5);
  const w = dRatio * innerWidth / num;
  const h = dRatio * innerHeight / num;
  const r = Math.min(innerWidth / num, innerHeight / num) * 0.8;

  for (let v = 0; v < length; v += 1) {
    const x = v % num;
    const y = (v - x) / num;
    const curr = voice[v];
    const res = (curr + 1) / 2;

    let currX = (x + 0.5) * w;
    let currY = (y + 0.5) * h;

    const dX = mouseX - currX;
    const dY = mouseY - currY;

    const d = Math.pow(Math.pow(dX, 2) + Math.pow(dY, 2), 0.5);

    if (d < mouseD) {
      currX = mouseX + mouseD * dX / d;
      currY = mouseY + mouseD * dY / d;
    }

    ctx.fillStyle = `rgba(255, 151, 1, ${0.3 * res * mouseD / d})`;
    ctx.beginPath();
    ctx.arc(currX, currY, r * res, 0, Math.PI * 2, false);
    ctx.fill();
  }
};

const renderExit = (ctx) => {
  const right = 30;
  const clientRight = innerWidth * dRatio - right;
  const height = sizeSm + right;

  const { text, active } = exit;

  ctx.font = fontSm;

  exit.measure = renderText({
    ctx,
    text,
    fillStyle: active ? colorLighter : color,
    font: fontSm,
    size: sizeSm,
    x: clientRight - ctx.measureText(text).width,
    y: height,
  });
};

const screen = (selector = {}, status = {}) => {
  if (!selector.screen) {
    return null;
  }

  addScreenControl(selector.world, status);

  const actor = {
    update: (ctx, cw, ch, ratio, w, h) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, cw, ch);

      renderSongs(ctx);
      renderExit(ctx);
      renderDots(ctx);
    },
  };

  const res = new Canvas({
    cva: selector.screen,
    list: [actor],
  });
};

export default screen;
