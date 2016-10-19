
var dest = global.gulpOptions.frontPath + '/dist';
var src = global.gulpOptions.frontPath + '/src';

module.exports = {
  clean: {
    files: [dest]
  },
  html: {
    src: src + '/html/views/**/*',
    dest: dest + '/views'
  },
  css: {
    src: src + '/scss/**/*.css',
    dest: dest + '/css'
  },
  sass: {
    src: src + '/scss/**/*.scss',
    dest: dest + '/css'
  },
  script: {
    src: src + '/js/**/*.js',
    dest: dest + '/js'
  },
  tpl: {
    src: src + '/html/tpl/**/*',
    dest: dest + '/tpl'
  },
  lib: {
    src: src + '/lib/**/*',
    dest: dest + '/lib'
  },
  images: {
    src: [src + '/images/**/*'],
    dest: dest + '/images'
  },
  media: {
    src: [src + '/media/**/*'],
    dest: dest + '/media'
  },
  react: {
    src: [src + '/react/components/**/*'],
    dest: dest + '/views/components'
  },
  browserify: {
    bundleConfigs: [
      // {
      //   entries: src + '/react/home.jsx',
      //   dest: dest,
      //   outputName: 'js/home.bundle.js',
      //   literal: {
      //     'jQuery': 'window.$',
      //     'lodash': 'window._'
      //   },
      //   extensions: ['.js', '.jsx']
      // }
    ]
  },
  nodemon: {
    script: 'server.js',
    watch: ['server.js']
  }
};
