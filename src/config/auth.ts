export default {
  jwt: {
    secret: process.env.JWT_SECRET as string || 'senhasupersecreta',
    expiresIn: '1d'
  }
}
