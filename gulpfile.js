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

gulp.task('deploy', function () {
    var folder = publicpath;
    gulp.src([
        "src/config.js",
        "src/config.example.js",
        "src/iconfont.eot",
        "src/jquery.fileupload.js"
    ]).pipe(gulp.dest("./dist"))
});

gulp.task('report', function () {
    var folder = publicpath;
    rimraf(folder + "/*", fs, function () {
        gulp.src("./dist/**/*")
            .pipe(gulpIgnore.exclude("config.js"))
            .pipe(gulp.dest(folder))
    });
});