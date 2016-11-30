"use strict";

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	babel = require('gulp-babel'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload,
	browserify = require('gulp-browserify'),
	es6transpiler = require('gulp-es6-transpiler'),
	ngAnnotate = require('gulp-ng-annotate'),
	templateCache = require('gulp-angular-templatecache'),
	config = require('../config');

gulp.task('js:vendor', () => {
	gulp.src([
		'node_modules/angular/angular.min.js',
		'node_modules/angular-animate/angular-animate.min.js',
		'node_modules/angular-aria/angular-aria.min.js',
		'node_modules/angular-messages/angular-messages.min.js',
		'node_modules/angular-material/angular-material.min.js',
		'node_modules/angular-ui-router/release/angular-ui-router.min.js'
	])
	.pipe(concat('build/js/vendor.js'))
	.pipe(gulp.dest('.'))
});

gulp.task('templateCache', function () {
	return gulp.src(config.src.html)
		.pipe(templateCache('templates.js', {module : 'app'}))
		.pipe(gulp.dest('./src/templates'));
});

gulp.task('js:build', ['templateCache'], function () {
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