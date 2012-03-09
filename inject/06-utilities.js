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
