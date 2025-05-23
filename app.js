const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const config = require('./config/config');

const app = express();

mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('MongoDB conectado com sucesso'))
  .catch(err => console.log('Erro MongoDB:', err));

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API ControleFC funcionando!');
});

app.listen(config.PORT, () => {
    console.log(`Servidor rodando na porta ${config.PORT}`);
});
