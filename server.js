const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',  // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }   // Set to true if you're using HTTPS
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'pet-images')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

app.get('/', (req, res) => {
    res.render('home', { session: req.session });
});

// Home route
app.get('/home', (req, res) => {
    res.render('home', { session: req.session });
});

app.get('/dog-care', (req, res) => {
    res.render('dog-care', { session: req.session });
});

app.get('/cat-care', (req, res) => {
    res.render('cat-care', { session: req.session });
});

// Login page
app.get('/login', (req, res) => {
    res.render('login', { errorMessage: null, session: req.session });
});

// Handle login submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile('text-files/login.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading login data:', err);
            res.status(500).send('Error reading login data');
            return;
        }

        const users = data.trim().split('\n');
        const isAuthenticated = users.some(user => {
            const [storedUser, storedPass] = user.split(':');
            return storedUser === username && storedPass === password;
        });

        if (isAuthenticated) {
            req.session.user = username;
            res.redirect('/donate-pet');
        } else {
            res.render('login', { errorMessage: 'Invalid username or password', session: req.session });
        }
    });
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error logging out');
            return;
        }
        res.redirect('/home');
    });
});

// Create Account page
app.get('/create-account', (req, res) => {
    res.render('create-account', { errorMessage: null, successMessage: null, session: req.session });
});

// Handle Create Account POST
app.post('/create-account', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password || !/^[a-zA-Z0-9]+$/.test(username) || password.length < 4) {
        res.render('create-account', {
            errorMessage: 'Invalid username or password format',
            successMessage: null,
            session: req.session
        });
        return;
    }

    fs.readFile('text-files/login.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading login data:', err);
            res.status(500).send('Error reading login data');
            return;
        }

        const users = data.trim().split('\n');
        const userExists = users.some(user => user.split(':')[0] === username);

        if (userExists) {
            res.render('create-account', {
                errorMessage: 'Username already exists',
                successMessage: null,
                session: req.session
            });
        } else {
            const newUser = `${username}:${password}\n`;
            fs.appendFile('text-files/login.txt', newUser, (err) => {
                if (err) {
                    console.error('Error writing to login.txt:', err);
                    res.status(500).send('Error creating account');
                    return;
                }
                res.render('create-account', {
                    errorMessage: null,
                    successMessage: 'Account created successfully! You can now log in.',
                    session: req.session
                });
            });
        }
    });
});

// Find a Dog or Cat
app.get('/find-animal', (req, res) => {
    const { animalType, breed, age, sex, compatibility } = req.query;

    fs.readFile('text-files/pets.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading pets.txt:', err);
            res.status(500).send('Error loading pet data');
            return;
        }

        let pets = data.trim().split('\n').map(line => {
            const [id, name, age, breed, sex, compatibility, description, owner, type] = line.split(':');
            return { id, name, age: parseInt(age, 10), breed, sex, compatibility, description, owner, type };
        });

        // Separate dog and cat breeds based on the 'type' field
        const dogBreeds = [...new Set(pets.filter(pet => pet.type.toLowerCase() === 'dog').map(pet => pet.breed))];
        const catBreeds = [...new Set(pets.filter(pet => pet.type.toLowerCase() === 'cat').map(pet => pet.breed))];

        const uniqueAges = [...new Set(pets.map(pet => pet.age))].sort((a, b) => a - b);

        // Filter by animal type
        if (animalType) {
            pets = pets.filter(pet => pet.type.toLowerCase() === animalType.toLowerCase());
        }

        // Filter by breed (case insensitive)
        if (breed && breed !== 'any') {
            pets = pets.filter(pet => pet.breed.toLowerCase() === breed.toLowerCase());
        }

        // Filter by age range
        if (age && age !== 'any') {
            let [minAge, maxAge] = age.split('-').map(Number);
            pets = pets.filter(pet => pet.age >= minAge && pet.age <= maxAge);
        }

        // Filter by sex (case insensitive)
        if (sex && sex !== 'any') {
            pets = pets.filter(pet => pet.sex.toLowerCase() === sex.toLowerCase());
        }

        // Filter by compatibility (case insensitive)
        if (compatibility) {
            const compatArray = Array.isArray(compatibility) ? compatibility : [compatibility];
            pets = pets.filter(pet => 
                compatArray.every(compat => pet.compatibility.toLowerCase().includes(compat.toLowerCase()))
            );
        }

        // Render the filtered pets to the find-animal.ejs template
        res.render('find-animal', { filteredPets: pets, session: req.session, searchCriteria: req.query, dogBreeds, catBreeds, uniqueAges });
    });
});

// Donate Pet page (requires login)
app.get('/donate-pet', isAuthenticated, (req, res) => {
    res.render('donate-pet', { session: req.session, errorMessage: null });
});

app.post('/donate-pet', isAuthenticated, (req, res) => {
    const { breed, age, sex, compatibility, comments } = req.body;
    const owner = req.body['owner-name'];  // Owner's name from the form
    const animalType = req.body['animal-type']; // Cat or Dog

    const petsFilePath = path.join(__dirname, 'text-files/pets.txt');
    fs.readFile(petsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading pets.txt:', err);
            res.status(500).send('Error saving pet data');
            return;
        }

        const pets = data.trim().split('\n');
        const newId = pets.length + 1;

        // Join the compatibility values with commas, assuming they come as an array
        const compatibilityStr = Array.isArray(compatibility) ? compatibility.join(',') : compatibility;

        // Construct the new pet entry
        const newPet = `${newId}:${owner}:${age}:${breed}:${sex}:${compatibilityStr}:${comments}:${owner}:${animalType}\n`;

        fs.appendFile(petsFilePath, newPet, (err) => {
            if (err) {
                console.error('Error writing to pets.txt:', err);
                res.status(500).send('Error saving pet data');
                return;
            }

            // Add new breed to the list if it's not there
            const breedsFilePath = path.join(__dirname, 'text-files/breeds.txt');
            fs.readFile(breedsFilePath, 'utf8', (err, breedData) => {
                if (err) {
                    console.error('Error reading breeds.txt:', err);
                    res.status(500).send('Error updating breed data');
                    return;
                }

                const breeds = breedData.trim().split('\n');
                if (!breeds.includes(breed)) {
                    fs.appendFile(breedsFilePath, `${breed}\n`, (err) => {
                        if (err) {
                            console.error('Error writing to breeds.txt:', err);
                            res.status(500).send('Error updating breed data');
                            return;
                        }
                        res.redirect('/find-animal');
                    });
                } else {
                    res.redirect('/find-animal');
                }
            });
        });
    });
});

// Contact Us page
app.get('/contact', (req, res) => {
    res.render('contact', { session: req.session, errorMessage: null });
});

// Start server
app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:3000');
});
