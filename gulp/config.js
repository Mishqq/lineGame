"use strict";

module.exports = {
  build: {
    html: 'build/templates/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/'
  },
  src: {
    html: './src/components/**/*.html',
    js: ['./src/modules/app.js', './src/modules/*.js', './src/templates/*.js', './src/*.js', 'src/**/*.js'],
    style: ['./src/style/main.sass'], // Плохо, но пока ладно. Иначе два раза компилит стили (из-за импорта)
    img: './src/img/**/*.*',
    font: ['./src/fonts/**/*.otf',
      './src/fonts/**/*.eot',
      './src/fonts/**/*.svg',
      './src/fonts/**/*.ttf',
      './src/fonts/**/*.woff',
      './src/fonts/**/*.woff2']
  },
  watch: {
    html: ['./src/**/*.html'],
    js: ['./src/*.js', 'src/**/*.js'],
    style: ['./src/**/*.sass'],
    img: ['./src/img/**/*.*']
  },
  clean: './build',
  serverSettings: {
    server: {
      baseDir: "."
    },
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend"
  }
};
