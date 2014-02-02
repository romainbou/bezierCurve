var Line = function(p1, p2, isControlLine) {
    this.setP1(p1);
    this.setP2(p2);
    this.isControlLine = isControlLine;
};

Line.prototype.setP1 = function(p1) {
    this.p1 = p1;
};

Line.prototype.setP2 = function(p2) {
    this.p2 = p2;
};

Line.prototype.getP1 = function() {
    return this.p1;
};

Line.prototype.getP2 = function() {
    return this.p2;
};

Line.prototype.isSet = function(){
    if(this.p1 !== undefined && this.p2 !== undefined){
        return true;
    }
    return false;
}

Line.prototype.draw = function(content, stokewidth) {

    if(stokewidth == undefined) { stokewidth = 2; }

    if(this.isSet()){

        var line = document.createElementNS("http://www.w3.org/2000/svg","line");
        line = $(line);
        line.attr("x1",this.p1.getX())
                   .attr("x2",this.p2.getX())
                   .attr("y1",this.p1.getY())
                   .attr("y2",this.p2.getY())
                   .attr("stroke","orangered")
                   .css("stroke-width", stokewidth)
                   .attr("fill","rgb(0, 200, 255)");

        if(this.isControlLine !== undefined && this.isControlLine === true){
            line.attr("class","controlLine");
        }

        $(content).prepend(line);
        return line;
    }
};

Line.prototype.update = function() {

};
Line.prototype.abs = function() {
    return Math.sqrt(Math.pow((this.p2.getX()-this.p1.getX()),2)+Math.pow((this.p2.getY()-this.p1.getY()),2));
};