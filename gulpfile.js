const gulp = require("gulp");
const del = require("del");

var distBase = "./dist";

gulp.task("clear-dist", function(cb) {
    del(distBase).then(() => {
        console.info("dist directory clearerd");
        cb()
    });
});