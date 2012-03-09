// Construct all of the prototypes that I am going to need!

var Construct = (function() {
			var i, constructors = {};
			function assignData(o1, o2) {
				for (i in o2) {if (o2.hasOwnProperty(i))  {
						o1[i] = o2[i]; } } }
			["Location", "Pts", "Clrs", "Text", "Words"].forEach(function(value)  {
						constructors[value] = function(data){assignData(this, data);};	}	);
			return constructors;	}	)();
Construct.Clrs.prototype =  {
		get colorStrings()	{
			var i, back, back = text = "#";
			for (i in this){ if (this.hasOwnProperty(i))  {
					back += this[i], text += this.ic(this[i]);	}	}
			return {'color': text, 'background-color': back };
			// Here is a helper method that inverts the background hex colors so we can get our font colors!	
				function invertColor(x) {var inv = Math.floor(255 - parseInt(x, 16)).toString(16); return inv;},	},
		set colorStrings(data)	{
			throw "Cannot set the colorStrings getter.";},
		get getColor() {
			return Math.floor(Math.random() * 160 + 96).toString(16);	},
		set getColor() {
			throw "setting getColor is not allowed! (for now)"	}	};
Construct.Pts.prototype =  {
		get minP()  {
			return [Math.min(this.I[0], this.C[0]), Math.min(this.I[1], this.C[1])];    },
		set minP(value) {
			throw "minP not a settable property";   },  
		get width() {return Math.abs(this.I[0] - this.C[0])}, set width(value) {throw "width is not a settable property although maybe it should be?";},
		get height() {return Math.abs(this.I[1] - this.C[1])}, set height(value) {throw "height is not a settable property although maybe it should be?";}

function Box(ev, props)    {
	if (ev === undefined) {ev = {}; ev.pageX = 0, ev.pageY = 0;}
	var words = props.words || "", 
		loc = props.words || {hostname: document.location.hostname, pathname:document.location.pathname, URL:document.location.URL},
		pts = props.pts || {I:[ev.pageX,ev.pageY], C:[ev.pageX,ev.pageY]},
		clrs = props.clrs || (function() {
						var a = {}; ['r','g','b'].forEach(function(d) {a[d] = Construct.Clrs.prototype.getColor;}); return a;}	)();
	this.location = new Construct.Location(loc),
		this.pts = new Construct.Pts(pts),
		this.clrs = new Construct.Clrs(clrs),
		this.text = new Construct.Words(words);	};


function armBoxForTyping(box)   {
	var $box = $('#' + box._id);
	$box.click(writeToBox);
	function writeToBox(ev) {
		console.log(this);
		ev.stopPropagation();
		$BOD.off('keypress').off('keydown');
		$BOD.keypress(function(ev)  {
                    ev.stopPropagation();
                    $box[0].innerHTML = $box.html() + String.fromCharCode(ev.which);
                    $box[0].innerHTML = testForLinks($box[0].innerHTML);
                    box.words = $box.html();
                    updateBox(box);
                    return !(ev.keyCode == 32); }   )
            .keydown(function(ev)   {
			        ev.stopPropagation();
				    if (ev.which === 8 && $box.html().length > 0)   {
                        $box[0].innerHTML = $box.html().substring(0, $box.html().length - 1);
                        $box[0].innerHTML = testForLinks($box[0].innerHTML);
                        box.words = $box.html();
                        updateBox(box); }   }   );  }   }
