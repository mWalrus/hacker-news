import {build} from 'aurelia-cli';
import gulp from 'gulp';
import project from '../aurelia.json';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssUrl from 'postcss-url';

export default function processCSS() {
  return gulp.src(project.cssProcessor.source, {sourcemaps: true})
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      postcssUrl({url: 'inline', encodeType: 'base64'}),
      cssnano()
    ]))
    .pipe(build.bundle());
}

