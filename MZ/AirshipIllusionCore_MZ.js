//=============================================================================
// AirshipIllusionCore_MZ.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Airship Illusion System v1.0.0 - Beautiful 2.5D Flight Scene
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 * @help
 * ============================================================================
 * Airship Illusion System v1.0.0 for RPG Maker MZ
 * ============================================================================
 *
 * This plugin recreates beautiful 2.5D flight scenes from classic JRPGs.
 *
 * Required Files:
 * - img/airship_illusion/WorldMap.png (Master image)
 * - img/characters/Airship.png (Sprite sheet)
 * - data/AirshipAnimations.json (Animation definition)
 *
 * Controls:
 * Up/Down: Forward/Backward
 * Left/Right: Turn
 * Shift: Boost
 * PageUp: Camera up
 * PageDown: Camera down
 * V: Land on field
 * C: Enter airship interior
 * Tab: Toggle minimap mode
 *
 * ============================================================================
 * Changelog:
 * v1.0.0 - Initial MZ release
 * ============================================================================
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
 * @param worldMapImage
 * @text World Map Image
 * @desc Field map image exported from the editor
 * @type file
 * @dir img/airship_illusion
 * @default WorldMap
 *
 * @param airshipSpriteSheet
 * @text Airship Sprite Sheet
 * @desc Airship sprite sheet (contains 4 animation types)
 * @type file
 * @dir img/airship_illusion
 * @default Airship
 *
 * @param airshipAnimationJSON
 * @text Animation JSON
 * @desc Animation definition JSON file
 * @type file
 * @dir img/airship_illusion
 * @default AirshipAnimations
 *
 * @param flightBGM
 * @text Flight BGM
 * @desc BGM during flight
 * @default Flight
 * @type file
 * @dir audio/bgm/
 * @require 1
 *
 * @param cruiseSpeed
 * @text Cruise Speed
 * @desc Normal cruising speed
 * @default 5.0
 * @type number
 * @decimals 1
 * @min 0.1
 * @max 20.0
 *
 * @param boostMultiplier
 * @text Boost Multiplier
 * @desc Speed multiplier when boosting
 * @default 2.5
 * @type number
 * @decimals 1
 * @min 1.5
 * @max 5.0
 *
 * @param rotationSpeed
 * @text Rotation Speed
 * @desc Rotation speed (degrees/frame)
 * @default 2.0
 * @type number
 * @decimals 1
 * @min 0.5
 * @max 5.0
 *
 * @param enableCameraPitch
 * @text Enable Camera Pitch
 * @desc Allow camera pitch control with PageUp/PageDown keys
 * @type boolean
 * @default true
 *
 * @param maxCameraPitchUp
 * @text Max Camera Pitch Up
 * @desc Maximum upward camera angle (degrees)
 * @type number
 * @min 0
 * @max 45
 * @default 30
 *
 * @param maxCameraPitchDown
 * @text Max Camera Pitch Down
 * @desc Maximum downward camera angle (degrees)
 * @type number
 * @min 0
 * @max 30
 * @default 17
 *
 * @param cloudyRegion
 * @text Cloudy Region
 * @desc Region ID for cloudy weather
 * @default 1
 * @type number
 * @min 1
 * @max 255
 *
 * @param rainRegion
 * @text Rain Region
 * @desc Region ID for rain
 * @default 2
 * @type number
 * @min 1
 * @max 255
 *
 * @param snowRegion
 * @text Snow Region
 * @desc Region ID for snow
 * @default 3
 * @type number
 * @min 1
 * @max 255
 *
 * @param stormRegion
 * @text Storm Region
 * @desc Region ID for storm
 * @default 4
 * @type number
 * @min 1
 * @max 255
 *
 * @param sandstormRegion
 * @text Sandstorm Region
 * @desc Region ID for sandstorm
 * @default 5
 * @type number
 * @min 1
 * @max 255
 *
 * @param fogRegion
 * @text Fog Region
 * @desc Region ID for fog
 * @default 6
 * @type number
 * @min 1
 * @max 255
 *
 * @param minimapPosition
 * @text Minimap Position
 * @desc Position of the minimap
 * @default topRight
 * @type select
 * @option Top Left
 * @value topLeft
 * @option Top Center
 * @value topCenter
 * @option Top Right
 * @value topRight
 * @option Top Middle Left
 * @value topMiddleLeft
 * @option Top Middle Right
 * @value topMiddleRight
 * @option Middle Left
 * @value middleLeft
 * @option Middle Right
 * @value middleRight
 * @option Bottom Middle Left
 * @value bottomMiddleLeft
 * @option Bottom Middle Right
 * @value bottomMiddleRight
 * @option Bottom Left
 * @value bottomLeft
 * @option Bottom Center
 * @value bottomCenter
 * @option Bottom Right
 * @value bottomRight
 * @option Hidden
 * @value none
 *
 * @param minimapSize
 * @text Minimap Size
 * @desc Size of the minimap
 * @default 200
 * @type number
 * @min 100
 * @max 400
 *
 * @param minimapShape
 * @text Minimap Shape
 * @desc Shape of the minimap
 * @default square
 * @type select
 * @option Square
 * @value square
 * @option Circle
 * @value circle
 *
 * @param compassPosition
 * @text Compass Position
 * @desc Position of the compass
 * @default topCenter
 * @type select
 * @option Top Left
 * @value topLeft
 * @option Top Center
 * @value topCenter
 * @option Top Right
 * @value topRight
 * @option Top Middle Left
 * @value topMiddleLeft
 * @option Top Middle Right
 * @value topMiddleRight
 * @option Middle Left
 * @value middleLeft
 * @option Middle Right
 * @value middleRight
 * @option Bottom Middle Left
 * @value bottomMiddleLeft
 * @option Bottom Middle Right
 * @value bottomMiddleRight
 * @option Bottom Left
 * @value bottomLeft
 * @option Bottom Center
 * @value bottomCenter
 * @option Bottom Right
 * @value bottomRight
 * @option Hidden
 * @value none
 *
 * @param compassSize
 * @text Compass Size
 * @desc Size of the compass
 * @default 80
 * @type number
 * @min 40
 * @max 160
 *
 * @param worldWidth
 * @text World Width
 * @desc Width of the world map
 * @default 10000
 * @type number
 * @min 1000
 * @max 50000
 *
 * @param worldHeight
 * @text World Height
 * @desc Height of the world map
 * @default 10000
 * @type number
 * @min 1000
 * @max 50000
 *
 * @param mapWidth
 * @text Map Width (Tiles)
 * @desc Map width in tiles
 * @default 100
 * @type number
 * @min 20
 * @max 500
 *
 * @param mapHeight
 * @text Map Height (Tiles)
 * @desc Map height in tiles
 * @default 100
 * @type number
 * @min 20
 * @max 500
 *
 * @param interiorMapId
 * @text Interior Map ID
 * @desc Map ID of airship interior
 * @default 1
 * @type number
 * @min 1
 *
 * @param interiorX
 * @text Interior X
 * @desc X coordinate for interior transfer
 * @default 10
 * @type number
 * @min 0
 *
 * @param interiorY
 * @text Interior Y
 * @desc Y coordinate for interior transfer
 * @default 10
 * @type number
 * @min 0
 *
 * @param interiorDirection
 * @text Interior Direction
 * @desc Direction when entering interior (2:Down 4:Left 6:Right 8:Up)
 * @default 2
 * @type number
 * @min 2
 * @max 8
 *
 * @param weatherTransitionFrames
 * @text Weather Transition Frames
 * @desc Transition time for weather changes (frames)
 * @default 180
 * @type number
 * @min 60
 * @max 600
 *
 * @param launchEffectType
 * @text Launch Effect Type
 * @desc Type of launch effect
 * @default rise
 * @type select
 * @option Vertical Rise
 * @value rise
 * @option White Fade
 * @value white
 * @option Iris In
 * @value iris
 *
 * @param landingFailedMessage
 * @text Landing Failed Message
 * @desc Message displayed when landing is not possible
 * @type string
 * @default Cannot land here!
 *
 * @command start
 * @text Start Flight Scene
 * @desc Start the airship flight scene
 *
 * @command enterInterior
 * @text Enter Airship Interior
 * @desc Enter airship interior (saves BGM position)
 *
 * @command returnFromInterior
 * @text Return From Interior
 * @desc Return from interior to flight scene
 */

/*:ja
 * @target MZ
 * @plugindesc 飛空艇イリュージョンシステム v1.0.0 - 美しい2.5D飛行シーン
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 * @help
 * ============================================================================
 * 飛空艇イリュージョンシステム v1.0.0 for RPG Maker MZ
 * ============================================================================
 *
 * このプラグインはクラシック2DRPGの美しい2.5D飛行シーンを再現します。
 *
 * 必要なファイル:
 * - img/airship_illusion/WorldMap.png (マスター画像)
 * - img/characters/Airship.png (スプライトシート)
 * - data/AirshipAnimations.json (アニメーション定義)
 *
 * 操作方法:
 * 上下キー: 前進・後退
 * 左右キー: 旋回
 * Shift: ブースト
 * PageUp: カメラを上向きに
 * PageDown: カメラを下向きに
 * V: フィールドに着陸
 * C: 飛空艇内部へ移動
 * Tab: ミニマップモード切り替え
 *
 * ============================================================================
 * 更新履歴:
 * v1.0.0 - MZ版初版リリース
 * ============================================================================
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
 * @param worldMapImage
 * @text ワールドマップ画像
 * @desc フィールドマップ画像。ツクールのエディタから出力した画像を使用
 * @type file
 * @dir img/airship_illusion
 * @default WorldMap
 *
 * @param airshipSpriteSheet
 * @text 飛空艇スプライトシート
 * @desc 飛空艇スプライトシート（4種類のアニメーションを含む）
 * @type file
 * @dir img/airship_illusion
 * @default Airship
 *
 * @param airshipAnimationJSON
 * @text アニメーションJSON
 * @desc アニメーション定義JSONファイル
 * @type file
 * @dir img/airship_illusion
 * @default AirshipAnimations
 *
 * @param flightBGM
 * @text 飛行BGM
 * @desc 飛行中のBGM
 * @default Flight
 * @type file
 * @dir audio/bgm/
 * @require 1
 *
 * @param cruiseSpeed
 * @text 巡航速度
 * @desc 通常巡航速度
 * @default 5.0
 * @type number
 * @decimals 1
 * @min 0.1
 * @max 20.0
 *
 * @param boostMultiplier
 * @text ブースト倍率
 * @desc ブースト時の速度倍率
 * @default 2.5
 * @type number
 * @decimals 1
 * @min 1.5
 * @max 5.0
 *
 * @param rotationSpeed
 * @text 回転速度
 * @desc 回転速度（度/フレーム）
 * @default 2.0
 * @type number
 * @decimals 1
 * @min 0.5
 * @max 5.0
 *
 * @param enableCameraPitch
 * @text カメラピッチ有効
 * @desc PageUp/PageDownキーでカメラの上下角度を変更できるようにする
 * @type boolean
 * @default true
 *
 * @param maxCameraPitchUp
 * @text カメラ最大上向き角度
 * @desc カメラが上を向く最大角度（度）
 * @type number
 * @min 0
 * @max 45
 * @default 30
 *
 * @param maxCameraPitchDown
 * @text カメラ最大下向き角度
 * @desc カメラが下を向く最大角度（度）
 * @type number
 * @min 0
 * @max 30
 * @default 17
 *
 * @param cloudyRegion
 * @text 曇りリージョン
 * @desc 曇りのリージョンID
 * @default 1
 * @type number
 * @min 1
 * @max 255
 *
 * @param rainRegion
 * @text 雨天リージョン
 * @desc 雨天のリージョンID
 * @default 2
 * @type number
 * @min 1
 * @max 255
 *
 * @param snowRegion
 * @text 雪リージョン
 * @desc 雪のリージョンID
 * @default 3
 * @type number
 * @min 1
 * @max 255
 *
 * @param stormRegion
 * @text 嵐リージョン
 * @desc 嵐のリージョンID
 * @default 4
 * @type number
 * @min 1
 * @max 255
 *
 * @param sandstormRegion
 * @text 砂嵐リージョン
 * @desc 砂嵐のリージョンID
 * @default 5
 * @type number
 * @min 1
 * @max 255
 *
 * @param fogRegion
 * @text 霧リージョン
 * @desc 霧のリージョンID
 * @default 6
 * @type number
 * @min 1
 * @max 255
 *
 * @param minimapPosition
 * @text ミニマップ位置
 * @desc ミニマップの位置
 * @default topRight
 * @type select
 * @option 左上
 * @value topLeft
 * @option 上部中央
 * @value topCenter
 * @option 右上
 * @value topRight
 * @option 左斜め上
 * @value topMiddleLeft
 * @option 右斜め上
 * @value topMiddleRight
 * @option 左横
 * @value middleLeft
 * @option 右横
 * @value middleRight
 * @option 左斜め下
 * @value bottomMiddleLeft
 * @option 右斜め下
 * @value bottomMiddleRight
 * @option 左下
 * @value bottomLeft
 * @option 下部中央
 * @value bottomCenter
 * @option 右下
 * @value bottomRight
 * @option 非表示
 * @value none
 *
 * @param minimapSize
 * @text ミニマップサイズ
 * @desc ミニマップのサイズ
 * @default 200
 * @type number
 * @min 100
 * @max 400
 *
 * @param minimapShape
 * @text ミニマップ形状
 * @desc ミニマップの形状
 * @default square
 * @type select
 * @option 四角形
 * @value square
 * @option 円形
 * @value circle
 *
 * @param compassPosition
 * @text コンパス位置
 * @desc コンパスの位置
 * @default topCenter
 * @type select
 * @option 左上
 * @value topLeft
 * @option 上部中央
 * @value topCenter
 * @option 右上
 * @value topRight
 * @option 左斜め上
 * @value topMiddleLeft
 * @option 右斜め上
 * @value topMiddleRight
 * @option 左横
 * @value middleLeft
 * @option 右横
 * @value middleRight
 * @option 左斜め下
 * @value bottomMiddleLeft
 * @option 右斜め下
 * @value bottomMiddleRight
 * @option 左下
 * @value bottomLeft
 * @option 下部中央
 * @value bottomCenter
 * @option 右下
 * @value bottomRight
 * @option 非表示
 * @value none
 *
 * @param compassSize
 * @text コンパスサイズ
 * @desc コンパスのサイズ
 * @default 80
 * @type number
 * @min 40
 * @max 160
 *
 * @param worldWidth
 * @text ワールド幅
 * @desc ワールドマップの幅
 * @default 10000
 * @type number
 * @min 1000
 * @max 50000
 *
 * @param worldHeight
 * @text ワールド高さ
 * @desc ワールドマップの高さ
 * @default 10000
 * @type number
 * @min 1000
 * @max 50000
 *
 * @param mapWidth
 * @text マップ幅（タイル）
 * @desc マップの幅（タイル数）
 * @default 100
 * @type number
 * @min 20
 * @max 500
 *
 * @param mapHeight
 * @text マップ高さ（タイル）
 * @desc マップの高さ（タイル数）
 * @default 100
 * @type number
 * @min 20
 * @max 500
 *
 * @param interiorMapId
 * @text 内部マップID
 * @desc 飛空艇内部のマップID
 * @default 1
 * @type number
 * @min 1
 *
 * @param interiorX
 * @text 内部X座標
 * @desc 飛空艇内部への移動先X座標
 * @default 10
 * @type number
 * @min 0
 *
 * @param interiorY
 * @text 内部Y座標
 * @desc 飛空艇内部への移動先Y座標
 * @default 10
 * @type number
 * @min 0
 *
 * @param interiorDirection
 * @text 内部移動時の向き
 * @desc 飛空艇内部への移動時の向き（2:下 4:左 6:右 8:上）
 * @default 2
 * @type number
 * @min 2
 * @max 8
 *
 * @param weatherTransitionFrames
 * @text 天候変化時間
 * @desc 天候変化のトランジション時間（フレーム）
 * @default 180
 * @type number
 * @min 60
 * @max 600
 *
 * @param launchEffectType
 * @text 発進演出タイプ
 * @desc 発進演出のタイプ
 * @default rise
 * @type select
 * @option 垂直上昇
 * @value rise
 * @option ホワイトフェード
 * @value white
 * @option アイリスイン
 * @value iris
 *
 * @param landingFailedMessage
 * @text 着陸失敗メッセージ
 * @desc 着陸できない場所で表示するメッセージ
 * @type string
 * @default ここには着陸できません！
 *
 * @command start
 * @text 飛行シーン開始
 * @desc 飛空艇の飛行シーンを開始します
 *
 * @command enterInterior
 * @text 飛空艇内部へ移動
 * @desc 飛空艇内部へ移動します（BGM位置を保存）
 *
 * @command returnFromInterior
 * @text 飛空艇内部から戻る
 * @desc 飛空艇内部から飛行シーンに戻ります
 */

(() => {
    'use strict';

    const pluginName = 'AirshipIllusionCore_MZ';
    const parameters = PluginManager.parameters(pluginName);
    
    // グローバル名前空間
    window.AirshipIllusion = window.AirshipIllusion || {};
    
    // プラグインパラメータ
    AirshipIllusion.params = {
        worldMapImage: String(parameters.worldMapImage || 'WorldMap'),
        airshipSpriteSheet: String(parameters.airshipSpriteSheet || 'Airship'),
        airshipAnimationJSON: String(parameters.airshipAnimationJSON || 'AirshipAnimations'),
        flightBGM: String(parameters.flightBGM || 'Flight'),
        cruiseSpeed: Number(parameters.cruiseSpeed || 5.0),
        boostMultiplier: Number(parameters.boostMultiplier || 2.5),
        rotationSpeed: Number(parameters.rotationSpeed || 2.0),
        enableCameraPitch: parameters.enableCameraPitch === 'true',
        maxCameraPitchUp: Number(parameters.maxCameraPitchUp || 30) * Math.PI / 180,
        maxCameraPitchDown: -Number(parameters.maxCameraPitchDown || 17) * Math.PI / 180,
        cloudyRegion: Number(parameters.cloudyRegion || 1),
        rainRegion: Number(parameters.rainRegion || 2),
        snowRegion: Number(parameters.snowRegion || 3),
        stormRegion: Number(parameters.stormRegion || 4),
        sandstormRegion: Number(parameters.sandstormRegion || 5),
        fogRegion: Number(parameters.fogRegion || 6),
        minimapPosition: String(parameters.minimapPosition || 'topRight'),
        minimapSize: Number(parameters.minimapSize || 200),
        minimapShape: String(parameters.minimapShape || 'square'),
        compassPosition: String(parameters.compassPosition || 'topCenter'),
        compassSize: Number(parameters.compassSize || 80),
        worldWidth: Number(parameters.worldWidth || 10000),
        worldHeight: Number(parameters.worldHeight || 10000),
        mapWidth: Number(parameters.mapWidth || 100),
        mapHeight: Number(parameters.mapHeight || 100),
        interiorMapId: Number(parameters.interiorMapId || 1),
        interiorX: Number(parameters.interiorX || 10),
        interiorY: Number(parameters.interiorY || 10),
        interiorDirection: Number(parameters.interiorDirection || 2),
        weatherTransitionFrames: Number(parameters.weatherTransitionFrames || 180),
        launchEffectType: String(parameters.launchEffectType || 'rise'),
        landingFailedMessage: String(parameters.landingFailedMessage || 'ここには着陸できません！')
    };
    
    // モジュールインスタンスの保存
    AirshipIllusion.instances = {};
    
    // 非同期JSON解析ヘルパー
    AirshipIllusion.parseJSONAsync = function(jsonString) {
        return new Promise((resolve, reject) => {
            // 小さいJSONは直接パース
            if (jsonString.length < 10000) {
                try {
                    resolve(JSON.parse(jsonString));
                } catch (e) {
                    reject(e);
                }
                return;
            }
            
            // 大きいJSONは次のフレームで処理
            requestAnimationFrame(() => {
                try {
                    const startTime = performance.now();
                    const result = JSON.parse(jsonString);
                    const elapsed = performance.now() - startTime;
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        });
    };
    
    //=============================================================================
    // AirshipIllusionBase - すべてのモジュールの基底クラス
    //=============================================================================
    
    class AirshipIllusionBase {
        constructor() {
            this.initialize(...arguments);
        }
        
        initialize() {
            this._resources = {};
            this._eventListeners = {};
            this._isActive = false;
            this._isReady = false;
            this.onInitialize();
        }
        
        // ライフサイクルメソッド（サブクラスでオーバーライド）
        onInitialize() {}
        onResourcesLoaded() {}
        onActivate() {}
        onDeactivate() {}
        onUpdate() {}
        onDispose() {}
        
        // リソース管理
        registerResource(type, key, path) {
            this._resources[key] = {
                type: type,
                path: path,
                loaded: false,
                data: null
            };
        }
        
        loadResources(onComplete) {
            const pendingResources = [];
            
            for (const key in this._resources) {
                const resource = this._resources[key];
                if (!resource.loaded) {
                    pendingResources.push(this._loadResource(key, resource));
                }
            }
            
            if (pendingResources.length === 0) {
                this._isReady = true;
                if (onComplete) onComplete();
                return;
            }
            
            Promise.all(pendingResources).then(() => {
                this._isReady = true;
                this.onResourcesLoaded();
                if (onComplete) onComplete();
            }).catch((error) => {
                this.handleError(error, 'Resource loading failed');
            });
        }
        
        _loadResource(key, resource) {
            return new Promise((resolve, reject) => {
                switch (resource.type) {
                    case 'image':
                        // すべての画像をairship_illusionフォルダから読み込む
                        const folder = 'img/airship_illusion/';
                        const bitmap = ImageManager.loadBitmap(folder, resource.path);
                        bitmap.addLoadListener(() => {
                            if (bitmap.isError()) {
                                console.error('Failed to load image:', folder + resource.path);
                                reject(new Error('Failed to load image: ' + folder + resource.path));
                            } else {
                                resource.data = bitmap;
                                resource.loaded = true;
                                resolve();
                            }
                        });
                        break;
                    case 'json':
                        const xhr = new XMLHttpRequest();
                        const url = 'img/airship_illusion/' + resource.path + '.json';
                        xhr.open('GET', url);
                        xhr.overrideMimeType('application/json');
                        xhr.onload = async function() {
                            if (xhr.status < 400) {
                                try {
                                    // 非同期でJSONを解析
                                    resource.data = await AirshipIllusion.parseJSONAsync(xhr.responseText);
                                    resource.loaded = true;
                                    resolve();
                                } catch (e) {
                                    reject(new Error('Failed to parse JSON: ' + url));
                                }
                            } else {
                                reject(new Error('Failed to load JSON: ' + url));
                            }
                        };
                        xhr.onerror = function() {
                            reject(new Error('Failed to load JSON: ' + url));
                        };
                        xhr.send();
                        break;
                    default:
                        resolve();
                }
            });
        }
        
        getResource(key) {
            const resource = this._resources[key];
            return resource ? resource.data : null;
        }
        
        releaseResources() {
            for (const key in this._resources) {
                const resource = this._resources[key];
                if (resource.type === 'image' && resource.data) {
                    // MZではdestroyメソッドが標準
                    if (typeof resource.data.destroy === 'function') {
                        resource.data.destroy();
                    }
                }
                resource.data = null;
                resource.loaded = false;
            }
        }
        
        // エラー処理
        handleError(error, context) {
            console.error('AirshipIllusion Error:', context, error);
            // シーン処理用のエラーイベントを発行
            this.emit('error', { error: error, context: context });
        }
        
        // イベントシステム
        emit(eventName, data) {
            if (this._eventListeners[eventName]) {
                this._eventListeners[eventName].forEach(callback => {
                    callback(data);
                });
            }
            
            // グローバルイベントの発行
            if (AirshipIllusion.eventBus) {
                AirshipIllusion.eventBus.emit(eventName, data, this);
            }
        }
        
        on(eventName, callback) {
            if (!this._eventListeners[eventName]) {
                this._eventListeners[eventName] = [];
            }
            this._eventListeners[eventName].push(callback);
        }
        
        // アクティベーション
        activate() {
            this._isActive = true;
            this.onActivate();
        }
        
        deactivate() {
            this._isActive = false;
            this.onDeactivate();
        }
        
        update() {
            if (this._isActive) {
                this.onUpdate();
            }
        }
        
        dispose() {
            this.deactivate();
            this.releaseResources();
            this.onDispose();
            this._eventListeners = {};
        }
        
        isReady() {
            return this._isReady;
        }
    }
    
    // 基底クラスをエクスポート
    AirshipIllusion.Base = AirshipIllusionBase;
    
    //=============================================================================
    // EventBus - グローバルイベントシステム
    //=============================================================================
    
    class EventBus {
        constructor() {
            this._listeners = {};
        }
        
        emit(eventName, data, sender) {
            if (this._listeners[eventName]) {
                this._listeners[eventName].forEach(listener => {
                    listener.callback.call(listener.context, data, sender);
                });
            }
        }
        
        on(eventName, callback, context) {
            if (!this._listeners[eventName]) {
                this._listeners[eventName] = [];
            }
            this._listeners[eventName].push({
                callback: callback,
                context: context
            });
        }
        
        off(eventName, callback, context) {
            if (!this._listeners[eventName]) return;
            
            this._listeners[eventName] = this._listeners[eventName].filter(listener => {
                return listener.callback !== callback || listener.context !== context;
            });
        }
        
        clear() {
            this._listeners = {};
        }
    }
    
    AirshipIllusion.eventBus = new EventBus();
    
    //=============================================================================
    // Game_AirshipIllusion - ゲーム状態管理
    //=============================================================================
    
    class Game_AirshipIllusion {
        constructor() {
            this.initialize(...arguments);
        }
        
        initialize() {
            this.position = { x: 5000, y: 5000 };
            this.angle = 0;
            this.speed = 0;
            this.altitude = 2.2; // 高度を上げる
            this.cameraPitch = AirshipIllusion.params.maxCameraPitchUp || 0.52; // カメラピッチ角度（最大上向きから開始）
            
            // 帰還位置情報
            this.returnMapId = 1;
            this.returnX = 0;
            this.returnY = 0;
            this.returnDirection = 2;
            
            // 飛行中かどうか
            this.isFlying = false;
            
            // 内部から戻る際の情報
            this.wasInInterior = false;
            this.bgmPosition = undefined;  // BGM再生位置の保存用

            // 飛空艇イベントID
            this.eventId = 0;
            
            // 着陸位置
            this.landingX = 0;
            this.landingY = 0;
            this.needsMoveEvent = false;
            
            // 自動飛行関連
            this.isAutoFlying = false;
            this.autoFlightTarget = null;
        }
    }
    
    // 自動飛行を開始
    Game_AirshipIllusion.prototype.startAutoFlight = function(targetX, targetY) {
        // フィールド座標をワールド座標に変換
        const worldWidth = AirshipIllusion.params.worldWidth || 10000;
        const worldHeight = AirshipIllusion.params.worldHeight || 10000;
        const mapWidth = AirshipIllusion.params.mapWidth || 100;
        const mapHeight = AirshipIllusion.params.mapHeight || 100;

        const worldTargetX = (targetX / mapWidth) * worldWidth;
        const worldTargetY = (targetY / mapHeight) * worldHeight;
        
        this.isAutoFlying = true;
        this.autoFlightTarget = {
            x: worldTargetX,
            y: worldTargetY,
            fieldX: targetX,  // フィールド座標も保存
            fieldY: targetY
        };
        
        // 自動飛行開始イベント
        if (AirshipIllusion && AirshipIllusion.eventBus) {
            AirshipIllusion.eventBus.emit('autoFlightStarted', {
                target: this.autoFlightTarget,
                current: this.position
            });
        }
    };
    
    // グローバル変数
    window.$gameAirshipIllusion = null;
    
    // DataManagerを拡張
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        $gameAirshipIllusion = new Game_AirshipIllusion();
    };
    
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.airshipIllusion = $gameAirshipIllusion;
        return contents;
    };
    
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        
        // 新しいインスタンスを作成
        const newInstance = new Game_AirshipIllusion();
        
        // セーブデータがある場合はプロパティをコピー
        if (contents.airshipIllusion) {
            // 各プロパティを個別にコピー（メソッドは除外）
            for (const key in contents.airshipIllusion) {
                if (contents.airshipIllusion.hasOwnProperty(key) && 
                    typeof contents.airshipIllusion[key] !== 'function') {
                    newInstance[key] = contents.airshipIllusion[key];
                }
            }
        }
        
        $gameAirshipIllusion = newInstance;
        
    };
    
    // 新規ゲームでも初期化されるように
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        $gameAirshipIllusion = new Game_AirshipIllusion();
    };
    
    //=============================================================================
    // Scene_AirshipIllusion - メインシーン
    //=============================================================================
    
    class Scene_AirshipIllusion extends Scene_Base {
        initialize() {
            super.initialize();
            this._modules = {};
            this._resourcesLoaded = false;
            this._launchEffectPhase = 'waiting'; // waiting, launching, ready
            this._launchEffectTimer = 0;
            
            // パフォーマンス最適化用の追加プロパティ
            this._loadingPhase = 'initial'; // initial, critical, secondary, complete
            this._loadingProgress = 0;
            this._loadingTotal = 0;
            this._criticalResourcesLoaded = false;
            this._loadingStartTime = Date.now();
            
            // $gameAirshipIllusionを早期に初期化
            if (!window.$gameAirshipIllusion) {
                window.$gameAirshipIllusion = new Game_AirshipIllusion();
            }
            
            // リソースキャッシュを初期化
            if (!AirshipIllusion._resourceCache) {
                AirshipIllusion._resourceCache = {};
            }
        }
        
        create() {
            super.create();
            
            // $gameAirshipIllusionが存在しない場合は初期化
            if (!$gameAirshipIllusion) {
                $gameAirshipIllusion = new Game_AirshipIllusion();
            }
            
            // ローディング画面を最初に作成
            this._createLoadingScreen();
            
            // 内部から戻ってきた場合でなければ、元のマップデータを保存
            if (!$gameAirshipIllusion.wasInInterior) {
                // 元の$dataMapを保存（内部から戻った時のため）
                $gameAirshipIllusion.originalDataMap = $dataMap;
                
                // タイルセット情報も保存
                if ($gameMap && $gameMap.tileset) {
                    $gameAirshipIllusion.originalTileset = $gameMap.tileset();
                }
                $gameAirshipIllusion.originalTilesetId = $dataMap ? $dataMap.tilesetId : 0;
                $gameAirshipIllusion.originalDataTilesets = $dataTilesets;
            }
            
            // ランドマークイベントを収集
            this._collectLandmarkEvents();
            
            // 内部から戻ってきた場合でなければ、現在位置を保存
            if (!$gameAirshipIllusion.wasInInterior) {
                $gameAirshipIllusion.returnMapId = $gameMap.mapId();
                $gameAirshipIllusion.returnX = $gamePlayer.x;
                $gameAirshipIllusion.returnY = $gamePlayer.y;
                $gameAirshipIllusion.returnDirection = $gamePlayer.direction();
                
                // マップデータを保持（リージョン読み取り用）
                $gameAirshipIllusion.mapData = {
                    data: $dataMap.data.slice(),
                    width: $dataMap.width,
                    height: $dataMap.height,
                    tilesetId: $dataMap.tilesetId
                };

                // タイルセットのフラグデータも保存
                if ($dataTilesets && $dataTilesets[$dataMap.tilesetId]) {
                    $gameAirshipIllusion.tilesetFlags = $dataTilesets[$dataMap.tilesetId].flags.slice();
                }
                        
                // フィールド位置から飛空艇位置を計算
                // 着陸位置が保存されている場合はそれを使用、なければプレイヤー位置を使用
                const startX = $gameAirshipIllusion.landingX > 0 ? $gameAirshipIllusion.landingX : $gamePlayer.x;
                const startY = $gameAirshipIllusion.landingY > 0 ? $gameAirshipIllusion.landingY : $gamePlayer.y;
                
                const worldCoords = this._convertMapToWorldCoordinates(startX, startY);
                $gameAirshipIllusion.position.x = worldCoords.x;
                $gameAirshipIllusion.position.y = worldCoords.y;
                
                // プレイヤーの向きから飛空艇の角度を設定
                // シェーダーの座標系では上が0度、時計回りに増加
                const directionToAngle = {
                    2: Math.PI,              // 下向き → 南向き（180度）
                    4: Math.PI * 0.5,        // 左向き → 東向き（90度）
                    6: Math.PI * 1.5,        // 右向き → 西向き（270度）
                    8: 0.01                  // 上向き → ほぼ北向き（0.01ラジアン）
                };
                $gameAirshipIllusion.angle = directionToAngle[$gamePlayer.direction()] || 0;
            }
           
            // 飛行中フラグを設定
            $gameAirshipIllusion.isFlying = true;
            
            // モジュールを初期化
            this._initializeModules();
            
            // リソース読み込みを開始
            this._loadAllResources();
        }
        
        _collectLandmarkEvents() {
            // 内部から戻ってきた場合、既に保存されているランドマークデータを使用
            if ($gameAirshipIllusion.wasInInterior && $gameAirshipIllusion.landmarkEvents && $gameAirshipIllusion.landmarkEvents.length > 0) {
                return; // 既存のデータを保持
            }
            
            if (!$dataMap || !$dataMap.events) return;
            
            // 新規収集の場合のみ
            $gameAirshipIllusion.landmarkEvents = [];
            
            $dataMap.events.forEach(eventData => {
                if (!eventData || !eventData.pages || eventData.pages.length === 0) return;
                
                // ページ0の情報を取得
                const page = eventData.pages[0];
                if (!page || !page.image) return;
                
                // メタデータを解析
                const meta = {};
                if (eventData.note) {
                    eventData.note.split(/[\r\n]+/).forEach(line => {
                        const match = /<([^:]+):\s*(.*)>/.exec(line);
                        if (match) {
                            meta[match[1].trim()] = match[2].trim();
                        }
                    });
                }
                
                // 飛空艇から見える設定がある場合
                if (meta.airshipVisible === 'true') {
                    // ワールド座標に変換
                    const worldPos = this._convertMapToWorldCoordinates(eventData.x, eventData.y);
                    
                    $gameAirshipIllusion.landmarkEvents.push({
                        id: eventData.id,
                        x: eventData.x,
                        y: eventData.y,
                        worldX: worldPos.x,
                        worldY: worldPos.y,
                        name: eventData.name,
                        displayName: meta.landmarkName || eventData.name || '', // 街名表示用
                        // グラフィック情報
                        characterName: page.image.characterName,
                        characterIndex: page.image.characterIndex,
                        direction: page.image.direction || 2,
                        pattern: page.image.pattern || 1,
                        tileId: page.image.tileId,
                        // スケール（FieldShaderと同じ計算）
                        scale: (meta.important === 'true' ? 1.5 : 1.0) * 0.3,
                        type: meta.landmarkType || 'default',
                        // メタデータ
                        meta: meta
                    });
                }
            });
            
            // タイルセット情報も保存
            if ($dataTilesets && $dataTilesets[$dataMap.tilesetId]) {
                $gameAirshipIllusion.tilesetData = {
                    tilesetNames: $dataTilesets[$dataMap.tilesetId].tilesetNames.slice()
                };
            }
        }
        
        _initializeModules() {
            // モジュールインスタンスを作成（これらは別ファイルで実装）
            if (window.AirshipIllusionFieldShader) {
                this._modules.fieldShader = new AirshipIllusionFieldShader();
                AirshipIllusion.instances.fieldShader = this._modules.fieldShader;
            }
            
            if (window.AirshipIllusionSprite) {
                this._modules.sprite = new AirshipIllusionSprite();
                AirshipIllusion.instances.sprite = this._modules.sprite;
            }
            
            if (window.AirshipIllusionWeather) {
                this._modules.weather = new AirshipIllusionWeather();
                AirshipIllusion.instances.weather = this._modules.weather;
            }
            
            if (window.AirshipIllusionControl) {
                this._modules.control = new AirshipIllusionControl();
                AirshipIllusion.instances.control = this._modules.control;
            }
            
            if (window.AirshipIllusionUI) {
                this._modules.ui = new AirshipIllusionUI();
                AirshipIllusion.instances.ui = this._modules.ui;
            }
            
            // ランドマークモジュールを追加
            if (window.AirshipIllusionLandmark) {
                this._modules.landmark = new AirshipIllusionLandmark();
                AirshipIllusion.instances.landmark = this._modules.landmark;
            }
            
            // ワールドマップモジュールを追加
            if (window.AirshipIllusionWorldMap) {
                this._modules.worldMap = new AirshipIllusionWorldMap();
                AirshipIllusion.instances.worldMap = this._modules.worldMap;
            }
        }
        
        _createLoadingScreen() {
            // ローディング画面の背景
            this._loadingBackground = new Sprite();
            this._loadingBackground.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._loadingBackground.bitmap.fillAll('#1a1a2e');
            this.addChild(this._loadingBackground);
            
            // ローディングテキスト
            this._loadingText = new Sprite();
            this._loadingText.bitmap = new Bitmap(400, 100);
            this._loadingText.bitmap.fontSize = 24;
            this._loadingText.bitmap.textColor = '#ffffff';
            this._loadingText.bitmap.drawText('飛行準備中...', 0, 0, 400, 100, 'center');
            this._loadingText.x = (Graphics.width - 400) / 2;
            this._loadingText.y = Graphics.height / 2 - 100;
            this.addChild(this._loadingText);
            
            // プログレスバーの背景
            this._progressBarBg = new Sprite();
            this._progressBarBg.bitmap = new Bitmap(400, 20);
            this._progressBarBg.bitmap.fillAll('#16213e');
            this._progressBarBg.x = (Graphics.width - 400) / 2;
            this._progressBarBg.y = Graphics.height / 2;
            this.addChild(this._progressBarBg);
            
            // プログレスバー
            this._progressBar = new Sprite();
            this._progressBar.bitmap = new Bitmap(400, 20);
            this._progressBar.x = (Graphics.width - 400) / 2;
            this._progressBar.y = Graphics.height / 2;
            this.addChild(this._progressBar);
            
            // プログレステキスト
            this._progressText = new Sprite();
            this._progressText.bitmap = new Bitmap(400, 50);
            this._progressText.bitmap.fontSize = 16;
            this._progressText.bitmap.textColor = '#aaaaaa';
            this._progressText.x = (Graphics.width - 400) / 2;
            this._progressText.y = Graphics.height / 2 + 30;
            this.addChild(this._progressText);
        }
        
        _updateLoadingScreen() {
            if (!this._progressBar) return;
            
            const progress = this._loadingTotal > 0 ? this._loadingProgress / this._loadingTotal : 0;
            const width = Math.floor(400 * progress);
            
            // プログレスバーを更新
            this._progressBar.bitmap.clear();
            this._progressBar.bitmap.fillRect(0, 0, width, 20, '#4a90e2');
            
            // プログレステキストを更新
            this._progressText.bitmap.clear();
            const percent = Math.floor(progress * 100);
            const elapsed = ((Date.now() - this._loadingStartTime) / 1000).toFixed(1);
            this._progressText.bitmap.drawText(
                `${percent}% - ${this._loadingPhase} - ${elapsed}s`,
                0, 0, 400, 50, 'center'
            );
        }
        
        _hideLoadingScreen() {
            // フェードアウトアニメーション
            if (this._loadingBackground) {
                this._loadingBackground.opacity = 0;
                this._loadingText.opacity = 0;
                this._progressBarBg.opacity = 0;
                this._progressBar.opacity = 0;
                this._progressText.opacity = 0;
            }
        }
        
        _loadAllResources() {
            // プログレッシブローディング: 重要なリソースを最初に読み込む
            this._loadingPhase = 'critical';
            this._loadCriticalResources().then(() => {
                this._criticalResourcesLoaded = true;
                this._loadingPhase = 'secondary';
                // セカンダリリソースは非同期でバックグラウンド読み込み
                this._loadSecondaryResources();
            }).catch(error => {
                console.error('Failed to load critical resources:', error);
                this.popScene();
            });
        }
        
        _loadCriticalResources() {
            const criticalLoads = [];
            this._loadingTotal = 3; // 初期の重要リソース数
            this._loadingProgress = 0;
            
            // 1. 低解像度のワールドマップ（または既存のキャッシュ）
            if (AirshipIllusion._resourceCache.worldMapLowRes) {
                this._loadingProgress++;
                this._updateLoadingScreen();
            } else {
                criticalLoads.push(this._loadWorldMapProgressive());
            }
            
            // 2. 飛空艇スプライト（小さいので高速）
            criticalLoads.push(new Promise(resolve => {
                if (this._modules.sprite) {
                    this._modules.sprite.loadResources(() => {
                        this._loadingProgress++;
                        this._updateLoadingScreen();
                        resolve();
                    });
                } else {
                    resolve();
                }
            }));
            
            // 3. UIモジュール（軽量）
            criticalLoads.push(new Promise(resolve => {
                if (this._modules.ui) {
                    this._modules.ui.loadResources(() => {
                        this._loadingProgress++;
                        this._updateLoadingScreen();
                        resolve();
                    });
                } else {
                    resolve();
                }
            }));
            
            return Promise.all(criticalLoads);
        }
        
        _loadWorldMapProgressive() {
            return new Promise((resolve) => {
                const imagePath = AirshipIllusion.params.worldMapImage || 'WorldMap';
                
                // キャッシュをチェック
                if (AirshipIllusion._resourceCache.worldMapHighRes) {
                    this._loadingProgress++;
                    this._updateLoadingScreen();
                    resolve();
                    return;
                }
                
                // 通常の高解像度版を直接読み込む（低解像度版なし）
                const bitmap = ImageManager.loadBitmap('img/airship_illusion/', imagePath);
                
                bitmap.addLoadListener(() => {
                    AirshipIllusion._resourceCache.worldMapHighRes = bitmap;
                    AirshipIllusion._resourceCache.worldMapLowRes = bitmap; // 互換性のため同じものを設定
                    this._loadingProgress++;
                    this._updateLoadingScreen();
                    resolve();
                });
                
                bitmap.addErrorListener(() => {
                    console.error('Failed to load world map:', imagePath);
                    this._loadingProgress++;
                    this._updateLoadingScreen();
                    resolve();
                });
            });
        }
        
        _loadHighResWorldMap(imagePath) {
            // この関数は不要になりましたが、互換性のため残します
            return;
        }
        
        _loadSecondaryResources() {
            const secondaryLoads = [];
            const modulesToLoad = ['fieldShader', 'weather', 'control', 'landmark', 'worldMap'];
            
            this._loadingTotal += modulesToLoad.length;
            
            modulesToLoad.forEach(key => {
                if (this._modules[key] && key !== 'sprite' && key !== 'ui') {
                    secondaryLoads.push(new Promise(resolve => {
                        // 非同期でモジュールを読み込み
                        setTimeout(() => {
                            this._modules[key].loadResources(() => {
                                this._loadingProgress++;
                                this._updateLoadingScreen();
                                resolve();
                            });
                        }, 10);
                    }));
                }
            });
            
            Promise.all(secondaryLoads).then(() => {
                this._resourcesLoaded = true;
                this._loadingPhase = 'complete';
                this._hideLoadingScreen();
            }).catch(error => {
                console.error('Failed to load secondary resources:', error);
            });
        }
        
        isReady() {
            if (!super.isReady()) {
                return false;
            }
            
            if (!this._resourcesLoaded) {
                return false;
            }
            
            // すべてのモジュールが準備完了かチェック
            for (const key in this._modules) {
                if (!this._modules[key].isReady()) {
                    return false;
                }
            }
            
            return true;
        }
        
        start() {
            super.start();
            
            // 飛空艇モードをアクティブに設定
            if ($gameAirshipIllusion) {
                $gameAirshipIllusion.isActive = true;
            }
            
            // すべてのモジュールをアクティベート
            for (const key in this._modules) {
                this._modules[key].activate();
            }
            
            // 飛行BGMを再生
            this._playFlightBGM();
            
            // z-indexで子要素をソート
            this.children.sort((a, b) => {
                return (a.z || 0) - (b.z || 0);
            });
            
            // 発進演出タイプに応じてフェードイン
            if (AirshipIllusion.params.launchEffectType === 'white') {
                // ホワイトフェードの場合
                // 白いティントから徐々に通常に戻す
                $gameScreen.startTint([0, 0, 0, 0], 90);
                // フェードアウトしていない場合でも念のためフェードイン
                if ($gameScreen.brightness() < 255) {
                    $gameScreen.startFadeIn(1);
                }
            } else {
                // その他の場合は通常の黒からフェードイン
                $gameScreen.startFadeIn(30);
            }
            
            // 内部から戻った場合は発進演出をスキップ
            if ($gameAirshipIllusion && $gameAirshipIllusion.wasInInterior) {
                // 内部から戻った場合は通常状態で開始
                this._launchEffectPhase = 'ready';
                
                // スプライトを通常表示状態にする
                if (this._modules.sprite) {
                    this._modules.sprite.skipLaunchEffect();
                }
                
                // FieldShaderのランドマークを再初期化（内部から戻った時の対策）
                if (this._modules.fieldShader) {
                    setTimeout(() => {
                        if (this._modules.fieldShader._collectLandmarkEvents) {
                            this._modules.fieldShader._collectLandmarkEvents();
                        }
                        if (this._modules.fieldShader._createLandmarkAtlas) {
                            this._modules.fieldShader._createLandmarkAtlas();
                        }
                    }, 500); // 少し遅延を入れて確実に初期化
                }
                
            } else {
                // 通常の発進演出を開始（待機時間を短縮）
                setTimeout(() => {
                    if (this._modules.sprite && this._modules.sprite._airshipSprite) {
                        this._startLaunchEffect();
                    } else {
                        // スプライトがまだ準備できていない場合
                        this._startLaunchEffect();
                    }
                }, 50); // 100msから50msに短縮
            }

            // フラグのリセットは少し遅らせる（他のモジュールが初期化を完了してから）
            setTimeout(() => {
                if ($gameAirshipIllusion && $gameAirshipIllusion.wasInInterior) {
                    $gameAirshipIllusion.wasInInterior = false;
                }
            }, 1000); // 1秒に延長して確実に処理を完了させる
        }
        
        _startLaunchEffect() {
            this._launchEffectPhase = 'launching';
            this._launchEffectTimer = 0;
            
            // スプライトモジュールに発進演出を通知
            if (this._modules.sprite) {
                this._modules.sprite.startLaunchEffect(AirshipIllusion.params.launchEffectType);
            }
        }
        
        _playFlightBGM() {
            const bgm = {
                name: AirshipIllusion.params.flightBGM,
                volume: 90,
                pitch: 100,
                pan: 0
            };
            
            // 内部から戻った場合で、BGM位置が保存されている場合
            if ($gameAirshipIllusion && $gameAirshipIllusion.wasInInterior &&
                $gameAirshipIllusion.bgmPosition !== undefined && $gameAirshipIllusion.bgmPosition > 0) {

                const savedPosition = $gameAirshipIllusion.bgmPosition;

                // MZの正しい方法：playBgmの第2引数として位置を指定
                AudioManager.playBgm(bgm, savedPosition);
                
                // 位置情報をクリア
                $gameAirshipIllusion.bgmPosition = undefined;
            } else {
                // 通常の再生（最初から）
                AudioManager.playBgm(bgm);
            }
        }
        
        update() {
            super.update();
            
            // 発進演出の更新
            if (this._launchEffectPhase === 'launching') {
                this._updateLaunchEffect();
                
                // ★重要：スプライトモジュールも更新する！
                if (this._modules.sprite) {
                    this._modules.sprite.update();
                }
                
                return; // 他のモジュールや操作は受け付けない
            }
            
            // すべてのモジュールを更新（自動飛行中も更新が必要）
            for (const key in this._modules) {
                this._modules[key].update();
            }
            
            // 自動飛行の更新はControl層が担当するため削除
            
            // 着陸をチェック
            if (this._isLandingRequested()) {
                this._startLanding();
            }
            
            // 内部への移動をチェック
            if (this._isInteriorRequested()) {
                this._startInteriorTransfer();
            }
        }
        
        // オートパイロット機能はControl層に移動したため削除
        /*
        _updateAutoFlight() {
            if (!$gameAirshipIllusion || !$gameAirshipIllusion.autoFlightTarget) {
                return;
            }
            
            const target = $gameAirshipIllusion.autoFlightTarget;
            const current = $gameAirshipIllusion.position;

            // 目標までの距離を計算
            const dx = target.x - current.x;
            const dy = target.y - current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 到着判定（距離が閾値以下）
            if (distance < 50) {
                // 自動飛行フラグをクリア
                $gameAirshipIllusion.isAutoFlying = false;
                $gameAirshipIllusion.autoFlightTarget = null;
                
                // SE再生
                SoundManager.playOk();
                
                // メッセージ表示（UIモジュール経由）
                AirshipIllusion.eventBus.emit('autoFlightCompleted', {
                    target: target,
                    position: current
                });
                
                return;
            }
            
            // 目標方向を計算
            const targetAngle = Math.atan2(dx, -dy);
            
            // 現在の角度との差を計算
            let angleDiff = targetAngle - $gameAirshipIllusion.angle;
            
            // 角度を-π～πの範囲に正規化
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            
            // 徐々に方向転換（最大0.05ラジアン/フレーム）
            const turnSpeed = 0.05;
            if (Math.abs(angleDiff) > turnSpeed) {
                $gameAirshipIllusion.angle += Math.sign(angleDiff) * turnSpeed;
            } else {
                $gameAirshipIllusion.angle = targetAngle;
            }
            
            // 角度を0～2πの範囲に正規化
            while ($gameAirshipIllusion.angle < 0) $gameAirshipIllusion.angle += Math.PI * 2;
            while ($gameAirshipIllusion.angle >= Math.PI * 2) $gameAirshipIllusion.angle -= Math.PI * 2;
            
            // 前進（角度がほぼ合っている場合のみ全速、そうでなければ減速）
            const alignmentFactor = Math.max(0.3, 1 - Math.abs(angleDiff) / Math.PI);  // 最低速度を保証
            const baseSpeed = AirshipIllusion.params.airshipSpeed || 10;
            const speed = baseSpeed * alignmentFactor * 1.5;  // 自動飛行は少し速めに

            current.x += Math.sin($gameAirshipIllusion.angle) * speed;
            current.y -= Math.cos($gameAirshipIllusion.angle) * speed;
            
            // ワールド境界でループ
            const worldWidth = AirshipIllusion.params.worldWidth || 10000;
            const worldHeight = AirshipIllusion.params.worldHeight || 10000;
            
            if (current.x < 0) current.x += worldWidth;
            if (current.x >= worldWidth) current.x -= worldWidth;
            if (current.y < 0) current.y += worldHeight;
            if (current.y >= worldHeight) current.y -= worldHeight;
            
            // 位置更新を通知
            AirshipIllusion.eventBus.emit('positionChanged', { 
                x: current.x, 
                y: current.y 
            });
            
            // 角度更新を通知
            AirshipIllusion.eventBus.emit('angleChanged', { 
                angle: $gameAirshipIllusion.angle 
            });
        }
        */
        
        _updateLaunchEffect() {
            this._launchEffectTimer++;
            
            // 発進演出の時間（3秒 = 180フレーム）
            if (this._launchEffectTimer >= 180) {
                this._launchEffectPhase = 'ready';
                
                // スプライトモジュールに演出終了を通知
                if (this._modules.sprite) {
                    this._modules.sprite.endLaunchEffect();
                }
            }
        }
        
        _isLandingRequested() {
            // Vキー（landing）で着陸
            return Input.isTriggered('landing') && !this.isBusy();
        }
        
        _isInteriorRequested() {
            // Cキー（interior）で内部へ移動
            return Input.isTriggered('interior') && !this.isBusy();
        }
        
        _startLanding() {
            // 着陸可能かチェック
            if (!this._canLandAtCurrentPosition()) {
                // 着陸不可の効果音
                SoundManager.playBuzzer();
                
                // 着陸失敗メッセージを表示
                this._showLandingFailedMessage();
                return;
            }
            
            // フェードアウト
            $gameScreen.startFadeOut(30);
            
            // BGMを停止
            AudioManager.fadeOutBgm(1);
            
            // モジュールを非アクティブ化
            for (const key in this._modules) {
                this._modules[key].deactivate();
            }
            
            // 飛行中フラグをリセット
            $gameAirshipIllusion.isFlying = false;
            
            // 少し待ってからシーン遷移
            setTimeout(() => {
                SceneManager.goto(Scene_Map);
                // Scene_Map開始時にフェードインを確実に実行
                setTimeout(() => {
                    $gameScreen.startFadeIn(30);
                }, 100);
            }, 500);
        }
        
        _startInteriorTransfer() {
            // 連打防止：既に遷移中なら何もしない
            if (AirshipIllusion._isTransferringToInterior) {
                return;
            }
            AirshipIllusion._isTransferringToInterior = true;

            // BGMの再生位置を保存（MZ標準のseekメソッドを使用）
            if (AudioManager._bgmBuffer && AudioManager._bgmBuffer.seek) {
                $gameAirshipIllusion.bgmPosition = AudioManager._bgmBuffer.seek();
            }

            // BGMを停止
            AudioManager.fadeOutBgm(1);

            // モジュールを非アクティブ化
            for (const key in this._modules) {
                this._modules[key].deactivate();
            }

            // 飛行状態を維持（内部から戻れるように）
            $gameAirshipIllusion.isFlying = true;

            // 内部から戻ることを記録
            $gameAirshipIllusion.wasInInterior = true;

            // 内部マップへ転送を予約
            // 内部マップ用の一時フラグを設定（フェードイン用）
            $gameAirshipIllusion._enteringInterior = true;

            // 内部マップへ転送（フェードタイプ: 0 = なし、手動でフェード制御）
            $gamePlayer.reserveTransfer(
                AirshipIllusion.params.interiorMapId,
                AirshipIllusion.params.interiorX,
                AirshipIllusion.params.interiorY,
                AirshipIllusion.params.interiorDirection,
                0
            );

            // フェードアウトしてからマップシーンへ
            $gameScreen.startFadeOut(30);
            setTimeout(() => {
                SceneManager.goto(Scene_Map);
            }, 500);
        }
        
        _canLandAtCurrentPosition() {
            // コントロールモジュールから最新の位置を取得
            let currentX, currentY;

            if (this._modules.control) {
                const controlPos = this._modules.control.getPosition();
                currentX = controlPos.x;
                currentY = controlPos.y;
            } else {
                // フォールバック
                currentX = $gameAirshipIllusion.position.x;
                currentY = $gameAirshipIllusion.position.y;
            }

            // 現在の飛空艇位置をマップ座標に変換
            const mapCoords = this._convertWorldToMapCoordinates(currentX, currentY);

            // 保存されたマップデータを使用してRPGツクールMZ標準の判定を行う
            if ($gameAirshipIllusion.mapData && $gameAirshipIllusion.tilesetFlags) {
                // RPGツクールMZ標準のisAirshipLandOkと同等の判定を行う
                // Game_Map.prototype.isAirshipLandOk の実装:
                // return this.checkPassage(x, y, 0x800) && this.checkPassage(x, y, 0x0f);
                return this._checkAirshipLandOkFromSavedData(mapCoords.x, mapCoords.y);
            }

            // フォールバック：$gameMap.isAirshipLandOk を直接使用
            if ($gameMap && $gameMap.isAirshipLandOk &&
                $gameMap.mapId() === $gameAirshipIllusion.returnMapId) {
                return $gameMap.isAirshipLandOk(mapCoords.x, mapCoords.y);
            }

            return false;
        }

        // 保存されたマップデータを使用して、標準のisAirshipLandOkと同等の判定を行う
        _checkAirshipLandOkFromSavedData(x, y) {
            const mapData = $gameAirshipIllusion.mapData;
            const flags = $gameAirshipIllusion.tilesetFlags;

            if (!mapData || !flags) return false;

            const width = mapData.width;
            const height = mapData.height;

            if (x < 0 || x >= width || y < 0 || y >= height) {
                return false;
            }

            // RPGツクールMZ標準: checkPassage(x, y, 0x800) && checkPassage(x, y, 0x0f)
            // 0x800 = 飛空艇着陸可能フラグ
            // 0x0f = 通行可能フラグ（4方向）
            return this._checkPassageFromSavedData(x, y, 0x800, mapData, flags) &&
                   this._checkPassageFromSavedData(x, y, 0x0f, mapData, flags);
        }

        // 保存されたデータでGame_Map.checkPassageと同等の判定
        _checkPassageFromSavedData(x, y, bit, mapData, flags) {
            const width = mapData.width;
            const height = mapData.height;

            // 全レイヤーのタイルIDを取得（Game_Map.allTilesと同等）
            const tileIds = [];
            for (let z = 3; z >= 0; z--) {
                const index = (z * height + y) * width + x;
                const tileId = mapData.data[index] || 0;
                if (tileId > 0) {
                    tileIds.push(tileId);
                }
            }

            // Game_Map.checkPassageと同等の判定
            for (const tileId of tileIds) {
                const flag = flags[tileId];
                if (flag === undefined) continue;

                // ビット16（0x10）= スター通行（☆マーク）- 上に乗れるタイル
                if ((flag & 0x10) !== 0) {
                    // スタータイルは判定をスキップして次のタイルへ
                    continue;
                }
                // 指定ビットが立っていれば通行不可
                if ((flag & bit) === 0) {
                    return true;  // 通行可能
                }
                return false;  // 通行不可
            }

            return false;  // タイルがない場合は通行不可
        }
        
        _convertWorldToMapCoordinates(worldX, worldY) {
            const worldWidth = AirshipIllusion.params.worldWidth;
            const worldHeight = AirshipIllusion.params.worldHeight;
            let mapWidth = AirshipIllusion.params.mapWidth;
            let mapHeight = AirshipIllusion.params.mapHeight;
            
            // $dataMapが存在する場合はその値を優先
            if ($gameAirshipIllusion.mapData) {
                mapWidth = $gameAirshipIllusion.mapData.width;
                mapHeight = $gameAirshipIllusion.mapData.height;
            }
            
            // 正規化座標（0-1）を介して変換
            const normalizedX = ((worldX % worldWidth) + worldWidth) % worldWidth / worldWidth;
            const normalizedY = ((worldY % worldHeight) + worldHeight) % worldHeight / worldHeight;
            
            let mapX = Math.floor(normalizedX * mapWidth);
            let mapY = Math.floor(normalizedY * mapHeight);
            
            // 範囲制限
            mapX = Math.max(0, Math.min(mapX, mapWidth - 1));
            mapY = Math.max(0, Math.min(mapY, mapHeight - 1));
            
            return { x: mapX, y: mapY };
        }
        
        _convertMapToWorldCoordinates(mapX, mapY) {
            // マップタイル座標をワールド座標に変換
            const worldWidth = AirshipIllusion.params.worldWidth;
            const worldHeight = AirshipIllusion.params.worldHeight;
            let mapWidth = AirshipIllusion.params.mapWidth;
            let mapHeight = AirshipIllusion.params.mapHeight;
            
            // $dataMapが存在する場合はその値を優先
            if ($dataMap) {
                mapWidth = $dataMap.width;
                mapHeight = $dataMap.height;
            }
            
            // 正規化座標（0-1）を介して変換（逆変換）
            const normalizedX = (mapX + 0.5) / mapWidth;  // タイルの中心
            const normalizedY = (mapY + 0.5) / mapHeight; // タイルの中心
            
            let worldX = normalizedX * worldWidth;
            let worldY = normalizedY * worldHeight;
            
            // 範囲制限
            worldX = Math.max(0, Math.min(worldX, worldWidth));
            worldY = Math.max(0, Math.min(worldY, worldHeight));
            
            return { x: worldX, y: worldY };
        }
        
        _showLandingFailedMessage() {
            // 着陸失敗メッセージウィンドウを作成
            if (this._landingMessageWindow) {
                this._landingMessageWindow.close();
                this.removeChild(this._landingMessageWindow);
            }
            
            this._landingMessageWindow = new Window_LandingMessage();
            this.addChild(this._landingMessageWindow);
            
            // 2秒後に自動的に閉じる
            setTimeout(() => {
                if (this._landingMessageWindow) {
                    this._landingMessageWindow.close();
                }
            }, 2000);
        }
        
        terminate() {
            super.terminate();

            // 連打防止フラグをすべてリセット
            AirshipIllusion._isStartingFlightScene = false;
            AirshipIllusion._isTransferringToInterior = false;
            AirshipIllusion._isReturningFromInterior = false;

            // 飛空艇モードを非アクティブに設定
            if ($gameAirshipIllusion) {
                $gameAirshipIllusion.isActive = false;
            }
            
            // すべてのモジュールを破棄
            for (const key in this._modules) {
                this._modules[key].dispose();
            }
            
            // インスタンスをクリア
            AirshipIllusion.instances = {};
            
            // イベントバスをクリア
            AirshipIllusion.eventBus.clear();
            
            // 内部への移動でない場合のみ、着陸処理を行う
            if (!$gameAirshipIllusion.isFlying) {
                // コントロールモジュールから最新の位置を取得
                if (this._modules.control) {
                    const controlPos = this._modules.control.getPosition();
                    $gameAirshipIllusion.position.x = controlPos.x;
                    $gameAirshipIllusion.position.y = controlPos.y;
                    $gameAirshipIllusion.cameraPitch = this._modules.control.getCameraPitch();
                }
                
                // 着陸位置を計算
                const landingCoords = this._convertWorldToMapCoordinates(
                    $gameAirshipIllusion.position.x,
                    $gameAirshipIllusion.position.y
                );
                
                // 着陸位置を保存
                $gameAirshipIllusion.landingX = landingCoords.x;
                $gameAirshipIllusion.landingY = landingCoords.y;
                $gameAirshipIllusion.needsMoveEvent = true;
                
                // プレイヤーを着陸位置に転送
                $gamePlayer.reserveTransfer(
                    $gameAirshipIllusion.returnMapId,
                    landingCoords.x,
                    landingCoords.y,
                    $gameAirshipIllusion.returnDirection,
                    0
                );
            }
        }
    }
    
    // シーンをエクスポート
    window.Scene_AirshipIllusion = Scene_AirshipIllusion;
    
    //=============================================================================
    // Scene_Map の拡張
    //=============================================================================
    
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);

        // 内部マップへの遷移フラグをリセット（連打防止フラグ解除）
        AirshipIllusion._isTransferringToInterior = false;

        // 飛空艇内部マップに入った場合のフェードイン
        if ($gameAirshipIllusion && $gameAirshipIllusion._enteringInterior &&
            $gameMap.mapId() === AirshipIllusion.params.interiorMapId) {
            // フラグをクリア
            $gameAirshipIllusion._enteringInterior = false;
            // 確実にフェードイン（少し遅延を入れて画面準備を待つ）
            setTimeout(() => {
                $gameScreen.startFadeIn(30);
            }, 100);
        }
        
        // 飛空艇から着陸した場合、イベントを移動（needsMoveEventフラグがある場合）
        if ($gameAirshipIllusion && $gameAirshipIllusion.needsMoveEvent) {
            $gameAirshipIllusion.needsMoveEvent = false;
            
            if ($gameAirshipIllusion.eventId > 0) {
                const event = $gameMap.event($gameAirshipIllusion.eventId);
                if (event) {
                    event.setPosition(
                        $gameAirshipIllusion.landingX,
                        $gameAirshipIllusion.landingY
                    );
                }
            }
        }
        // 通常のマップ移動で飛空艇イベントの位置を復元（フィールドマップの場合）
        else if ($gameAirshipIllusion && 
                 $gameMap.mapId() === $gameAirshipIllusion.returnMapId &&
                 $gameAirshipIllusion.eventId > 0 &&
                 $gameAirshipIllusion.landingX > 0 &&
                 $gameAirshipIllusion.landingY > 0) {
            
            const event = $gameMap.event($gameAirshipIllusion.eventId);
            if (event) {
                // イベントが元の位置にある場合のみ移動（既に正しい位置にある場合は移動しない）
                if (event.x !== $gameAirshipIllusion.landingX || 
                    event.y !== $gameAirshipIllusion.landingY) {
                    event.setPosition(
                        $gameAirshipIllusion.landingX,
                        $gameAirshipIllusion.landingY
                    );
                }
            }
        }
    };
    
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);

        // 飛空艇内部マップに入った場合のフェードイン（onMapLoadedで処理されなかった場合のバックアップ）
        if ($gameAirshipIllusion && $gameAirshipIllusion._enteringInterior &&
            $gameMap.mapId() === AirshipIllusion.params.interiorMapId) {
            // フラグをクリア
            $gameAirshipIllusion._enteringInterior = false;
            // 画面が暗い場合はフェードイン
            if ($gameScreen.brightness() === 0) {
                $gameScreen.startFadeIn(30);
            }
        }
    };
    
    //=============================================================================
    // プラグインコマンド
    //=============================================================================
    
    // シーン遷移中フラグ（連打防止）
    AirshipIllusion._isStartingFlightScene = false;
    AirshipIllusion._isTransferringToInterior = false;
    AirshipIllusion._isReturningFromInterior = false;

    PluginManager.registerCommand(pluginName, 'start', function(args) {
        // 連打防止：既にシーン遷移中なら何もしない
        if (AirshipIllusion._isStartingFlightScene) {
            return;
        }
        AirshipIllusion._isStartingFlightScene = true;

        // 現在のイベントIDを保存
        if ($gameAirshipIllusion) {
            $gameAirshipIllusion.eventId = this.eventId();

            // リソースのプリロード（初回のみ）
            if (!$gameAirshipIllusion._resourcesPreloaded) {
                // 主要な画像をプリロード
                ImageManager.loadBitmap('img/airship_illusion/', AirshipIllusion.params.worldMapImage || 'WorldMap');
                ImageManager.loadBitmap('img/airship_illusion/', AirshipIllusion.params.airshipSpriteSheet || 'Airship');
                $gameAirshipIllusion._resourcesPreloaded = true;
            }
        }

        // 画像のプリロード完了を待つ
        const worldMapBitmap = ImageManager.loadBitmap('img/airship_illusion/', AirshipIllusion.params.worldMapImage || 'WorldMap');
        const airshipBitmap = ImageManager.loadBitmap('img/airship_illusion/', AirshipIllusion.params.airshipSpriteSheet || 'Airship');

        // 両方の画像読み込み完了を待つ
        const waitForLoad = () => {
            if (worldMapBitmap.isReady() && airshipBitmap.isReady()) {
                // 発進演出タイプに応じてフェードアウト
                if (AirshipIllusion.params.launchEffectType === 'white') {
                    // ホワイトフェードの場合は白い画面遷移
                    // フェードアウトせずに白くティントするだけ
                    $gameScreen.startTint([255, 255, 255, 255], 30);
                    this.wait(30);
                } else {
                    // その他の場合は通常の黒フェードアウト
                    $gameScreen.startFadeOut(30);
                    this.wait(30);
                }

                // フェードアウト完了後に飛行シーンへ
                setTimeout(() => {
                    SceneManager.push(Scene_AirshipIllusion);
                }, 500);
            } else {
                // まだ読み込み中なら再チェック
                setTimeout(waitForLoad, 50);
            }
        };

        waitForLoad();
    });
    
    PluginManager.registerCommand(pluginName, 'returnFromInterior', function(args) {
        // 連打防止：既にシーン遷移中なら何もしない
        if (AirshipIllusion._isReturningFromInterior) {
            return;
        }

        if ($gameAirshipIllusion && $gameAirshipIllusion.isFlying) {
            AirshipIllusion._isReturningFromInterior = true;

            // wasInInteriorフラグを確実に設定
            $gameAirshipIllusion.wasInInterior = true;

            // 内部から戻る場合もフェードアウト
            $gameScreen.startFadeOut(30);
            this.wait(30);

            setTimeout(() => {
                SceneManager.push(Scene_AirshipIllusion);
            }, 500);
        }
    });
    
    //=============================================================================
    // Window_LandingMessage - 着陸失敗メッセージウィンドウ
    //=============================================================================
    
    class Window_LandingMessage extends Window_Base {
        initialize() {
            const rect = this.windowRect();
            super.initialize(rect);
            this.drawMessage();
            this.openness = 0;
            this.open();
        }
        
        windowRect() {
            const width = 400;
            const height = 80;
            const x = (Graphics.width - width) / 2;
            const y = Graphics.height / 2 - 100;
            return new Rectangle(x, y, width, height);
        }
        
        drawMessage() {
            this.contents.clear();
            const textY = (this.contents.height - this.lineHeight()) / 2;
            this.drawText(AirshipIllusion.params.landingFailedMessage, 0, textY, this.contents.width, 'center');
        }
    }
    
})();