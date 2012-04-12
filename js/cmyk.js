view.size.width = window.innerWidth;
view.size.height = window.innerHeight;

var // Arithmetic variables
    radius  = 50,
    radian  = Math.PI / 180,
    width   = Math.cos(30 * radian) * radius * 2,
    height  = Math.tan(60 * radian) * (width / 2),
    tWidth  = Math.cos(30 * Math.PI / 180) * radius * 2,
    tHeight = Math.sin(30 * Math.PI / 180) * radius + radius,
    nrHoriz = Math.ceil(view.size.width / tWidth) + 2,   // Two extra triangles, just in case...
    nrVerti = Math.ceil(view.size.height / tHeight) + 2, // Two extra triangles, just in case...
    // Animation speeds
    movementSpeed = 80,
    movementFadeOut = 0.06,
    // Colors
    waveHighlight = 'magenta',
    series1Color  = 'yellow',
    series2Color  = 'cyan',
    // Poiting down series
    series1 = {
        startX: -radius,
        startY: 0,
        color:  series1Color
    },
    // Pointing up series
    series2 = {
        startX: -radius + width / 2.65,
        startY: radius * 2 - height - (radius / 8),
        color:  series2Color
    },
    // General vars
    triangle,
    i,
    j,
    n = 0,
    offset,
    downTriangles = [],
    upTriangles   = [];

function fade(triangle) {
    // If no opacity was found, do nothing and exit
    if (isNaN(triangle.opacity) || isNaN(triangle.opacityDelta)) {
        return;
    }

    // Once opacity reaches a threshold, reset it
    if (triangle.opacity <= 0.25) {
        if (triangle.nextOpacityDelta) {
            triangle.opacityDelta = triangle.nextOpacityDelta;
            triangle.nextOpacityDelta = null;
        }

        if (triangle.nextColor) {
            triangle.fillColor = triangle.nextColor;
            triangle.nextColor = null;
        }
        triangle.opacity = 1;
    }

    triangle.opacity -= triangle.opacityDelta;
}

var onFrameFn = function (event) {
        fade(this);
    },
    onMouseEnterFn = function () {
},
    onMouseLeaveFn = function () {
},
    onMouseClickSeries1Fn = function () {
        var i,
            dx,
            dy,
            triangle,
            func = function () {
                this.fillColor = waveHighlight;
                this.opacity = 1;
                this.nextColor = series2.color;
                this.nextOpacityDelta = this.opacityDelta;
                this.opacityDelta = movementFadeOut;
            };

        this.nextColor = this.fillColor;
        this.fillColor = 'black';
        this.opacity = 1;
        this.nextOpacityDelta = this.opacityDelta;
        this.opacityDelta = movementFadeOut;

        // Spread top
        i = 0;
        dx = this.x;
        dy = this.y - 1;
        while (dy > -1) {
            triangle = upTriangles[(dy % 2) ? dx - 1 : dx][dy];

            // Schedules highlight function
            setTimeout(func.bind(triangle), movementSpeed * i);

            // Update indexes for next iteration
            i += 1;
            dy -= 2;
        }

        // Spread bottom left
        i = 0;
        dx = this.x - 1;
        dy = this.y;
        while (dx > -1 && dy < upTriangles.length) {
            triangle = upTriangles[dx][dy];

            // Schedules highlight function
            setTimeout(func.bind(triangle), movementSpeed * i);

            // Update indexes for next iteration
            i += 1;
            dy += 1;
            dx -= (dy % 2) ? 2 : 1;
        }

        // Spread bottom right
        i = 0;
        dx = this.x;
        dy = this.y;
        while (dx < upTriangles[0].length || dy < upTriangles.length) {
            triangle = upTriangles[dx][dy];

            // Schedules highlight function
            setTimeout(func.bind(triangle), movementSpeed * i);

            // Spread bottom right
            i += 1;
            dy += 1;
            dx += (dy % 2) ? 1 : 2;
        }
    },
    onMouseClickSeries2Fn = function () {
        var i,
            dx,
            dy,
            triangle,
            func = function () {
                this.fillColor = waveHighlight;
                this.opacity = 1;
                this.nextColor = series1.color;
                this.nextOpacityDelta = this.opacityDelta;
                this.opacityDelta = movementFadeOut;
            };

        this.nextColor = this.fillColor;
        this.fillColor = 'black';
        this.opacity = 1;
        this.nextOpacityDelta = this.opacityDelta;
        this.opacityDelta = movementFadeOut;

        // Spread bottom
        i = 0;
        dx = (this.y % 2) ? this.x + 1 : this.x;
        dy = this.y + 1;
        while (dy < downTriangles[0].length) {
            triangle = downTriangles[dx][dy];

            setTimeout(func.bind(triangle), movementSpeed * i);

            i += 1;
            dy += 2;
        }

        // Spread top left
        i = 0;
        dx = this.x;
        dy = this.y;
        while (dx > -1 && dy > -1) {
            triangle = downTriangles[dx][dy];

            setTimeout(func.bind(triangle), movementSpeed * i);

            i += 1;
            dy -= 1;
            dx -= (dy % 2) ? 2 : 1;
        }

        // Spread top right
        i = 0;
        dx = this.x + 1;
        dy = this.y;
        while (dx < upTriangles[0].length || dy > -1) {
            triangle = downTriangles[dx][dy];

            setTimeout(func.bind(triangle), movementSpeed * i);

            i += 1;
            dy -= 1;
            dx += (dy % 2) ? 1 : 2;
        }
    };

i = nrHoriz;

// Cycle through the triangles
while (i > 0) {
    // Update indexes
    i -= 1;
    j = nrVerti;

    downTriangles[i] = [];
    upTriangles[i]   = [];

    while (j) {
        j -= 1;

        offset = (j % 2 === 0 ? 0 : tWidth / 2);

        // Series 1
        triangle = new Path.RegularPolygon(new Point(series1.startX + (i * tWidth) + offset, series1.startY + (j * tHeight)), 3, radius);
        triangle.fillColor = series1.color;
        triangle.rotate(60, triangle.bounds.center);

        // Events
        triangle.onFrame = onFrameFn;
        triangle.onMouseEnter = onMouseEnterFn;
        triangle.onMouseLeave = onMouseLeaveFn;
        triangle.onClick = onMouseClickSeries1Fn;

        // New atributes
        triangle.opacityDelta = Math.random() * 0.01 + 0.001;
        triangle.x = i;
        triangle.y = j;

        downTriangles[i][j] = triangle;

        // Series 2
        triangle = new Path.RegularPolygon(new Point(series2.startX + (i * tWidth) + offset, series2.startY + (j * tHeight)), 3, radius);
        triangle.fillColor = series2.color;
        triangle.onFrame = onFrameFn;
        triangle.onClick = onMouseClickSeries2Fn;

        // New atributes
        triangle.opacityDelta = Math.random() * 0.01 + 0.001;
        triangle.x = i;
        triangle.y = j;

        upTriangles[i][j] = triangle;
    }
}