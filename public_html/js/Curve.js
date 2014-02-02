/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Curve(controlPoints) {
    if (controlPoints === undefined) {
        this.nbPoints = 0;
        this.controlPoints = [];
    } else {
        this.nbPoints = controlPoints.length;
        this.setControlPoints(controlPoints);
    }
}

Curve.prototype.setControlPoints = function(controlPoints) {
    this.controlPoints = controlPoints;
};
Curve.prototype.setNbPoints = function() {
    this.nbPoints = this.getControlPoints().length;
};

Curve.prototype.getControlPoints = function() {
    return this.controlPoints;
};

Curve.prototype.getNbPoints = function() {
    return this.nbPoints;
};

Curve.prototype.getPoint = function(i) {
    return this.controlPoints[i];
};

Curve.prototype.addControlPoint = function(controlPoint) {
    this.controlPoints.push(controlPoint);
    this.nbPoints++;
    this.draw("#content svg");

    if(this.nbPoints > 0) {
        this.getLaTex("formule-latex");
        this.getPointsString("formule-latex");
    }
    
    return this.controlPoints.length -1;
};

Curve.prototype.removeControlPoint = function(controlPoint) {
    var index = this.controlPoints.indexOf(controlPoint);
    if (index > -1) {
        this.controlPoints.splice(index, 1);
    }
    this.nbPoints--;
    this.draw();
};

Curve.prototype.clear = function(){
    this.controlPoints = [];
    this.nbPoints = 0;
};

Curve.prototype.getLp=function(){
    var points = this.getControlPoints();
    var Lp = 0;
    for(var i=0; i< points.length-1;i++){
        var curLine = new Line(points[i],points[i+1]);
        Lp += curLine.abs();
    }
    return Lp;
};
Curve.prototype.getLc=function(){
    var points = this.getControlPoints();
    var Lc = 0;
    var curLine = new Line(points[0],points[points.length-1]);
    Lc += curLine.abs();
    return Lc;
};
Curve.prototype.getAbsAprox=function(){
    var Lp = this.getLp();
    var Lc = this.getLc();
    return (Lp+Lc)/2;
};


Curve.prototype.getLaTex = function(container) {
    var nbPoints = this.getNbPoints()-1;
    var nbPointsString = (nbPoints).toString();
    if(nbPoints>=0){
        var string = "$${ { P }_{ 0..."+ nbPointsString +"}(t)=\\sum _{ i=0 }^{" + nbPointsString + "}{ \\binom{" + nbPointsString+ "}{i}    } { t }^{ i }{ (1-t) }^{ " + nbPointsString+ "-i }{ P }_{ i } }$$";
        $("#"+container).html(string);
    }else{
        var string ='$${ { P }_{ 0...0}(t)=ND}$$';
        $("#"+container).html(string);
    }
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,container]);
};
Curve.prototype.getPointsString = function(container) {
    
    var nbPoints = this.getNbPoints()-1;
    
    if(nbPoints>=0){
        var string = "les points sont: ";
        for(var i=0;  i<=nbPoints;i++){
            var curString = "P"+i+"=";
            curString+="("+this.controlPoints[i].getX()+","+this.controlPoints[i].getY()+") ";
            string+=curString;
        }
        $("#"+container).attr('title',string);
    }else{
        $("#"+container).attr('title',"aucun points");
    }
};


Curve.prototype.getPointTwoPoints = function(t, p1, p2) {

    var newX = ((p2.getX() - p1.getX()) * t) + p1.getX();

    var newY = ((p2.getY() - p1.getY()) * t) + p1.getY();

    var newPoint = new Point(newX, newY, 4);

    return newPoint;
};


Curve.prototype.getPointsAtT = function(t) {
    var points = this.getControlPoints();
    var curPoints=[];
    curPoints[0]=points;
   
    for (var j = 0; j < curPoints.length; j++) {
        var currentControlPoints = [];
        for(var i = 0; i < curPoints[j].length-1; i++){
            var p1 = curPoints[j][i];
            var p2 = curPoints[j][i+1];
            currentControlPoints.push(this.getPointTwoPoints(t, p1, p2));   
        }
        if(currentControlPoints.length>0){
            curPoints.push(currentControlPoints);
        }
        
        
    }
    

    return curPoints;
};
Curve.prototype.getSubCurve=function(t,side){
    var points=this.getPointsAtT(t);
    var ctrPoints = [];
    for (var i=0;i<points.length;i++){
        ctrPoints.push(points[i][(points[i].length-1)*side]);
    }
    return new Curve(ctrPoints);
};



//to debug
Curve.prototype.getP = function(t) {
    var x = 0;
    var y = 0;
    for (var i = 0; i < this.nbPoints; i++) {
        x += binomialCoeficient(this.nbPoints - 1, i) * Math.pow(t, i) * Math.pow((1 - t), this.nbPoints - 1 - i) * this.getPoint(i).getX();
        y += binomialCoeficient(this.nbPoints - 1, i) * Math.pow(t, i) * Math.pow((1 - t), this.nbPoints - 1 - i) * this.getPoint(i).getY();
    }
    return {x: x, y: y};
};


//question 3
Curve.prototype.abs = function(precision) {
    var abs = 0;
    var n=1;
    if (isNaN(precision)) {
        console.warn("Precision not set");
        return;
    }
    
    abs+= this.getSubCurve(0.5, 0).absRec(precision,n);
    abs+= this.getSubCurve(0.5, 1).absRec(precision,n);
    
    return abs;
};




Curve.prototype.absRec = function(precision,n) {
    var abs = 0;
    if (isNaN(precision)) {
        console.warn("Precision not set");
        return;
    }
    
    if (this.getLp()-this.getLc() > precision/(Math.pow(n,2) ) ){
        abs+= this.getSubCurve(0.5, 0).abs(precision);
        abs+= this.getSubCurve(0.5, 1).abs(precision);
    }else{
        abs=this.getAbsAprox();
    }
    return abs;
};
//draw methods
//question2
Curve.prototype.drawDeCasteljau = function(deep,t) {
    if( t == undefined ){
        t=0.5;
    }
    var points = this.getPointsAtT(t);
    this.drawDeCasteljauRec(deep,1,points,t);
    
};
Curve.prototype.drawDeCasteljauRec = function(deep,depth,points,t) {
    
    if(depth<=deep){
        this.draw('#content svg');
        var newPointsLeft=[];
        var newPointsRight=[];
        for(var i = 0 ;i< points.length;i++){
            newPointsLeft.push(points[i][0]);
           
            newPointsRight.push(points[i][points[i].length-1]);
           
            
        }
        var leftCurve=new Curve(newPointsLeft);
        leftCurve.drawDeCasteljauRec(deep,depth+1,leftCurve.getPointsAtT(t),t);
        var rigthCurve=new Curve(newPointsRight);
        rigthCurve.drawDeCasteljauRec(deep,depth+1,rigthCurve.getPointsAtT(t),t);
        
    }
    
    
};
//question1
Curve.prototype.drawBrutForce = function(nbPoints) {
    if(nbPoints === 0){
        var deltaT = 1 ;
    }else{
        var deltaT = 1 / nbPoints;
    }
    var coord1 = this.getP(0 * deltaT);
    var coord2 = this.getP(1* deltaT);
    var curPoint1 = new Point(coord1.x, coord1.y, 2);
    var curPoint2 = new Point(coord2.x, coord2.y, 2);
    var line = new Line(curPoint1,curPoint2);
    line.draw("#content svg",4);

    for (var i = 1; i < nbPoints; i++) {
        var coord1 = this.getP(i * deltaT);
        var coord2 = this.getP((i+1) * deltaT);
        var curPoint1 = new Point(coord1.x, coord1.y, 2);
        var curPoint2 = new Point(coord2.x, coord2.y, 2);
        var line = new Line(curPoint1,curPoint2);
        line.draw("#content svg", 4);
    }
    
    this.draw("#content svg");
};
//question 4
Curve.prototype.getRail=function(delta,nbPoints){
    if(this.getPointsAtT().length > 1) {
        var deltaT = 1 / nbPoints;
        var points = [];
        for (var i = 0; i < nbPoints-1; i++) {
            var coord1 = this.getP(i * deltaT);
            var coord2 = this.getP((i+1) * deltaT);
            var a = Math.cos(Math.PI);
            var orthoVectx=(0-(1*(coord1.y-coord2.y)));
            var orthoVecty=(1*(coord1.x-coord2.x));
            
            var orthoVectabs = Math.sqrt(Math.pow(orthoVectx,2)+Math.pow(orthoVecty,2));
            orthoVectx = orthoVectx/orthoVectabs;
            orthoVecty = orthoVecty/orthoVectabs;
            var newPoint1 = new Point(coord1.x+(orthoVectx)*delta,coord1.y + (orthoVecty)*delta);
            var newPoint2 = new Point(coord2.x+(orthoVectx)*delta,coord2.y + (orthoVecty)*delta);
            points = points.concat([newPoint1,newPoint2]);
            
        }
        for (var i = 0; i < points.length-1; i++) {
            var curPoint1 = points[i];
            var curPoint2 = points[i+1];
            var line = new Line(curPoint1,curPoint2);
            line.draw('#content svg');
        }
    }
   
};

Curve.prototype.draw = function(content) {
    
    for (var i = 0; i < this.nbPoints; i++) {
        this.controlPoints[i].draw(content);
        if (i + 1 < this.getNbPoints()) {
            var curLine = new Line(this.controlPoints[i], this.controlPoints[i + 1],true);
            curLine.draw(content);
        }

    }

};


Curve.prototype.cleanCurve = function(content) {
    $("circle",content).remove();
    $("line",content).remove();
};
