"use strict";

var gulp = require('gulp'),
		watch = require('gulp-watch'),
		config = require('../config');

gulp.task('watch', function(){
	// gulp.watch(config.watch.html, ['html:build']);

	gulp.watch(config.watch.html, ['js:build']);

	gulp.watch(config.watch.style, ['style:build']);

	gulp.watch(config.watch.js, ['js:build']);

	gulp.watch(config.watch.img, ['image:build']);
});