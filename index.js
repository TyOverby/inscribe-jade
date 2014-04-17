var jade = require("jade");
var mkd = require("markdown").markdown;
var fs = require('fs');

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

    blog['_posts_'].forEach(function (post){
        compilePost(blog, post, jadeFn);
    });
}

function compilePost(blog, post, jadeFn) {
    var loc = post['_file_'].slice(0,post['_file_'].lastIndexOf("."));
    console.log(loc);
    var compiled = jadeFn({
        post: post,
        blog: blog,
        content: mkd.toHTML(post['_contents_'])
    });

    fs.writeFile(loc + ".html", compiled, function (err) {
        if (err) throw err;
    });
}