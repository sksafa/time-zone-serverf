const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.phmej.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("ecommerce").collection("eproduct");
    const orderProductCollection = client.db("ecommerce").collection("orderProduct");
    console.log('db connected')


    app.get('/product',(req,res)=>{
        productCollection.find()
        .toArray((err,productItems)=>{
           res.send(productItems)
           console.log(productItems)
        })
                       
    })

    app.get('/orderProduct/:id',(req,res) =>{
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err,documents)=>{
          res.send(documents[0]);
        } )
      })

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log('add new ', newProduct)
        productCollection.insertOne(newProduct)
            .then(result => {
                console.log('inserted')
                res.send(result.insertedCount > 0)
            })

    })

    app.post('/orderProductList', (req, res) => {
        const newProduct = req.body;
        console.log('add new ', newProduct)
        orderProductCollection.insertOne(newProduct)
            .then(result => {
                console.log('inserted')
                res.send(result.insertedCount > 0)
            })

    })

    app.get('/orderProductListInfo',(req,res)=>{
        orderProductCollection.find({email: req.query.email})
        .toArray((err,productItems)=>{
           res.send(productItems)
           console.log(productItems)
        })
                       
    })

    app.delete('/deleteProduct/:id',(req,res)=>{
        productCollection.findOneAndDelete({_id: ObjectId(req.params.id)})
        .then(documents => res.send(documents))

    })


});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})