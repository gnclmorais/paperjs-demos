var // The amount of circles we want to make:
    count = 150,
    // Create a symbol, which we will use to place instances of later:
    path = new Path.Circle(new Point(0, 0), 10);

path.style = {
    fillColor: 'white',
    strokeColor: 'black'
};

var symbol = new Symbol(path),
    center,
    placedSymbol,
    i;

// Place the instances of the symbol:
for (i = 0; i < count; i += 1) {
    // The center position is a random point in the view:
    center = Point.random() * view.size;
    placedSymbol = symbol.place(center);

    placedSymbol.scale(i / count);
}

// The onFrame function is called up to 60 times a second:
function onFrame(event) {
    var i,
        item,
        random;

    // Run through the active layer's children list and change
    // the position of the placed symbols:
    for (i = 0; i < count; i += 1) {
        item = project.activeLayer.children[i];

        // Move the item 1/20th of its width to the right. This way
        // larger circles move faster than smaller circles:
        item.position.x += item.bounds.width / 20;

        // If the item has left the view on the right, move it back
        // to the left:
        if (item.bounds.left > view.size.width) {
            item.position.x = -item.bounds.width;

            // Adds a couple of entropy in the next y position
            random = Math.random() * 100 * Math.round(Math.random() * -1);
            item.position.y += random;
            if (item.position.y > view.size.height) {
                item.position.y -= view.size.height;
            } else if (item.position.y < 0) {
                item.position.y *= -1;
            }
        }
    }
}