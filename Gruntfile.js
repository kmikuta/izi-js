module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt)
  const config = require('load-grunt-configs')(grunt, {config: {src: 'grunt/*.js'}})
  config.pkg = grunt.file.readJSON('package.json')
  grunt.initConfig(config)

  grunt.registerTask('default', [
    'validate',
    'test',
    'dist'
  ])

  grunt.registerTask('dist', [
    'clear',
    'compile'
  ])

  grunt.registerTask('clear', [
    'clean'
  ])

  grunt.registerTask('compile', [
    'webpack'
  ])

  grunt.registerTask('test', [
    'mochaTest'
  ])

  grunt.registerTask('validate', [
    'tslint'
  ])

  grunt.registerTask('tslint', [
    'exec:tslint'
  ])

  grunt.registerTask('tslint-fix', [
    'exec:tslintFix'
  ])
}
