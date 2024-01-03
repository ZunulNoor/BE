const mysql = require('mysql2')
const pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'EtechSolution@123789',
    database: 'global_traders',
});

pool.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});


module.exports = {
    create: (data, callBack) => {
        pool.query(`INSERT INTO user_detail(user_id, user_name, user_id, user_password, project_file_add, project_file_edit, project_file_delete, project_group_file_add, project_group_file_edit, project_group_file_delete, c_o_a_add, c_o_a_edit, c_o_a_delete, voucher_add, voucher_edit, voucher_delete, group_head_add, group_head_edit, group_head_delete, sub_head_add, sub_head_edit, sub_head_delete, role) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
            ,
            [
                data.user_id,
                data.user_name,
                data.user_id,
                data.user_password,
                data.project_file_add,
                data.project_file_edit,
                data.project_file_delete,
                data.project_group_file_add,
                data.project_group_file_edit,
                data.project_group_file_delete,
                data.c_o_a_add,
                data.c_o_a_edit,
                data.c_o_a_delete,
                data.voucher_add,
                data.voucher_edit,
                data.voucher_delete,
                data.group_head_add,
                data.group_head_edit,
                data.group_head_delete,
                data.sub_head_add,
                data.sub_head_edit,
                data.sub_head_delete,
                data.role
            ],
            (error, results, feilds) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
        )
    },
    getUser: callBack => {
        pool.query(`select * from user_detail`,
            [],
            (error, results, feilds) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            })
    },
    login: (user_id, callBack) => {
        pool.query(
            `select * from user_detail where user_id = ?`,
            [user_id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    }
}