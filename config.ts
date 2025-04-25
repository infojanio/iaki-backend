import { env } from '@/env'
// Crie um arquivo config.ts
import dotenv from 'dotenv'

try {
  dotenv.config()
} catch (e) {
  // Ignore se o arquivo .env não existir (em produção)
}

export const config = {
  // Suas configurações aqui
}
