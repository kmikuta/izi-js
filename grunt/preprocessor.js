module.exports.tasks = {
    preprocessor: {
        izi: {
            options: {
                context: {
                    DEBUG: false
                }
            },
            files: {
                "dist/izi-js.js": "dist/izi-js-debug.js"
            }
        }
    }
};