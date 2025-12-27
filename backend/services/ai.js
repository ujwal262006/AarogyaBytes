// Mock AI assessment logic
function assessHealth(symptoms) {
  return {
    urgencyLevel: 'moderate',
    severityScore: 6,
    recommendations: [
      'Take rest',
      'Stay hydrated',
      'Consult a doctor if symptoms persist'
    ]
  };
}

module.exports = { assessHealth };
