function getCondition(userInput) {
  const symptomMap = [
    {
      keywords: ["fever", "chills", "temperature"],
      condition: "You may have a mild viral fever. Stay hydrated and rest."
    },
    {
      keywords: ["cough", "cold", "sore throat"],
      condition: "This could be a common cold. Drink warm fluids and rest."
    },
    {
      keywords: ["headache", "dizziness"],
      condition: "Possibly a tension headache. Try relaxing and stay hydrated."
    },
    {
      keywords: ["vomit", "nausea"],
      condition: "Could be a stomach infection. Eat light and monitor hydration."
    },
    {
      keywords: ["chest pain", "tightness"],
      condition: "⚠️ This may be serious. Seek medical attention immediately!"
    }
  ];

  const input = userInput.toLowerCase();

  for (let entry of symptomMap) {
    for (let keyword of entry.keywords) {
      if (input.includes(keyword)) {
        return entry.condition;
      }
    }
  }

  return "No matching condition found. Please consult a doctor.";
}
