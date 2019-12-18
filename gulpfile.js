var gulp       = require('gulp'),
  sass         = require('gulp-sass'),
  browserSync  = require('browser-sync'),
  concat       = require('gulp-concat'),
  cssnano      = require('gulp-cssnano'),
  rename       = require('gulp-rename'),
  del          = require('del'),
  imagemin     = require('gulp-imagemin'),
  pngquant     = require('imagemin-pngquant'),
  cache        = require('gulp-cache'),
  autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
  return gulp.src('app/sass/**/*.sass')
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: false }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('clean', function() {
  return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
    // .pipe(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'sass'], function() {

  var buildCss = gulp.src([
    'app/css/main.css',
    ])
  .pipe(gulp.dest('dist/css'))

  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
  return cache.clearAll();
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('app/sass/**/*.sass', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('default', ['watch']);