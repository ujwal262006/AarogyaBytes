const fs = require('fs');
const path = require('path');
const os = require('os');

function generatePDF({ reportId, patient, symptoms, assessment }) {
  // Cross-platform temp directory
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, `report_${reportId}.txt`);

  const content = `
AAROGYABYTES – HEALTH REPORT

Patient Name: ${patient.name}
Age: ${patient.age}

Symptoms:
${symptoms}

Urgency Level: ${assessment.urgencyLevel}
Severity Score: ${assessment.severityScore}

Recommendations:
- ${assessment.recommendations.join('\n- ')}

DISCLAIMER:
For informational purposes only. Not a medical diagnosis.
`;

  fs.writeFileSync(filePath, content);
  return filePath;
}

module.exports = { generatePDF };
