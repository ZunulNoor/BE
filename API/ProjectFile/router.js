const { createProjectGroup, getProjectGroup, getProjectGroupByID, updateProjectGroup, deleteProjectGroup } = require('./controller');
const express = require('express');
const router = express.Router();

router.post('/project-group', createProjectGroup)
router.get('/get-project-group', getProjectGroup)
router.get('/get-project-group-by-id/:id', getProjectGroupByID)
router.put('/update-project-group/:id', updateProjectGroup)
router.delete('/delete-project-group/:id', deleteProjectGroup);

module.exports = router