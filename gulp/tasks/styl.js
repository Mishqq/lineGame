"use strict";

var gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	cssmin = require('gulp-minify-css'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload,
	sass = require('gulp-sass'),
	spritesmith = require('gulp.spritesmith'),
	config = require('../config');

gulp.task('style:vendor', () => {
	gulp.src([
		'./src/libs/normalize.css'
	])
	.pipe(concat('build/css/vendor.css'))
	.pipe(cssmin())
	.pipe(gulp.dest('.'))
});

gulp.task('sprite', ()=>{
	let spriteData = gulp.src('./src/images/*.png').pipe(spritesmith({
		imgName: 'sprite.png',
		imgPath: '../images/sprite.png',
		cssName: '_sprite.sass'
	}));
	spriteData.img.pipe(gulp.dest('./build/images/')); // путь, куда сохраняем картинку
	spriteData.css.pipe(gulp.dest('./src/style/helpers')); // путь, куда сохраняем стили
});

gulp.task('style:build', ['sprite'], ()=>{
	gulp.src(config.src.style)
		.pipe(sourcemaps.init())
		.pipe(sass(
			{outputStyle: 'compressed'}
		).on('error', sass.logError))
		.pipe(concat('build/css/app.css'))
		.pipe(prefixer())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('.'))
		.pipe(reload({stream: true}));
});

gulp.task('style:prod', ['sprite'], ()=>{
	gulp.src(config.src.style)
		.pipe(sass(
			{outputStyle: 'compressed'}
		).on('error', sass.logError))
		.pipe(concat('build/css/app.min.css'))
		.pipe(prefixer())
		.pipe(gulp.dest('.'))
		.pipe(reload({stream: true}));
});