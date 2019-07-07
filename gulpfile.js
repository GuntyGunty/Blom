var  gulp = require('gulp');
var  plumber = require('gulp-plumber');
var  pug = require('gulp-pug');
var  less = require('gulp-less');
var  minify = require("gulp-csso");
var rename = require("gulp-rename");
var  cssbeautify = require('gulp-cssbeautify');
var  postcss = require("gulp-postcss");
var  autoprefixer = require("autoprefixer");
var  mqpacker = require("css-mqpacker");
var  svgSprite = require('gulp-svg-sprites');
var  cheerio = require('gulp-cheerio');
var  replace = require('gulp-replace');
var  browserSync = require('browser-sync');
var  watch = require('gulp-watch');
var  runSequence = require('run-sequence');

gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		}
	})
});

gulp.task('pug', function() {
	return gulp.src('app/pug/pages/*.pug')
	.pipe(pug({pretty: true}))
	.pipe(gulp.dest('dist/'))
	.pipe(browserSync.reload({stream: true}))
});


gulp.task('less', function() {
	return gulp.src('app/styles/style.less')
	.pipe(plumber())
	.pipe(less())
	.pipe(postcss([
		autoprefixer({overrideBrowserslist: [
			"last 1 version",
			"last 2 Chrome versions",
			"last 2 Firefox versions",
			"last 2 Opera versions",
			"last 2 Edge versions",
			"IE 11"
		]}),
		mqpacker({
			sort: true
		})
	]))
	.pipe(cssbeautify())
	.pipe(minify())
	.pipe(gulp.dest("dist/css"))
	.pipe(browserSync.reload({stream: true}))
});


gulp.task('js', function() {
	return gulp.src('app/js/**/*.js')
	.pipe(gulp.dest('dist/js/'))
	.pipe(browserSync.reload({stream: true}))
});


gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});


gulp.task('svg', function () {
	return gulp.src('app/icons/*.svg')
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[style]').removeAttr('style');
			}
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
				mode: "symbols",
				preview: false,
				selector: "%f",
				svg: {
					symbols: 'svg_sprite.html'
				}
			}
		))
		.pipe(gulp.dest('dist/icons/'));
});



gulp.task('watch', ['browserSync', 'pug', 'less',  'fonts','js', 'svg'], function() {
	gulp.watch('app/pug/pages/**/*.pug',  ['pug']);
	gulp.watch('app/styles/style.less',  ['less']);
	gulp.watch('app/fonts/**/*',  ['fonts']);
	gulp.watch('app/js/**/*.js', ['js']);
	gulp.watch('app/icons/*.svg', ['svg']);
});



gulp.task('default', function(callback) {
  	runSequence(['pug', 'less', 'js', 'fonts', 'svg', 'browserSync', 'watch'],
		callback
	)
});
