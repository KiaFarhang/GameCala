'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const nodemon = require('gulp-nodemon');

gulp.task('css-workflow', function() {
    gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(sourcemaps.write('./'))

    .pipe(gulp.dest('./dist/css/'))
});

gulp.task('js-workflow', function() {
    gulp.src(['./src/js/**/util.js', './src/js/**/script.js'])
        .pipe(concat('script.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'))
});


gulp.task('watch', function() {
    gulp.watch('./src/scss/**/*.scss', ['css-workflow']);
    gulp.watch('./src/js/**/*.js', ['js-workflow']);
});

gulp.task('nodemon', function() {
    nodemon({
            script: 'server.js',
            ext: 'js scss html',
            env: {
                'NODE_ENV': 'development'
            },
            ignore: ['dist/**/**'],
            tasks: ['css-workflow', 'js-workflow']
        })
});

gulp.task('default', ['nodemon']);
