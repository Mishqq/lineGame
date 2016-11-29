"use strict";

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	babel = require('gulp-babel'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload,
	ngAnnotate = require('gulp-ng-annotate'),
	config = require('../config');

gulp.task('js:vendor', () => {
	gulp.src([
		'./src/libs/require.js',
		'./src/libs/jquery-3.1.1.min.js',
		'./node_modules/jquery-modal/jquery.modal.min.js'
		// './src/libs/jquery.validate.min.js',
		// './src/libs/additional-methods.min.js',
		// './src/libs/localization/messages_ru.min.js'
	])
	.pipe(concat('build/js/vendor.js'))
	.pipe(gulp.dest('.'))
});

gulp.task('js:build', function () {
	return gulp.src(config.src.js)
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(concat('app.js'))
	.pipe(sourcemaps.init())
	.pipe(uglify())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(config.build.js))
	.pipe(reload({stream: true}));
});

gulp.task('js:prod', function () {
	return gulp.src(config.src.js)
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(config.build.js))
		.pipe(reload({stream: true}));
});