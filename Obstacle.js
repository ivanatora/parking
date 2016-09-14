function Obstacle(pos, w, h){
    this.pos = pos;
    this.w = w;
    this.h = h;
    
    this.show = function(){
        stroke(255);
        fill(255, 0, 0);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }
}
