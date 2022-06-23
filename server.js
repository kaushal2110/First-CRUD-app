const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(bodyParser.json())

MongoClient.connect('mongodb+srv://Kaushal:kaushalDev@cluster0.nqd8p.mongodb.net/?retryWrites=true&w=majority', {useUnifiedTopology: true})
.then(client => {
  console.log('Connected to the database')
  const db = client.db('star-wars-quotes')
  const quotesCollection = db.collection('quotes')

  app.post('/quotes', (req, res) => {
    quotesCollection.insertOne(req.body)
    .then(result => {
      res.redirect('/')
    })
    .catch(error => console.error(err))
  })

  app.get('/', (req, res) => {
    const cursor = db.collection('quotes').find().toArray()
    .then(results => {
      res.render('index.ejs', {quotes: results})
    })
    .catch(error => console.error(error))
  })

  app.put('/quotes', (req, res) => {
    quotesCollection.findOneAndUpdate(
      { name: 'Yoda'},
      {
        $set: {
          name: req.body.name,
          quote: req.body.quote
        }
      },
      {
        upsert: true
      }
    )
    .then(result => {
      res.json('Success')
    })
    .catch(error => console.error(error))
  })

  app.delete('/quotes', (req, res) => {
    quotesCollection.deleteOne(
      {name: req.body.name},
    )
    .then(result => {
      if(result.deletedCount === 0){
        return res.json('No quote to delete')
      }
      res.json('Deleted Darth Vader quote')
    })
    .catch(error => console.error(error))
  })

})

app.listen(3000, () => {
  console.log('listening on 3000')
})



