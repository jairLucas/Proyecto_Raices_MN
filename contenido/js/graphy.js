let jsgcalc;

function Graph() {

    this.currInput = 0;
    this.lineColors = ["#FF0000", "#0000FF", "#00FF00", "#FF00FF", "#00FFFF1", "#000000", "#990000", "#000099", "#009900", "#999900", "#990099", "#009999"];
    this.currtool = "pointer";
    this.currEq = 0;
    this.gridlines = "normal";
    this.settings = {};

    this.setQuality = function(q) {
        $("#quality_select a").removeClass("option_selected");
        q2 = String(q).replace(".", "");
        $("#quality_select_" + q2).addClass("option_selected");
        this.calc.quality = q;
        this.calc.draw();
    }

    this.setAngles = function(q) {
        $("#angle_select a").removeClass("option_selected");
        $("#angle_select_" + q).addClass("option_selected");
        Calc.angles = q;
        this.calc.draw();
    }

    this.setTool = function(t) {
        $("#tool_select a").removeClass("toolbar_selected");
        $("#tool_select_" + t).addClass("toolbar_selected");

        $(".toolbox").hide();
        $("#toolbox_" + t).show();
        $("#toolbox_" + t).css("top", $("#tool_select_" + t).offset().top - 23);
        $("#toolbox_" + t).css("right", $(document).width() - $("#tool_select_" + t).offset().left + 5);

        this.currtool = t;
        this.calc.draw();
    }

    this.doTrace = function(xval) {
        this.calc.draw();
        this.calc.drawTrace(this.calc.getEquation(this.currEq), "#000000", xval);
    }

    this.setGridlines = function(t) {
        $("#gridlines_select a").removeClass("option_selected");
        $("#gridlines_select_" + t).addClass("option_selected");

        this.gridlines = t;
        this.calc.draw();
    }

    this.updateValues = function() {
        $("input.jsgcalc_xmin").val(Math.round(this.calc.currCoord.x1 * 1000) / 1000);
        $("input.jsgcalc_xmax").val(Math.round(this.calc.currCoord.x2 * 1000) / 1000);
        $("input.jsgcalc_ymin").val(Math.round(this.calc.currCoord.y1 * 1000) / 1000);
        $("input.jsgcalc_ymax").val(Math.round(this.calc.currCoord.y2 * 1000) / 1000);
    }

    this.add = function(f, color) {
        this.calc.lines.push({ equation: f, color: color || this.lineColors[this.calc.lines.length] });
        this.calc.draw();
    }

    this.reset = function() {
        this.calc.lines = [];
        this.calc.draw();
    }

    this.resize = function() {

        this.calc.resizeGraph($("#wrapper").width(), $("#wrapper").height());
    }

    this.calc = jsgcalc = new JSgCalc(this, "graph");
    this.calc.initCanvas();
}

var graph;


function resize() {
    $("#vsplitter").height($("#wrapper").height());
    // $("#vsplitter").css("height", window.innerHeight + "px");
    $("#edit").css("height", $("#code").outerHeight() - 20 + "px");
    graph.resize();
}

$(function() {
    graph = new Graph();

    $(".toolbox_close a").click(function() {
        $(".toolbox").hide();
    })
    document.body.onselectstart = function() {
        return false;
    }

    window.addEventListener("resize", resize);
    resize();


    resize();
});