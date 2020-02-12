'use strict';

var util = require('util');
var model = require('../model/model.js');

module.exports = {
    getProjects,
    getProject,
    createProject,
    modifyProject,
    deleteProject,
    getDirectories,
    getDirectory,
    createDirectory,
    modifyDirectory,
    deleteDirectory,
    getIssues,
    getIssue,
    createIssue,
    modifyIssue,
    deleteIssue,
    createComment,
    modifyComment,
    deleteComment
}

function getProjects(res, req, next) {
    r.db("WorkPlanner").table("Projects").run.then(
        function(result) {
            res.json(result);
        }
    );
}

function getProject(res, req, next) {
    r.db("WorkPlanner").table("Projects")
        .get(req.swagger.operation.getParameter('id').value(req).value)
        .run().then(
            function(result) {
                res.json(result);
            });
}

function createProject(res, req, next) {
    r.db("WorkPlanner").table("Projects").insert(req.body)
        .run().then(
            function(result) {
                res.json();
            });
}

function modifyProject(res, req, next) {
    res.json();
}

function deleteProject(res, req, next) {
    res.json();
}