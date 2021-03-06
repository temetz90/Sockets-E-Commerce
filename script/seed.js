'use strict'

const db = require('../server/db')
const {
  User,
  Product,
  Order,
  ProductOrder,
  Review
} = require('../server/db/models')

const faker = require('faker')
const productCategories = ['Video Games', 'PC Parts', 'Drones', 'Other']
const orderStatuses = ['pending shipping', 'completed']
const randomInt = function(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const seedUsers = async function() {
    for (let i = 0; i < 100; i++) {
      await User.create({
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      })
    }
  }

  const seedProducts = async function() {
    for (let i = 0; i < 100; i++) {
      await Product.create({
        invQuantity: randomInt(20) + 1,
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        photo: faker.image.technics(640, 480, randomInt(10) + 1),
        category: productCategories[randomInt(4)],
        price: faker.finance.amount(1, 100, 2)
      })
    }
  }

  const seedReviews = async function() {
    for (let i = 0; i < 200; i++) {
      const user = await User.findByPk(randomInt(100) + 1)
      const product = await Product.findByPk(randomInt(100) + 1)

      const review = await Review.create({
        rating: randomInt(5) + 1,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph()
      })

      await review.setUser(user)
      await product.addReview(review)
    }
  }

  const seedOrders = async function() {
    for (let i = 0; i < 200; i++) {
      const user = await User.findByPk(randomInt(100) + 1)
      const order = await Order.create({
        status: orderStatuses[randomInt(2)],
        userId: user.id
      })

      const cart = await Order.create({
        status: 'in cart',
        userId: user.id
      })

      const product1 = await Product.findByPk(randomInt(100) + 1)
      const product2 = await Product.findByPk(randomInt(100) + 1)
      const product3 = await Product.findByPk(randomInt(100) + 1)

      await order.addProduct(product1)
      await order.addProduct(product2)
      await order.addProduct(product3)
    }
  }
  await seedUsers()
  await seedProducts()
  await seedReviews()
  await seedOrders()

  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
