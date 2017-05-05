var gulp = require("gulp"),
	rename = require("gulp-rename"),
	uglify = require("gulp-uglify"),
	babel = require("gulp-babel"),
	sourceMaps = require("gulp-sourcemaps"),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer"),
	browserify = require("browserify"),
	watchify = require("watchify"),
	babel = require("babelify"),
	debug = require("gulp-debug");

/*
gulp.task("default", function() {
	gulp.src("./js/**.js/")
		.pipe(babel({ presets: ["es2015"] }))
		.pipe(uglify())
		.pipe(gulp.dest("./dist"))
		.pipe(notify( {
			message: "Build complete",
			onLast: true
		}));
});

gulp.task("watch", function() {
	gulp.watch("./js/**.js", function() {
		gulp.run("default");
	});
});
*/

//From https://gist.github.com/danharper/3ca2273125f500429945
function compile(watch) {
	var bundler = watchify(browserify('./index.js', { debug: false }).transform(babel.configure({ presets: ["es2015"]} )));

	function rebundle() {
		bundler.bundle()
			.on('error', function(err) { console.error(err); this.emit('end'); })
			.pipe(source('build.js'))
			.pipe(debug({ title: "Source: "}))
			.pipe(buffer())
			.pipe(debug({ title: "Buffer: "}))
			.pipe(gulp.dest('./build'))
			.pipe(debug({ title: "Output: "}));
	}

	if (watch) {
		bundler.on('update', function() {
			console.log('-> bundling...');
			rebundle();
		});
	}

	rebundle();
}

function watch() {
	return compile(true);
}

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch']);
