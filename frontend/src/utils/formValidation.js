// 1. Shared Password Rules Evaluator
export const getPasswordRules = (password) => {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[@$!%*?&]/.test(password),
  };
};

// 2. Helper to check if all conditions are met
export const checkPasswordStrength = (password) => {
  const rules = getPasswordRules(password);
  return Object.values(rules).every(Boolean);
};

// 3. Helper to sanitize security PIN inputs (digits only)
export const sanitizePin = (value) => {
  return value.replace(/\D/g, '');
};