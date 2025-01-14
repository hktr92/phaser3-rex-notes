import GetBoundsConfig from '../utils/GetBoundsConfig.js';
import ALIGNMODE from '../utils/AlignConst.js';
import Space from '../utils/Space.js';
import { GetDisplayWidth, GetDisplayHeight } from '../../../plugins/utils/size/GetDisplaySize.js';

const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
const GetValue = Phaser.Utils.Objects.GetValue;
const ALIGN_CENTER = Phaser.Display.Align.CENTER;
const PROPORTIONMODE = {
    min: 0,
    full: -1,
}

var Add = function (gameObject, proportion, align, paddingConfig, expand, childKey, index, minSize) {
    this.pin(gameObject);

    var proportionType = typeof (proportion);
    if (proportion === null) {
        return this;
    } else if (proportionType === 'number') {

    } else if (proportionType === 'string') {
        proportion = PROPORTIONMODE[proportion];
    } else if (IsPlainObject(proportion)) {
        var config = proportion;
        proportion = GetValue(config, 'proportion', 0);
        align = GetValue(config, 'align', ALIGN_CENTER);
        paddingConfig = GetValue(config, 'padding', 0);
        expand = GetValue(config, 'expand', false);
        childKey = GetValue(config, 'key', undefined);
        index = GetValue(config, 'index', undefined);

        if (!gameObject.isRexSizer) {
            minSize = GetValue(config, 'minWidth', undefined);
            if (this.orientation === 0) { // x
                minSize = GetValue(config, 'minWidth', undefined);
            } else {  // y
                minSize = GetValue(config, 'minHeight', undefined);
            }
        }
    }

    if (typeof (align) === 'string') {
        align = ALIGNMODE[align];
    }

    if (proportion === undefined) {
        proportion = 0;
    }
    if (align === undefined) {
        align = ALIGN_CENTER;
    }
    if (paddingConfig === undefined) {
        paddingConfig = 0;
    }
    if (expand === undefined) {
        expand = false;
    }

    var config = this.getSizerConfig(gameObject);
    config.proportion = proportion;
    config.align = align;
    config.padding = GetBoundsConfig(paddingConfig);
    config.expand = expand;
    if ((index === undefined) || (index >= this.sizerChildren.length)) {
        this.sizerChildren.push(gameObject);
    } else {
        this.sizerChildren.splice(index, 0, gameObject);
    }

    if (!gameObject.isRexSizer && (proportion > 0)) { // Expand normal game object
        if (this.orientation === 0) { // x
            gameObject.minWidth = (minSize === undefined) ? GetDisplayWidth(gameObject) : minSize;
            gameObject.minHeight = undefined;
        } else {
            gameObject.minWidth = undefined;
            gameObject.minHeight = (minSize === undefined) ? GetDisplayHeight(gameObject) : minSize;
        }
    }

    if (childKey !== undefined) {
        this.addChildrenMap(childKey, gameObject)
    }
    return this;
};

export default {
    add: Add, // sizer.add could be override

    addSpace(proportion) {
        if (proportion === undefined) {
            proportion = 1;
        }
        Add.call(this, Space(this.scene),
            {
                proportion: proportion,
                minWidth: 0,
                minHeight: 0
            }
        );
        // No problem if sizer.add is override
        return this;
    },

    insert(index, gameObject, proportion, align, paddingConfig, expand, childKey) {
        Add.call(this, gameObject, proportion, align, paddingConfig, expand, childKey, index);
        // No problem if sizer.add is override
        return this;
    }
}