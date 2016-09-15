function Car(genes){
    this.pos = createVector(car_h/2, height/2);
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
    
    this.tire_w = 20;
    this.tire_h = 10;
    this.dfb = 20; // distance front bumper -> front axle
    this.dra = this.dfb + axis_h; // distance front bumper -> rare axle
    this.drb = car_h - this.dra; // distance rare bumper -> rare axle
    
    
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
//            impulse = 1;
        }
        this.next_genes.push(impulse); // save for further generations
        
        if (this.current_wheel_angle + impulse < this.maximum_wheel_angle){
            this.current_wheel_angle += impulse;
        }
        else {
            this.current_wheel_angle = this.maximum_wheel_angle;
        }
        
        // impulse. ...
        
        if (this.update_counter == 0){
            this.applyForce([1, 0]);
        }
        
        if (this.current_wheel_angle != 0){
            this.vel.rotate(radians(impulse));
            this.car_angle = -this.current_wheel_angle;
            
            this.current_turning_radius = axis_h / sin(radians(this.current_wheel_angle));
            turning_circle_len = abs(PI * 2 * this.current_turning_radius);
            arc_angle = 1 / this.current_turning_radius;
            console.log('angle is', this.current_wheel_angle, 'radius is', this.current_turning_radius, 'circle len is', turning_circle_len, 'arc angle', degrees(arc_angle))
            
            circle_pos = this.pos.copy();
            circle_pos.setMag(this.current_turning_radius)
//            line(this.pos.x, this.pos.y, circle_pos.x, circle_pos.y)
            //console.log('pos', this.pos, 'circle', circle_pos)
            
            rare_a = this.pos.copy();
            rare_a.x = car_h / 2 - this.drb;
            rare_a.y = -car_w / 2;
            
            rare_b = this.pos.copy();
            rare_b.x = car_h / 2 - this.drb;
            rare_b.y = car_w / 2;
            
            push();
            translate(this.pos.x, this.pos.y);
            rare_a.rotate(radians(this.car_angle));
            rare_b.rotate(radians(this.car_angle));
            axle_a_b = rare_b.copy().sub(rare_a)
            axle_a_b.setMag(this.current_turning_radius).mult(-1);
            this.current_turning_radius += car_w / 2;
            radius_center = rare_a.copy().add(axle_a_b);
            ellipse(radius_center.x, radius_center.y, this.current_turning_radius*2, this.current_turning_radius*2) // turning circle
            line(rare_a.x, rare_a.y, radius_center.x, radius_center.y)
            
            stroke(255, 0, 255);
            line(rare_a.x, rare_a.y, rare_b.x, rare_b.y) // turning radius trough the rare axle // debug - OK
            pop();

            // get vector to vehicle center
            center_translated = radius_center.add(this.pos);
            line(center_translated.x, center_translated.y , this.pos.x, this.pos.y) // radius to the vehicle center // debug - OK
            
            cntr_to_pos = this.pos.copy().sub(center_translated);
            console.log('cntr_to_pos = ', cntr_to_pos, 'heading ', cntr_to_pos.heading())
//            line(0, 0, cntr_to_pos.x, cntr_to_pos.y)
            
            arc_angle = cntr_to_pos.heading() - arc_angle;
//            arc_angle = - arc_angle + cntr_to_pos.heading();
//            arc_angle = PI/6;
            console.log('new angle', arc_angle)
            new_pos = createVector(center_translated.x + this.current_turning_radius * cos(arc_angle), center_translated.y + this.current_turning_radius * sin(arc_angle));
            ellipse(new_pos.x, new_pos.y, 20, 20)
//            console.log('new angle', arc_angle, 'pos', this.pos, 'new', new_pos)
            
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
        
        fill(255);
        ellipse(this.pos.x, this.pos.y, 10, 10);
        noFill();
            
        push();
//            translate(20, 20);
            translate(this.pos.x, this.pos.y);
            rotate(radians(this.car_angle))

            rect(0, 0, car_h, car_w);

            // front up
            push();
                fill(255, 0, 0, 100);
                push();
                    translate(this.dfb - car_h/2, -car_w/2);
                    rotate(radians(this.current_wheel_angle));
                    rect(0, 0, this.tire_w, this.tire_h);
                pop();

                // front down
                push();
                    translate(this.dfb - car_h/2, +car_w/2);
                    rotate(radians(this.current_wheel_angle))
                    rect(0, 0, this.tire_w, this.tire_h);
                pop();

            pop();

            // rare 
            push();
                translate(this.dra - car_h/2, -car_w/2);
                rect(0, 0, this.tire_w, this.tire_h);
                rect(0, car_w, this.tire_w, this.tire_h);
            pop();
        
        pop();
    }
    
    this.hits = function(obstacle){
        
    }
}
