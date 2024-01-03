const pool = require('../../config/db');

module.exports = {
    createProjectGroupFile: (data, callBack) => {
        pool.query(
            'INSERT INTO project_file(job, `desc`, short_name, project_group, opening_balance, opening_date) VALUES (?, ?, ?, ?, ?, ?)',
            [data.job, data.desc, data.short_name, data.project_group, data.opening_balance, data.opening_date],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
};
