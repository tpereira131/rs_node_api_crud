const express = require('express');

const server = express();

server.use(express.json())

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Diego", "email": "diego@rocketseat.com.br" }

const users = ['Diego', 'Robson', 'Victor']

server.use((req, res, next) => {
    console.time('Request')
    console.log(`Metodo: ${req.method}; URL: ${req.url}`);

    next();

    console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({error: 'User name is required'});
    }
    return next();
}

function checkUserInArray(req, res, next) {
    const user = users[req.params.index] 
    if(!user){
        return res.status(400).json({error: 'User does not exists'})
    }
    req.user = user;

    return next()
}

// lista todos os usuarios
server.get('/users', (req, res) => {
    return res.json(req.users);
})

// lista usuario
server.get('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params;

    return res.json(users[index]);
})

// criação de um novo usuario
server.post('/users', checkUserExists, (req, res) => {
    const { name } = req.body;

    users.push(name);
    
    return res.json(users);
});


//Editar usuario
server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
    const { index } = req.params;
    
    const { name } = req.body;

    users[index] = name;

    return res.json(users)
})

//excluir usuario
server.delete('/users/:index', checkUserInArray, (req,res) => {
    const { index } = req.params;

    users.splice(index,1);

    return res.send();
});

server.listen(3000);

