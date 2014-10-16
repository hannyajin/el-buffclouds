var gulp = require('gulp'),
    less = require('gulp-less'),
    inject = require('gulp-inject'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    addsrc = require('gulp-add-src'),
    changed = require('gulp-changed');

gulp.task('less', function(cb) {
  try {
  gulp.src('./public/css/*.less')
      .pipe(less())
      .pipe(gulp.dest('./public/css'));

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
      .pipe(concat(style.css))
      .pipe(gulp.dest('./public/css'));
});

gulp.task('images', function() {
  var src = './public/images/*',
      dst = './dist/public/images';

  return gulp.src(src)
          .pipe(changed(dst))
          .pipe(imagemin())
          .pipe(gulp.dest(dst));
});

