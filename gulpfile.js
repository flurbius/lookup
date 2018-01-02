var gulp = require('gulp');
var webpack = require('webpack-stream');
var uglify = require('gulp-uglify');

var gulp = require('gulp');

gulp.task('default', () => {
 //console.log('No default task set.')
 return gulp.src('./src/*.*')
           .pipe(webpack())
});


gulp.task('copy-html', () => {
    return gulp.src('./src/**/*.html')
               .pipe(gulp.dest('./dist'))
});
  
  gulp.task('copy-js', () => {
    return gulp.src('./src/**/*.js')
               .pipe(uglify())
               .pipe(gulp.dest('./dist'))
  });
  
  gulp.task('copy-css',  () => {
    return gulp.src('./src/**/*.css')
               .pipe(gulp.dest('./dist'))
  });
  
gulp.task('copy', [ 'copy-html', 'copy-js', 'copy-css' ]); 

gulp.task('transpile',  () => {
    return gulp.src('./src/**/*.ts')
      .pipe()
  });
  
  gulp.task('build',['copy', 'transpile' ]);
gulp.task('run',  () => {
    gulp.src('./dist/**/*.js') 
    .pipe(uglify())
    .pipe(gulp.dest('path/to/destination'));
});