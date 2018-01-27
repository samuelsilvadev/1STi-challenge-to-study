'use strict';

const
    runSequence = require('run-sequence'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    imageMin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create(),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    clean = require('gulp-clean'),
    autoprefixer = require('gulp-autoprefixer');

const _inputFilesScss = './sass/**/*.scss';
const _outputFilesCss = './dist/css/';

const _inputFilesJs = './js/**/*.js';
const _outputFilesJs = './dist/js/';

const _inputImages = './imgs/*';
const _outputImages = './dist/imgs/';

gulp.task('sass', () => {
    return gulp
        .src(_inputFilesScss)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(_outputFilesCss))
        .pipe(browserSync.stream());
});

gulp.task('prefixe', () => {
    gulp.src(`${_outputFilesCss}/**/*.css`)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(_outputFilesCss));
});


gulp.task('imagemin', () => {
    gulp.src(_inputImages)
        .pipe(imageMin())
        .pipe(gulp.dest(_outputImages))
});

gulp.task('serve', ['sass'], () => {

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch(_inputFilesScss, ['sass']);
    gulp.watch('*.html').on('change', browserSync.reload);
});

gulp.task('browserify', () => {
    return browserify(_inputFilesJs)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(_outputFilesJs));
});

gulp.task('babel', () =>
    gulp.src(`${_outputFilesJs}/*.js`)
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest(_outputFilesJs))
);

gulp.task('compress', (cb) => {
    pump([
        gulp.src(`${_outputFilesJs}/*.js`),
        uglify(),
        gulp.dest(_outputFilesJs)
    ],
        cb
    );
});

gulp.task('clean', () => {
    return gulp.src(`./dist/*`, { read: false })
        .pipe(clean());
});

gulp.task('build:prod', () => {
    runSequence('clean', 'browserify', 'babel', 'compress', 'imagemin', () => { });
});


gulp.task('build:dev', () => {
    runSequence('clean', 'browserify', 'imagemin', () => { });
});