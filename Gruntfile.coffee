module.exports = (grunt) ->
    @loadNpmTasks('grunt-contrib-jshint')
    @loadNpmTasks('grunt-contrib-watch')

    @initConfig
        jshint:
            all: [ 'lib/*.js' ]
            options:
                jshintrc: '.jshintrc'

        watch:
            all:
                files: ['lib/**.js', 'test/*/*']
                tasks: ['test']

    @registerTask 'default', ['test']
    @registerTask 'build', ['jshint']
    @registerTask 'test', ['build']
