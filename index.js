const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

var cors = require('cors')
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            // "https://assignment-12-humayun-ph-b9.netlify.app",
        ],
        credentials: true,
    })
);

app.use(express.json())
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o9b6e9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o9b6e9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const database = client.db("GadgetZone");
        const phonesCollection = database.collection("phones");


        app.get('/phones', async (req, res) => {
            const brand = req.query.brand; // Get brand from query params
            const category = req.query.category; // Get category from query params
            const name = req.query.productname; // Get category from query params
            console.log({ brand, category, name });
            // const productname=name.toLocaleLowerCase()



            let query = {};

            if (brand && brand !== 'null') {
                query.brand = brand;
            }

            if (category && category !== 'null') {
                query.category = category;
            }

            if (name) {
                query.productname = { $regex: name, $options: "i" };
            }



            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const allProducts = await phonesCollection.find()

                .skip(page * size)
                .limit(size)
                .toArray();





            try {

                // const result = await phonesCollection.find(query).toArray();
                // res.send(result);
                const count = await phonesCollection.countDocuments()
                // console.log(allProducts, count)

                res.send({
                    phones: allProducts,
                    count: count
                })
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: "Internal Server Error" });
            }
        });






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Gadged Zone server is running')
})

app.listen(port, () => {
    console.log(`Server is Running on port ${port}`)
})
