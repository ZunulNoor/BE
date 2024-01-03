const { createProjectGroupFile } = require('./service');
const moment = require('moment');

module.exports = {
    createProjectGroupFile: (req, res) => {
        const { job, desc, short_name, project_group, opening_balance, opening_date } = req.body;
        // const formattedDate = moment(opening_date, 'YYYY-MM-DD', true).format('YYYY-MM-DD');
        // if (!formattedDate) {
        //     res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        //     return;
        // }

        createProjectGroupFile(
            {
                job,
                desc,
                short_name,
                project_group,
                opening_balance,
                opening_date
            },
            (err, results) => {
                if (err) {
                    console.error('Error:', err);
                    res.status(500).json({ message: 'Error adding Project Group File' });
                } else {
                    console.log('Project Group File added successfully');
                    res.json({ message: 'Project Group File added successfully' });
                }
            }
        );
    },
};
