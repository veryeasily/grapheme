function loadBoxes()	{
	grapheme.view("grapheme/getMarks",	{
			success: function(data)	{
				console.log(data);
				for (var i = 0, _len=data.rows.length; i<_len; i++)	{
					var props = data.row[i], color,
						box = new Box(null, props), color = box.clrs;
					var $box = $('<div>').attr('id', box._id)
									.attr('class', 'textBox');
					$box.css({left: box.pts.minP[0] + 'px', top: box.pts.minP[1] + 'px',
							  position: 'absolute', opacity:0.7, "z-index": 100, "font-size":"small"})
						.css(box.clrs.colorStrings);		
					$box.width(box.pts.width).height(box.pts.height);
					$box[0].innerHTML = box.text;
					$box.appendTo($BOD);
					armBoxForTyping(box);
					/* grapheme.removeDoc(data.rows[i].id,	{
									success: function(data)	{
										console.log("victory!");	},
									error: function(data)	{
										console.log("error!");	}	}	);	*/	}	},
			error: function(data) {console.log(data);	},
			key: [document.location.hostname, document.location.pathname, "box"], 	}	); 	}

function updateBox(box)
{
	grapheme.saveDoc(box,
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
