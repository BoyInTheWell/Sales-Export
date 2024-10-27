import dotenv from 'dotenv';
dotenv.config()
import express, { response } from "express";
import fs from 'node:fs';

const app = express();
const PORT = 3000;

app.use(express.static('public/css'));
app.use(express.static('public/javascript'));
app.use(express.json())

app.get("/", (req, res) => {
    fs.readFile('./index.html', 'utf8', (err, html) => {
        if (err) {
            response.status(500).send('sorry, out of order')
        }
        res.send(html);
    })
  
});

app.post('/alert', (req, res) => {
    res.send('POST Called with body ' + req.body.name + " " + process.env.CLIENT_ID)
    
})

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});