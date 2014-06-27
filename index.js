#!/usr/bin/env node
var jade = require("jade");
var mkd = require("marked");
var fs = require('fs');
var hi = require('highlight.js');

mkd.setOptions({
    highlight: function (code, lang) {
        if(lang){
            return hi.highlight(lang, code).value;
        } else {
            return code;
        }
    }
});

main();
function main() {
    var fileContents = fs.readFileSync("./bundle.json");
    var jadeTemplate = fs.readFileSync("./post.jade");
    var blog = JSON.parse(fileContents, jadeTemplate);

    var jadeFn = jade.compile(jadeTemplate, {
        'filename': './post.jade',
        'pretty': true,
        'self': false,
        'debug': false,
        'compileDebug': false,
    });

    blog._posts_.forEach(function (post){
        compilePost(blog, post, jadeFn, blog._outDir_);
    });
}

/*
 * Compiles a blog post.
 * `blog` is the JSON form of the entire bundle.json file.
 * `post` is the JSON form of the post that is being compiled.
 * `jadeFn` is the jade compile function that is used to generate
 *          the output.
 */
function compilePost(blog, post, jadeFn, outDir) {
    var loc = post._file_.slice(0,post._file_.lastIndexOf("."));
    var compiled = jadeFn({
        post: post,
        blog: blog,
        content: mkd(post._contents_)
    });

    fs.writeFile(outDir + "/" + loc + ".html", compiled, function (err) {
        if (err) throw err;
    });
}
