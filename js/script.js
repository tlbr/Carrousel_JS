/* Created on 01/05/2016 by Théo Lambert. */
var slideshow = {
	elem : null, /* finder */
	timer : null, /* timer for the window.setintervall  */
	zero : 0, /* Zero */
	SK : 65, /* Position bottom top of the text  */
	num : 0, /* num is going to change for the bullets point */
	time_transition : 2000, /* Time transition for the pictures */
	time_transitionPrimeA : 1000, /* Transition for the text when it appear */
	time_transitionPrimeD : 4000, /* Transition for the text when it desappear */
	width_img : 400, /* Witdh of the picture */
	gaugeNum : 1, /* Gauge number to begin the gauge at 1 */

	init : function(elem){
		/* Carroussel pagination */
		elem.append('<div class="navi"></div>');
		for (var i = 1; i <= 4; i++) {
			elem.find(".navi").append("<span>&nbsp"+i+"</span>"); /* Add 4 <span> bullets int the html  */
		}
		this.elem = elem;
		elem.find(".slide").hide(); /* Hide all pictures at the begining */
		elem.find(".slide:first").show(); /* Show only the first one */
		this.elem.find(".navi span:eq("+(0)+")").addClass("active");
		slideshow.autoPlay($("#slideshow")); /*****/
	},

	stop : function(){
		window.clearInterval(slideshow.timer);
	},

	play : function(){
		window.clearInterval(slideshow.timer);
		this.timer = window.setInterval("slideshow.next()",3500);
	},

	autoPlay : function(){
		slideshow.play(); /* Begin the slideshow */
		slideshow.hidePlay($("#slideshow")); /*****/
	},

	next : function(){ /* Next function */
		if(this.num == 3)
		{
			this.num = -1;
		}
		/* When this.num reach 3 		   *
		 * this.num is initialize whith -1 *
		 * to select the first one bullet  */
		slideshow.stop($("#slideshow"));
		$("#slideshow .content").animate(
			{
				"margin-left": "-" + this.width_img + "px"
			},
			this.time_transition,
			function(){
				slideshow.numNXT($("#slideshow"));
				$("#slideshow .slide:last").after($("#slideshow .slide:first"));
				$("#slideshow .content").css("margin-left", "0px");
				slideshow.play($("#slideshow"));
				slideshow.hidePlay($("#slideshow"));
				slideshow.show($("#slideshow"));
				slideshow.gaugeFctMax($("#slideshow"));
		});
	},

	gaugeFctMax : function(){
		if(this.gaugeNum == 4){
			this.gaugeNum = 0;
		}
		this.gaugeNum++;
		g1.refresh(this.gaugeNum);
	},

	gaugeFctMin : function(){ 
		if(this.gaugeNum == 0 || this.gaugeNum == 1){
			this.gaugeNum = 5;
		}
		this.gaugeNum--;
		g1.refresh(this.gaugeNum);
	},

	show : function(){ /* Show the text with and "up and down" animation. */
		$("#title").animate(
			{
				"bottom":  "+" +this.zero+ "px" /* Up the text to 0px at the bottom border */
			},
			this.time_transitionPrimeA,
			function(){
				slideshow.dissapear($("#slideshow")); /* Callback of the function disappear to down the text to -65 px to hide it */
		});
	},

	dissapear : function(){
		$("#title").animate(
			{
				"bottom":  "-" +this.SK+ "px" /* Disappear Animation to down the text */
			},
			this.time_transitionPrimeD,
			function(){
			/* We do nothing here. */
		});
	},

	prev : function(){ /* Prev */
	if(this.num == -1)
	{
		this.num = 3;
	}
	/* When this.num reach -1 		  *
	* this.num is initialize whith 3  *
	* to select the last one bullet   */
	slideshow.stop($("#slideshow"));
	$('#slideshow .slide:last').css("margin-left","-1600px");
 	$("#slideshow .content").animate(
 	{
 		"margin-left": this.width_img + "px"
 	},
 	this.time_transition,
 	function(){
 		slideshow.numRW($("#slideshow"));
        $("#slideshow .content").css("margin-left", "0px");
        $("#slideshow .slide:last").css("margin-left", "0px");
        $("#slideshow .slide:first").before( $("#slideshow .slide:last") );
        slideshow.play($("#slideshow"));
		slideshow.hidePlay($("#slideshow"));
		slideshow.show($("#slideshow"));
		slideshow.gaugeFctMin($("#slideshow"));
      });
	},

	hidePause: function(){
		document.getElementById('play').style.visibility = "visible";  /*****/
		document.getElementById('pause').style.visibility = "hidden"; /*****/
	},

	hidePlay : function(){
		document.getElementById('pause').style.visibility = "visible"; /*****/
		document.getElementById('play').style.visibility = "hidden";  /*****/
	},

	numRW : function(){
		this.elem.find(".navi span").removeClass("active"); /* Remove the color blue related to the picture */
		this.elem.find(".navi span:eq("+(--this.num)+")").addClass("active"); /*****/
	},

	numNXT : function(){
		this.elem.find(".navi span").removeClass("active"); /*****/
		this.elem.find(".navi span:eq("+(++this.num)+")").addClass("active"); /* Add a blue color to the active bullet related to the picture */
	},
}
$(document).ready(function (){
	$.ajax({
      method: "POST",
      url: "https://www.skrzypczyk.fr/ajax.php", /* GET the description and pictures information in XML */
      data: { nom: 'jason'}
    }).done(function( msg ) {
      var ListSlide = jQuery.parseJSON(msg); /* Parse the XML to JSON in a new var ListSlide*/
      console.log(ListSlide);
      $( "slideshow" ).html('<div class="content"></div>'); /*IN HTML, IN THE DIV CONTENT... */
      for (key in ListSlide) { 									/* => FOR EACH INSTRUCTION	*/
      	$("#slideshow .content").append('<div class="slide"><img src="'+ ListSlide[key].src + '"><div id="title">' + ListSlide[key].desc + '</div></div>'); 
      	/* ADD THE PICTURES---------------------------------------------^^^^^^^^^^^^^^^^^^^ ADD THE DESC------------^^^^^^^^^^^^^^^^^^^^^////////////////*/
		}
    });
	slideshow.init($("#slideshow")); /* Slide Initialisation */
	$("#pause").click(function(){ /* Pause button action */
		slideshow.stop($("#slideshow")); /* Stop the slideshow */
		slideshow.hidePause($("#slideshow")); /* hide pause button to show the play button */

	})

	$("#play").click(function(){ /* Play button action */
		slideshow.play($("#slideshow"));
		slideshow.hidePlay($("#slideshow"));
	})

	$('.content').mouseover(function () { /* When we go on on the picture, we call the function stop to stop the slide show */
		slideshow.hidePause($("#slideshow"));
		slideshow.stop($("#slideshow"));}).mouseout(function (){
			/* When we left the picture area, to re-start the slideshow, we must click on the P */
			/* We do nothing here. */
	});

	$('.next').click(function(){ /* Next button picture action */
		slideshow.next($("#slideshow"));
	}); 

	$('.prev').click(function(){ /* Previous button picture action */
		slideshow.prev($("#slideshow"));
    });    

})
/**********************************************************************/
/**/ var g1;											   		      //
/**/ document.addEventListener("DOMContentLoaded", function(event) {  //
/**/     g1 = new JustGage({							      	      //
/**/         id: "g1",												  //
/**/         value: 1,												  //
/**/         min: 0,						/* GAUGE JQUERY */	      //
/**/         max: 4,											      //
/**/         donut: true,											  //
/**/         gaugeWidthScale: 0.7,								      //
/**/		 refreshAnimationType: "bounce",						  //
/**/		 startAnimationTime: 1500,								  //
/**/    	 startAnimationType: ">",								  //
/**/     	 refreshAnimationTime: 1000,						 	  //
/**/		 hideInnerShadow: true,			     		  	     	  //
/**/       });														  //
/**/   });															  //
/**********************************************************************/	  
/************** Created on 01/05/2016 by Théo Lambert. ****************/