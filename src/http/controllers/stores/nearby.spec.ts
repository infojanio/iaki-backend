import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
describe('Nearby Stores (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able list nearby stores', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    // Criando lojas dentro do raio permitido (<= 40 km)
    await request(app.server)
      .post('/stores')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Loja Arraias',
        slug: 'Some description.',
        latitude: -12.9301785,
        longitude: -46.9520646,
      })

    // Criando uma loja FORA do raio permitido (> 40 km)
    await request(app.server)
      .post('/stores')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Loja Alto Paraíso',
        slug: 'Some description.',
        latitude: -27.2092052, // Distância maior
        longitude: -47.5271038, // Distância maior
      })

    // Chamando a rota de busca de lojas próximas
    const response = await request(app.server)
      .get('/stores/nearby')
      .query({
        latitude: -13.0382409, //localização do cliente
        longitude: -46.7712408, //localização do cliente
      })
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.statusCode).toEqual(200)
    expect(response.body.stores).toHaveLength(1)
    expect(response.body.stores).toEqual([
      expect.objectContaining({
        name: 'Loja Arraias',
      }),
    ])
  })
})
