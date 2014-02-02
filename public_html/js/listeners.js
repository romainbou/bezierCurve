addListeners = function(curve) {
    // Add point mode

    var addConentClick = function() {
        $("#content svg").click(function(e) {

            var currentMousePos = {top: 0, left: 0};
            var pointPosition = {top: 0, left: 0};
            var contentPos;
            currentMousePos.top = e.clientY;
            currentMousePos.left = e.clientX;


            contentPos = $('#content').offset();

            pointPosition.top = currentMousePos.top - contentPos.top;
            pointPosition.left = currentMousePos.left - (contentPos.left + 410);

            var currentPoint = new Point(pointPosition.left, pointPosition.top, 8, true);


            var pointId = curve.addControlPoint(currentPoint);
            
            currentPoint.setId(pointId);

            $("span","#longueur").html(curve.abs(60));
            
            curve.cleanCurve("#content svg");

            curve.cleanCurve("#content svg");

            if ($(".selected-mode").attr("id") === "brutforce") {
                curve.drawBrutForce(parseInt($('.bruteforce-bar').val()));
            }
            if ($(".selected-mode").attr("id") === "casteljou") {
                curve.drawDeCasteljau(parseInt($('.casteljou-bar').val()));
            }

            if ($("#display-rail").hasClass("active")) {
                curve.getRail(parseInt($('.rail-bar').val()),60);
                curve.getRail(parseInt(-parseInt($('.rail-bar').val())),60);
            }
        });
    }
    addConentClick();

    $('#remove-button').click(function() {
        $('#content svg').empty();
        $("#formule-latex").empty();
        $("span","#longueur").empty();
        curve = new Curve();
        curve.getPointsString('formule-latex');
        curve.getLaTex('formule-latex');
    });
    function Animation(id){
        this.t=0;
        this.id=id;
    }
    anim= new Animation();
    $('#anime-button').click(function() {
        
        if (!$('#anime-button').hasClass("active")){
            $("#casteljou").addClass("selected-mode");
            $("#brutforce").removeClass("selected-mode");
            $("#anime-button").addClass("active");
            anim.id=window.setInterval(function(){
                anim.t = (anim.t+0.1)%1;
                curve.cleanCurve();
                curve.drawDeCasteljau(parseInt($('.casteljou-bar').val()),anim.t);
                console.log(anim.t);
            },400);
        }else{
            $("#anime-button").removeClass("active");
            window.clearInterval(anim.id);
            curve.cleanCurve();
            curve.drawDeCasteljau(parseInt($('.casteljou-bar').val()),0.5);
            anim.t=0;
        }
        
    });

    $(".bruteforce-bar").change(function() {
        $("#casteljou").removeClass("selected-mode");
        $("#brutforce").addClass("selected-mode");
        curve.cleanCurve("#content svg");
        curve.drawBrutForce(parseInt($('.bruteforce-bar').val()));
        if ($("#display-rail").hasClass("active")) {
            curve.getRail(parseInt($('.rail-bar').val()),60);
            curve.getRail(parseInt(-parseInt($('.rail-bar').val())),60);
        }
    });


    $(".casteljou-bar").change(function() {
        $("#brutforce").removeClass("selected-mode");
        $("#casteljou").addClass("selected-mode");
        curve.cleanCurve("#content svg");
        curve.drawDeCasteljau(parseInt($('.casteljou-bar').val()));
        if ($("#display-rail").hasClass("active")) {
            curve.getRail(parseInt($('.rail-bar').val()),60);
            curve.getRail(parseInt(-parseInt($('.rail-bar').val())),60);
        }
    });


    var grabPoint = function(){
        $(document).on('mousedown',function(e){
            if($(e.target).is("circle")){
                var currentPoint = $(e.target);
                if(currentPoint.attr('data-id')){
                    var pointInstance = curve.getPoint(parseInt(currentPoint.attr('data-id')));
                    $(document).on('mousemove', function(e){
                        var currentMousePos = {top: 0, left: 0};
                        var pointPosition = {top: 0, left: 0};
                        var contentPos;
                        currentMousePos.top = e.clientY;
                        currentMousePos.left = e.clientX;

                        contentPos = $('#content').offset();

                        pointPosition.top = currentMousePos.top - contentPos.top;
                        pointPosition.left = currentMousePos.left - (contentPos.left + 410);
                        pointInstance.setX(pointPosition.left);
                        pointInstance.setY(pointPosition.top);

                        curve.cleanCurve();
                        curve.draw("#content svg");
                        $("span","#longueur").html(curve.abs(60));
                        if ($(".selected-mode").attr("id") === "brutforce") {
                            curve.drawBrutForce(parseInt($('.bruteforce-bar').val()));
                        }
                        if ($(".selected-mode").attr("id") === "casteljou") {
                            curve.drawDeCasteljau(parseInt($('.casteljou-bar').val()));
                        }
                        
                        if($('#display-rail').hasClass("active")){
                            curve.getRail(parseInt($('.rail-bar').val()),50);
                            curve.getRail(parseInt(-parseInt($('.rail-bar').val())),50);
                        }
                    });
                $("#content svg").off('click');
                }
            }
        });
    };

    var dropPoint = function(){
        $(document).on('mouseup',function(e){
            var target = $(e.target);
            if(target.is("circle")){
                $(document).on('mousemove',function(){
                    $(document).off('mousedown');
                    addConentClick();
                    grabPoint();
                    $(document).off('mousemove');
               });
            }
        });
    };

    grabPoint();
    dropPoint();
    

    $('#display-rail').click(function() {
        if($(this).hasClass("active")) {
            curve.cleanCurve("#content svg");
            if ($(".selected-mode").attr("id") == "brutforce") {
                curve.drawBrutForce(parseInt($('.bruteforce-bar').val()));
            }
            if ($(".selected-mode").attr("id") == "casteljou") {
                curve.drawDeCasteljau(parseInt($('.casteljou-bar').val()));
            }
            $(this).removeClass("active");
            $(this).html("Activer");
        }
        else {
            curve.getRail(parseInt($('.rail-bar').val()),50);
            curve.getRail(parseInt(-parseInt($('.rail-bar').val())),50);
            $(this).addClass("active");
            $(this).html("Désactiver");

        }
    });

    $(".rail-bar").change(function() {
        curve.cleanCurve("#content svg");
        if ($(".selected-mode").attr("id") == "brutforce") {
            curve.drawBrutForce(parseInt($('.bruteforce-bar').val()));
        }
        if ($(".selected-mode").attr("id") == "casteljou") {
            curve.drawDeCasteljau(parseInt($('.casteljou-bar').val()));
        }
        curve.getRail(parseInt($('.rail-bar').val()),60);
        curve.getRail(parseInt(-parseInt($('.rail-bar').val())),60);
        $(this).addClass("active");
        $(this).html("Désactiver");
    });
    
    $('#brutforce').on('click',function(e){
        $("#casteljou").removeClass("selected-mode");
        $("#brutforce").addClass("selected-mode");
        curve.cleanCurve("#content svg");
        curve.drawBrutForce(parseInt($('.bruteforce-bar').val()));
        if ($("#display-rail").hasClass("active")) {
            curve.getRail(parseInt($('.rail-bar').val()),60);
            curve.getRail(parseInt(-parseInt($('.rail-bar').val())),60);
        }
    });
    $("#casteljou").on('click',function(e){
        $("#brutforce").removeClass("selected-mode");
        $("#casteljou").addClass("selected-mode");
        curve.cleanCurve("#content svg");
        curve.drawDeCasteljau(parseInt($('.casteljou-bar').val()));
        if ($("#display-rail").hasClass("active")) {
            curve.getRail(parseInt($('.rail-bar').val()),60);
            curve.getRail(parseInt(-parseInt($('.rail-bar').val())),60);
        }
    });
};