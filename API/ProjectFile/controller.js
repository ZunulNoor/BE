const { createProjectGroup, getProjectGroup, getProjectGroupByID, deleteProjectGroup, updateProjectGroup } = require('./service')

module.exports = {
    createProjectGroup: (req, res) => {
        const { project_group } = req.body
        createProjectGroup([project_group], (err, results) => {
            if (err) {
                console.error('Error:', err);
                res.status(500).json({ message: 'Error adding project_group' });
            } else {
                console.log('project_group added successfully');
                res.json({ message: 'project_group added successfully' });
            }
        })
    },
    getProjectGroupByID: (req, res) => {
        const id = req.params.id
        getProjectGroupByID(id, (err, results) => {
            if (err) {
                console.log(err)
                return
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not found"
                })
            }
            res.status(200).json(results);
        })
    },
    getProjectGroup: (req, res) => {
        getProjectGroup((err, results) => {
            if (err) {
                console.log(err)
                return
            }
            res.status(200).json(results);
        })
    },
    updateProjectGroup: (req, res) => {
        const body = req.body
        updateProjectGroup(body, (err, results) => {
            if (err) {
                console.log(err)
                return
            } if (!results) {
                return res.json({
                    success: 0,
                    message: "Record Not Found"
                })
            }
            return res.json({
                success: 1,
                message: "Project Group Updated Successfully"
            })
        })
    },
    deleteProjectGroup: (req, res) => {
        const id = req.params.id
        deleteProjectGroup({id}, (err, results) => {
            if (err) {
                console.log(err)
                return
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record Not Found"
                })
            }
            return res.json({
                success: 1,
                message: "Project Group Deleted Success Fully"
            })
        })
    }
}