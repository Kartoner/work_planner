'use strict';

var fs = require('fs');
var path = require('path');

module.exports = {
    homepage: homepage,
    projectView: projectView,
    projectModify: projectModify,
    directoryView,
    directoryView,
    directoryModify: directoryModify,
    issueView: issueView,
    issueModify: issueModify,
    commentModify: commentModify
};

function homepage(req, res, next) {
    let file = path.join(__dirname, "..", "..", "html", "homepage.html");
    let contents = fs.readFileSync(file, 'utf8');
    res.send(contents);
}

function projectView(req, res, next) {
    let file = path.join(__dirname, "..", "..", "html", "project.html");
    let contents = fs.readFileSync(file, 'utf8');
    res.send(contents);
}

function projectModify(req, res, next) {
    let file = path.join(__dirname, "..", "..", "html", "projectModify.html");
    let contents = fs.readFileSync(file, 'utf8');
    res.send(contents);
}

function directoryView(req, res, next) {
    let file = path.join(__dirname, "..", "..", "html", "directory.html");
    let contents = fs.readFileSync(file, 'utf8');
    res.send(contents);
}

function directoryModify(req, res, next) {
    let file = path.join(__dirname, "..", "..", "html", "directoryModify.html");
    let contents = fs.readFileSync(file, 'utf8');
    res.send(contents);
}

function issueView(req, res, next) {
    let file = path.join(__dirname, "..", "..", "html", "issue.html");
    let contents = fs.readFileSync(file, 'utf8');
    res.send(contents);
}

function issueModify(req, res, next) {
    let file = path.join(__dirname, "..", "..", "html", "issueModify.html");
    let contents = fs.readFileSync(file, 'utf8');
    res.send(contents);
}

function commentModify(req, res, next) {
    let file = path.join(__dirname, "..", "..", "html", "commentModify.html");
    let contents = fs.readFileSync(file, 'utf8');
    res.send(contents);
}