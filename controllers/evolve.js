// Emploi  
class Emploi {
    constructor(a , b, c) 
    {
        this.matières = a;
        this.salles = b;
        this.durées = c;
        this.emploi = [];
        this.fitnessValue = 0;
    }
    createEmploi()
    {
        for(let i=0; i<this.matières.length; i++) {
            this.emploi[i] = [];
            let Sal = Math.floor(Math.random(1)*this.salles.length) ;
            let Dur = Math.floor(Math.random(1)*this.durées.length) ;
            this.emploi[i][0] = this.matières[i].id ;
            this.emploi[i][1] = this.matières[i].professeurs[0] ;
            this.emploi[i][2] = this.salles[Sal].id ;
            this.emploi[i][3] = this.durées[Dur] ;
        }
    }
    calculateFitness()
    {

        //hardContraints
        let durées = [];
        let professeurs = [];
        let salles = [];
        let hc1 = 0;
        let v1 = 0;
        let hc2 = 0;
        let v2 = 0;
        //softContraints
        // let sc1 = 0;
        // let w1 = 0;

        for(let i=0; i<this.matières.length; i++) {
            durées = [...durées, this.emploi[i][3]];
        }
        for(let i=0; i<this.matières.length; i++) {
            salles = [...salles, this.emploi[i][2]];
        }
        for(let i=0; i<this.matières.length; i++) {
            professeurs = [...professeurs, this.emploi[i][1]];
        }
        for(let i=0; i<durées.length; i++) {
            for(let j=0; j<durées.length; j++) {
                if(j<i){
                    if(durées[j] == durées[i]){
                        if(professeurs[j] == professeurs[i]){
                            hc1 = 1;
                            v1 = v1 + 0.5;
                        }
                        if(salles[j] == salles[i]){
                            hc2 = 1;
                            v2 = v2 + 0.5;
                        }
                    }
                }else if(j>i){
                    if(durées[j] == durées[i]){
                        if(professeurs[j] == professeurs[i]){
                            hc1 = 1;
                            v1 = v1 + 0.5;
                        }
                        if(salles[j] == salles[i]){
                            hc2 = 1;
                            v2 = v2 + 0.5;
                        }
                    }
                }else{
                    continue;
                }
            }
        }

        //fitnessValue
        this.fitnessValue = 1 / (1 + (hc1*v1 + hc2*v2));
    }    
       
}

// Population
const Population = (matières, salles, durées, size) => {
    const emplois = [];
    for (let i = 0; i <size; i++) {
        let emp = new Emploi(matières, salles, durées);
        emp.createEmploi();
        emp.calculateFitness();
        emplois[i] = {emploi: emp.emploi, fitness: emp.fitnessValue};
    }
    return emplois;
}

// Selection
const pickOne = (emplois) => {
    let index = 0;
    let r = Math.random(1);

    while(r > 0 && index < emplois.length){
        r = r - emplois[index].fitness;
        if(r > 0){
            index++;
        }
    }
    return emplois[index];
}

// Crossover
const crossover = (firstPatner, secondPatner) => {
    let newEmploi = [] ;
    let point = Math.floor(Math.random(1)*firstPatner['emploi'].length) ;

    for (let i = 0; i <firstPatner['emploi'].length;i++){
        if(i>point){
        newEmploi[i] = firstPatner.emploi[i];
        }else {
        newEmploi[i] = secondPatner.emploi[i];
        }
    }
    return newEmploi;
}

// Mutation  
const mutation = (emploi, matières, salles, durées) => {
    let newEmploi = Population(matières, salles, durées, 1)[0].emploi ;
    let i = Math.floor(Math.random(1)*emploi.length) ;
    for(let j=2; j<4;j++){
        if(Math.random(1)<0.01){
            emploi[i][j] = newEmploi[i][j];
        }
    }
    return emploi;
}

// searchElit
const searchElit = (emplois, matières, salles, durées) => {
    let Elits = [];
    let elitFitness = 0;
    let maxFitness = 0;
    let indexOfmaxFitness = 0;

    // Search if Someone Verify All Contraints
    for(let i=0; i<emplois.length; i++){
        if(emplois[i].fitness === 1){
            Elits.push(emplois[i]);
        }
    }
    
    if(Elits.length > 0){
        elitFitness = 1;
        return Elits[0]; 
    }else{
        while(elitFitness == 0){

            // Save the Elit for Next Generation
            for(let i=0; i<emplois.length; i++){
                if(maxFitness < emplois[i].fitness){
                    maxFitness = emplois[i].fitness;
                    indexOfmaxFitness = i;
                }
            }
            if(emplois.length >= 3){
                emplois.splice(indexOfmaxFitness, 1);
            }            
            
            // Selection
            var parentA = pickOne(emplois);
            var parentB = pickOne(emplois);

            // Crossover
            if(parentA && parentB){
                var crossed = crossover(parentA, parentB);
            } 

            // Mutation  
            if(crossed){
                var mutated = mutation(crossed, matières, salles, durées);
            }

            // test 
            if(mutated){
                let z = new Emploi(matières, salles, durées);
                z.emploi = mutated;
                z.calculateFitness();
                if(z.fitnessValue == 1){
                    elitFitness = 1;
                    return {emploi: z.emploi, fitness: z.fitnessValue};
                }  
            }


        }
  
    }
}



module.exports = { Population, searchElit };