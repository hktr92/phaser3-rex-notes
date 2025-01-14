import FadeIn from '../../../audio/fade/fadeIn.js';
import FadeOut from '../../../audio/fade/fadeOut.js';

const GetValue = Phaser.Utils.Objects.GetValue;

class SoundManager {
    constructor(scene, config) {
        this.scene = scene;

        // Sound effect will be destroyed when completed
        this.soundEffect = undefined;

        // Background music will be (fade out)destroyed when play next one.
        this.backgroundMusic = undefined;

        this.setBackgroundMusicLoopValue(GetValue(config, 'bgm.loop', true));
        this.setBackgroundMusicFadeTime(GetValue(config, 'bgm.fade', 500));

        var initialBackgroundMusic = GetValue(config, 'bgm.initial', undefined);
        if (initialBackgroundMusic) {
            this.setCurrentBackgroundMusic(initialBackgroundMusic);
        }
    }

    destroy() {
        if (this.soundEffect) {
            this.soundEffect.destroy();
            this.soundEffect = undefined;
        }

        if (this.backgroundMusic) {
            this.backgroundMusic.destroy();
            this.backgroundMusic = undefined;
        }

        this.scene = undefined;
    }

    setBackgroundMusicLoopValue(value) {
        this.backgroundMusicLoopValue = value;
        return this;
    }

    setBackgroundMusicFadeTime(time) {
        this.backgroundMusicFadeTime = time;
        return this;
    }

    getSoundEffect() {
        return this.soundEffect;
    }

    getBackgroundMusic() {
        return this.backgroundMusic;
    }

    playSoundEffect(key) {
        this.soundEffect = this.scene.sound.add(key);
        this.soundEffect
            .once('complete', function () {
                this.soundEffect.destroy();
                this.soundEffect = undefined;
            }, this)
            .once('destroy', function () {
                this.soundEffect = undefined;
            }, this)
            .play();

        return this;
    }

    setSoundEffectVolume(volume) {
        if (this.soundEffect) {
            this.soundEffect.setVolume(volume);
        }

        return this;
    }

    fadeInSoundEffect(time) {
        if (this.soundEffect) {
            FadeIn(this.scene, this.soundEffect, time);
        }

        return this;
    }

    fadeOutSoundEffect(time, isStopped) {
        if (this.soundEffect) {
            FadeOut(this.scene, this.soundEffect, time, isStopped);
        }

        return this;
    }

    setCurrentBackgroundMusic(music) {
        this.backgroundMusic = music;

        if (music) {
            music.setLoop(this.backgroundMusicLoopValue);
            music
                .once('complete', function () {
                    this.backgroundMusic.destroy();
                    this.backgroundMusic = undefined;
                }, this)
                .once('destroy', function () {
                    this.backgroundMusic = undefined;
                }, this)

            if (!music.isPlaying) {
                music.play();
            }
        }
    }

    playBackgroundMusic(key) {
        // Don't re-play the same background music
        if (this.backgroundMusic && (this.backgroundMusic.key === key)) {
            return this;
        }

        this.stopBackgroundMusic(); // Stop previous background music

        this.setCurrentBackgroundMusic(this.scene.sound.add(key));

        if (this.backgroundMusicFadeTime > 0) {
            this.fadeInBackgroundMusic(this.backgroundMusicFadeTime);
        }
        return this;
    }

    pauseBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
        return this;
    }

    resumeBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.resume();
        }
        return this;
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            if (this.backgroundMusicFadeTime > 0) {
                this.fadeOutBackgroundMusic(this.backgroundMusicFadeTime, true);

            } else {
                this.backgroundMusic.stop();
                this.backgroundMusic.destroy();
                this.backgroundMusic = undefined;
            }
        }
        return this;
    }

    fadeInBackgroundMusic(time) {
        if (this.backgroundMusic) {
            FadeIn(this.scene, this.backgroundMusic, time);
        }

        return this;
    }

    fadeOutBackgroundMusic(time, isStopped) {
        if (this.backgroundMusic) {
            FadeOut(this.scene, this.backgroundMusic, time, isStopped);
        }

        return this;
    }

    crossFadeBackgroundMusic(key, time) {
        var backgroundMusicFadeTimeSave = this.backgroundMusicFadeTime;
        this.backgroundMusicFadeTime = 0;

        this
            .fadeOutBackgroundMusic(time, true)
            .playBackgroundMusic(key)
            .fadeInBackgroundMusic(time);

        this.backgroundMusicFadeTime = backgroundMusicFadeTimeSave;

        return this;
    }

}

export default SoundManager;