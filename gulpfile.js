// https://stackoverflow.com/a/57656078/3262054
const { series, src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

// Task 1: copy bootstap's assets to /_vendor/
function bootstrap() {
  const files = [
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/bootstrap/dist/js/bootstrap.min.js'
  ]
  return src(files).pipe(dest('backend/_vendor'))
}

// Task 2: copy jquery's assets to /_vendor/
function jquery() {
  const files = [
    'node_modules/jquery/dist/jquery.min.js'
  ]
  return src(files).pipe(dest('backend/_vendor'))
}

// Task 2: copy popperjs's assets to /_vendor/
function popperjs() {
  const files = [
    'node_modules/popper.js/dist/umd/popper.min.js',
    // 'node_modules/popper.js/dist/popper-utils.js'
  ]
  return src(files).pipe(dest('backend/_vendor'))
  // return src(files).pipe(uglify())
  //     .pipe(concat('popper.min.js'))
  //     .pipe(dest('backend/_vendor'))
}

exports.default = series(bootstrap, jquery, popperjs);
