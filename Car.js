function Car(genes){
    this.pos = createVector(width/2, height);
    this.acc = createVector(0, 0);
    this.vel = createVector(0, 0);
    
    this.color = color(random(255), random(255), random(255));
    
    this.fitness = 1; 
    this.is_dead = false;
    
    this.genes = genes || [];
    this.next_genes = [];
    
    
    this.applyForce = function(force){
        this.acc.add(force);
    }
    
    this.update = function(){
        if (this.is_dead) return;
        
        
        this.pos.add(this.acc);
        
    }
    
    this.evaluate = function(){
        
    }
    
    this.constrain_to_screen = function(){
        // don't get outside the screen
        if (this.pos.y > height){ // on floor
            this.is_dead = true;
        }
        if (this.pos.x > width){ // on left
            this.is_dead = true;
        }
        if (this.pos.x < 0){ // on right
            this.is_dead = true;
        }
        
        if (this.is_dead){ // remove the defective gene
            this.next_genes.splice(this.jump_counter-1, 1);
        }
        // do we care about shooting above top? probably not
    }
    
    this.show = function(){
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, 30, 30);
    }
    
    this.hits = function(ramp){
        
    }
}
