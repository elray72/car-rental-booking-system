const validateRequiredFields = (fields) => {
  return Object.values(fields).every((field) => typeof field === 'string' && field.trim() !== '');
};

module.exports = { validateRequiredFields };
