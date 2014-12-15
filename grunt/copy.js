var grunt = require("grunt");

module.exports.tasks = {
    copy: {
        pom: {
            options: {
                /**
                 * Replace all <%= ... %> entries within pom.template
                 */
                process: function (content) {
                    return grunt.config.process(content);
                }
            },

            files: [
                {
                    src: 'webjar/pom.template',
                    dest: 'webjar/pom.xml'
                }
            ]
        }
    }
};