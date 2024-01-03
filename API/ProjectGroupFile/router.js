const { createProjectGroupFile } = require('./controller');
const express = require('express');
const router = express.Router();

router.post('/project-group-file', createProjectGroupFile);

module.exports = router;
