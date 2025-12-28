const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const { assessHealth } = require('../services/ai');
const { generatePDF } = require('../services/pdf');

const router = express.Router();

/**
 * POST /api/reports
 */
router.post('/', authMiddleware, async (req, res) => {
  const { patientId, symptoms } = req.body;

  if (!patientId || !symptoms) {
    return res.status(400).json({ error: 'patientId and symptoms are required' });
  }

  try {
    // 1. Verify patient belongs to clinic
    const patientResult = await pool.query(
      'SELECT id, name, age FROM patients WHERE id = $1 AND clinic_id = $2',
      [patientId, req.clinicId]
    );

    if (patientResult.rows.length === 0) {
      return res.status(403).json({ error: 'Patient not found' });
    }

    const patient = patientResult.rows[0];

    // 2. AI assessment
    const assessment = assessHealth(symptoms);

    // 3. Insert report
    const reportResult = await pool.query(
      `INSERT INTO reports (clinic_id, patient_id, symptoms, urgency_level)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [req.clinicId, patientId, symptoms, assessment.urgencyLevel]
    );

    const reportId = reportResult.rows[0].id;

    // 4. Generate PDF (text file)
    const pdfUrl = generatePDF({
      reportId,
      patient,
      symptoms,
      assessment
    });

    // 5. Update report with pdf_url
    await pool.query(
      'UPDATE reports SET pdf_url = $1 WHERE id = $2',
      [pdfUrl, reportId]
    );

    res.status(201).json({
      reportId,
      patientName: patient.name,
      urgencyLevel: assessment.urgencyLevel,
      pdfUrl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// GET /api/reports
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         r.id,
         p.name AS patient_name,
         p.age AS patient_age,
         r.symptoms,
         r.urgency_level,
         r.created_at,
         r.pdf_url
       FROM reports r
       JOIN patients p ON r.patient_id = p.id
       WHERE r.clinic_id = $1
       ORDER BY r.created_at DESC`,
      [req.clinicId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});


module.exports = router;
