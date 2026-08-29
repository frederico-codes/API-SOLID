import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { beforeAll, afterAll, describe, it, expect } from 'vitest'

describe('Create Gym (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Gym',
        description: 'A new gym for testing',
        phone: '1234567890',
        latitude: -23.55052,
        longitude: -46.633308,
      })

    expect(response.statusCode).toEqual(201)
  })
})
