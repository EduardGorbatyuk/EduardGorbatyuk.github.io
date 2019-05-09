const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');

var paths = {
  sass: {
    src: './dev/scss/**/*.{scss,sass}',
    dist: './dist/*.html',
    opts: {
    }
  }
};

gulp.task('scss', function () {
    return gulp
    .src('dev/scss/**/*.scss')
    .pipe(sass())
    .pipe(
        autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {
            cascade: true
        })
    )
    .pipe(cssnano())
    .pipe(gulp.dest('public/stylesheets'))
});

gulp.task('watch:styles', function () {
  gulp.watch(paths.sass.src, gulp.series('scss'));
});

gulp.task('watch', gulp.series('scss',
  gulp.parallel('watch:styles')
));

gulp.task('default', gulp.series('scss', 
  gulp.parallel('watch:styles')
));