import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
<<<<<<< HEAD
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Profile (e2e)', () => {
=======

describe('Refresh Token (e2e)', () => {
>>>>>>> origin/master
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
<<<<<<< HEAD
  it('should be able to get user profile', async () => {
    const { accessToken } = await createAndAuthenticateUser(app, true)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
      }),
    )
=======

  it('should be able to refresh a token', async () => {
    // Criando usuário
    const registerResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '6299775614',
      role: 'USER',
      avatar: 'perfil.png',
    })

    expect(registerResponse.statusCode).toEqual(201)

    // Autenticando usuário
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(authResponse.statusCode).toEqual(200)

    // Pegando o refreshToken correto do body da resposta
    const { refreshToken } = authResponse.body

    if (!refreshToken) {
      throw new Error('❌ Refresh token não retornado na autenticação!')
    }

    // Fazendo a requisição de refresh usando o token correto
    const refreshResponse = await request(app.server)
      .patch('/token/refresh')
      .send({ refreshToken }) // Enviando pelo body

    console.log('🔵 Refresh Response:', refreshResponse.body) // Debug

    // Validando a resposta do refresh
    expect(refreshResponse.statusCode).toEqual(200)

    // Agora verificamos accessToken e refreshToken corretamente
    expect(refreshResponse.body).toHaveProperty('accessToken')
    expect(refreshResponse.body.accessToken).toBeDefined()

    expect(refreshResponse.body).toHaveProperty('refreshToken')
    expect(refreshResponse.body.refreshToken).toBeDefined()
>>>>>>> origin/master
  })
})