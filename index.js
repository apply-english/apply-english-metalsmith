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

function trace(){
  return function trace(files, metalsmith, done) {
    done();
  };
}

Metalsmith(__dirname)
    .use(markdown({
        gfm: true
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
            perPage: 3,
            layout: 'page.jade',
            first: 'index.html',
            noPageOne: true,
            path: ':num/index.html'
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
    //.use(formatcheck())
    .build(function (err) {
        if (err) {
            console.error(err);
            return;
        }
    });
