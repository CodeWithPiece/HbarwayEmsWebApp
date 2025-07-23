require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const upload = require("express-fileupload");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pageRoutes = require('./routes/pageRoutes');
const userRoutes = require('./routes/userRoute');
const taskRoutes = require('./routes/taskRoute');
const taskDocumentRoutes = require('./routes/taskDocumentRoute');
const masterRoute = require('./routes/masterRoute');
const app = express();

app.use(cors({
    // origin: 'http://localhost:3000',
    origin: '*',
    credentials: true
}));
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    })
);
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(upload());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/taskdocument', taskDocumentRoutes);
app.use('/api/master', masterRoute);
app.use('/', pageRoutes);

app.use((req, res, next) => {
    const allowedPages = [
        '/',
        '/user-management',
        '/user-attendance',
        '/work-allotment',
        '/work-progress',
        '/work-details',
        '/invalid-page',
        // '/profile-details',
        '/dashboard'
    ];
    const url = req.originalUrl.split('?')[0];
    if (url.startsWith('/api') || !allowedPages.includes(url)) {
        return res.redirect('/invalid-page');
    }
    next();
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));