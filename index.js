var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var jade = require('metalsmith-jade');
var collections = require('metalsmith-collections');
var beautify = require('metalsmith-beautify');
var formatcheck = require('metalsmith-formatcheck');
var permalinks = require('metalsmith-permalinks');
var fileMetadata = require('metalsmith-filemetadata');
var pagination = require('metalsmith-pagination');
var env = require('metalsmith-env');
var excerptor = require('metalsmith-excerptor');

var perPage = 3;

function trace(){
  return function trace(files, metalsmith, done) {
    done();
  };
}

Metalsmith(__dirname)
    .use(env())
    .use(markdown({
        gfm: true
    }))
    .use(excerptor({
        maxLength: 300,
        keepImageTag: false,
        ellipsis: '&hellip;'
    }))
    .use(collections({
        releases: {
            pattern: 'data/entries/release/*.*',
            sortBy: 'number',
            reverse: true
        }
    }))
    .use(fileMetadata([
        {
            pattern: 'data/entries/release/*.*',
            metadata: {
                layout: 'release.jade'
            }
        }
    ]))
    .use(permalinks({
        relative: false,
        linksets: [
            {
                match: {collection: 'releases'},
                pattern: ':slug'
            }
        ]
    }))
    .use(pagination({
        'collections.releases': {
            perPage: perPage,
            layout: 'page.jade',
            first: 'index.html',
            noPageOne: true,
            path: ':name/index.html',
            groupBy: function(page) {
                var mod = Math.floor(page.number / perPage);
                return (mod * perPage) + '-' + (((mod + 1) * perPage) - 1);
            }
        }
    }))
    .use(jade({
        pretty: true,
        useMetadata: true
    }))
    .use(layouts({
        engine: 'jade',
        pretty: true,
        default: 'layout.jade',
        directory: './layouts',

    }))
    .use(beautify({
        css: false,
        js: false,
        html: {
            indent_size: 2,
            indent_char: ' ',
            indent_with_tabs: false,
            wrap_line_length: 0
        }
    }))
    .use(trace())
    .build(function (err) {
        if (err) {
            console.error(err);
            return;
        }
    });
