var hEnd  = new Point(view.size.width, 0),
    vEnd  = new Point(0, view.size.height),
    hLine = new Path.Line(-hEnd, hEnd),
    vLine = new Path.Line(-vEnd, vEnd),
    lineStyle = {
        strokeColor: 'white',
        strokeWidth: 3
        //dashArray: [100, 25]
    },
    nEnemies = 0;

hLine.style = lineStyle;
vLine.style = lineStyle;

function onMouseMove(event) {
    vLine.position = event.point;
    hLine.position = event.point;
}

// Create a new layer
var secondLayer = new Layer();

/*
 * Spherical enemy.
 */
var Enemy = function (center, radius, growth) {
    var that = Path.Circle(center, radius);

    that.growthSpeed = growth || 1.005;

    // Animation
    that.onFrame = function () {
        this.scale(that.growthSpeed);

        if (this.bounds.width >= Math.max(view.size.width, view.size.height)) {
            console.log('BOOOOOOOOOOOOOOM!');

            project.activeLayer.removeChildren();

            that.onFrame = null;

            window.clearInterval(abiogenesis);

            project.layers[0].activate();

            console.log(view);

/*
            var i,
                children = project.activeLayer.children.length;

            for (i = 0; i < children; i += 1) {
                project.activeLayer.children[i].remove();
            }*/
        }
    };

    // Mouse down action
    that.onMouseDown = function () {
        nEnemies -= 1;

        var nextEnemies = Math.round(Math.random() * 1);
        nextEnemies = nEnemies > 0 && nextEnemies > 0 ? nextEnemies : nextEnemies + 1;
        while (nextEnemies) {
            setTimeout(function () {
                    spawn(1);
                }, Math.random() * 1000);
            //spawn(nEnemies > 0 && nextEnemies > 0 ? nextEnemies : nextEnemies + 1);

            nextEnemies -= 1;
        }

        this.onFrame = function () {
            if (Math.floor(that.bounds.width) > 0) {
                this.scale(0.8);

                this.opacity -= this.opacity > 0.1 ? 0.1 : this.opacity -= 0.1;
            }
        };
    };

    return that;
};

// Start the first enemy
spawn(1);

function onFrame(event) {
    var nChildren = project.activeLayer.children.length;
}

function spawn(plus) {
    nEnemies += plus;

    var enemy;

    while (plus) {
        center = Point.random() * view.size;

        enemy = Enemy(center, 10 + Math.round(Math.random() * 10), 1.005 + Math.random() * 0.02);
        enemy.fillColor = 'black';

        plus -= 1;
    }
}

// Increase difficulty from time to time
var abiogenesis = window.setInterval(function () {
        spawn(1);

        console.log('Enemies are now ' + nEnemies);
    }, 5000);
