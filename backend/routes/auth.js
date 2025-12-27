const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// Helper: Generate JWT
function generateToken({ doctorId, clinicId, email }) {
  return jwt.sign(
    { doctorId, clinicId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// =========================
// POST /api/auth/register
// =========================
router.post('/register', async (req, res) => {
  const { clinicName, email, password } = req.body;

  if (!clinicName || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // 1. Check if email already exists
    const existing = await pool.query(
      'SELECT id FROM clinics WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Insert clinic
    const clinicResult = await pool.query(
      'INSERT INTO clinics (name, email) VALUES ($1, $2) RETURNING id, name',
      [clinicName, email]
    );

    const clinic = clinicResult.rows[0];

    // 4. Insert doctor (admin)
    const doctorResult = await pool.query(
      `INSERT INTO doctors (clinic_id, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       RETURNING id`,
      [clinic.id, email, passwordHash]
    );

    const doctorId = doctorResult.rows[0].id;

    // 5. Generate JWT
    const token = generateToken({
      doctorId,
      clinicId: clinic.id,
      email,
    });

    res.status(201).json({
      token,
      clinic,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ======================
// POST /api/auth/login
// ======================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Fetch doctor + clinic
    const result = await pool.query(
      `SELECT d.id AS doctor_id, d.password_hash, c.id AS clinic_id, c.name
       FROM doctors d
       JOIN clinics c ON d.clinic_id = c.id
       WHERE d.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const doctor = result.rows[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, doctor.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Generate JWT
    const token = generateToken({
      doctorId: doctor.doctor_id,
      clinicId: doctor.clinic_id,
      email,
    });

    res.json({
      token,
      clinic: {
        id: doctor.clinic_id,
        name: doctor.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
