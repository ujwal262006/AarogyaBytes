function checkSymptoms() {
  const input = document.getElementById("symptomInput").value.trim();
  const resultBox = document.getElementById("resultBox");

  if (input === "") {
    resultBox.textContent = "Please describe your symptoms.";
    resultBox.style.color = "red";
    return;
  }

  const result = getCondition(input);
  resultBox.textContent = result;

  if (result.includes("⚠️")) {
    resultBox.style.color = "red";
  } else if (result.includes("consult")) {
    resultBox.style.color = "orange";
  } else {
    resultBox.style.color = "green";
  }
}
