var dest = './build';
var src = './src';

var parseArgs = require('minimist');

var defaultOpts = ({
    string: ['env'],
    default: {
        env: 'home-wifi'
    }
});

var argv = parseArgs(process.argv.slice(2), defaultOpts);

module.exports = {
    browserSync: {
        server: {
            baseDir: [dest, src]
        },

        files: [
                dest + '/**',
                '!' + dest + '/**.map'
        ]
    },

    fonts: {
        src: src + '/fonts/*.*',
        dest: dest + '/fonts'
    },

    less: {
        main: src + '/less/app.less',
        src: src + '/less/**',
        dest: dest + '/css'
    },

    images: {
        src: src + '/assets/images/**',
        dest: dest + '/assets/images'
    },

    markup: {
        src: src + '/htdocs/**',
        dest: dest
    },

    props: {
        src: src + '/js/properties/' + argv.env + '/props.js',
        dest: src + '/js/properties'
    },

    browserify: {
        debug: true,
        extensions: ['.js', '.jsx'],
        bundleConfigs: [
            {
                entries: src + '/js/app.js',
                dest: dest + '/js/',
                outputName: 'app.js'
            }
        ]
    },

    core: {
        dist: dest,
        src: src
    }
};
