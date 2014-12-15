module.exports = function (grunt) {

    /**
     * Load all `grunt-*` tasks from `package.json`
     */
    require('load-grunt-tasks')(grunt);

    /**
     * Load DEFAULT configuration for tasks from directory `grunt/*.js`
     */
    var config = require('load-grunt-configs')(grunt, {config: {src: "grunt/*.js"}});
    config.pkg = grunt.file.readJSON('package.json');

    /**
     * Initialize Grunt configuration
     */
    grunt.initConfig(config);

    grunt.registerTask('default', [
        'dist',
        'test'
    ]);

    grunt.registerTask('dist', [
        'clear',
        'compile'
    ]);

    grunt.registerTask('clear', [
        'clean'
    ]);

    grunt.registerTask('compile', [
        'concat_in_order',
        'preprocessor',
        'uglify'
    ]);

    grunt.registerTask('dev', [
        'watch'
    ]);

    grunt.registerTask('test', [
        'karma:all'
    ]);

    grunt.registerTask('test-fast', [
        'karma:phantomjs'
    ]);

    grunt.registerTask('deploy', [
        'default'
    ]);

    grunt.registerTask('maven-install', [
        'clean:webjar',
        'copy:pom',
        'exec:maven-install'
    ]);

    grunt.registerTask('maven-deploy', [
        'clean:webjar',
        'copy:pom',
        'exec:maven-deploy'
    ]);
};