import AppendCommandBase from '../../../dynamictext/methods/AppendCommand.js';

const GetValue = Phaser.Utils.Objects.GetValue;

var OnParseCrossFadeBackgroundMusicTag = function (textPlayer, parser, config) {
    var tagName = GetValue(config, 'tags.bgm.cross', 'bgm.cross');
    parser
        .on(`+${tagName}`, function (name, fadeTime) {
            AppendCommandBase.call(textPlayer,
                'bgm.cross',               // name
                CrossFadeBackgroundMusic,  // callback
                [name, fadeTime],          // params
                textPlayer,                // scope
            );
            parser.skipEvent();
        })
        .on(`-${tagName}`, function () {
            parser.skipEvent();
        })
}

var CrossFadeBackgroundMusic = function (params) {
    var name = params[0];
    var fadeTime = params[1];

    // this: textPlayer
    this.soundManager.crossFadeBackgroundMusic(name ,fadeTime);
}

export default OnParseCrossFadeBackgroundMusicTag;