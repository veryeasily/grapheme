function draw(ev)
{
	var $box, box;
	this.onmousedown = null;
	box = new Box(ev);  //BoxStore
	$box = $('<div>').appendTo($BOD).attr('class', 'textBox');
	$box.css({position:'absolute', opacity:0.7, "z-index": 100, 'font-size':'small'});

	this.onmouseup = function(ev)
	{
		this.onmousemove = null;
		this.onmouseup = null;
		this.onmousedown = draw;

		if ($box.height() < 10 || $box.width() < 10)
				$box.remove();
		else
		{
			grapheme.saveDoc(box,
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
