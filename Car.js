function Car(genes){
    this.pos = createVector(0, height/2);
    this.acc = createVector(0, 0);
    this.vel = createVector(0, 0);
    
    this.maximum_angle = 30;
    this.current_angle = 0;
    
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
        
        
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc = createVector(0, 0);
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
//        fill(this.color);
        rect(this.pos.x, this.pos.y, car_h, car_w);
        tire_w = 20;
        tire_h = 10;

        // front up
        push();
            fill(255, 0, 0);
            push();
                translate(this.pos.x + 10 + tire_w/2, this.pos.y -5 + tire_h/2);
                rotate(radians(this.current_angle));
                rect(-tire_w/2, -tire_h/2, tire_w, tire_h);
            pop();

            // front down
            push();
                translate(this.pos.x + 10 + tire_w/2, this.pos.y -5 + tire_h/2 + car_w);
                rotate(radians(this.current_angle))
//                rect(0, car_w, tire_w, tire_h);
                rect(-tire_w/2, -tire_h/2, tire_w, tire_h);
            pop();
        
        pop();
        
        // rare 
        push();
        translate(this.pos.x + 10 + axis_h, this.pos.y -5);
        rect(0, 0, tire_w, tire_h);
        rect(0, car_w, tire_w, tire_h);
        pop();
    }
    
    this.hits = function(obstacle){
        
    }
}
