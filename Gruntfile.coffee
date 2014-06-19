module.exports = (grunt) ->
    @loadNpmTasks('grunt-browserify')
    @loadNpmTasks('grunt-bump')
    @loadNpmTasks('grunt-contrib-clean')
    @loadNpmTasks('grunt-contrib-jshint')
    @loadNpmTasks('grunt-contrib-uglify')
    @loadNpmTasks('grunt-contrib-watch')
    @loadNpmTasks('grunt-jscs-checker')
    @loadNpmTasks('grunt-mocha-cli')

    @initConfig
        clean:
            dist: ['dist']

        jshint:
            all: [ 'lib/*.js', 'test/*.js' ]
            options:
                jshintrc: '.jshintrc'

        jscs:
            src:
                options:
                    config: '.jscs.json'
                files:
                    src: [ 'lib/*.js', 'test/*.js' ]

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

        browserify:
            dist:
                files:
                    'dist/pofile.js': ['lib/po.js']
                options:
                    alias: 'lib/po.js:pofile'

        uglify:
            dist:
                files:
                    'dist/pofile.min.js': 'dist/pofile.js'

        bump:
            options:
                files: ['package.json', 'bower.json']
                commitFiles: ['-a']
                pushTo: 'origin'

    @registerTask 'default', ['test']
    @registerTask 'build', ['clean', 'jshint', 'jscs', 'browserify', 'uglify']
    @registerTask 'test', ['build', 'mochacli']
