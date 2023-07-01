import { app } from '@/app'
import request from 'supertest'
import { it, afterAll, beforeAll, describe, expect } from 'vitest'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example2.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example2.com',
      password: '123456',
    })

    const { token } = authResponse.body

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example2.com',
      }),
    )
  })
})