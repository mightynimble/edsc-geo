var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    del         = require('del'),
    coffee      = require('gulp-coffee'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat');

gulp.task('compass', function() {
  return gulp.src('./src/stylesheets/**/*.{scss,sass}')
    .pipe($.plumber())
    .pipe($.compass({
      css: 'dist/stylesheets',
      sass: 'src/stylesheets'
    }))
    .pipe(gulp.dest('dist/stylesheets'));
});

gulp.task('js', ['coffee'], function(){
  return gulp.src([
        'src/scripts/namespaces.js',
        'dist/js/latlng.js.js',
        'dist/js/coordinate.js.js',
        'dist/js/arc.js.js',
        'dist/js/geoutil.js.js',
        'dist/js/spherical_polygon.js.js'
      ])
    .pipe(uglify())
    .pipe(concat('divide-polygon.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('coffee', function() {
  return gulp.src('src/scripts/*.js.coffee')
      .pipe(coffee())
      .pipe(gulp.dest('./dist/js/'));
});

gulp.task('clean', function(cb) {
  del('./dist', cb);
});

gulp.task('images', function() {
  return gulp.src('./src/images/**/*')
    .pipe($.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./dist/images'))
})

gulp.task('templates', function() {
  return gulp.src('src/**/*.html')
    .pipe($.plumber())
    .pipe( gulp.dest('dist/') )
});

gulp.task('build', ['compass', 'js', 'templates', 'images']);

gulp.task('default', ['build']);
