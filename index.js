{/*Back ของ rigistation login*/ }
var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt')
const saltRounds = 10
var jwt = require('jsonwebtoken')
const secret = 'Fullstack-login-2023'
require('dotenv').config()


app.use(cors())

const mysql = require('mysql2');
// create the connection to database
const connection = mysql.createConnection(process.env.DATABASE_URL)






{/*databasetable / Search*/ }
app.get('/user', function (req, res, next) {
  const page = parseInt(req.query.page);
  const per_page = parseInt(req.query.per_page);
  const sort_column = req.query.sort_column;
  const sort_direction = req.query.sort_direction;
  const search = req.query.search;

  const start_idx = (page - 1) * per_page;
  var params = [];
  var sql = 'SELECT * FROM employee';
  if (search) {
    sql += ' WHERE fullNameEng LIKE ?'
    params.push('%' + search + '%')
  }
  if (sort_column) {
    sql += ' ORDER BY ' + sort_column + ' ' + sort_direction;
  }
  sql += ' LIMIT ?, ?'
  params.push(start_idx)
  params.push(per_page)
  console.log(sql, params)
  // execute will internally call prepare and query
  connection.execute(sql, params,
    function (err, results, fields) {
      console.log(results); // results contains rows returned by server

      // simple query
      connection.query(
        'SELECT COUNT(employee_ID) as total FROM employee',
        function (err, counts, fields) {
          const total = counts[0]['total'];
          const total_pages = Math.ceil(total / per_page)
          res.json({
            page: page,
            per_page: per_page,
            total: total,
            total_pages: total_pages,
            data: results,
          })
        }
      );



      // If you execute same statement again, it will be picked from a LRU cache
      // which will save query preparation time and give better performance
    }
  );
})
{/*databasetable / Search*/ }








// เพิ่มข้อมูลลงในฐานข้อมูล
app.post('/dataadd', (req, res) => {
  const employeeData = req.body; // ข้อมูลของพนักงานที่ส่งมาจากแบบฟอร์ม

  const sql = 'INSERT INTO employee (fullNameEng, idAddress, currentAddress) VALUES (?, ?, ?)';

  connection.query(sql, [
    employeeData.fullNameEng,
    employeeData.idAddress,
    employeeData.currentAddress
  ], (err, result) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล: ' + err.stack);
      return;
    }
    console.log('เพิ่มข้อมูลเรียบร้อยแล้ว');
    res.sendStatus(200);
  });
});




// app.post('/adddata', jsonParser, function (req, res, next) {

//   connection.execute(
//     'INSERT INTO employee(employee_ID, prefix, fullNameThai, fullNameEng, gender, birthday, maritalStatus, religion, nationality, idAddress, currentAddress, Work_address, personal_id, email, phoneNumber, Positon, department, Salary, Contract_Duration, Contract_Consultant_Name, client, SSF_Pay, SSF_Type, Non_ssf, Company_name, Registration_number, Registration_address, Joining_date_cpay, Leave_eligibility, Agreement_expiration_period, Hospital_detail_cpay, Withholding_tax_cpay, Married_name_cpay, Children_detail_cpay, Parents_cpay, Disabled_person_cpay, LiU_insurance_endowment_cpay, Health_insurance_accident_cpay, Parent_liU_resurance_cpay, Annuity_insurance_cpay, Rmf_cpay, SSF_super_saving_fund_cpay, Provident_fund_pvd_cpay, Donations_cpay, Resume_image, Transcript_image, Cerficate_image, House_registraon_image, id_card_image, Personal_image, Photo_with_id_image, Bank_book_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',

//     [
//       req.body.employee_ID || null,
//       req.body.prefix || null,
//       req.body.fullNameThai || null,
//       req.body.fullNameEng || null,
//       req.body.gender || null,
//       req.body.birthday || null,
//       req.body.maritalStatus || null,
//       req.body.religion || null,
//       req.body.nationality || null,
//       req.body.idAddress || null,
//       req.body.currentAddress || null,
//       req.body.Work_address || null,
//       req.body.personal_id || null,
//       req.body.email || null,
//       req.body.phoneNumber || null,
//       req.body.Positon || null,
//       req.body.department || null,
//       req.body.Salary || null,
//       req.body.Contract_Duration || null,
//       req.body.Contract_Consultant_Name || null,
//       req.body.client || null,
//       req.body.SSF_Pay || null,
//       req.body.SSF_Type || null,
//       req.body.Non_ssf || null,
//       req.body.Company_name || null,
//       req.body.Registration_number || null,
//       req.body.Registration_address || null,
//       req.body.Joining_date_cpay || null,
//       req.body.Leave_eligibility || null,
//       req.body.Agreement_expiration_period || null,
//       req.body.Hospital_detail_cpay || null,
//       req.body.Withholding_tax_cpay || null,
//       req.body.Married_name_cpay || null,
//       req.body.Children_detail_cpay || null,
//       req.body.Parents_cpay || null,
//       req.body.Disabled_person_cpay || null,
//       req.body.LiU_insurance_endowment_cpay || null,
//       req.body.Health_insurance_accident_cpay || null,
//       req.body.Parent_liU_resurance_cpay || null,
//       req.body.Annuity_insurance_cpay || null,
//       req.body.Rmf_cpay || null,
//       req.body.SSF_super_saving_fund_cpay || null,
//       req.body.Provident_fund_pvd_cpay || null,
//       req.body.Donations_cpay || null,
//       req.body.Resume_image || null,
//       req.body.Transcript_image || null,
//       req.body.Certificate_image || null,
//       req.body.House_registration_image || null,
//       req.body.id_card_image || null,
//       req.body.Personal_image || null,
//       req.body.Photo_with_id_image || null,
//       req.body.Bank_book_image || null
//     ],
//     function(err, results, fields) {
//       if (err) {
//         console.error('Error:', err);
//         res.json({ status: 'error', message: err });
//         return;
//       }
//       res.json({ status: 'ok' });
//     }
//   );
// })


app.post('/addemployee', jsonParser, function (req, res, next) {
  connection.execute(
    'INSERT INTO employee (prefix,fullNameThai,fullNameEng,gender,birthday,maritalStatus,religion,nationality,idAddress,password,currentAddress,Work_address,personal_id,email,phoneNumber,Positon,department,Salary,Contract_Duration,Contract_Consultant_Name,client,Company_name,Leave_eligibility,Agreement_expiration_period,Resume_image,Transcript_image,Cerficate_image,House_registraon_image,id_card_image,Personal_image,Photo_with_id_image,Bank_book_image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [
      req.body.prefix,
      req.body.fullNameThai,
      req.body.fullNameEng,
      req.body.gender,
      req.body.birthday,
      req.body.maritalStatus,
      req.body.religion,
      req.body.nationality,
      req.body.idAddress,
      req.body.password,
      req.body.currentAddress,
      req.body.Work_address,
      req.body.personal_id,
      req.body.email,
      req.body.phoneNumber,
      req.body.Positon,
      req.body.department,
      req.body.Salary,
      req.body.Contract_Duration,
      req.body.Contract_Consultant_Name,
      req.body.client,
      req.body.Company_name,
      req.body.Leave_eligibility,
      req.body.Agreement_expiration_period,
      req.body.Resume_image,
      req.body.Transcript_image,
      req.body.Cerficate_image,
      req.body.House_registraon_image,
      req.body.id_card_image,
      req.body.Personal_image,
      req.body.Photo_with_id_image,
      req.body.Bank_book_image
    ],
    function (err, results, fields) {
      if (err) {
        res.json({ status: 'error', message: err })
        return
      }
      res.json({ status: 'ok' })
    }
  );
})







{/*Login / Registation Login / Registation Login / Registation Login / Registation Login / Registation Login / Registation Login / Registation*/ }
app.post('/register', jsonParser, function (req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    connection.execute(
      'INSERT INTO users (email,password,fname,lname) VALUES (?,?,?,?)',
      [req.body.email, hash, req.body.fname, req.body.lname],
      function (err, results, fields) {
        if (err) {
          res.json({ status: 'error', message: err })
          return
        }
        res.json({ status: 'ok' })
      }
    );
  });

})


app.post('/login', jsonParser, function (req, res, next) {
  connection.execute(
    'SELECT * FROM users WHERE email=?',
    [req.body.email],
    function (err, users, fields) {
      if (err) {
        res.json({ status: 'error', message: err })
        return
      }
      if (users.length == 0) {
        res.json({ status: 'error', message: 'no user found' })
        return
      }
      bcrypt.compare(req.body.password, users[0].password, function (err, isLogin) {
        if (isLogin) {
          var token = jwt.sign({ email: users[0].email }, secret, { expiresIn: '1h' });
          res.json({ status: 'ok', message: 'login sccess', token, email: users[0].email })// เพิ่ม email ในการส่งคืนข้อมูล
        } else {
          res.json({ status: 'error', message: 'login failed' })
        }
      });
    }
  );
})



app.post('/authen', jsonParser, function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(token, secret);
    res.json({ status: 'ok', decoded })
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }

})
{/*Login / Registation Login / Registation Login / Registation Login / Registation Login / Registation Login / Registation Login / Registation*/ }






{/*ทดสอบ*/ }
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM employee';
  connection.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});


app.get('/data/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM employee WHERE employee_ID = ?';
  connection.query(query, id, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});


app.get('/search', function (req, res, next) {
  const search = req.query.search;

  const sql = 'SELECT * FROM employee WHERE fullNameEng LIKE ?';
  const params = ['%' + search + '%'];

  connection.execute(sql, params, function (err, results, fields) {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});



app.delete('/data/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM employee WHERE employee_ID = ?';
  connection.query(query, id, (err, result) => {
    if (err) {
      res.status(500).json({ status: 'error', message: err });
    } else {
      res.json({ status: 'ok' });
    }
  });
});




app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})
//connection.end()








