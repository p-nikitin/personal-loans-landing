const {src, dest, series, watch, parallel}  = require('gulp');
const connect = require('gulp-connect');
const pug = require('gulp-pug');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

const server = () => {
    return connect.server({
        root: 'dest',
        livereload: true,
        port: 8000
    })
};

const pages = () => {
    return src('src/pages/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(dest('dest'))
        .pipe(connect.reload());
};

const scripts = () => {
    return src('src/scripts/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest('dest/assets/script'))
        .pipe(connect.reload());
};

const styles = () => {
    return src('src/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(dest('dest/assets/style'))
        .pipe(connect.reload());
};

const webpConvert = () => {
    return src(['src/images/**/*.jpg', 'src/images/**/.png'])
        .pipe(webp())
        .pipe(dest('dest/assets/images'))
}

const images = () => {
    return src('src/images/**')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(dest('dest/assets/images'))
        .pipe(connect.reload());
};

const libs = () => {
    return src('src/libs/**')
        .pipe(dest('dest/assets/libs'))
        .pipe(connect.reload());
};

const watcher = () => {
    watch('src/pages/**/*.pug', pages);
    watch('src/scripts/*.js', scripts);
    watch('src/styles/**/*.scss', styles);
    watch('src/images/**', series(webpConvert, images));
    watch('src/libs/**', libs);
};

exports.default = parallel(libs, pages, scripts, styles, series(webpConvert, images), server, watcher);