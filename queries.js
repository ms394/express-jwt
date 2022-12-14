const pool = require("./config/db");

const getUserByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE email=$1`;
    pool.query(query, [email], (err, res) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(res.rows[0]);
      }
    });
  });
};

const getUserById = async (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE user_id=$1`;
    pool.query(query, [id], (err, res) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(res.rows[0]);
      }
    });
  });
};

module.exports = { getUserByEmail, getUserById };
