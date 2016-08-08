const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const del = require('del')
const webpack = require('webpack-stream')
const exec = require('child_process').exec

const gulpsync = plugins.sync(gulp)

const webpackConfig = require('./webpack.config')


gulp.task('clean', () => del.sync('dist/**'))

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
    .pipe(gulp.dest('dist/public'))
})

gulp.task('styles', () => {

})

gulp.task('rust', (done) => {
  del.sync('dist/server/**/server')
  exec('cargo build', (err, stdout, stderr) => {
    console.log(stdout, stderr)
    done(err)
  })
})

gulp.task('build', ['webpack', 'styles', 'rust'])

gulp.task('watch', (done) => {
	gulp.watch('client/scripts/**/*.js', ['webpack'])
	gulp.watch('client/{styles,scripts}/**/*.css', ['styles'])
	gulp.watch('server/**/*.rs', ['rust'])

  plugins.nodemon({
    exec: 'dist/server/**/server',
    watch: 'dist/server/**/server',
    delay: 3000
	})

	done()
})

gulp.task('test:server', () => {

})

gulp.task('test:client', () => {

})

gulp.task('test', ['test:server', 'test:client'])

gulp.task('default', gulpsync.sync(['build', 'watch', 'serve']))
