const express = require('express')
const app = express()

const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Origin, Accept')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

app.use(express.urlencoded())
app.use(express.json())

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tourism Express API with Swagger',
      version: '0.1.0',
      description: 'Documentation of Tourism API Application',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Tourism',
        url: 'http://localhost:3001',
      },
    },
    servers: [
      {
        url: 'http://34.76.185.185:5000/',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000/',
        description: 'Development server',
      },
    ],
  },
  apis: [`${__dirname}/routes/v1/*.js`],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }))

/** Start Route Definition */
app.get('/', (req, res) => {
	res.send('Hello World Tourism')
})

app.use('/hotels/berlin/rooms', require('./routes/rooms'))

//http://localhost:5000/  or just localhost:5000
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}...`))