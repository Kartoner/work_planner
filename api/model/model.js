'use strict';
const thinkagain = require('thinkagain')();

module.exports = {
    role: role,
    issueStatus: issueStatus,
    issuePriority: issuePriority,
    issueTag: issueTag,

    Group: Group,
    Project: Project,
    Directory: Directory,
    User: User,
    Issue: Issue,
    Comment: Comment
};

//ENUMS

const role = {
    ADMIN: 'Admin',
    OWNER: 'Owner',
    MEMBER: 'Member'
}

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

//GROUP

let Group = thinkagain.createModel('Groups', {
    type: 'object',
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        visible: { type: 'boolean' }
    },
    required: ['title', 'visible']
});

// PROJECT

let Project = thinkagain.createModel('Projects', {
    type: 'object',
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        idGroup: { type: 'string' },
        visible: { type: 'boolean' }
    },
    required: ['title', 'idGroup']
});

Project.belongsTo(Group, 'group', 'idGroup', 'id');

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

// USER

let User = thinkagain.createModel('Users', {
    type: 'object',
    properties: {
        id: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        role: { type: 'string' },
        idGroup: { type: 'string' }
    },
    required: ['username', 'password', 'firstName', 'lastName']
});

User.belongsTo(Group, 'group', 'idGroup', 'id');

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
        idProject: { type: 'string' },
        idDirectory: { type: 'string' },
        idUser: { type: 'string' }
    },
    required: ['title', 'createDate', 'status', 'tag', 'idProject', 'idDirectory']
});

Issue.belongsTo(Project, 'project', 'idProject', 'id');
Issue.belongsTo(Directory, 'directory', 'idDirectory', 'id');
Issue.belongsTo(User, 'user', 'idUser', 'id');

// COMMENT

let Comment = thinkagain.createModel('Comments', {
    type: 'object',
    properties: {
        id: { type: 'string' },
        createDate: { type: 'string', format: 'date-time' },
        content: { type: 'string' },
        idUser: { type: 'string' }
    },
    required: ['createDate', 'content', 'idUser']
});

Comment.belongsTo(User, 'user', 'idUser', 'id');