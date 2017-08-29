const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const selectornot = require("postcss-selector-not");
const cssImageSet = require('postcss-image-set-polyfill');
const quantityQueries = require('postcss-quantity-queries');
const replace = require('gulp-replace');
const gulpIgnore = require('gulp-ignore');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');

let publicpath = "/Users/andy/projects/admin.ums.aunbox.cn.dev";

gulp.task('sass', function () {
    var plugins = [
        quantityQueries(),
        cssImageSet(),
        selectornot(),
        autoprefixer({
            browsers: ['IE >= 9']
        })
    ];
	sass('src/**/*.scss')
		.on('error', sass.logError)
        .pipe(postcss(plugins))
        .pipe(replace('Symbol(GANG)', '\\'))
		.pipe(gulp.dest('src/assets/css'))
});

gulp.task('sass:watch', function () {
    gulp.watch('src/**/*.scss', ['sass']);
});

gulp.task('test', function () {
    return gulp.src('test/module/*.js')
        .pipe(babel(
            {
                presets: ['env']
            }
        ))
        .pipe(gulp.dest("./test"))
});