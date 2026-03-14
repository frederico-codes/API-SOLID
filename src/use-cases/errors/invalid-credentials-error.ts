export class InvalidCredentialsError extends Error {
  constructor() {
    super("User with this email already exists.")    
  }}