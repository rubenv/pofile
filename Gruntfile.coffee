module.exports = (grunt) ->
    @loadNpmTasks('grunt-contrib-jshint')
    @loadNpmTasks('grunt-contrib-watch')
    @loadNpmTasks('grunt-mocha-cli')

    @initConfig
        jshint:
            all: [ 'lib/*.js', 'test/*.js' ]
            options:
                jshintrc: '.jshintrc'

        watch:
            all:
                options:
                    atBegin: true
                files: ['lib/**.js', 'test/*{,/*}']
                tasks: ['test']

        mochacli:
            options:
                files: 'test/*.js'
            spec:
                options:
                    reporter: 'spec'

    @registerTask 'default', ['test']
    @registerTask 'build', ['jshint']
    @registerTask 'test', ['build', 'mochacli']
