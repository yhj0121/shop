function Car(){
  this.name = "My Car";
}

Car.prototype.move = function(){
  console.log(this.name + " move");
}   //prototype으로 멤버추가

var myCar = new Car();
myCar.move();