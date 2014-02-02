/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Point(x,y,size,isControlPoint){
    this.setX(x);
    this.setY(y);
    this.setSize(size);
    this.isControlPoint = isControlPoint;
    this.setDrawn(false);
}

//getters&setters
Point.prototype.setX = function(x){
        this.x=x;
};
    
Point.prototype.setY = function(y){
    this.y = y;
};

Point.prototype.setId = function(id){
    this.id = id;
}

Point.prototype.setDrawn = function(drawn){
    this.drawn = drawn;
}

Point.prototype.isDrawn = function(){
    return this.drawn;
}

Point.prototype.setSize = function(size){
    if(size !== undefined && size>0){
        this.size=size;
    }else{
        //8 is the default size
        this.size = 8;
    }    
};

Point.prototype.getX = function(){
    return this.x;
};
    
Point.prototype.getY = function(){
    return this.y;
};

Point.prototype.getSize = function(){
    return this.size;
};

Point.prototype.getId = function(){
    return this.id;
};



//methods
Point.prototype.moveTo=function(x,y){
    this.setX(x);
    this.setY(y);
};
Point.prototype.draw=function(content){

    var circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
    circle = $(circle);
    circle.attr("cx",this.getX())
               .attr("cy",this.getY())
               .attr("r",this.getSize())
               .attr("stroke","orangered")
               .attr("stoke-width", 2)
               .attr("fill","rgb(0, 200, 255)");

    if(this.isControlPoint!== undefined && this.isControlPoint === true){
        circle.attr("class","controlPoint");
        
    }
    if(this.id !== undefined){
     //  if(!this.isDrawn()){
         //   console.log('add id '+ this.getId());
            circle.attr("data-id", this.getId());
     //   }
    }
    $(content).append(circle);    
};