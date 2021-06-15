const express = require('express');
const router = express.Router();
const { Population, searchElit } = require("../controllers/evolve");



router.get('/emploi/generate', (req, res) => {
    var { matières, salles, durées } = req.body;
    if(matières && salles && durées){        
        let population = Population(matières, salles, durées, 100);
        res.send(searchElit(population, matières, salles, durées));
    }
})



module.exports = router;