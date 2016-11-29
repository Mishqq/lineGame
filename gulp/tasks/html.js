"use strict";

var gulp = require('gulp'),
	rigger = require('gulp-rigger'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload,
	config = require('../config');

gulp.task('html:build', function () {
	gulp.src(config.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(config.build.html))
		.pipe(reload({stream: true}));
});