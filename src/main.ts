import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import httpProxy from 'express-http-proxy';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';
import { UsersProvider } from "./providers/users.provider"
import jwt from 'jsonwebtoken' 

const app = express();

const pathfile = resolve(process.cwd(), 'config.yml');
const readConfig = readFileSync(pathfile, { encoding: 'utf8' });
const { services } = safeLoad(readConfig, { json: true });


app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const USER_URL_MS: string = 'http://localhost:3001'
const MEDICINE_URL_MS: string = 'http://localhost:3002'
app.get('/', (req, res) => {
  return res.json({ message: 'Running application' });
});

let checkToken = (req, res, next) => { 
  let authToken = req.headers["authorization"] 
  if (!authToken) {         
      res.status(401).json({ message: 'Token de acesso requerida' }) 
  } 
  else { 
      let token = authToken.split(' ')[1] 
      req.token = token 
  } 

  jwt.verify(req.token, 'secretKey', (err, decodeToken) => { 
      if (err) { 
          res.status(401).json({ message: 'Acesso negado'}) 
          return 
      }
      req.user_id = decodeToken.userId 
      next() 
  }) 
} 

let isAdmin =  async (req, res, next) => { 
  const usersProvider = new UsersProvider();  
  const user: any = await usersProvider.findOneUser(req.user_id)    
   
  if(user.role === 'ADMIN') {
    next()
    return  
  }else { 
    res.status(403).json({ message: 'Role de ADMIN requerida' }) 
    return 
  } 
}

app.post(`/auth/sessions`, httpProxy(USER_URL_MS, { timeout: 3000 }));

app.get(`/users`, checkToken, httpProxy(USER_URL_MS, { timeout: 3000 }));
app.post(`/users`, httpProxy(USER_URL_MS, { timeout: 3000 }));
app.get(`/users/:id`, checkToken, httpProxy(USER_URL_MS, { timeout: 3000 }));

app.get(`/roles`, httpProxy(USER_URL_MS, { timeout: 3000 }));
app.post(`/roles`, checkToken, httpProxy(USER_URL_MS, { timeout: 3000 }));
app.delete(`/roles/:id`, checkToken, httpProxy(USER_URL_MS, { timeout: 3000 }));
app.get(`/roles/:id`, checkToken, httpProxy(USER_URL_MS, { timeout: 3000 }));

app.get(`/medicines`, checkToken, httpProxy(MEDICINE_URL_MS, { timeout: 3000 }));
app.post(`/medicines`, checkToken, httpProxy(MEDICINE_URL_MS, { timeout: 3000 }));
app.delete(`/medicines/:id`, checkToken, httpProxy(MEDICINE_URL_MS, { timeout: 3000 }));
app.get(`/medicines/:id`, checkToken, httpProxy(MEDICINE_URL_MS, { timeout: 3000 }));

app.get(`/medicineUsers`, checkToken, httpProxy(MEDICINE_URL_MS, { timeout: 3000 }));
app.post(`/medicineUsers`, checkToken, httpProxy(MEDICINE_URL_MS, { timeout: 3000 }));
app.delete(`/medicineUsers/:id`, checkToken, httpProxy(MEDICINE_URL_MS, { timeout: 3000 }));
app.get(`/medicineUsers/:id`, checkToken, httpProxy(MEDICINE_URL_MS, { timeout: 3000 }));

app.listen(3000, () => console.log('Running application'));
