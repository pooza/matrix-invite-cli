const isValidUsername = (username) => {
  return typeof username === 'string' && /^[a-z0-9._=\/-]+$/.test(username);
};

const isValidEmail = (email) => {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

module.exports = {
  isValidUsername,
  isValidEmail,
};
