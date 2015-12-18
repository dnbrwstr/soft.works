var gulp = require('gulp'),
  gulpIf = require('gulp-if'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  browserify = require('browserify'),
  watchify = require('watchify'),
  babelify = require('babelify'),
  express = require('express'),
  runSequence = require('run-sequence'),
  rm = require('rimraf'),
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer');

var argv = require('minimist')(process.argv.slice(2));

var buildDir = __dirname + '/dist';
var watch = false;
var production = !!argv.production;

gulp.task('clean', function (done) {
  rm(__dirname + '/dist/**', done);
});

gulp.task('files', function () {
  return gulp.src(__dirname + '/src/files/**')
    .pipe(gulp.dest(buildDir));
});

gulp.task('styles', function () {
  return gulp.src(__dirname + '/src/styles/main.styl')
    .pipe(stylus())
    .pipe(autoprefixer({
      browsers: ['last 10 versions']
    }))
    .pipe(gulp.dest(buildDir))
});

gulp.task('scripts', function () {
  var browserifyOpts = {
    entries: [__dirname + '/src/scripts/init.js'],
    cache: {},
    packageCache: {}
  };

  var babelOpts = { presets: ['es2015', "stage-0"] };

  var bundler = browserify(browserifyOpts)
    .transform(babelify, babelOpts);

  var rebundle = function () {
    return bundler
      .bundle()
      .on('error', function (e) {
        console.log(e);
      })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(gulpIf(production, uglify()))
      .pipe(gulp.dest(buildDir))
  };

  if (watch) {
    bundler = watchify(bundler);
    bundler.on('update', rebundle);
  }

  return rebundle();
});

gulp.task('build', function (done) {
  runSequence('clean', ['files', 'scripts', 'styles'], done);
});

gulp.task('watch', ['build'], function () {
  watch = true;
  runSequence('scripts');
  gulp.watch(__dirname + '/src/styles/**', ['styles']);
  gulp.watch(__dirname + '/src/files/**', ['files']);
});

gulp.task('serve', ['watch'], function () {
  var app = express();
  app.use(express.static(buildDir));
  app.listen(3000)
  console.log('Now listening on port 3000');
});
