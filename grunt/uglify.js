var grunt = require("grunt");

module.exports.tasks = {
    uglify: {
        options: {
            sourceMap: true,
            banner: grunt.file.read('LICENSE')
        },

        izi: {
            files: {
                "dist/izi-js.min.js": "dist/izi-js.js"
            }
        }
    }
};