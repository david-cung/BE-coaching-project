export default (): Record<string, string> => ({
  jwtSecretKey: '1231231232131231223',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
});
