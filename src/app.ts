import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { setRoutes } from './routes/userRoutes';
import { setAuthRoutes } from './routes/authRoutes';
import { attachUserFromJwt, cookieParserMiddleware } from './middleware/requireAuth';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParserMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(attachUserFromJwt);

// Routes
setAuthRoutes(app);
setRoutes(app);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});