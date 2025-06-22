const express = require('express');
const axios = require('axios');
const env = require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const PRIVATE_APP_ACCESS = process.env.PRIVATE_KEY;

app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

app.post('/update-cobj', async (req, res) => {
  const newPet = {
    properties: {
      pet_name: req.body.name,
      pet_age: req.body.age,
      pet_breed: req.body.breed,
      pet_type: req.body.type,
      pet_owner: req.body.owner,
    },
  };

  const createPet = `https://api.hubapi.com/crm/v3/objects/pets`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(createPet, newPet, { headers });
    res.redirect('/');
  } catch (err) {
    console.error('Error adding new pet:', err.response?.data || err.message);
    res.status(500).send('Failed to add pet');
  }
});



app.get('/update', async (req,res)=>{
    const email=req.query.email;

    const getContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=email,favorite_book`;
     const headers ={
        Authorization:`Bearer ${private_app_token}`,
        'Content-Type':'application/json'
    }
     try{
         const response = await axios.get(getContact ,{headers});
         const data = response.data;
        res.render('update',{userEmail:data.properties.email,favorite_book:data.properties.favorite_book});
     } catch(error){
        console.error(error);
     }
});



app.get('/', async (req, res) => {
    const pets = 'https://api.hubspot.com/crm/v3/objects/pets?limit=10&properties=pet_name&properties=pet_age&properties=pet_breed&properties=pet_owner&properties=pet_type&properties=hs_object_id&archived=false';
       
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(pets,{headers});
        const data = resp.data.results;
        res.render('pets', { title: 'Pets | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});



app.listen(3000, () => console.log('Listening on http://localhost:3000'));

