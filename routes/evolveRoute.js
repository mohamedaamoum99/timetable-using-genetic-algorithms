const express = require('express');
const router = express.Router();
const { Population, searchElit } = require("../controllers/evolve");



router.get('/emploi/generate', (req, res) => {
    var { matières, salles, durées, populationSize , mutationRate  } = req.body;
    if(matières && salles && durées && populationSize ){        
        let population = Population(matières, salles, durées, populationSize);
        res.send(searchElit(population, mutationRate, matières, salles, durées));
    }
})



module.exports = router;