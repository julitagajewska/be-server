require('dotenv').config()
const cors = require('cors')

const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
)
const port = process.env.PORT || 3000

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', error => console.log('MongoDB connection error:' + error))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

app.use(express.json())

const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

const accountsRouter = require('./routes/accounts')
app.use('/accounts', accountsRouter)

const categoriesRouter = require('./routes/categories')
app.use('/categories', categoriesRouter)

const transactionsRouter = require('./routes/transactions')
app.use('/transactions', transactionsRouter)

const goalsRouter = require('./routes/goals')
app.use('/goals', goalsRouter)

const budgetsRouter = require('./routes/budgets')
app.use('/budgets', budgetsRouter)

const trackedCategoriesRouter = require('./routes/trackedCategories')
app.use('/trackedCategories', trackedCategoriesRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
