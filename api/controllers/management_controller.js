'use strict';

var util = require('util');
var model = require('../model/model.js');
const thinkagain = require('thinkagain')();
var r = thinkagain.r;

module.exports = {
    getProjects,
    getProject,
    createProject,
    modifyProject,
    deleteProject,
    /*getDirectories,
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
    deleteComment */
}

function getProjects(req, res, next) {
    r.db("WorkPlanner").table("Projects").run().then(
        function(result) {
            console.log(JSON.stringify(result));
            res.json(result);
        }
    );
}

function getProject(req, res, next) {
    r.db("WorkPlanner").table("Projects")
        .get(req.swagger.params.id.value).merge(function(project) {
            return {
                'directories': r.db("WorkPlanner").table("Directories").filter({ idProject: project('id') }).coerceTo('array')
            };
        })
        .run().then(
            function(result) {
                console.log(JSON.stringify(result));
                res.json(result);
            });
}

function createProject(req, res, next) {
    r.db("WorkPlanner").table("Projects").insert()
        .run().then(
            function(result) {
                res.json();
            });
}

function modifyProject(req, res, next) {
    res.json();
}

function deleteProject(req, res, next) {
    res.json();
}