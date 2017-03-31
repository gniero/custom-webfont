const gulp = require("gulp");
const del = require("del");
const iconfont = require("gulp-iconfont");
const path = require("path");
const async = require("async");
const consolidate = require("gulp-consolidate");
const concat = require("gulp-concat");

var distBase = "./dist";
var svgSource = "./src/svg";
gulp.task("clear-dist", function (cb) {
   
});

gulp.task("generate-font", function (done) {
    var config = {
        fontName: 'myfont', // required 
        prependUnicode: true, // recommended option 
        formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
        normalize: true
    };

    var iconStream = gulp.src(path.join(svgSource, "*.svg"))
        .pipe(iconfont(config));

    async.parallel([
        function buildStyles(cb) {
            iconStream.on('glyphs', function (glyphs, options) {
                var consolidateStream = consolidate('lodash', {
                    glyphs: glyphs,
                    fontName: config.fontName,
                    fontPath: '../fonts/',
                    className: 's'
                });

                gulp.src('./src/templates/font-style.css')
                    .pipe(consolidateStream)
                    .pipe(concat(config.fontName + ".css"))
                    .pipe(gulp.dest(path.join(distBase, "css")))
                    .on('finish', cb);
            });
        },
        function buildDemo(cb) {
            iconStream.on('glyphs', function (glyphs, options) {
                var consolidateStream = consolidate('lodash', {
                    glyphs: glyphs,
                    fontName: config.fontName,
                    fontPath: '../fonts/',
                    className: 's'
                });

                gulp.src('./src/templates/font-demo.html')
                    .pipe(consolidateStream)
                    .pipe(concat(config.fontName + ".html"))
                    .pipe(gulp.dest(distBase))
                    .on('finish', cb);
            });
        },
        function handleFonts(cb) {
            iconStream
                .pipe(gulp.dest(path.join(distBase, "fonts")))
                .on('finish', cb);
        }
    ], done);
});

gulp.task("default", ["clear-dist", "generate-font"]);