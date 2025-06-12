const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Updated: Check uniqueness using personal_data table
const generateAccId = async () => {
  let accId;
  let exists = true;

  while (exists) {
    accId = Math.random().toString(36).substring(2, 6).toUpperCase();
    const [rows] = await pool.query('SELECT 1 FROM personal_data WHERE Acc_ID = ?', [accId]);
    exists = rows.length > 0;
  }

  return accId;
};

// Generate Contact ID without uniqueness check (optional enhancement later)
const generateContactId = () => {
  return 'CON-' + (Math.random().toString(16).slice(2, 10)).toUpperCase();
};

// Short Funding ID (7 characters)
const generateFundingId = () => {
  return 'F' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Generate Bank Account Number (10-digit number string)
const generateBankAccNo = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

module.exports = {
  pool,
  generateAccId,
  generateContactId,
  generateFundingId,
  generateBankAccNo
};
