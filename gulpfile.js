// https://stackoverflow.com/a/57656078/3262054
const { series, src, dest } = require('gulp');

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

exports.default = series(bootstrap, jquery);
