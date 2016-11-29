"use strict";

var gulp = require('gulp'),
	imagemin = require('gulp-imagemin'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload,
	pngquant = require('imagemin-pngquant'),
	config = require('../config');

gulp.task('image:build', function () {
	gulp.src(config.src.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(config.build.img))
		.pipe(reload({stream: true}));
});