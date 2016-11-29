"use strict";

var gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	cssmin = require('gulp-minify-css'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload,
	stylus = require('gulp-stylus'),
	config = require('../config');

gulp.task('fonts', () => {
	gulp.src(config.src.font)
		.pipe(gulp.dest('./build/fonts'))
});