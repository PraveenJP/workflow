var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify')
    compass = require('gulp-compass'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-minify-css'),
    htmlmin = require('gulp-minify-html'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    connect = require('gulp-connect');

var jsSources,
	cssSources,
	htmlSources,
	imageSources,
	outputDir,
	env;

env = process.env.NODE_ENV || 'development';

if(env === 'development'){
	outputDir = 'builds/development/';
}else{
	outputDir = 'builds/production/';
}

jsSources = [
	'components/script/script.js'	
];

cssSources = [
	'components/style/animate.css',
	'components/style/grid.css',
	'components/style/ionicons.min.css',
	'components/style/normalize.css',
	'components/style/queries.css',
	'components/style/style.css'
];

htmlSources = [
	outputDir+'*.html'
];

imageSources = {
	img:'builds/development/img/*.*',
	cssimg:'builds/development/css/img/*.*'
};

gulp.task('log',function(){
	gutil.log('Workflows are awesome');
});

gulp.task('js',function(){
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.on('error',gutil.log)
		.pipe(gulpif(env === 'production',uglify()))
		.pipe(gulp.dest(outputDir+'js/'))
		.pipe(connect.reload())
});

gulp.task('css',function(){
	gulp.src(cssSources)
		.pipe(concat('style.css'))
		.pipe(gulpif(env === 'production',cssmin()))
		.pipe(gulp.dest(outputDir+'css/'))
		.pipe(connect.reload())
});

gulp.task('html',function(){
	gulp.src('builds/development/*.html')
		.pipe(gulpif(env === 'production',htmlmin()))
		.pipe(gulpif(env === 'production',gulp.dest(outputDir)))
		.pipe(connect.reload())
});

gulp.task('fonts',function(){
	gulp.src('builds/development/fonts/*.*')
		.pipe(gulpif(env === 'production',gulp.dest(outputDir+'fonts')))
		.pipe(connect.reload())
});

gulp.task('image',function(){
	gulp.src(imageSources.img)
		.pipe(gulpif(env === 'production',imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use:[pngcrush()]
		})))
		.pipe(gulpif(env === 'production',gulp.dest(outputDir+'img')))
		.pipe(connect.reload())
});

gulp.task('cssimage',function(){
	gulp.src(imageSources.cssimg)
		.pipe(gulpif(env === 'production',imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use:[pngcrush()]
		})))
		.pipe(gulpif(env === 'production',gulp.dest(outputDir+'css/img')))
		.pipe(connect.reload())
});

gulp.task('images',function(){
	gulp.src()
})

gulp.task('watch',function(){
	gulp.watch(jsSources, ['js']);
	gulp.watch(cssSources, ['css']);
	gulp.watch('builds/development/*.html', ['html'])
	gulp.watch(imageSources.img, ['image'])
	gulp.watch(imageSources.cssimg, ['cssimage'])
	gulp.watch('builds/development/fonts/*.*', ['fonts'])
});

gulp.task('connect',function(){
	connect.server({
		root:outputDir,
		livereload: true
	});
});

gulp.task('default', ['html','js','css','image','fonts','cssimage','connect','watch']);