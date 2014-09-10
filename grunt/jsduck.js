module.exports.tasks = {
    jsduck: {
        main: {
            // source paths with your code
            src: [
                'ext-4.1.1/src',
                'project1/js',
                'project2/**/*.js'  // globbing supported!
            ],

            // docs output dir
            dest: 'docs',

            // extra options
            options: {
                'builtin-classes': true,
                'warnings': ['-no_doc', '-dup_member', '-link_ambiguous'],
                'external': ['XMLHttpRequest']
            }
        }
    }
};
