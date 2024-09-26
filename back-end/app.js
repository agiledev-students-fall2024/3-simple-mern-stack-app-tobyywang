require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// a route for "About Us"
app.get('/about', async (req, res) => {
  res.json({
    title: "About Us",
    paragraphs: ["My name is Toby. My favorite activity outside of school is playing sports with friends, most of the time golf and basketball. For golf, we often go outside of Manhattan to Queens or New Jersey by taking the LIRR or Ubers to play. It’s nice to leave the city once in a while and to travel a little bit with friends. I also like to play pickup basketball with friends and neighbors sometimes. Where I lived before, there was a basketball half-court that I would go every weekend over the summer to meet people and play. Now that I’ve moved, I haven’t played yet because I don’t have access to a court anymore, but I am definitely still open to playing.", "I grew up in Asia, also in a metropolitan area. Coming to NYC for college hasn’t been a culture shock at all due to the similarities of the cities. But something unique about NYC and going to school in NYC is the way it teaches you to be independent. Although I am still in college, and since I live off campus, it feels as if I have been years out of college. I enjoy the easy access to the city and how many different people you can meet here. During my high school, it was a very tight social circle, and everyone knew each other. This big change in the social scene is very exciting.", "While I currently really enjoy living in NYC, I have still yet to decide where I want to reside long term after graduation. Sometimes it is nice to have a break. I’ve noticed that since coming here for college, every time I go back to an Asian city, I start to notice things that I appreciate which I never did before."],
    imageUrl: "https://github.com/agiledev-students-fall2024/3-simple-mern-stack-app-tobyywang/blob/master/IMG_2452.jpg?raw=true"
  })
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
