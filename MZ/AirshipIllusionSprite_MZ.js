//=============================================================================
// AirshipIllusionSprite_MZ.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Airship Illusion - Sprite Animation Module v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 * @help
 * ============================================================================
 * Airship Illusion - Sprite Animation Module v1.0.0 for RPG Maker MZ
 * ============================================================================
 *
 * This module handles the airship sprite animation for the Airship Illusion system.
 * Supported animation types: Hovering, Turning Left, Turning Right,
 * Accelerating, Moving Forward, Moving Backward.
 * Must be used together with AirshipIllusionCore_MZ.js.
 *
 * v1.0.0 - Initial MZ release
 *
 * ============================================================================
 * License: MIT License
 * ============================================================================
 * Copyright (c) 2025 Load of Game (Umi Aizu)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ============================================================================
 *
 * @param airshipSpriteScale
 * @text Airship Sprite Scale
 * @type number
 * @min 0.1
 * @max 3.0
 * @decimals 1
 * @default 1.0
 * @desc Display scale of the airship sprite (1.0=normal, 1.5=1.5x)
 */

/*:ja
 * @target MZ
 * @plugindesc 飛空艇イリュージョン - スプライトアニメーションモジュール v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 * @help
 * ============================================================================
 * 飛空艇イリュージョン - スプライトアニメーションモジュール v1.0.0 for RPG Maker MZ
 * ============================================================================
 *
 * このモジュールは飛空艇イリュージョンシステムの飛空艇スプライトアニメーションを処理します。
 * アニメーションタイプをサポートします：ホバリング、左旋回、右旋回、加速、前進、後退。
 * AirshipIllusionCore_MZ.jsと一緒に使用する必要があります。
 *
 * v1.0.0 - MZ版初版リリース
 *
 * ============================================================================
 * ライセンス: MIT License
 * ============================================================================
 * 【日本語要約】
 * 本プラグインはMITライセンスの下で公開されています。
 * 商用・非商用問わず、自由に使用・改変・再配布が可能です。
 * 著作権表示とライセンス表示を含める必要があります。
 *
 * 【原文】
 * Copyright (c) 2025 Load of Game (Umi Aizu)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ============================================================================
 *
 * @param airshipSpriteScale
 * @text 飛空艇スプライト倍率
 * @type number
 * @min 0.1
 * @max 3.0
 * @decimals 1
 * @default 1.0
 * @desc 飛空艇スプライトの表示倍率（1.0=等倍、1.5=1.5倍）
 */

(() => {
    'use strict';

    // コアプラグインが読み込まれているかチェック
    if (!window.AirshipIllusion || !window.AirshipIllusion.Base) {
        throw new Error('AirshipIllusionSprite_MZ requires AirshipIllusionCore_MZ to be loaded first');
    }

    // プラグインパラメータ読み込み
    const pluginName = 'AirshipIllusionSprite_MZ';
    const parameters = PluginManager.parameters(pluginName);
    const airshipSpriteScale = Number(parameters['airshipSpriteScale'] || 1.0);
    
    //=============================================================================
    // AirshipIllusionSprite
    //=============================================================================
    
    class AirshipIllusionSprite extends AirshipIllusion.Base {
        // アニメーションタイプ
        static ANIMATION_TYPES = {
            HOVERING: 'hovering',
            TURNING_LEFT: 'turning_left',
            TURNING_RIGHT: 'turning_right',
            ACCELERATING: 'accelerating',
            MOVING_FORWARD: 'moving_forward',  // 前進
            MOVING_BACKWARD: 'moving_backward'  // 後退
        };
        
        onInitialize() {
            // リソースを登録
            this.registerResource('image', 'spriteSheet', AirshipIllusion.params.airshipSpriteSheet);
            this.registerResource('json', 'animationData', AirshipIllusion.params.airshipAnimationJSON);
            
            // アニメーションプロパティ
            this._currentAnimation = AirshipIllusionSprite.ANIMATION_TYPES.HOVERING;
            this._animationData = null;
            this._currentFrame = 0;
            this._animationTimer = 0;
            this._animationCompleted = false;
            this._lastAnimation = null;
            
            // スプライト
            this._airshipSprite = null;
            this._shadowSprite = null;
            this._spriteContainer = null;
            
            // 状態フラグ
            this._turningLeft = false;
            this._turningRight = false;
            this._isBoosting = false;
            this._currentSpeed = 0;
            
            // 発進演出
            this._launchEffectActive = false;
            this._launchEffectType = 'rise';
            this._launchEffectTimer = 0;
            this._initialY = 0;
            this._initialX = 0;
        }
        
        onResourcesLoaded() {
            this._animationData = this.getResource('animationData');
            this._createSprites();
            this._setupAnimation();
        }
        
        _createSprites() {
            const bitmap = this.getResource('spriteSheet');
            
            if (!bitmap) {
                return;
            }
            
            // 影スプライトを作成
            this._shadowSprite = new Sprite();
            this._shadowSprite.bitmap = ImageManager.loadSystem('Shadow2');
            this._shadowSprite.anchor.x = 0.5;
            this._shadowSprite.anchor.y = 0.5;
            this._shadowSprite.opacity = 128;
            this._shadowSprite.z = 5;
            
            // 飛空艇スプライトを作成
            this._airshipSprite = new Sprite();
            this._airshipSprite.bitmap = bitmap;
            this._airshipSprite.anchor.x = 0.5;
            this._airshipSprite.anchor.y = 0.5;
            this._airshipSprite.z = 6;
            
            // スプライトを画面中央に配置
            const centerX = Graphics.width / 2;
            const centerY = Graphics.height / 2 - 30;
            
            this._shadowSprite.x = centerX;
            this._shadowSprite.y = centerY + 40;
            
            this._airshipSprite.x = centerX;
            this._airshipSprite.y = centerY;
            this._initialY = centerY;
            this._initialX = centerX;
            
            // 最初は非表示にする
            this._airshipSprite.visible = false;
            this._shadowSprite.visible = false;
            
            // シーンに追加
            if (SceneManager._scene) {
                SceneManager._scene.addChild(this._shadowSprite);
                SceneManager._scene.addChild(this._airshipSprite);
            }
        }
        
        _setupAnimation() {
            if (!this._animationData || !this._animationData.animations) {
                return;
            }
            
            // 初期アニメーションフレームを設定
            this._currentFrame = 0;
            this._currentAnimation = AirshipIllusionSprite.ANIMATION_TYPES.HOVERING;
            this._updateAnimationFrame();
        }
        
        _parseFrameRange(frameStr) {
            // "0-7"のような形式をパース
            if (typeof frameStr === 'string' && frameStr.includes('-')) {
                const parts = frameStr.split('-');
                const start = parseInt(parts[0]);
                const end = parseInt(parts[1]);
                const frames = [];
                for (let i = start; i <= end; i++) {
                    frames.push(i);
                }
                return frames;
            }
            return [];
        }
        
        _updateAnimationFrame() {
            if (!this._animationData || !this._airshipSprite) {
                console.warn('[AirshipSprite] Missing animationData or airshipSprite');
                return;
            }

            // ビットマップがロードされていない場合は待つ
            if (!this._airshipSprite.bitmap || !this._airshipSprite.bitmap.isReady()) {
                console.warn('[AirshipSprite] Bitmap not ready for animation:', this._currentAnimation);
                return;
            }

            // マッピングを使用して実際のアニメーション名を取得
            const animationName = this._animationData.mapping ?
                this._animationData.mapping[this._currentAnimation] :
                this._currentAnimation;

            // アニメーションを名前で検索
            let animData = null;
            if (this._animationData.animations && Array.isArray(this._animationData.animations)) {
                animData = this._animationData.animations.find(anim => {
                    return anim.name === animationName;
                });
            }

            if (!animData) {
                console.warn('[AirshipSprite] Animation not found:', this._currentAnimation, '→', animationName);
                return;
            }

            // フレーム範囲を解析（"0-7"のような形式）
            const frames = this._parseFrameRange(animData.frames);
            if (!frames || frames.length === 0) {
                console.warn('[AirshipSprite] No frames for animation:', animationName);
                return;
            }

            const frameIndex = frames[this._currentFrame % frames.length];
            const frameWidth = this._animationData.frame_size ? this._animationData.frame_size.width : 256;
            const frameHeight = this._animationData.frame_size ? this._animationData.frame_size.height : 256;

            // ソース矩形を計算
            let sx, sy;
           
            sx = frameIndex * frameWidth;
            sy = animData.row * frameHeight;
            
            // フレームを設定
            this._airshipSprite.setFrame(sx, sy, frameWidth, frameHeight);

            
        }
        
        onActivate() {
            // アクティベート時は発進演出待機状態（内部から戻った場合を除く）
            if (!$gameAirshipIllusion || !$gameAirshipIllusion.wasInInterior) {
                this._waitingForLaunch = true;
            } else {
                this._waitingForLaunch = false;
            }
            
            // コントロールイベントをリッスン
            AirshipIllusion.eventBus.on('turningStateChanged', this._onTurningStateChanged, this);
            AirshipIllusion.eventBus.on('boostStateChanged', this._onBoostStateChanged, this);
            AirshipIllusion.eventBus.on('positionChanged', this._onPositionChanged, this);
        }
        
        onDeactivate() {
            // イベントリスナーを削除
            AirshipIllusion.eventBus.off('turningStateChanged', this._onTurningStateChanged, this);
            AirshipIllusion.eventBus.off('boostStateChanged', this._onBoostStateChanged, this);
            AirshipIllusion.eventBus.off('positionChanged', this._onPositionChanged, this);
        }
        
        _onTurningStateChanged(data) {
            this._turningLeft = data.turningLeft || false;
            this._turningRight = data.turningRight || false;
        }
        
        _onBoostStateChanged(data) {
            this._isBoosting = data.isBoosting || false;
        }
        
        _onPositionChanged(data) {
            this._currentSpeed = data.speed || 0;
        }
        
        onUpdate() {
            // 発進演出待機中は何もしない
            if (this._waitingForLaunch && !this._launchEffectActive) {
                return;
            }
            
            // 発進演出中は特別処理
            if (this._launchEffectActive) {
                this.updateLaunchEffect();
                this.updateFrame();
                return;
            }
            
            // 通常の更新処理
            this.updateAnimation();
            this.updateEffects();
        }
        
        // 発進演出の開始
        startLaunchEffect(type) {
            // スプライトが作成されていなければ待つ
            if (!this._airshipSprite || !this._shadowSprite) {
                setTimeout(() => {
                    this.startLaunchEffect(type);
                }, 100);
                return;
            }
            
            // 待機状態を解除
            this._waitingForLaunch = false;
            
            this._launchEffectActive = true;
            this._launchEffectType = type;
            this._launchEffectTimer = 0;
            
            // 初期位置を設定
            if (!this._initialX || !this._initialY) {
                this._initialX = Graphics.width / 2;
                this._initialY = Graphics.height / 2 - 30;
            }

            // 発進タイプによって初期状態を設定
            switch(type) {
                case 'rise':
                    // 垂直上昇 - 画面下から開始
                    this._airshipSprite.visible = true;
                    this._shadowSprite.visible = true;

                    const startY = this._initialY + 300;

                    this._airshipSprite.y = startY;
                    this._airshipSprite.x = this._initialX;
                    this._airshipSprite.opacity = 255;
                    this._airshipSprite.scale.x = airshipSpriteScale;
                    this._airshipSprite.scale.y = airshipSpriteScale;

                    this._shadowSprite.x = this._initialX;
                    this._shadowSprite.y = startY + 40;
                    this._shadowSprite.scale.x = 0.1 * airshipSpriteScale;
                    this._shadowSprite.scale.y = 0.05 * airshipSpriteScale;
                    this._shadowSprite.opacity = 20;
                    
                    // 強制描画更新
                    this._airshipSprite.updateTransform();
                    this._shadowSprite.updateTransform();
                    break;
                    
                case 'white':
                    // ホワイトフェード - 画面のティントを利用するので、スプライトは通常表示
                    this._airshipSprite.visible = true;
                    this._shadowSprite.visible = true;

                    this._airshipSprite.y = this._initialY;
                    this._airshipSprite.x = this._initialX;
                    this._airshipSprite.opacity = 255;
                    this._airshipSprite.scale.x = airshipSpriteScale;
                    this._airshipSprite.scale.y = airshipSpriteScale;

                    this._shadowSprite.x = this._initialX;
                    this._shadowSprite.y = this._initialY + 40;
                    this._shadowSprite.opacity = 128;
                    this._shadowSprite.scale.x = airshipSpriteScale;
                    this._shadowSprite.scale.y = 0.5 * airshipSpriteScale;
                    break;
                    
                case 'iris':
                    // アイリスイン（大きいサイズから開始）
                    this._airshipSprite.visible = true;
                    this._shadowSprite.visible = true;

                    this._airshipSprite.y = this._initialY;
                    this._airshipSprite.x = this._initialX;
                    this._airshipSprite.opacity = 255;
                    this._airshipSprite.scale.x = 2.0 * airshipSpriteScale;
                    this._airshipSprite.scale.y = 2.0 * airshipSpriteScale;

                    this._shadowSprite.x = this._initialX;
                    this._shadowSprite.y = this._initialY + 40;
                    this._shadowSprite.opacity = 0;
                    this._shadowSprite.scale.x = 2.0 * airshipSpriteScale;
                    this._shadowSprite.scale.y = 1.0 * airshipSpriteScale;
                    break;
            }
            
            // 強制的にトランスフォーム更新
            if (this._airshipSprite.parent) {
                this._airshipSprite.updateTransform();
            }
            if (this._shadowSprite.parent) {
                this._shadowSprite.updateTransform();
            }
        }

        skipLaunchEffect() {
            // 発進演出をスキップして通常状態にする
            this._launchEffectActive = false;
            this._waitingForLaunch = false;

            // 初期位置を設定
            if (!this._initialX || !this._initialY) {
                this._initialX = Graphics.width / 2;
                this._initialY = Graphics.height / 2 - 30;
            }
            
            // スプライトを通常表示状態にする
            if (this._airshipSprite) {
                this._airshipSprite.visible = true;
                this._airshipSprite.y = this._initialY;
                this._airshipSprite.x = this._initialX;
                this._airshipSprite.opacity = 255;
                this._airshipSprite.scale.x = airshipSpriteScale;
                this._airshipSprite.scale.y = airshipSpriteScale;
                this._airshipSprite.rotation = 0;
            }

            if (this._shadowSprite) {
                this._shadowSprite.visible = true;
                this._shadowSprite.scale.x = airshipSpriteScale;
                this._shadowSprite.scale.y = 0.5 * airshipSpriteScale;
                this._shadowSprite.opacity = 128;
                this._shadowSprite.y = this._initialY + 40;
                this._shadowSprite.x = this._initialX;
            }
        }

        // 白いオーバーレイ作成
        _createWhiteOverlay() {
            if (!this._whiteOverlay) {
                this._whiteOverlay = new Sprite();
                const bitmap = new Bitmap(Graphics.width, Graphics.height);
                bitmap.fillAll('white');
                this._whiteOverlay.bitmap = bitmap;
                this._whiteOverlay.z = 999;
                
                if (SceneManager._scene) {
                    SceneManager._scene.addChild(this._whiteOverlay);
                    if (SceneManager._scene.children.length > 1) {
                        SceneManager._scene.setChildIndex(this._whiteOverlay, 
                            SceneManager._scene.children.length - 1);
                    }
                }
            }
            this._whiteOverlay.opacity = 255;
            this._whiteOverlay.visible = true;
        }

        _updateRiseEffect(progress) {
            if (!this._airshipSprite || !this._shadowSprite) {
                console.warn('Sprites not ready for rise effect');
                return;
            }

            if (!this._initialX || !this._initialY) {
                this._initialX = Graphics.width / 2;
                this._initialY = Graphics.height / 2 - 30;
            }
            
            // イーズアウト
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            // Y座標を上昇させる（下から上へ）
            const startY = this._initialY + 300;
            const endY = this._initialY;
            const currentY = startY + (endY - startY) * easeOut;
            
            this._airshipSprite.y = currentY;
            
            // 最初は振動、後半で安定
            if (progress < 0.3) {
                // エンジン始動の振動
                this._airshipSprite.x = this._initialX + (Math.random() - 0.5) * 4;
            } else {
                // 安定飛行
                this._airshipSprite.x = this._initialX;
            }
            
            // 影の処理
            if (this._shadowSprite) {
                // 影が小さくなっていく
                const shadowScale = (0.1 + 0.9 * easeOut) * airshipSpriteScale;
                this._shadowSprite.scale.x = shadowScale;
                this._shadowSprite.scale.y = shadowScale * 0.5;
                this._shadowSprite.opacity = 20 + 108 * easeOut;
                
                // 影も上昇するが、少し遅れて
                const shadowY = startY + 40 + (endY + 40 - (startY + 40)) * (easeOut * 0.8);
                this._shadowSprite.y = shadowY;
            }
            
            // 強制的にトランスフォーム更新
            this._airshipSprite.updateTransform();
            this._shadowSprite.updateTransform();
        }

        _updateWhiteEffect(progress) {
            // ホワイトフェード効果は$gameScreenのティントで処理するため、
            // スプライト側では特別な処理は不要
            
            // 必要に応じて微細な調整のみ
            if (progress >= 1.0) {
                // 完了時に確実に正しい状態にする
                this._airshipSprite.opacity = 255;
                this._shadowSprite.opacity = 128;
            }
        }

        // 発進演出の更新
        updateLaunchEffect() {
            if (!this._launchEffectActive) return;
            
            this._launchEffectTimer++;
            const duration = 180; // 3秒
            const progress = Math.min(this._launchEffectTimer / duration, 1.0);
            
            switch(this._launchEffectType) {
                case 'rise':
                    this._updateRiseEffect(progress);
                    break;
                    
                case 'white':
                    this._updateWhiteEffect(progress);
                    break;
                    
                case 'iris':
                    this._updateIrisEffect(progress);
                    break;
            }
            
            // 完了チェック
            if (progress >= 1.0) {
                if (this._launchEffectType === 'white') {
                    if (this._whiteOverlay && this._whiteOverlay.opacity >= 255) {
                        this._whiteOverlay.opacity = 254;
                    }
                }
                this.endLaunchEffect();
            }
        }

        // アイリスインエフェクト
        _updateIrisEffect(progress) {
            // イーズアウトバック（少しオーバーシュート）
            const easeOutBack = (t) => {
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
            };

            // 大きいところから小さくなる（手前から奥へ）
            const easedProgress = easeOutBack(progress);
            const scale = (2.0 - easedProgress) * airshipSpriteScale; // 2.0から1.0へ、スケール適用

            if (this._airshipSprite) {
                this._airshipSprite.scale.x = scale;
                this._airshipSprite.scale.y = scale;

                // 回転しながら出現（逆回転）
                this._airshipSprite.rotation = progress * Math.PI * 2;
            }

            if (this._shadowSprite) {
                this._shadowSprite.scale.x = scale;
                this._shadowSprite.scale.y = scale * 0.5;
                this._shadowSprite.opacity = 128 * progress;
            }
        }

        // 発進演出の終了
        endLaunchEffect() {
            this._launchEffectActive = false;
            this._waitingForLaunch = false;

            // 初期位置の確認
            if (!this._initialX) {
                this._initialX = Graphics.width / 2;
            }
            if (!this._initialY) {
                this._initialY = Graphics.height / 2 - 30;
            }
            
            // 最終状態にリセット（必ず表示）
            if (this._airshipSprite) {
                this._airshipSprite.visible = true;
                this._airshipSprite.y = this._initialY;
                this._airshipSprite.x = this._initialX;
                this._airshipSprite.opacity = 255;
                this._airshipSprite.scale.x = airshipSpriteScale;
                this._airshipSprite.scale.y = airshipSpriteScale;
                this._airshipSprite.rotation = 0;
            }

            if (this._shadowSprite) {
                this._shadowSprite.visible = true;
                this._shadowSprite.scale.x = airshipSpriteScale;
                this._shadowSprite.scale.y = 0.5 * airshipSpriteScale;
                this._shadowSprite.opacity = 128;
                this._shadowSprite.y = this._initialY + 40;
                this._shadowSprite.x = this._initialX;
            }
            
            // 白いオーバーレイのフェードアウト処理
            if (this._whiteOverlay) {
                this._fadeOutWhiteOverlay();
            }
        }

        // 白いオーバーレイのフェードアウト処理
        _fadeOutWhiteOverlay() {
            if (!this._whiteOverlay) return;
            
            const fadeSpeed = 5;
            
            const fadeOut = () => {
                if (this._whiteOverlay) {
                    this._whiteOverlay.opacity -= fadeSpeed;
                    
                    if (this._whiteOverlay.opacity <= 0) {
                        if (this._whiteOverlay.parent) {
                            this._whiteOverlay.parent.removeChild(this._whiteOverlay);
                        }
                        this._whiteOverlay = null;
                    } else {
                        requestAnimationFrame(fadeOut.bind(this));
                    }
                }
            };
            
            fadeOut();
        }
        
        updateAnimation() {
            // 発進演出中はアニメーション変更をスキップ
            if (this._launchEffectActive && this._launchEffectType === 'rise') {
                this.updateFrame();
                return;
            }
            
            // 再生するアニメーションを決定
            const newAnimation = this.determineAnimation();
            
            // 必要に応じてアニメーションを切り替え
            if (newAnimation !== this._currentAnimation) {
                this.switchAnimation(newAnimation);
            }
            
            // フレームを更新
            this.updateFrame();
        }
        
        determineAnimation() {
            // キー入力をチェック
            const isAnyKeyPressed = Input.isPressed('up') || 
                                 Input.isPressed('down') || 
                                 Input.isPressed('left') || 
                                 Input.isPressed('right') ||
                                 Input.isPressed('shift');
            
            // 何もキーが押されていない場合は必ずホバリング
            if (!isAnyKeyPressed) {
                return AirshipIllusionSprite.ANIMATION_TYPES.HOVERING;
            }
            
            // キーが押されている場合の優先度：加速 > 旋回 > 前進/後退
            if (this._isBoosting) {
                return AirshipIllusionSprite.ANIMATION_TYPES.ACCELERATING;
            } else if (this._turningLeft) {
                return AirshipIllusionSprite.ANIMATION_TYPES.TURNING_LEFT;
            } else if (this._turningRight) {
                return AirshipIllusionSprite.ANIMATION_TYPES.TURNING_RIGHT;
            } else if (Input.isPressed('up')) {
                // 前進
                return AirshipIllusionSprite.ANIMATION_TYPES.MOVING_FORWARD;
            } else if (Input.isPressed('down')) {
                // 後退
                return AirshipIllusionSprite.ANIMATION_TYPES.MOVING_BACKWARD;
            } else {
                // 左右キーのみの場合も旋回アニメーションを使用
                if (Input.isPressed('left')) {
                    return AirshipIllusionSprite.ANIMATION_TYPES.TURNING_LEFT;
                } else if (Input.isPressed('right')) {
                    return AirshipIllusionSprite.ANIMATION_TYPES.TURNING_RIGHT;
                }
                // その他の場合は現在のアニメーションを維持
                return this._currentAnimation;
            }
        }
        
        switchAnimation(newAnimation) {
            // 既に同じアニメーションが再生中の場合
            if (newAnimation === this._currentAnimation) {
                // ループしないアニメーションが完了していてもキーが押されている間は最終フレームを維持
                if (this._animationCompleted && !this._isLoopingAnimation(newAnimation)) {
                    // 最終フレームを維持（何もしない）
                    return;
                }
                // ループするアニメーションまたは未完了の場合は継続
                return;
            }

            // 新しいアニメーションに切り替え
            this._currentAnimation = newAnimation;
            this._currentFrame = 0;
            this._animationTimer = 0;
            this._animationCompleted = false;
            this._updateAnimationFrame();

            // アニメーション変更イベントを発行
            this.emit('animationStateChanged', { animation: newAnimation });
        }
        
        _isLoopingAnimation(animationType) {
            if (!this._animationData || !this._animationData.animations) {
                return true;
            }
            
            const animationName = this._animationData.mapping ? 
                this._animationData.mapping[animationType] : 
                animationType;
                
            const animData = this._animationData.animations.find(anim => {
                return anim.name === animationName;
            });
            
            return animData ? animData.loop !== false : true;
        }
        
        updateFrame() {
            if (!this._animationData || !this._animationData.animations) return;
            
            // アニメーション名を取得
            const animationName = this._animationData.mapping ? 
                this._animationData.mapping[this._currentAnimation] : 
                this._currentAnimation;
                
            let animData = null;
            if (Array.isArray(this._animationData.animations)) {
                animData = this._animationData.animations.find(anim => {
                    return anim.name === animationName;
                });
            }
            
            if (!animData) return;
            
            // ループしないアニメーションが完了している場合
            if (this._animationCompleted && !animData.loop) {
                // 最終フレームを維持
                return;
            }
            
            // タイマーを更新
            this._animationTimer++;
            
            // フレーム期間を計算（speedから計算）
            const frameDuration = Math.floor(60 / (animData.speed || 12));
            
            // フレームを進める時間かチェック
            if (this._animationTimer >= frameDuration) {
                this._animationTimer = 0;
                this._currentFrame++;
                
                // フレーム範囲を取得
                const frames = this._parseFrameRange(animData.frames);
                
                // アニメーションをループ
                if (this._currentFrame >= frames.length) {
                    if (animData.loop !== false) {
                        // ループする
                        this._currentFrame = 0;
                    } else {
                        // ループしない：最終フレームで停止
                        this._currentFrame = frames.length - 1;
                        this._animationCompleted = true;
                    }
                }
                
                this._updateAnimationFrame();
            }
        }
        
        updateEffects() {
            // 発進演出中は特別な処理
            if (this._launchEffectActive) {
                return;
            }

            // _initialX と _initialY が設定されているか確認
            if (!this._initialX || !this._initialY) {
                this._initialX = Graphics.width / 2;
                this._initialY = Graphics.height / 2 - 30;
            }
            
            // キー入力をチェック
            const isAnyKeyPressed = Input.isPressed('up') || 
                                 Input.isPressed('down') || 
                                 Input.isPressed('left') || 
                                 Input.isPressed('right') ||
                                 Input.isPressed('shift');
            
            // キーが押されていない時のみホバリング効果
            if (!isAnyKeyPressed && this._airshipSprite) {
                const hoverOffset = Math.sin(Graphics.frameCount * 0.05) * 3;
                this._airshipSprite.y = this._initialY + hoverOffset;
            } else if (this._airshipSprite) {
                // キー押下中は固定位置
                this._airshipSprite.y = this._initialY;
            }
            
            // 高度に基づく影のスケーリング
            if (this._shadowSprite) {
                let shadowScale = airshipSpriteScale;
                if (this._isBoosting) {
                    shadowScale = 0.8 * airshipSpriteScale;
                }
                this._shadowSprite.scale.x = shadowScale;
                this._shadowSprite.scale.y = shadowScale * 0.5;
            }
            
            // ブースト効果
            if (this._isBoosting && this._airshipSprite) {
                this._airshipSprite.x = this._initialX + (Math.random() - 0.5) * 2;
            } else if (this._airshipSprite) {
                this._airshipSprite.x = this._initialX;
            }
        }
        
        onDispose() {
            // スプライトを削除
            if (this._airshipSprite && this._airshipSprite.parent) {
                this._airshipSprite.parent.removeChild(this._airshipSprite);
            }
            
            if (this._shadowSprite && this._shadowSprite.parent) {
                this._shadowSprite.parent.removeChild(this._shadowSprite);
            }
            
            // 白いオーバーレイも削除
            if (this._whiteOverlay && this._whiteOverlay.parent) {
                this._whiteOverlay.parent.removeChild(this._whiteOverlay);
                this._whiteOverlay = null;
            }
            
            // ビットマップを解放
            if (this._airshipSprite && this._airshipSprite.bitmap && 
                typeof this._airshipSprite.bitmap.destroy === 'function') {
                this._airshipSprite.bitmap.destroy();
            }
            
            if (this._shadowSprite && this._shadowSprite.bitmap && 
                typeof this._shadowSprite.bitmap.destroy === 'function') {
                this._shadowSprite.bitmap.destroy();
            }
        }
        
        // パブリックメソッド
        getCurrentAnimation() {
            return this._currentAnimation;
        }
        
        setTurningState(left, right) {
            this._turningLeft = left;
            this._turningRight = right;
        }
        
        setBoostState(boosting) {
            this._isBoosting = boosting;
        }
        
        getAirshipSprite() {
            return this._airshipSprite;
        }
        
        getShadowSprite() {
            return this._shadowSprite;
        }
    }
    
    // エクスポート
    window.AirshipIllusionSprite = AirshipIllusionSprite;
    
})();