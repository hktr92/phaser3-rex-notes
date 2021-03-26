import BaseSpinner from '../base/BaseSpinner.js';
import { Circle } from '../../../plugins/gameobjects/shape/shapes/shape';
import Fold from '../utils/Fold.js';


class Puff extends BaseSpinner {
    constructor(scene, config) {
        super(scene, config);
        this.type = 'rexSpinnerPuff';
    }

    buildShapes() {
        this.addShape(new Circle());
    }

    updateShapes() {
        var centerX = this.centerX;
        var centerY = this.centerY;
        var radius = this.radius;
        var puffRadius = radius * this.value;
        var lineWidth = Math.ceil(radius / 25);
        var alpha = Fold(this.value);

        this.getShapes()[0]
            .lineStyle(lineWidth, this.color, alpha)
            .setRadius(puffRadius)
            .setCenterPosition(centerX, centerY)
    }
}

export default Puff;