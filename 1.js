function Car(){
  this.name = "My Car";
}

Car.prototype.move = function(){
  console.log(this.name + " move");
}   //prototype으로 멤버추가

let myCar = new Car();
myCar.move();