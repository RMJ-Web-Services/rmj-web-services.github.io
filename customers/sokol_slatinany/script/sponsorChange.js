$(document).ready(function(){
    //$(".sponzor").css("background-image", "url(\"images/sponzori/sponzor_small_0"+getIndex()+".png\")");
    

setRandomSponzor();
});


window.setInterval(function(){zmena();}, 20000);



function zmena(){
    $(".sponzor img, .sponzor p").fadeOut(3000, function () {
        setRandomSponzor();
        $(".sponzor img, .sponzor p").fadeIn(3000);
    });
}

function setRandomSponzor(){
    var index = Math.floor(Math.random()+1);
    var popisek = "";
    $(".sponzor img").attr("src", "images/sponzori/sponzor_small_0"+index+".png");
    

switch (index) {
        case 1:
            popisek = "<a href=\"http://www.slatinany.cz/index.php\">M\u011bsto Slati\u0148any</a>";
            break;

        
			case 2:
            popisek = "<a href=\"http://www.pardubickykraj.cz/">Pardubický kraj</a>";
            break;    }
    

$("#sponzorPopisek").html(popisek);
}


