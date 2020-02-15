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
    getDirectory,
    createDirectory,
    modifyDirectory,
    deleteDirectory,
    getIssue,
    createIssue,
    modifyIssue,
    deleteIssue,
    createComment,
    modifyComment,
    deleteComment
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
    var newProject = {
        title: req.swagger.params.title.value,
        description: req.swagger.params.description.value
    };
    r.db("WorkPlanner").table("Projects").insert(newProject)
        .run().then(
            function(result) {
                r.db("WorkPlanner").table("Projects")
                    .get(result["generated_keys"][0]).merge(function(project) {
                        return {
                            'directories': r.db("WorkPlanner").table("Directories").filter({ idProject: project('id') }).coerceTo('array')
                        };
                    })
                    .run().then(
                        function(result) {
                            console.log(JSON.stringify(result));
                            res.json(result);
                        });
            });
}

function modifyProject(req, res, next) {
    var id = req.swagger.params.id.value;
    var updatedProject = {
        title: req.swagger.params.title.value,
        description: req.swagger.params.description.value
    }
    r.db("WorkPlanner").table("Projects").get(id).update(updatedProject)
        .run().then(
            function(result) {
                r.db("WorkPlanner").table("Projects")
                    .get(id).merge(function(project) {
                        return {
                            'directories': r.db("WorkPlanner").table("Directories").filter({ idProject: project('id') }).coerceTo('array')
                        };
                    })
                    .run().then(
                        function(result2) {
                            console.log(JSON.stringify(result2));
                            res.json(result2);
                        });
            });
}

function deleteProject(req, res, next) {
    var id = req.swagger.params.id.value;
    // Delete project
    r.db("WorkPlanner").table("Projects").get(id).delete({ returnChanges: true })
        .run().then(function(result) {
            console.log(JSON.stringify(result));
            // Delete directories
            r.db("WorkPlanner").table("Directories").filter({ idProject: result["changes"][0]["old_val"]["id"] }).delete({ returnChanges: true })
                .run().then(function(result) {
                    // Delete issues
                    try {
                        result["changes"].array.forEach(element => {
                            r.db("WorkPlanner").table("Issues").filter({ idDirectory: element["old_val"]["id"] }).delete({ returnChanges: true })
                                .run().then(function(result) {
                                    // Delete comments
                                    try {
                                        result["changes"].array.forEach(element => {
                                            r.db("WorkPlanner").table("Comments").filter({ idIssue: element["old_val"]["id"] }).delete().run();
                                        });
                                    } catch (err) {
                                        console.log("No comments to delete");
                                    }
                                });
                        });
                    } catch (err) {
                        console.log("Empty directory");
                    }
                });
            // Return list of projects
            r.db("WorkPlanner").table("Projects").run().then(
                function(result) {
                    console.log(JSON.stringify(result));
                    res.json(result);
                }
            );
        });
}

function getDirectory(req, res, next) {
    var dirId = req.swagger.params.directoryId.value;
    r.db("WorkPlanner").table("Directories")
        .get(dirId).merge(function(directory) {
            return {
                'issues': r.db("WorkPlanner").table("Issues").filter({ idDirectory: directory('id') }).coerceTo('array')
            };
        })
        .run().then(
            function(result) {
                console.log(JSON.stringify(result));
                res.json(result);
            });
}

function createDirectory(req, res, next) {
    var projectId = req.swagger.params.id.value;
    var newDirectory = {
        title: req.swagger.params.title.value,
        description: req.swagger.params.description.value,
        idProject: projectId
    };
    r.db("WorkPlanner").table("Directories").insert(newDirectory)
        .run().then(
            function(result) {
                r.db("WorkPlanner").table("Directories")
                    .get(result["generated_keys"][0]).merge(function(directory) {
                        return {
                            'issues': r.db("WorkPlanner").table("Issues").filter({ idDirectory: directory('id') }).coerceTo('array')
                        };
                    })
                    .run().then(
                        function(result) {
                            console.log(JSON.stringify(result));
                            res.json(result);
                        });
            });
}

function modifyDirectory(req, res, next) {
    var dirId = req.swagger.params.directoryId.value;
    var updatedDirectory = {
        title: req.swagger.params.title.value,
        description: req.swagger.params.description.value
    };
    r.db("WorkPlanner").table("Directories").get(dirId).update(updatedDirectory)
        .run().then(function(result) {
            r.db("WorkPlanner").table("Directories")
                .get(dirId).merge(function(directory) {
                    return {
                        'issues': r.db("WorkPlanner").table("Issues").filter({ idDirectory: directory('id') }).coerceTo('array')
                    };
                })
                .run().then(
                    function(result) {
                        console.log(JSON.stringify(result));
                        res.json(result);
                    });
        });
}

function deleteDirectory(req, res, next) {
    var projectId = req.swagger.params.id.value;
    var dirId = req.swagger.params.directoryId.value;
    // Delete directory
    r.db("WorkPlanner").table("Directories").get(dirId).delete({ returnChanges: true })
        .run().then(function(result) {
            // Delete issues
            try {
                result["changes"].array.forEach(element => {
                    r.db("WorkPlanner").table("Issues").filter({ idDirectory: element["old_val"]["id"] }).delete({ returnChanges: true })
                        .run().then(function(result) {
                            // Delete comments
                            try {
                                result["changes"].array.forEach(element => {
                                    r.db("WorkPlanner").table("Comments").filter({ idIssue: element["old_val"]["id"] }).delete().run();
                                });
                            } catch (err) {
                                console.log("No comments to delete");
                            }
                        });

                });
            } catch (err) {
                console.log("Empty directory");
            }
            //return list of directories
            r.db("WorkPlanner").table("Projects")
                .get(projectId).merge(function(project) {
                    return {
                        'directories': r.db("WorkPlanner").table("Directories").filter({ idProject: project('id') }).coerceTo('array')
                    };
                })
                .run().then(
                    function(result) {
                        console.log(JSON.stringify(result));
                        res.json(result);
                    });
        });
}

function getIssue(req, res, next) {
    var issueId = req.swagger.params.issueId.value;
    r.db("WorkPlanner").table("Issues")
        .get(issueId).merge(function(issue) {
            return {
                'comments': r.db("WorkPlanner").table("Comments").filter({ idIssue: issue('id') }).coerceTo('array')
            };
        })
        .run().then(
            function(result) {
                console.log(JSON.stringify(result));
                res.json(result);
            });
}

function createIssue(req, res, next) {
    var dirId = req.swagger.params.directoryId.value;
    var newIssue = {
        title: req.swagger.params.title.value,
        description: req.swagger.params.description.value,
        createDate: Date().toString(),
        status: model.issueStatus.OPEN,
        priority: req.swagger.params.priority.value,
        tag: req.swagger.params.tag.value,
        idDirectory: dirId
    };
    r.db("WorkPlanner").table("Issues").insert(newIssue)
        .run().then(
            function(result) {
                r.db("WorkPlanner").table("Issues")
                    .get(result["generated_keys"][0]).merge(function(issue) {
                        return {
                            'comments': r.db("WorkPlanner").table("Comments").filter({ idIssue: issue('id') }).coerceTo('array')
                        };
                    })
                    .run().then(
                        function(result) {
                            console.log(JSON.stringify(result));
                            res.json(result);
                        });
            });
}

function modifyIssue(req, res, next) {
    var issueId = req.swagger.params.issueId.value;
    var updatedIssue = {
        title: req.swagger.params.title.value,
        description: req.swagger.params.description.value,
        modifyDate: Date().toString(),
        status: req.swagger.params.status.value,
        priority: req.swagger.params.priority.value,
        tag: req.swagger.params.tag.value
    };
    r.db("WorkPlanner").table("Issues").get(issueId).update(updatedIssue)
        .run().then(
            function(result) {
                r.db("WorkPlanner").table("Issues")
                    .get(issueId).merge(function(issue) {
                        return {
                            'comments': r.db("WorkPlanner").table("Comments").filter({ idIssue: issue('id') }).coerceTo('array')
                        };
                    })
                    .run().then(
                        function(result) {
                            console.log(JSON.stringify(result));
                            res.json(result);
                        });
            });
}

function deleteIssue(req, res, next) {
    var dirId = req.swagger.params.directoryId.value;
    var issueId = req.swagger.params.issueId.value;
    // Delete issue
    r.db("WorkPlanner").table("Issues").get(issueId).delete({ returnChanges: true })
        .run().then(function(result) {
            // Delete comments
            try {
                result["changes"].array.forEach(element => {
                    r.db("WorkPlanner").table("Comments").filter({ idIssue: element["old_val"]["id"] }).delete().run();
                });
            } catch (err) {
                console.log("No comments to delete");
            }
            // Return list of issues
            r.db("WorkPlanner").table("Directories")
                .get(dirId).merge(function(directory) {
                    return {
                        'issues': r.db("WorkPlanner").table("Issues").filter({ idDirectory: directory('id') }).coerceTo('array')
                    };
                })
                .run().then(
                    function(result) {
                        console.log(JSON.stringify(result));
                        res.json(result);
                    });
        });
}

function createComment(req, res, next) {
    var issueId = req.swagger.params.issueId.value;
    var newComment = {
        createDate: Date().toString(),
        content: req.swagger.params.content.value,
        idIssue: issueId
    };
    r.db("WorkPlanner").table("Comments").insert(newComment)
        .run().then(function(result) {
            r.db("WorkPlanner").table("Issues")
                .get(issueId).merge(function(issue) {
                    return {
                        'comments': r.db("WorkPlanner").table("Comments").filter({ idIssue: issue('id') }).coerceTo('array')
                    };
                })
                .run().then(
                    function(result) {
                        console.log(JSON.stringify(result));
                        res.json(result);
                    });
        });
}

function modifyComment(req, res, next) {
    var issueId = req.swagger.params.issueId.value;
    var commentId = req.swagger.params.commentId.value;
    var updatedComment = {
        modifyDate: Date().toString(),
        content: req.swagger.params.content.value,
        idIssue: issueId
    };
    r.db("WorkPlanner").table("Comments").get(commentId).update(updatedComment)
        .run().then(function(result) {
            r.db("WorkPlanner").table("Issues")
                .get(issueId).merge(function(issue) {
                    return {
                        'comments': r.db("WorkPlanner").table("Comments").filter({ idIssue: issue('id') }).coerceTo('array')
                    };
                })
                .run().then(
                    function(result) {
                        console.log(JSON.stringify(result));
                        res.json(result);
                    });
        });
}

function deleteComment(req, res, next) {
    var issueId = req.swagger.params.issueId.value;
    var commentId = req.swagger.params.commentId.value;
    // Delete comment
    r.db("WorkPlanner").table("Comments").get(commentId).delete()
        .run().then(
            function(result) {
                // Return issue
                r.db("WorkPlanner").table("Issues")
                    .get(issueId).merge(function(issue) {
                        return {
                            'comments': r.db("WorkPlanner").table("Comments").filter({ idIssue: issue('id') }).coerceTo('array')
                        };
                    })
                    .run().then(
                        function(result) {
                            console.log(JSON.stringify(result));
                            res.json(result);
                        });
            });
}