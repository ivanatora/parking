function Car(genes){
    this.pos = createVector(0, height/2 - car_w/2);
    this.acc = createVector(0, 0);
    this.vel = createVector(0, 0);
    
//    this.maximum_wheel_angle = 30;
    this.maximum_wheel_angle = 60;
    this.current_wheel_angle = 0;
    this.car_angle = 0;
    this.current_turning_radius = 0;
    
    this.color = color(random(255), random(255), random(255));
    
    this.fitness = 1; 
    this.is_dead = false;
    
    this.genes = genes || [];
    this.next_genes = [];
    this.update_counter = 0
    
    
    this.applyForce = function(force){
        this.acc.add(force);
    }
    
    this.update = function(){
        if (this.is_dead) return;
        
        var impulse;
        
        if (this.genes.length > 0 && this.genes.length > this.update_counter){
            impulse = this.genes[this.update_counter];
        }
        else {
            impulse = random(-5, 5); // random rotation
        }
        this.next_genes.push(impulse); // save for further generations
        
        if (this.current_wheel_angle + impulse < this.maximum_wheel_angle){
            this.current_wheel_angle += impulse;
        }
        else {
            this.current_wheel_angle += this.maximum_wheel_angle - this.current_wheel_angle;
        }
        
        // impulse. ...
        
        if (this.update_counter == 0){
            this.applyForce([1, 0]);
        }
        
        if (this.current_wheel_angle != 0){
            this.vel.rotate(radians(impulse));
            this.car_angle = this.current_wheel_angle;
            
            this.current_turning_radius = axis_h / sin(radians(this.current_wheel_angle));
            turning_circle_len = abs(PI * 2 * this.current_turning_radius);
            console.log('angle is', this.current_wheel_angle, 'radius is', this.current_turning_radius, 'circle len is', turning_circle_len)
            
            // speed is constant 1
            omega = 1 / turning_circle_len;
        }
//        console.log(this.vel)
        
        
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc = createVector(0, 0);
        
        this.update_counter++;
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
        tire_w = 20;
        tire_h = 10;
        dfb = 10; // distance wheel - front bumber
        dra = dfb + axis_h; // distance to rare axle
            
        push();
//            translate(20, 20);
//            rotate(radians(this.car_angle))
            translate(this.pos.x + dfb, this.pos.y);

            rect(0, 0, car_h, car_w);

            // front up
            push();
                fill(255, 0, 0, 100);
                push();
                    translate(dfb + tire_w/2, -5 + tire_h/2);
                    rotate(radians(this.current_wheel_angle));
                    rect(-tire_w/2, -tire_h/2, tire_w, tire_h);
                pop();

                // front down
                push();
                    translate(dfb + tire_w/2, -5 + tire_h/2 + car_w);
                    rotate(radians(this.current_wheel_angle))
                    rect(-tire_w/2, -tire_h/2, tire_w, tire_h);
                pop();

            pop();

            // rare 
            push();
                translate(dra, -5);
                rect(0, 0, tire_w, tire_h);
                rect(0, car_w, tire_w, tire_h);
            pop();
        
        pop();
    }
    
    this.hits = function(obstacle){
        
    }
}
