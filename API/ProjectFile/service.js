const pool = require('../../config/db')

module.exports = {
    createProjectGroup: (data, callBack) => {
        pool.query('INSERT INTO project_group(project_group) VALUES (?)',
            [data.project_group],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getProjectGroup: callBack => {
        pool.query(`select id ,project_group from project_group`,
            [],
            (error, results, feilds) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            })
    },
    getProjectGroupByID: (id, callBack) => {
        pool.query(`select id ,project_group from project_group where id = ?`,
            [id],
            (error, results, feilds) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results[0])
            })
    },
    updateProjectGroup: (data, callBack) => {
        pool.query(`update project_group set project_group = ? where id = ?`,
            [data.project_group, data.id],
            (error, results, feilds) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
        )
    },
    deleteProjectGroup: (data, callBack) => {
        pool.query(
            'DELETE FROM project_group WHERE id = ?',
            [data.id],
            (error, results, fields) => {
                if (error) {
                    console.error('Error deleting project group:', error);
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    }
}