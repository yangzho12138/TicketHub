import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'; // import the real one, but during the test, it will be the fake one

it('has a route handler listening to /api/tickets for post requests', async() => {
    const response = await request(app)
    .post('/api/tickets')
    .send({})

    expect(response.status).not.toEqual(404)
})

it('can not be accessed if the user is not signed in', async() => {
    await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
})

it('can be accessed if the user is signed in, retune status is not 401', async() => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})

    expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: '',
        price: 10,
      })
      .expect(400);
  
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        price: 10,
      })
      .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'fight',
        price: -10,
      })
      .expect(400);
  
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'fight',
      })
      .expect(400);
  });

  it('success create a ticket with valid input', async() => {
        let tickets = await Ticket.find({})
        expect(tickets.length).toEqual(0)

        const title = 'fight';

        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price: 20,
        })
        .expect(201);

        tickets = await Ticket.find({});
        expect(tickets.length).toEqual(1);
        expect(tickets[0].price).toEqual(20);
        expect(tickets[0].title).toEqual(title);
  })

it('publish an event', async() => {
  const title = 'fight';

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title,
    price: 20,
  })
  .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
