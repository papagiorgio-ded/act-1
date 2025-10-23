const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  user: 'postgres',           
  host: 'mi_postgres',        
  database: 'miweb',          
  password: '1234',            
  port: 5432,
});

// Motor de plantillas
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Ruta principal
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Mi primer web',
    name1: 'Test arriba',
    name2: 'Test abajo',
  });
});

// Middleware de autenticación
const isAuth = (req, res, next) => {
  if (req.cookies && req.cookies.user) {
    return next();
  }
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.cookies && req.cookies.admin) {
    return next();
  }
  res.redirect('/login');
};

// Ruta de login
app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    name1: 'Identifícate',
    name2: 'Para continuar',
  });
});

// Logout
app.get('/logout', (req, res) => {
  res.clearCookie('user');
  res.clearCookie('admin');
  res.redirect('login');
});

// Página para usuario normal
app.get('/home', isAuth, (req, res) => {
  res.render('home', {
    title: 'Bienvenido',
    name1: 'Usuario normal',
    name2: 'Puedes ver el contenido',
  });
});

// Página para administrador
app.get('/homeadmin', isAdmin, (req, res) => {
  res.render('homeadmin', {
    title: 'Bienvenido',
    name1: 'Usuario administrador',
    name2: 'Puedes ver el contenido de administrador',
  });
});

// Lógica de login
app.post('/login', async (req, res) => {
  const { user, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM usersdb WHERE username = $1', [user]);
    const userdb = result.rows[0];

    if (userdb && bcrypt.compareSync(password, userdb.password)) {
      if (userdb.role === 'admin') {
        console.log('Login correcto admin');
        res.cookie('admin', userdb);
        res.redirect('homeadmin');
      } else {
        console.log('Login correcto usuario');
        res.cookie('user', userdb);
        res.redirect('home');
      }
    } else {
      res.status(401).redirect('login');
    }
  } catch (err) {
    console.error('Error en la base de datos:', err);
    res.status(500).send('Error en la base de datos');
  }
});

// Servidor en marcha
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
