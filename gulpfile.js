var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var webpack = require('webpack-stream');
// Load plugins
var $ = require('gulp-load-plugins')();

// css task
gulp.task('css',function(){
    return gulp.src('src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle:'compressed'})).on('error',sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

// js task
gulp.task('js', function(){
	return gulp.src('src/**/*.js')
            .pipe(sourcemaps.init())
            .pipe(babel({
                presets: ['env']
            }))
            .pipe(webpack())
            .pipe(uglify())
            .pipe(concat('main.js'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/js'))
            .pipe(browserSync.stream());
});

//image copy and optimize task
gulp.task('images',function(){
    return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
});

//file copy tak
gulp.task('copy',function(){
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

//browsersync for auto refresh
gulp.task('browserSync',function(){
    browserSync.init({
        server: {
            baseDir:'dist'
        }
    })
});

gulp.task('watch',['browserSync','css','js'],function(){
    gulp.watch('src/sass/**/*.scss',['css']);
    gulp.watch('src/js/*.js',['js']);
    gulp.watch('src/*.html',['copy']);
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src(['node_modules/font-awesome/fonts/fontawesome-webfont.*'])
            .pipe(gulp.dest('dist/fonts/'));
});

// Clean
gulp.task('clean', function () {
    return gulp.src(['dist/css', 'dist/js', 'dist/images', 'dist/fonts'], { read: false }).pipe($.clean());
});

// Build
gulp.task('build', ['copy', 'images', 'js', 'fonts', 'css']);

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});