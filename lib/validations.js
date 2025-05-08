export function validateEmail(email) {
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (typeof email !== "string") {
  return { valid: false, error: "Email must be a string" };
 }
 if (!emailRegex.test(email)) {
  return { valid: false, error: "Invalid email format" };
 }
 return { valid: true };
}

export function validateUsername(username) {
 const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
 if (typeof username !== "string") {
  return { valid: false, error: "Username must be a string" };
 }
 if (!usernameRegex.test(username)) {
  return {
   valid: false,
   error:
    'Username must start with a letter, can include letters, numbers, "_" or "-", and be 3-20 characters long',
  };
 }
 return { valid: true };
}

export function validatePassword(password) {
 if (typeof password !== "string") {
  return { valid: false, error: "Password must be a string" };
 }
 if (password.length < 6 || password.length > 30) {
  return {
   valid: false,
   error: "Password must be between 6 and 30 characters long",
  };
 }
 return { valid: true };
}
