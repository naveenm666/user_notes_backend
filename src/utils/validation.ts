export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 128;
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 50 && /^[a-zA-Z0-9_-]+$/.test(username);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
