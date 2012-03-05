var box, fun, $BOD;
$BOD = $('body');
alert("jquery, couchdb, and own script injected, in theory!");
document.body.addEventListener('mousedown', drawBox);
$.couch.urlPrefix = "http://127.0.0.1:5984";
fun = $.couch.db("fun");
birthBoxes();


function birthBoxes()
{
	fun.view("fun/serveBoxes",
		{
			success: function(data)
				{
					for (var i = 0, _len=data.rows.length; i<_len; i++)
					{


						fun.removeDoc(data.rows[i].value, 
							{
							success: function(data)
								{
									console.log("victory!");
								},
							error: function(data)
								{
									console.log("error!");
								}
							});



						/*
						var box = data.rows[i].value; //TemporaryBox var
							console.log(box);
						var	color = box.clrs;
	
						var $box = $('<div>').attr('id', box._id);
						$box.css({	left: box.pts.minP[0] + 'px',
									top: box.pts.minP[1] + 'px',
									position: 'absolute', opacity:0.5, "z-index": 100})
							.css(box.fns.colorStrings);		
						$box.width(box.width).height(box.height);
						$box[0].innerHTML = box.text;
						$box.appendTo($BOD);
						armBoxForTyping(box);
						*/	

					}
				}
		}
	);
}

function Box(ev)
{

	var self = this;

	self = 
	{
		get width()
		{
			return Math.abs(self.pts.I[0]-self.pts.C[0]);
		},

		get height()
		{
			return Math.abs(self.pts.I[1]-self.pts.C[1]);
		}
	};

	this.pts =

		{
			I: [ev.pageX, ev.pageY],
			C: [ev.pageX, ev.pageY],
			get minP ()
			{
				return [Math.min(this.I[0],this.C[0]), Math.min(this.I[1],this.C[1])];
			}
		};	

	this.clrs = 

		{
			r: Math.floor(Math.random()*160+96).toString(16),
			g: Math.floor(Math.random()*160+96).toString(16),
			b: Math.floor(Math.random()*160+96).toString(16)
		}


	this.fns =
	{
		ic: function invertColor(x)
			{
				var inv = Math.floor(255-parseInt(x,16)).toString(16);
				return inv;
			}
	};

	self = this;

	this.fns.colorStrings = (function(clrs)
	{
		var text = back = "#";
		for(i in clrs)
		{
			back+=clrs[i];
			text+=self.fns.ic(clrs[i]);
		}
		return {'background-color': back, 'color': text};
	}
	)(this.clrs);

	this.text = "";

	this.url = window.URL;

}	


function drawBox(ev)
{
	var $box, box;
	this.onmousedown = null;
	box = new Box(ev);  //BoxStore
	$box = $('<div>').appendTo($BOD).attr('class', 'textBox');
	$box.css({position:'absolute', opacity:0.5, "z-index": 100});

	this.onmouseup = function(ev)
	{
		this.onmousemove = null;
		this.onmouseup = null;
		this.onmousedown = drawBox;

		if ($box.height() < 10 || $box.width() < 10)
				$box.remove();
		else
		{
			fun.saveDoc(box,
				{
					success: function(data)
					{
						box._rev = data.rev;
						box._id = data.id;
						console.log("Box saved!");
						console.log(data);
						$box.attr('id', data.id);
						armBoxForTyping(box);
					},

					error: function(status)
					{
						console.log(status);
						delete $box;
						delete box;
					}
				}
			);
		}
	};

	this.onmousemove = function(ev)
	{
		box.pts.C = [ev.pageX, ev.pageY];
		$box.css({	'left': box.pts.minP[0] + 'px',
					'top': box.pts.minP[1] + 'px'})
			.width(Math.abs(box.pts.C[0] - box.pts.I[0]))
			.height(Math.abs(box.pts.C[1] - box.pts.I[1]));
	};

	$box.css(box.fns.colorStrings);
	console.log(box.fns.colorStrings);


}

function updateBox(box)
{
	fun.saveDoc(box,
		{
			success: function (data)
			{
				box._rev=data.rev;
			},

			error: function (status)
			{
				console.log (status);
			}
		}
	);
}

function armBoxForTyping(box)
{
	var $box = $('#'+box._id);
	$box.click(writeToBox);

	function writeToBox(ev)
	{
		console.log(this);
		ev.stopPropagation();
		$BOD.off('keypress').off('keydown');
		$BOD.keypress(function(ev)
			{
				ev.stopPropagation();
				$box[0].innerHTML = $box.html() + String.fromCharCode(ev.which);
				$box[0].innerHTML = testForLinks($box[0].innerHTML);
				box.text = $box.html();
				updateBox(box);
				ev.stopPropagation();
				return !(ev.keyCode == 32);
			}
		).keydown(function(ev)
			{
				ev.stopPropagation();
				if (ev.which === 8 && $box.html().length > 0)
				{
					$box[0].innerHTML = $box.html().substring(0, $box.html().length - 1);
					$box[0].innerHTML = testForLinks($box[0].innerHTML);
					box.text = $box.html();
					updateBox(box);
				}
			}
		);
	}
}

function testForLinks(str)
{
	var matches, address, 
		pattern = /\b(?=\w)(?:(http(?:s)?\:\/\/\S*)|(www\.\S*))\s(?![^<]*?>)/;
	while ((matches = pattern.exec(str)) != null)
	{
		if (matches[1] != null) {address = matches[1];}
		else {address = "http://" + matches[2];}

		str = str.slice(0,matches.index) + '<a href = "' + address + ' ">' + matches[0] + ' </a>'
			+ testForLinks(str.slice(matches.index + matches[0].length, str.length));
		return str;
	}
	return str;
}
