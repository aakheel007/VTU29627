import { initializeAuthToken } from '../services/auth'

export async function login(username: string, _password: string) {
  const token = await initializeAuthToken()
  return { username, token }
}

export async function logout() {
  // TODO: Replace with real sign-out logic
  return Promise.resolve()
}
