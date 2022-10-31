class Shape {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  //get edge positions
  getLeft() {
    return this.x;
  }

  getRight() {
    return this.x + this.width;
  }

  getBottom() {
    return this.y + this.height;
  }

  getTop() {
    return this.y;
  }
  
  //check within left, right, top, bottom edges
  //based on @jonfroehlich http://makeabilitylab.io/
  contains(x, y) {
    return x >= this.x && x <= (this.x + this.width) &&
           y >= this.y && y <= (this.y + this.height);
  }
  
  overlaps(shape){
    return !(this.getRight() < shape.x || 
             this.getBottom() < shape.y || 
             this.x > shape.getRight() || 
             this.y > shape.getBottom());
  }
}