var gulp = require('gulp'),
    less = require('gulp-less'),
    inject = require('gulp-inject'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    addsrc = require('gulp-add-src'),
    changed = require('gulp-changed'),
    mincss = require('gulp-minify-css'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber');

gulp.task('less', function(cb) {
  try {
  gulp.src('./public/css/*.less')
      .pipe(plumber())
      .pipe(less())
      .pipe(gulp.dest('./public/css'))
      .pipe(livereload());

  } catch (err) {
    cb(err);
    return;
  }

  cb();
});

gulp.task('vendor-js', function(cb) {
  var src = './public/js/vendor/*.js',
      dst = './public/js';

  try {
  gulp.src(src)
      .pipe(concat('0_vendor.js'))
      .pipe(gulp.dest(dst));
    } catch (err) {
      cb(err);
      return;
    }

  cb();
})

gulp.task('js', ['vendor-js'], function() {
  gulp.src('./public/js/*.js')
      .pipe(concat('main.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/public/js'));
});

gulp.task('css', ['less'], function() {
  gulp.src('./public/css/*.css')
      .pipe(concat('styles.min.css'))
      .pipe(mincss())
      .pipe(gulp.dest('./dist/public/css'));
});

gulp.task('images', function() {
  var src = './public/images/*',
      dst = './dist/public/images';

  return gulp.src(src)
          .pipe(changed(dst))
          .pipe(imagemin())
          .pipe(gulp.dest(dst));
});

// watch
gulp.task('watch', function() {
  gulp.watch('public/css/*.less', ['less']);
});

//default
gulp.task('default', ['watch']);