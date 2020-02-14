'use strict';
const thinkagain = require('thinkagain')({
    db: 'WorkPlanner'
});

//ENUMS

const issueStatus = {
    OPEN: 'Open',
    IN_ANALYSIS: 'In analysis',
    ASSIGNED_TO_DEVELOPMENT: 'Assigned to development',
    IN_DEVELOPMENT: 'In development',
    READY_FOR_CODE_REVIEW: 'Ready for code review',
    IN_CODE_REVIEW: 'In code review',
    READY_FOR_TESTING: 'Ready for testing',
    IN_TESTING: 'In testing',
    READY_TO_MERGE: 'Ready to merge',
    MERGED: 'Merged',
    VERIFIED: 'Verified',
    CLOSED: 'Closed'
}

const issuePriority = {
    MINOR: 'Minor',
    NORMAL: 'Normal',
    MAJOR: 'Major',
    CATASTROPHIC: 'Catastrophic'
}

const issueTag = {
    BUG: 'Bug',
    DEVELOPMENT: 'Development',
    IMPROVEMENT: 'Improvement',
    REFACTOR: 'Refactor'
}

// PROJECT

let Project = thinkagain.createModel('Projects', {
    type: 'object',
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' }
    },
    required: ['title']
});

// DIRECTORY

let Directory = thinkagain.createModel('Directories', {
    type: 'object',
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        idProject: { type: 'string' }
    },
    required: ['title', 'idProject']
});

Directory.belongsTo(Project, 'project', 'idProject', 'id');

// ISSUE

let Issue = thinkagain.createModel('Issues', {
    type: 'object',
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        createDate: { type: 'string', format: 'date-time' },
        modifyDate: { type: 'string', format: 'date-time' },
        status: { type: 'string' },
        priority: { type: 'string' },
        tag: { type: 'string' },
        idDirectory: { type: 'string' }
    },
    required: ['title', 'createDate', 'status', 'tag', 'idProject', 'idDirectory']
});

Issue.belongsTo(Directory, 'directory', 'idDirectory', 'id');

// COMMENT

let Comment = thinkagain.createModel('Comments', {
    type: 'object',
    properties: {
        id: { type: 'string' },
        createDate: { type: 'string', format: 'date-time' },
        modifyDate: { type: 'string', format: 'date-time' },
        content: { type: 'string' },
        idIssue: { type: 'string' }
    },
    required: ['createDate', 'content']
});

Comment.belongsTo(Issue, 'issue', 'idIssue', 'id');

module.exports = {
    issueStatus: issueStatus,
    issuePriority: issuePriority,
    issueTag: issueTag,

    Project: Project,
    Directory: Directory,
    Issue: Issue,
    Comment: Comment
};