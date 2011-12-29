if (typeof AB == 'undefined') AB = {};

AB.grid = function (canvas, cols, gutter, styling) {
	var widthCnv = 0; //Used to calculate dimensions
	
	if (typeof styling != 'object' || styling == null) styling = {};
	
	try {
		var ctx = canvas.getContext('2d'); //Handle for the canvas
		widthCnv = canvas.width;
	}
	catch (e) {
		//Can't access the canvas
		
		styling.draw = false;
		
		//Did they pass a number instead?
		if (canvas && canvas > 0 && isNaN(styling.overrideWidth)) {
			styling.overrideWidth = canvas;
		}
		
		if (isNaN(styling.overrideWidth)) {
			return false;
		}
	}
	
	var colCount = 0, //The number of columns drawn
		pseudoColCount = 0, //The virtual number of columns when size-multipliers are given
		colMultiplier = 1; //The default size-multiplier for a column
	
	//Assign default styling
	//Default to drawing the columns and background
	if (typeof styling.draw == 'undefined') styling.draw = true;
	//Set default background color
	if (typeof styling.background == 'undefined') {
		styling.background = '#C1DEFE';
	}
	//Set default foreground color
	if (typeof styling.foreground == 'undefined') {
		styling.foreground = '#94C5FC';
	}
	
	//Combine overrideWidth with draw: false to calculate nested columns
	if (!isNaN(styling.overrideWidth)) {
		widthCnv = styling.overrideWidth;
	}
	
	//Allow users to pass either an array of size-multipliers or a 
	//number of equal-sized columns
	if (isNaN(cols)) {
		for (var i= 0; i < cols.length; i++) {
			//Clean up any weird values
			cols[i] = Math.max(parseInt(cols[i]), 1);
			pseudoColCount += cols[i];
			colCount++;
		}
	}
	else {
		pseudoColCount = colCount = parseInt(cols);
	}
	
	//Don't include outer margins by default
	var gutterMultiplier = colCount - 1;
	if (styling.includeOuter) {
		gutterMultiplier = colCount + 1;
	}
	
	//Construct our default return object
	var returns = {
		cols: colCount,
		gutter: gutter,
		width: 0,
		offsets: [],
		element: (typeof canvas == 'object')?canvas:null
	};
	
	//Draw the background
	if (styling.draw) {
		ctx.fillStyle = styling.background;
		ctx.fillRect(0, 0, widthCnv, canvas.height);
		
		//Configure the foreground
		ctx.fillStyle = styling.foreground;
	}
	
	//Calculate the column width
	returns.width = Math.floor((widthCnv - (gutterMultiplier * gutter)) / pseudoColCount);
	
	//Set the initial X
	var offset = 0;
	if (styling.includeOuter) {
		offset = gutter;
	}
	
	for (var j = 0; j < colCount; j++) {
		//Set the new column's width
		if (pseudoColCount != colCount) {
			colMultiplier = cols[j];
		}
		width = returns.width * colMultiplier;
		
		//Draw the foreground
		if (styling.draw) {
			ctx.fillRect(offset, 0, width, canvas.height);
		}
		
		//Store the position of the column
		returns.offsets.push(offset);
		
		//Advance to the next column
		offset += width + gutter;
	}
	
	return returns;
}