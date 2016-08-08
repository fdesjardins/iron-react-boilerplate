const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const del = require('del')
const webpack = require('webpack-stream')

const webpackConfig = require('./webpack.config')


gulp.task('clean', () => del.sync('public/**'))

gulp.task('eslint', () => {
  return gulp.src([
    '*.js',
    '**/*.js',
    '!node_modules/**'
  ])
    .pipe(plugins.eslint({
      configFile: '.eslintrc.json'
    }))
    .pipe(plugins.eslint.format())
})

gulp.task('webpack', () => {
	return gulp.src('client/scripts/main.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('public/js'))
})

gulp.task('styles', () => {

})

gulp.task('rust', () => {

})

gulp.task('build', ['clean', 'webpack', 'styles', 'rust'])

gulp.task('watch', (done) => {
	gulp.watch('client/scripts/**/*.js', ['webpack'])
	gulp.watch('client/{styles,scripts}/**/*.css', ['styles'])
	gulp.watch('server/**/*.rs', ['rust'])

	plugins.nodemon({
    exec: 'target/**/server',
    watch: ['target/**/server']
	})

	done()
})

gulp.task('test:server', () => {

})

gulp.task('test:client', () => {

})

gulp.task('test', ['test:server', 'test:client'])

gulp.task('default', ['build', 'watch'])
