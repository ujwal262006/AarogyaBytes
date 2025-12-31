const pool = require('../db');

/**
 * Middleware to enforce monthly report limits per clinic
 */
async function checkReportLimit(req, res, next) {
  const clinicId = req.clinicId;

  try {
    // 1. Fetch clinic subscription info
    const clinicResult = await pool.query(
      `SELECT subscription_plan, monthly_reports_limit, billing_cycle_start, billing_cycle_end
       FROM clinics
       WHERE id = $1`,
      [clinicId]
    );

    if (clinicResult.rows.length === 0) {
      return res.status(404).json({ error: 'Clinic not found' });
    }

    const clinic = clinicResult.rows[0];

    // 2. Count reports in current billing cycle
    const countResult = await pool.query(
      `SELECT COUNT(*) AS count
       FROM reports
       WHERE clinic_id = $1
         AND created_at >= $2
         AND created_at <= $3`,
      [
        clinicId,
        clinic.billing_cycle_start,
        clinic.billing_cycle_end
      ]
    );

    const used = parseInt(countResult.rows[0].count, 10);
    const limit = clinic.monthly_reports_limit;

    console.log(`📊 Clinic ${clinicId}: ${used}/${limit} reports used`);

    // 3. Enforce limit
    if (used >= limit) {
      return res.status(402).json({
        error: 'Monthly report limit exceeded',
        message: `Your ${clinic.subscription_plan} plan allows ${limit} reports per month`,
        reportsUsed: used,
        limit: limit,
        upgradeRequired: true
      });
    }

    // 4. Attach usage info for later use
    req.reportUsage = {
      used,
      limit,
      remaining: limit - used
    };

    next();
  } catch (err) {
    console.error('Usage limit middleware error:', err);
    res.status(500).json({ error: 'Failed to check report usage' });
  }
}

module.exports = checkReportLimit;
