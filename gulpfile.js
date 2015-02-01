var gulp = require('gulp'),
	del = require('del'),
	merge = require('merge-stream'),
	plugins = require('gulp-load-plugins')(),
    mochaPhantomJS = require('gulp-mocha-phantomjs')

var js_custom = [
	'src/metsuri.js'
]

var processExitOnError = true

var onError = function (err) {
    console.log('\033[91m' + err + '\033[0m')
    processExitOnError ? process.exit(1) : this.emit('end')
}

gulp.task('clean', function (cb) { del(['build'], cb) })

gulp.task('build', ['clean'], function () {
	var jsonRules = require('./.jshintrc.json')
	jsonRules.lookup = false;

    var bSrc =  gulp.src(js_custom)
        .pipe(plugins.plumber({
            errorHandler: onError
        }))
        .pipe(plugins.jshint(jsonRules))
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.jshint.reporter('fail'))
        .pipe(plugins.traceur())
        .pipe(plugins.concat('metsuri.js'))
        .pipe(gulp.dest('build'))

    jsonRules.predef = jsonRules.predef.concat('Metsuri','describe','assert','it')

    var bTest = gulp.src('test/unit/**/*.js')
        .pipe(plugins.plumber({
            errorHandler: onError
        }))
        .pipe(plugins.jshint(jsonRules))
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.jshint.reporter('fail'))
        .pipe(plugins.traceur())
        .pipe(plugins.concat('test.js'))
        .pipe(gulp.dest('build'))

    return merge(bSrc,bTest)
})

gulp.task('test', ['build'], function () {
    return gulp.src('test/runner.html')
	    .pipe(plugins.plumber({
	        errorHandler: onError
	    })).pipe(mochaPhantomJS({
	        mocha: {},
	        phantomjs: {
	            settings: {
	                localToRemoteUrlAccessEnabled: true
	            }
	        }
	    }))
})

gulp.task('default', function () {
    processExitOnError = false

    plugins.watch(['src/**/*.js', 'test/**/*.js'], function () {
        gulp.start('test')
    })
});