import AppendCommandBase from '../../../dynamictext/methods/AppendCommand.js';

const GetValue = Phaser.Utils.Objects.GetValue;

var OnParseFadeOutBackgroundMusicTag = function (textPlayer, parser, config) {
    var tagName = GetValue(config, 'tags.bgm.fadeout', 'bgm.fadeout');
    parser
        .on(`+${tagName}`, function (time, isStopped) {
            AppendCommand(textPlayer, time, isStopped);
            parser.skipEvent();
        })
        .on(`-${tagName}`, function () {
            parser.skipEvent();
        })
}

var FadeOutBackgroundMusic = function (params) {
    this.soundManager.fadeOutBackgroundMusic.apply(this.soundManager, params);  // this: textPlayer
}

var AppendCommand = function (textPlayer, time, isStopped) {
    AppendCommandBase.call(textPlayer,
        'bgm.fadeout',           // name
        FadeOutBackgroundMusic,  // callback
        [time, isStopped],      // params
        textPlayer,             // scope
    );
}

export default OnParseFadeOutBackgroundMusicTag;