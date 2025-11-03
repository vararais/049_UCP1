const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./models');
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);

app.listen(PORT, () => {
    console.log('Server started on port 3000');
});

db.sequelize.sync()
    .then((result) => {
        app.listen(3000, () => {
                console.log('Server started');
            })
        })
        .catch((err) => {
            console.log(err);
        });

app.post('/music', async(req, res) => {
    const data = req.body;
    try{
        const music = await db.Music.create(data);
        res.send(music);
    } catch(err){
        res.send(err);
    }
});

app.get('/music', async(req, res) => {
    try{
        const music = await db.Music.findAll();
        res.send(music);
    } catch(err){
        res.send(err);
    }
});

app.put('/music/:id', async(req, res) => {
    const id = req.params.id;
    const data = req.body;

    try{
        const music = await db.Music.findByPk(id);
        if(!music){
            return res.status(404).send({message: 'Saat ini musik tidak tersedia'});
        }
        await music.update(data);
        res.send({message: "Musik berhasil diperbarui", music});
    } catch(err){
        res.status(500).send(err);
    }
});

app.delete('/music/:id', async(req, res) => {
    const id = req.params.id;

    try{
        const music = await db.Music.findByPk(id);
        if(!music){
            return res.status(404).send({message: 'Saat ini musik belum tersedia'});
        }
        await music.destroy();
        res.send({message: "Musik berhasil dihapus"});
    } catch(err){
        res.status(500).send(err);
    }
});
