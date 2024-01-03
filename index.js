const express = require('express');
const cors = require('cors');
const port = 3100;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const salt = 10;
const mysql = require('mysql2')
const moment = require('moment');
const cookieParser = require('cookie-parser')



app.use(cors({
  origin: ["*"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// <========================================= C O N N E C T I O N ==========================================================>

const db = mysql.createConnection({
  host: 'localhost',
  user: 'etspk',
  password: 'Etspk{123}',
  database: 'global_traders',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

// <=========================================== U S E R =======================================================================>



app.post('/check-email', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error executing database query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  });
});

app.post('/api/login', (req, res) => {
  const sql = "SELECT * from user_detail where user_email = ?";
  db.query(sql, [req.body.user_email], (err, data) => {
    if (err) return res.json({ Error: "Login Error" });
    if (data.length > 0) {
      bcrypt.compare(req.body.user_password.toString(), data[0].user_password, (err, response) => {
        if (err) return res.json({ Error: "Password Compare error" });
        if (response) {
          const { user_name, role, user_id } = data[0];
          const token = jwt.sign({ user_name, role, user_id }, "^516*3!dcfujxcvbn789<?:753<?//>>", { expiresIn: '1d' });
          res.cookie('token', token);
          return res.json({ Status: "Success" });
        } else {
          return res.json({ Error: "Password not matched" });
        }
      });
    } else {
      return res.json({ Error: "No email exists" });
    }
  });
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "etech", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not correct" });
      } else {
        req.user_name = decoded.user_name;
        req.role = decoded.role;
        req.user_id = decoded.user_id
        next();
      }
    });
  }
};

app.get('/', verifyUser, (req, res) => {
  return res.json({ Status: "Success", user_name: req.user_name, role: req.role, user_id: req.user_id });
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: "Success" });
});

app.post('/api/signup', (req, res) => {
  const {
    user_id, user_name, user_email, user_password, project_file_add, project_file_edit,
    project_file_delete, project_group_file_add, project_group_file_edit, project_group_file_delete,
    c_o_a_add, c_o_a_edit, c_o_a_delete, voucher_add, voucher_edit, voucher_delete,
    group_head_add, group_head_edit, group_head_delete, sub_head_add, sub_head_edit, sub_head_delete, role,user_add
  } = req.body;

  const sql = `INSERT INTO user_detail(
    user_id, user_name, user_email, user_password, project_file_add, project_file_edit,
    project_file_delete, project_group_file_add, project_group_file_edit, project_group_file_delete,
    c_o_a_add, c_o_a_edit, c_o_a_delete, voucher_add, voucher_edit, voucher_delete,
    group_head_add, group_head_edit, group_head_delete, sub_head_add, sub_head_edit, sub_head_delete, role,user_add
  ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  bcrypt.hash(user_password.toString(), salt, (err, hash) => {
    if (err) {
      return res.json({ Status: "Error", Message: "Error hashing password" });
    }

    const values = [
      user_id, user_name, user_email, hash, project_file_add, project_file_edit,
      project_file_delete, project_group_file_add, project_group_file_edit, project_group_file_delete,
      c_o_a_add, c_o_a_edit, c_o_a_delete, voucher_add, voucher_edit, voucher_delete,
      group_head_add, group_head_edit, group_head_delete, sub_head_add, sub_head_edit, sub_head_delete, role,user_add
    ];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Error adding User' });
      } else {
        console.log('User added successfully');
        res.json({ message: 'User added successfully' });
      }
    });
  });
});

app.get('/api/get-all-user', (req, res) => {
  const sql = 'SELECT * FROM user_detail'
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
})


// admin email = admin123@gmail.com
// admin password = Admin<123>?4/*--

// ====================================================== PROJECT GROUP ==========================================================================

app.post('/api/project-group', (req, res) => {
  const { project_group } = req.body
  const sql = 'INSERT INTO project_group(project_group) VALUES (?)';
  db.query(sql, [project_group], (err, result) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Error adding project_group' });
    } else {
      console.log('project_group added successfully');
      res.json({ message: 'project_group added successfully' });
    }
  })
})

app.get('/api/get-project-group', (req, res) => {
  const sql = 'SELECT * FROM project_group'
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
})

app.get('/api/get-project-group-by-id/:id', (req, res) => {
  const id = req.params.id
  const sql = 'SELECT * FROM project_group where id = ?'
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
})

app.put('/api/update-project-group/:id', (req, res) => {
  const id = req.params.id;
  const { project_group } = req.body;
  const sql = 'UPDATE project_group SET project_group = ? WHERE id = ?';
  db.query(sql, [project_group, id], (err, result) => {
    if (err) {
      console.error('Error updating Project Group:', err);
      res.status(500).json({ message: 'Error updating Project Group' });
    } else {
      console.log('Project Group updated successfully');
      res.json({ message: 'Project Group updated successfully' });
    }
  });
});

app.delete('/api/delete-project-group/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM project_group WHERE id = ?', id, (err, result) => {
    if (err) {
      console.error('Error deleting Project Group:', err);
      res.status(500).json({ message: 'Error deleting Project Group' });
    } else {
      console.log('Project Group deleted successfully');
      res.json({ message: 'Project Group deleted successfully' });
    }
  });
});
// ====================================================== PROJECT GROUP FILE ==========================================================================

app.post('/api/project-group-file', (req, res) => {
  const { job, desc, short_name, project_group, opening_balance, opening_date } = req.body;
  const formattedDate = moment(opening_date, 'YYYY-MM-DD', true).format('YYYY-MM-DD');
  if (!formattedDate) {
    res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    return;
  }
  const sql = 'INSERT INTO project_file(job, `desc`, short_name, project_group, opening_balance, opening_date) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [job, desc, short_name, project_group, opening_balance, formattedDate], (err, result) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Error adding project_group_file' });
    } else {
      console.log('project_group_file added successfully');
      res.json({ message: 'project_group_file added successfully' });
    }
  });
});

app.get('/api/get-project-group-file', (req, res) => {
  const sql = 'SELECT * FROM project_file'
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
})

app.get('/api/get-project-group-file-by-id/:id', (req, res) => {
  const id = req.params.id
  const sql = 'SELECT * FROM project_file where id = ?'
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
})

app.delete('/api/delete-project-group-file/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM project_file WHERE id = ?', id, (err, result) => {
    if (err) {
      console.error('Error deleting Project Group File:', err);
      res.status(500).json({ message: 'Error deleting Project Group File' });
    } else {
      console.log('Project Group File deleted successfully');
      res.json({ message: 'Project Group File deleted successfully' });
    }
  });
});

app.put('/api/update-project-group-file/:id', (req, res) => {
  const id = req.params.id;
  const { job, desc, short_name, project_group, opening_balance, opening_date } = req.body;
  const sql = 'UPDATE project_file SET job=?, `desc`=?, short_name=?, project_group=?, opening_balance=?, opening_date=? WHERE id=?';
  db.query(sql, [job, desc, short_name, project_group, opening_balance, opening_date, id], (err, result) => {
    if (err) {
      console.error('Error updating Project Group File:', err);
      res.status(500).json({ message: 'Error updating Project Group File' });
    } else {
      console.log('Project Group File updated successfully');
      res.json({ message: 'Project Group File updated successfully' });
    }
  });
});

// ====================================================== Group Head ==========================================================================

app.post('/api/group-head', (req, res) => {
  const { group_head, nature } = req.body
  const sql = 'INSERT INTO group_head( group_head, nature) VALUES ( ?, ?)';
  db.query(sql, [group_head, nature], (err, result) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Error adding group_head' });
    } else {
      console.log('group_head added successfully');
      res.json({ message: 'group_head added successfully' });
    }
  })
})

app.get('/api/get-group-head', (req, res) => {
  const sql = 'SELECT * FROM group_head'
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
})

app.get('/api/get-group-head-by-id/:id', (req, res) => {
  const id = req.params.id
  const sql = 'SELECT * FROM group_head where id = ?'
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
})

app.put('/api/update-group-head/:id', (req, res) => {
  const id = req.params.id;
  const { group_head, nature } = req.body;
  const sql = 'UPDATE group_head SET group_head = ?, nature = ? WHERE id = ?';

  db.query(sql, [group_head, nature, id], (err, result) => {
    if (err) {
      console.error('Error updating Group Head:', err);
      res.status(500).json({ message: 'Error updating Group Head' });
    } else {
      console.log('Group Head updated successfully');
      res.json({ message: 'Group Head updated successfully' });
    }
  });
});

app.delete('/api/delete-group-head/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM group_head WHERE id = ?', id, (err, result) => {
    if (err) {
      console.error('Error deleting Group Head:', err);
      res.status(500).json({ message: 'Error deleting Group Head' });
    } else {
      console.log('Group Head deleted successfully');
      res.json({ message: 'Group Head deleted successfully' });
    }
  });
});
// ====================================================== Sub Head ==========================================================================

app.post('/api/sub-head', (req, res) => {
  const { sub_head_acc, group_head, nature } = req.body
  const sql = 'INSERT INTO sub_head_acc(sub_head_acc, group_head, nature) VALUES ( ?, ?, ?)';
  db.query(sql, [sub_head_acc, group_head, nature], (err, result) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Error adding Sub Head' });
    } else {
      console.log('Sub Head Acc added successfully');
      res.json({ message: 'Sub Head Acc added successfully' });
    }
  })
})

app.get('/api/get-sub-head', (req, res) => {
  const sql = 'SELECT * FROM sub_head_acc'
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
})

app.get('/api/get-sub-head-by-id/:id', (req, res) => {
  const id = req.params.id
  const sql = 'SELECT * FROM sub_head_acc where id = ?'
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
})

app.delete('/api/delete-sub-head/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM sub_head_acc WHERE id = ?', id, (err, result) => {
    if (err) {
      console.error('Error deleting Sub Head Acc:', err);
      res.status(500).json({ message: 'Error deleting Sub Head Acc' });
    } else {
      console.log('Sub Head Acc deleted successfully');
      res.json({ message: 'Sub Head Acc deleted successfully' });
    }
  });
});

app.put('/api/update-sub-head/:id', (req, res) => {
  const id = req.params.id;
  const { sub_head_acc, group_head, nature } = req.body;

  const sql = 'UPDATE sub_head_acc SET sub_head_acc=?, group_head=?, nature=? WHERE id=?';

  db.query(sql, [sub_head_acc, group_head, nature, id], (err, result) => {
    if (err) {
      console.error('Error updating Sub Head Acc:', err);
      res.status(500).json({ message: 'Error updating Sub Head Acc' });
    } else {
      console.log('Sub Head Acc updated successfully');
      res.json({ message: 'Sub Head Acc updated successfully' });
    }
  });
});

// ====================================================== Chart OF Account ==========================================================================

app.post('/api/chart-of-account', (req, res) => {
  const { sub_head_acc, status, group_acc, name, nature, party, acc_type, comments, opening, commission, credit_days, credit_allowed, address, phone, cell, sec_cell, email, website, gst, ntn, concern_person } = req.body
  const sql = 'INSERT INTO chart_of_account(sub_head_acc, status, group_acc, name, nature, party, acc_type, comments, opening, commission, credit_days, credit_allowed, address, phone, cell, sec_cell, email, website, gst, ntn, concern_person) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
  db.query(sql, [sub_head_acc, status, group_acc, name, nature, party, acc_type, comments, opening, commission, credit_days, credit_allowed, address, phone, cell, sec_cell, email, website, gst, ntn, concern_person], (err, result) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Error adding Chart OF Account' });
    } else {
      console.log('Chart OF Account added successfully');
      res.json({ message: 'Chart OF Account added successfully' });
    }
  })
})

app.get('/api/get-chart-of-account', (req, res) => {
  const sql = ` SELECT v.*,grpHead.group_head as group_acc_name
  FROM chart_of_account v
  LEFT JOIN group_head grpHead ON v.group_acc = grpHead.id`
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
})

app.get('/api/get-chart-of-account-by-id/:id', (req, res) => {
  const id = req.params.id
  const sql = 'SELECT * FROM chart_of_account where id = ?'
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
})

app.put('/api/update-chart-of-account/:id', (req, res) => {
  const id = req.params.id;
  const { sub_head_acc, status, group_acc, name, nature, party, acc_type, comments, opening, commission, credit_days, credit_allowed, address, phone, cell, sec_cell, email, website, gst, ntn, concern_person } = req.body;

  const sql = `
    UPDATE chart_of_account
    SET
      sub_head_acc = ?,
      status = ?,
      group_acc = ?,
      name = ?,
      nature = ?,
      party = ?,
      acc_type = ?,
      comments = ?,
      opening = ?,
      commission = ?,
      credit_days = ?,
      credit_allowed = ?,
      address = ?,
      phone = ?,
      cell = ?,
      sec_cell = ?,
      email = ?,
      website = ?,
      gst = ?,
      ntn = ?,
      concern_person = ?
    WHERE id = ?
  `;

  db.query(sql, [sub_head_acc, status, group_acc, name, nature, party, acc_type, comments, opening, commission, credit_days, credit_allowed, address, phone, cell, sec_cell, email, website, gst, ntn, concern_person, id], (err, result) => {
    if (err) {
      console.error('Error updating Chart Of Account:', err);
      res.status(500).json({ message: 'Error updating Chart Of Account' });
    } else {
      console.log('Chart Of Account updated successfully');
      res.json({ message: 'Chart Of Account updated successfully' });
    }
  });
});

app.delete('/api/delete-chart-of-account/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM chart_of_account WHERE id = ?', id, (err, result) => {
    if (err) {
      console.error('Error deleting Chart Of Account:', err);
      res.status(500).json({ message: 'Error deleting Chart Of Account' });
    } else {
      console.log('Chart Of Account deleted successfully');
      res.json({ message: 'Chart Of Account deleted successfully' });
    }
  });
});
// ====================================================== Voucher ==========================================================================

app.post('/api/voucher', (req, res) => {
  const { date, acc_ref, cheq, category, description, department, desc, item, book, acc_for, bank, debit, credit } = req.body
  const sql = 'INSERT INTO voucher( date, acc_ref, cheq, category, description, department, `desc`, item, book, acc_for, bank, debit, credit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [date, acc_ref, cheq, category, description, department, desc, item, book, acc_for, bank, debit, credit], (err, result) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Error adding Voucher' });
    } else {
      console.log('Voucher added successfully');
      res.json({ message: 'Voucher added successfully' });
    }
  });
});

app.get('/api/get-voucher', (req, res) => {
  const sql = `
  SELECT v.*,
   c.name as category_name,
   subhead.sub_head_acc as acc_ref_name,
   accFor.name as acc_for_name,
   projectGroup.project_group as project_group_name,
   descript.desc as desc_name
  FROM voucher v 
  LEFT JOIN chart_of_account c ON v.category = c.id
  LEFT JOIN sub_head_acc subhead ON v.acc_ref = subhead.id
  LEFT JOIN chart_of_account accFor ON v.acc_for = accFor.id
  LEFT JOIN project_group projectGroup ON v.department = projectGroup.id
  LEFT JOIN project_file descript ON v.desc = descript.id
  `
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
})

app.put('/api/update-voucher/:id', (req, res) => {
  const id = req.params.id;
  const { date, acc_ref, cheq, category, description, department, desc, item, book, acc_for, bank, debit, credit } = req.body;
  const sql = `
    UPDATE voucher
    SET date = ?, acc_ref = ?, cheq = ?, category = ?, description = ?, department = ?, \`desc\` = ?, item = ?, book = ?, acc_for = ?, bank = ?, debit = ?, credit = ?
    WHERE id = ?
  `;

  db.query(sql, [date, acc_ref, cheq, category, description, department, desc, item, book, acc_for, bank, debit, credit, id], (err, result) => {
    if (err) {
      console.error('Error updating voucher:', err);
      res.status(500).json({ message: 'Error updating voucher' });
    } else {
      console.log('Voucher updated successfully');
      res.json({ message: 'Voucher updated successfully' });
    }
  });
});

app.delete('/api/delete-voucher/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM voucher WHERE id = ?', id, (err, result) => {
    if (err) {
      console.error('Error deleting voucher:', err);
      res.status(500).json({ message: 'Error deleting voucher' });
    } else {
      console.log('voucher deleted successfully');
      res.json({ message: 'voucher deleted successfully' });
    }
  });
});

app.get('/api/get-voucher-by-id/:id', (req, res) => {
  const id = req.params.id
  const sql = 'SELECT * FROM voucher where id = ?'
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
})

// =====================================================================================================================================================================
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})