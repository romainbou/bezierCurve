$(document).ready(function() {
    
    content = document.getElementById('content');
    $('#menu').css('height', $(window).height());
    $('#content').css('height', $(window).height());
    $("#content svg").css("width", $('#content').width()-$('#menu').width()- 100);
    $("#content svg").css("height", "99%");

    controlPoints = [];

    curve = new Curve();
    addListeners(curve);

});
