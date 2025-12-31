//=============================================================================
// AirshipIllusionFieldShader_MZ.js - Landmark Integration Version
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Airship Illusion - Field Shader (Landmark Integration) v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 * @help
 * ============================================================================
 * Airship Illusion - Field Shader v1.0.0 for RPG Maker MZ
 * ============================================================================
 *
 * This module handles pseudo-3D display of sky and ground for the Airship
 * Illusion System using WebGL shaders, with integrated landmark display.
 *
 * Landmark Features:
 * - Set <airshipVisible: true> in event note to make it visible from airship
 * - <landmarkName: Name> sets the name displayed when approaching
 * - <landmarkType: town/castle/dungeon/shrine/port/tower/cave/forest> sets type
 * - <landmarkIcon: number> specifies individual icon
 * - <important: true> displays as important location (larger)
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
 * @param maxLandmarks
 * @text Max Landmarks
 * @desc Maximum number of landmarks displayed simultaneously
 * @type number
 * @min 10
 * @max 100
 * @default 50
 *
 * @param landmarkScale
 * @text Landmark Scale
 * @desc Base display size of landmarks
 * @type number
 * @decimals 2
 * @min 0.1
 * @max 5.0
 * @default 0.3
 *
 * @param showMinimapIcons
 * @text Show Minimap Icons
 * @desc Display landmark icons on minimap
 * @type boolean
 * @default true
 *
 * @param townIcon
 * @text Town Icon
 * @desc Default icon number for town type
 * @type number
 * @min 0
 * @max 9999
 * @default 176
 *
 * @param castleIcon
 * @text Castle Icon
 * @desc Default icon number for castle type
 * @type number
 * @min 0
 * @max 9999
 * @default 177
 *
 * @param dungeonIcon
 * @text Dungeon Icon
 * @desc Default icon number for dungeon type
 * @type number
 * @min 0
 * @max 9999
 * @default 178
 *
 * @param shrineIcon
 * @text Shrine Icon
 * @desc Default icon number for shrine type
 * @type number
 * @min 0
 * @max 9999
 * @default 179
 *
 * @param portIcon
 * @text Port Icon
 * @desc Default icon number for port type
 * @type number
 * @min 0
 * @max 9999
 * @default 180
 *
 * @param towerIcon
 * @text Tower Icon
 * @desc Default icon number for tower type
 * @type number
 * @min 0
 * @max 9999
 * @default 181
 *
 * @param caveIcon
 * @text Cave Icon
 * @desc Default icon number for cave type
 * @type number
 * @min 0
 * @max 9999
 * @default 182
 *
 * @param forestIcon
 * @text Forest Icon
 * @desc Default icon number for forest type
 * @type number
 * @min 0
 * @max 9999
 * @default 183
 *
 * @param defaultIcon
 * @text Default Icon
 * @desc Icon number when type is not specified
 * @type number
 * @min 0
 * @max 9999
 * @default 176
 *
 * @param enableVisitedTracking
 * @text Enable Visited Tracking
 * @desc Link with VisitedPlaceTracker for visited status
 * @type boolean
 * @default true
 *
 * @param unvisitedDisplayName
 * @text Unvisited Display Name
 * @desc Display name for unvisited locations
 * @type string
 * @default ???
 *
 * @param landmarkNameDisplayDistance
 * @text Landmark Name Display Distance
 * @desc Distance at which landmark name appears (world coords: 500 ≒ 5 tiles on 100x100 map)
 * @type number
 * @min 100
 * @max 2000
 * @default 500
 *
 * @param landmarkNamePosition
 * @text Landmark Name Position
 * @desc Position of landmark name display
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
 *
 * @param waterMaskImage
 * @text Water Mask Image
 * @desc Mask image for water areas (white=water, black=land)
 * @type file
 * @dir img/airship_illusion
 * @default WaterMask
 *
 * @param enableWaveEffect
 * @text Enable Wave Effect
 * @desc Enable wave animation for water
 * @type boolean
 * @default true
 *
 * @param waveAmplitude
 * @text Wave Amplitude
 * @desc Wave height (larger = higher waves)
 * @type number
 * @decimals 1
 * @min 0.0
 * @max 50.0
 * @default 10.0
 *
 * @param waveSpeed
 * @text Wave Speed
 * @desc Wave animation speed (smaller = slower)
 * @type number
 * @decimals 1
 * @min 0.1
 * @max 5.0
 * @default 0.5
 *
 * @param waveFrequency
 * @text Wave Frequency
 * @desc Wave density (larger = finer waves)
 * @type number
 * @decimals 1
 * @min 0.1
 * @max 5.0
 * @default 1.0
 *
 * @param heightMapImage
 * @text Height Map Image
 * @desc Terrain height information (brighter = higher)
 * @type file
 * @dir img/airship_illusion
 * @default HeightMap
 *
 * @param enableHeightMap
 * @text Enable Height Map
 * @desc Enable parallax effect from height map
 * @type boolean
 * @default true
 *
 * @param heightMapStrength
 * @text Height Map Strength
 * @desc Depth effect strength (larger = more 3D)
 * @type number
 * @decimals 2
 * @min 0.0
 * @max 5.0
 * @default 1.0
 *
 * @param enableHeightShadow
 * @text Enable Height Shadow
 * @desc Generate dynamic shadows from height map
 * @type boolean
 * @default true
 *
 * @param heightShadowStrength
 * @text Shadow Strength
 * @desc Shadow intensity (larger = darker shadows)
 * @type number
 * @decimals 2
 * @min 0.0
 * @max 1.0
 * @default 0.4
 *
 * @param lightDirection
 * @text Light Direction
 * @desc Direction of light source (degrees: 0=North, 90=East, 180=South, 270=West)
 * @type number
 * @min 0
 * @max 360
 * @default 135
 */

/*:ja
 * @target MZ
 * @plugindesc 飛空艇イリュージョン - フィールドシェーダー（ランドマーク統合） v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 * @help
 * ============================================================================
 * 飛空艇イリュージョン - フィールドシェーダー v1.0.0 for RPG Maker MZ
 * ============================================================================
 *
 * このモジュールは飛空艇イリュージョンシステムの空と大地の疑似3D表示を
 * WebGLシェーダーで処理し、ランドマークを統合表示します。
 *
 * ランドマーク機能：
 * - イベントのメモ欄に <airshipVisible: true> を設定すると飛空艇から見えます
 * - <landmarkName: 名前> で近づいた時に表示される名前を設定
 * - <landmarkType: town/castle/dungeon/shrine/port/tower/cave/forest> でタイプを設定
 * - <landmarkIcon: 番号> で個別にアイコンを指定
 * - <important: true> で重要地点として大きく表示
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
 * @param maxLandmarks
 * @text 最大ランドマーク数
 * @desc 同時に表示できるランドマークの最大数
 * @type number
 * @min 10
 * @max 100
 * @default 50
 *
 * @param landmarkScale
 * @text ランドマーク基本サイズ
 * @desc ランドマークの基本表示サイズ
 * @type number
 * @decimals 2
 * @min 0.1
 * @max 5.0
 * @default 0.3
 *
 * @param showMinimapIcons
 * @text ミニマップアイコン表示
 * @desc ミニマップにランドマークアイコンを表示するか
 * @type boolean
 * @default true
 *
 * @param townIcon
 * @text 街アイコン
 * @desc 街タイプのデフォルトアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 176
 *
 * @param castleIcon
 * @text 城アイコン
 * @desc 城タイプのデフォルトアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 177
 *
 * @param dungeonIcon
 * @text ダンジョンアイコン
 * @desc ダンジョンタイプのデフォルトアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 178
 *
 * @param shrineIcon
 * @text 神殿アイコン
 * @desc 神殿タイプのデフォルトアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 179
 *
 * @param portIcon
 * @text 港アイコン
 * @desc 港タイプのデフォルトアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 180
 *
 * @param towerIcon
 * @text 塔アイコン
 * @desc 塔タイプのデフォルトアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 181
 *
 * @param caveIcon
 * @text 洞窟アイコン
 * @desc 洞窟タイプのデフォルトアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 182
 *
 * @param forestIcon
 * @text 森アイコン
 * @desc 森タイプのデフォルトアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 183
 *
 * @param defaultIcon
 * @text デフォルトアイコン
 * @desc タイプが指定されていない場合のアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 176
 *
 * @param enableVisitedTracking
 * @text 訪問済み判定連携
 * @desc VisitedPlaceTrackerと連携して訪問済み判定を行うか
 * @type boolean
 * @default true
 *
 * @param unvisitedDisplayName
 * @text 未訪問時の表示名
 * @desc 訪問していない場所の表示名
 * @type string
 * @default ???
 *
 * @param landmarkNameDisplayDistance
 * @text ランドマーク名表示距離
 * @desc この距離以内に近づくとランドマーク名が表示される（ワールド座標単位：マップ100×100で500≒5タイル分）
 * @type number
 * @min 100
 * @max 2000
 * @default 500
 *
 * @param landmarkNamePosition
 * @text ランドマーク名表示位置
 * @desc ランドマーク名の表示位置
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
 *
 * @param waterMaskImage
 * @text 海マスク画像
 * @desc 海の領域を示すマスク画像（白=海、黒=陸）
 * @type file
 * @dir img/airship_illusion
 * @default WaterMask
 *
 * @param enableWaveEffect
 * @text 波エフェクト有効化
 * @desc 海の波アニメーションを有効にするか
 * @type boolean
 * @default true
 *
 * @param waveAmplitude
 * @text 波の高さ
 * @desc 波の振幅（大きいほど波が高い）
 * @type number
 * @decimals 1
 * @min 0.0
 * @max 50.0
 * @default 10.0
 *
 * @param waveSpeed
 * @text 波の速度
 * @desc 波のアニメーション速度（小さいほどゆっくり）
 * @type number
 * @decimals 1
 * @min 0.1
 * @max 5.0
 * @default 0.5
 *
 * @param waveFrequency
 * @text 波の周期
 * @desc 波の細かさ（大きいほど波が細かい）
 * @type number
 * @decimals 1
 * @min 0.1
 * @max 5.0
 * @default 1.0
 *
 * @param heightMapImage
 * @text ハイトマップ画像
 * @desc 地形の高さ情報（明るいほど高い）
 * @type file
 * @dir img/airship_illusion
 * @default HeightMap
 *
 * @param enableHeightMap
 * @text ハイトマップ有効化
 * @desc ハイトマップによる視差効果を有効にするか
 * @type boolean
 * @default true
 *
 * @param heightMapStrength
 * @text ハイトマップ強度
 * @desc 立体感の強さ（大きいほど立体的）
 * @type number
 * @decimals 2
 * @min 0.0
 * @max 5.0
 * @default 1.0
 *
 * @param enableHeightShadow
 * @text ハイトマップ影有効化
 * @desc ハイトマップから動的に影を生成するか
 * @type boolean
 * @default true
 *
 * @param heightShadowStrength
 * @text 影の強度
 * @desc 影の濃さ（大きいほど影が濃い）
 * @type number
 * @decimals 2
 * @min 0.0
 * @max 1.0
 * @default 0.4
 *
 * @param lightDirection
 * @text 光源の方向
 * @desc 光が差し込む方向（度数、0=北、90=東、180=南、270=西）
 * @type number
 * @min 0
 * @max 360
 * @default 135
 */

(() => {
    'use strict';
    
    // Uキーを登録（視点切り替え用）
    Input.keyMapper[85] = 'viewToggle'; // U key
    
    // プラグインパラメータの取得
    const pluginName = 'AirshipIllusionFieldShader_MZ';
    const parameters = PluginManager.parameters(pluginName);
    const landmarkParams = {
        maxLandmarks: Number(parameters.maxLandmarks || 50),
        landmarkScale: Number(parameters.landmarkScale || 1.0),
        landmarkNameDisplayDistance: Number(parameters.landmarkNameDisplayDistance || 500),
        showMinimapIcons: parameters.showMinimapIcons !== 'false',
        enableVisitedTracking: parameters.enableVisitedTracking !== 'false',
        unvisitedDisplayName: String(parameters.unvisitedDisplayName || '???'),
        landmarkNamePosition: String(parameters.landmarkNamePosition || 'topCenter'),
        // 海の波エフェクト
        waterMaskImage: String(parameters.waterMaskImage || 'WaterMask'),
        enableWaveEffect: parameters.enableWaveEffect !== 'false',
        waveAmplitude: Number(parameters.waveAmplitude || 10.0),
        waveSpeed: Number(parameters.waveSpeed || 0.5),
        waveFrequency: Number(parameters.waveFrequency || 1.0),
        // ハイトマップ
        heightMapImage: String(parameters.heightMapImage || 'HeightMap'),
        enableHeightMap: parameters.enableHeightMap !== 'false',
        heightMapStrength: Number(parameters.heightMapStrength || 1.0),
        // ハイトマップからの動的影生成
        enableHeightShadow: parameters.enableHeightShadow !== 'false',
        heightShadowStrength: Number(parameters.heightShadowStrength || 0.4),
        lightDirection: Number(parameters.lightDirection || 135),
        iconTypes: {
            town: Number(parameters.townIcon || 176),
            castle: Number(parameters.castleIcon || 177),
            dungeon: Number(parameters.dungeonIcon || 178),
            shrine: Number(parameters.shrineIcon || 179),
            port: Number(parameters.portIcon || 180),
            tower: Number(parameters.towerIcon || 181),
            cave: Number(parameters.caveIcon || 182),
            forest: Number(parameters.forestIcon || 183),
            default: Number(parameters.defaultIcon || 176)
        }
    };
    
    // コアプラグインが読み込まれているかチェック
    if (!window.AirshipIllusion || !window.AirshipIllusion.Base) {
        throw new Error('AirshipIllusionFieldShader_MZ requires AirshipIllusionCore_MZ to be loaded first');
    }
    
    //=============================================================================
    // AirshipIllusionFieldShader
    //=============================================================================
    
    class AirshipIllusionFieldShader extends AirshipIllusion.Base {
        // 空と大地の表示設定
        static FIELD_CONFIG = {
            horizonY: 0.5,        // ホライゾン位置（上から50%）
            cameraHeight: 0.5,    // カメラ高さ
            fieldOfView: 0.6,     // 視野角
            farDistance: 500,     // 遠方クリッピング距離
            nearDistance: 5,      // 近方クリッピング距離
            scale: 0.02           // マップのスケール
        };
        
        // 頂点シェーダー
        static VERTEX_SHADER = [
            'attribute vec2 aVertexPosition;',
            'attribute vec2 aTextureCoord;',
            '',
            'uniform mat3 projectionMatrix;',
            'varying vec2 vTextureCoord;',
            '',
            'void main(void) {',
            '    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);',
            '    vTextureCoord = aTextureCoord;',
            '}'
        ].join('\n');
        
        // フラグメントシェーダー
        static FRAGMENT_SHADER = [
            '#ifdef GL_ES',
            'precision mediump float;',
            '#endif',
            '',
            'varying vec2 vTextureCoord;',
            'uniform sampler2D uSampler;',
            'uniform sampler2D uMapTexture;',
            'uniform sampler2D uLandmarkTexture;',
            'uniform sampler2D uWaterMask;',
            'uniform sampler2D uHeightMap;',
            '',
            'uniform float uHorizonY;',
            'uniform float uCameraHeight;',
            'uniform float uFieldOfView;',
            'uniform vec2 uCameraPos;',
            'uniform float uCameraAngle;',
            'uniform float uCameraPitch;',
            'uniform float uTime;',
            'uniform vec2 uWorldSize;',
            'uniform vec2 uMapSize;',
            'uniform float uScale;',
            'uniform float uWeatherType;',
            'uniform float uViewMode;',  // 視点モード（0: 3D, 1: トップダウン）
            '',
            '// 追加エフェクト用uniform',
            'uniform float uEnableWaveEffect;',
            'uniform float uWaveAmplitude;',
            'uniform float uWaveSpeed;',
            'uniform float uWaveFrequency;',
            'uniform float uEnableHeightMap;',
            'uniform float uHeightMapStrength;',
            'uniform float uEnableHeightShadow;',
            'uniform float uHeightShadowStrength;',
            'uniform vec2 uLightDirection;',
            '',
            '// ランドマーク用uniform',
            'uniform int uLandmarkCount;',
            'uniform vec4 uLandmarkData[50];',
            'uniform vec4 uLandmarkUV[50];',
            '',
            '// ノイズ関数',
            'float hash(vec2 p) {',
            '    p = fract(p * vec2(123.34, 456.78));',
            '    p += dot(p, p + 45.32);',
            '    return fract(p.x * p.y);',
            '}',
            '',
            '// スムーズノイズ',
            'float smoothNoise(vec2 p) {',
            '    vec2 i = floor(p);',
            '    vec2 f = fract(p);',
            '    f = f * f * (3.0 - 2.0 * f);',
            '    ',
            '    float a = hash(i);',
            '    float b = hash(i + vec2(1.0, 0.0));',
            '    float c = hash(i + vec2(0.0, 1.0));',
            '    float d = hash(i + vec2(1.0, 1.0));',
            '    ',
            '    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
            '}',
            '',
            '// フラクタルブラウン運動',
            'float fbm(vec2 p, float octaves) {',
            '    float value = 0.0;',
            '    float amplitude = 0.5;',
            '    float frequency = 1.0;',
            '    ',
            '    for(float i = 0.0; i < 5.0; i++) {',
            '        if(i >= octaves) break;',
            '        value += amplitude * smoothNoise(p * frequency);',
            '        amplitude *= 0.5;',
            '        frequency *= 2.0;',
            '        p = p * 2.0 + vec2(100.0);',
            '    }',
            '    ',
            '    return value;',
            '}',
            '',
            '// 晴れの日の雲生成',
            'float cloudShape(vec2 uv, float time) {',
            '    float cloud = fbm(uv * 3.0 + vec2(time * 0.05, 0.0), 4.0);',
            '    float detail = fbm(uv * 8.0 + vec2(time * 0.02, 100.0), 3.0);',
            '    cloud = cloud * 0.8 + detail * 0.2;',
            '    cloud = smoothstep(0.35, 0.65, cloud);',
            '    cloud = pow(cloud, 1.2);',
            '    return cloud;',
            '}',
            '',
            '// 積雲のような立体的な雲',
            'float cumulusCloud(vec2 uv, float time, float scale) {',
            '    uv *= scale;',
            '    float base = smoothNoise(uv * 0.5 + vec2(time * 0.01, 0.0));',
            '    base = smoothstep(0.3, 0.7, base);',
            '    float medium = fbm(uv * 1.5 + vec2(time * 0.02, 50.0), 3.0);',
            '    medium = smoothstep(0.4, 0.6, medium);',
            '    float detail = fbm(uv * 4.0 + vec2(time * 0.03, 100.0), 2.0);',
            '    float cloud = base * 0.6 + medium * 0.3 + detail * 0.1;',
            '    cloud = smoothstep(0.2, 0.8, cloud);',
            '    float highlight = fbm(uv * 2.0 + vec2(time * 0.01, 200.0), 2.0);',
            '    cloud *= 0.8 + highlight * 0.2;',
            '    return cloud;',
            '}',
            '',
            '// ランドマーク描画関数',
            'vec4 drawLandmark(vec2 worldPos, float depth, float screenY) {',
            '    vec4 landmarkColor = vec4(0.0);',
            '    vec2 landmarkPos;',
            '    float landmarkScale;',
            '    vec2 diff;',
            '    float distance;',
            '    float landmarkSize;',
            '    vec2 localUV;',
            '    vec4 uvBounds;',
            '    vec2 landmarkUV;',
            '    vec4 texColor;',
            '    ',
            '    for(int i = 0; i < 50; i++) {',
            '        if(i >= uLandmarkCount) break;',
            '        ',
            '        landmarkPos = uLandmarkData[i].xy;',
            '        landmarkScale = uLandmarkData[i].z;',
            '        ',
            '        if(landmarkScale < 0.01) continue;',
            '        ',
            '        diff = worldPos - landmarkPos;',
            '        distance = length(diff);',
            '        ',
            '        float tileSize = uWorldSize.x / uMapSize.x;',
            '        landmarkSize = tileSize * landmarkScale;',
            '        ',
            '        if(distance < landmarkSize) {',
            '            localUV = (diff / landmarkSize + 1.0) * 0.5;',
            '            ',
            '            if(localUV.x < 0.0 || localUV.x > 1.0 || localUV.y < 0.0 || localUV.y > 1.0) continue;',
            '            ',
            '            uvBounds = uLandmarkUV[i];',
            '            landmarkUV = mix(uvBounds.xy, uvBounds.zw, localUV);',
            '            ',
            '            texColor = texture2D(uLandmarkTexture, landmarkUV);',
            '            ',
            '            if(texColor.a > 0.1) {',
            '                landmarkColor = mix(landmarkColor, texColor, texColor.a);',
            '            }',
            '        }',
            '    }',
            '    ',
            '    return landmarkColor;',
            '}',
            '',
            '// 波の強度を計算（色の明暗で表現）',
            'float calcWaveIntensity(vec2 uv, float time) {',
            '    float worldScale = 100.0;',
            '    float timeScale = 0.3;',
            '    ',
            '    // 異なる方向・周期の波を合成',
            '    float wave1 = sin(uv.x * worldScale * uWaveFrequency + time * timeScale * uWaveSpeed);',
            '    float wave2 = sin(uv.y * worldScale * uWaveFrequency * 0.7 + time * timeScale * uWaveSpeed * 0.8);',
            '    float wave3 = sin((uv.x + uv.y) * worldScale * uWaveFrequency * 0.5 + time * timeScale * uWaveSpeed * 1.2);',
            '    float wave4 = sin((uv.x - uv.y) * worldScale * uWaveFrequency * 0.3 + time * timeScale * uWaveSpeed * 0.6);',
            '    ',
            '    // 波を合成して0〜1の範囲に',
            '    float combined = wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.2 + wave4 * 0.1;',
            '    return combined * 0.5 + 0.5;',
            '}',
            '',
            '// 波の色調整を適用',
            'vec3 applyWaveColor(vec3 color, float waterMask, float waveIntensity) {',
            '    if (waterMask < 0.5 || uEnableWaveEffect < 0.5) return color;',
            '    ',
            '    // 波の強度に応じて明暗を調整',
            '    float brightness = 1.0 + (waveIntensity - 0.5) * uWaveAmplitude * 0.02;',
            '    ',
            '    // ハイライト（波の頂点で白く光る）',
            '    float highlight = smoothstep(0.7, 0.95, waveIntensity) * uWaveAmplitude * 0.02;',
            '    ',
            '    // 色を調整',
            '    vec3 waveColor = color * brightness + vec3(highlight);',
            '    ',
            '    // 水の部分だけに適用',
            '    return mix(color, waveColor, waterMask);',
            '}',
            '',
            '// ハイトマップ視差効果',
            'vec2 applyHeightParallax(vec2 uv, vec2 viewDir, float height) {',
            '    if (uEnableHeightMap < 0.5) return uv;',
            '    ',
            '    float parallaxAmount = (height - 0.5) * uHeightMapStrength * 0.02;',
            '    return uv + viewDir * parallaxAmount;',
            '}',
            '',
            '// ハイトマップから動的に影を計算（カメラ角度に連動）',
            'float calcHeightShadow(vec2 uv, float currentHeight, float cameraAngle) {',
            '    if (uEnableHeightShadow < 0.5) return 1.0;',
            '    ',
            '    float lightAngle = cameraAngle + 3.14159;',
            '    vec2 lightDir = vec2(sin(lightAngle), -cos(lightAngle));',
            '    ',
            '    float shadow = 0.0;',
            '    ',
            '    vec2 s1 = uv + lightDir * 0.001;',
            '    vec2 s2 = uv + lightDir * 0.0025;',
            '    vec2 s3 = uv + lightDir * 0.004;',
            '    vec2 s4 = uv + lightDir * 0.006;',
            '    vec2 s5 = uv + lightDir * 0.008;',
            '    vec2 s6 = uv + lightDir * 0.010;',
            '    vec2 s7 = uv + lightDir * 0.013;',
            '    vec2 s8 = uv + lightDir * 0.016;',
            '    ',
            '    float h1 = texture2D(uHeightMap, fract(s1)).r;',
            '    float h2 = texture2D(uHeightMap, fract(s2)).r;',
            '    float h3 = texture2D(uHeightMap, fract(s3)).r;',
            '    float h4 = texture2D(uHeightMap, fract(s4)).r;',
            '    float h5 = texture2D(uHeightMap, fract(s5)).r;',
            '    float h6 = texture2D(uHeightMap, fract(s6)).r;',
            '    float h7 = texture2D(uHeightMap, fract(s7)).r;',
            '    float h8 = texture2D(uHeightMap, fract(s8)).r;',
            '    ',
            '    shadow += smoothstep(0.0, 0.06, h1 - currentHeight) * 0.20;',
            '    shadow += smoothstep(0.0, 0.06, h2 - currentHeight) * 0.17;',
            '    shadow += smoothstep(0.0, 0.06, h3 - currentHeight) * 0.15;',
            '    shadow += smoothstep(0.0, 0.06, h4 - currentHeight) * 0.13;',
            '    shadow += smoothstep(0.0, 0.06, h5 - currentHeight) * 0.11;',
            '    shadow += smoothstep(0.0, 0.06, h6 - currentHeight) * 0.10;',
            '    shadow += smoothstep(0.0, 0.06, h7 - currentHeight) * 0.08;',
            '    shadow += smoothstep(0.0, 0.06, h8 - currentHeight) * 0.06;',
            '    ',
            '    return 1.0 - shadow * uHeightShadowStrength;',
            '}',
            '',
            '// ハイトマップ影を色に適用',
            'vec3 applyHeightShadow(vec3 color, vec2 uv, float height, float cameraAngle) {',
            '    float shadowFactor = calcHeightShadow(uv, height, cameraAngle);',
            '    return color * shadowFactor;',
            '}',
            '',
            '// 大気遠近法（低地は明るく霞み、高地はクリア、カメラピッチで強度変化）',
            'vec3 applyAtmosphericPerspective(vec3 color, float height) {',
            '    if (uEnableHeightMap < 0.5) return color;',
            '    ',
            '    // カメラピッチによる係数（上向きほど効果が強い）',
            '    float pitchFactor = clamp(1.0 + uCameraPitch * 2.0, 0.3, 1.5);',
            '    ',
            '    // 地形の高低差による霞の量',
            '    float hazeAmount = (1.0 - height) * 0.4 * pitchFactor;',
            '    hazeAmount = clamp(hazeAmount, 0.0, 0.6);',
            '    ',
            '    // 明度を上げる（大気散乱で明るく見える効果）',
            '    vec3 result = color + vec3(hazeAmount * 0.4);',
            '    ',
            '    // 少し青みを足す',
            '    result.b += hazeAmount * 0.12;',
            '    ',
            '    return clamp(result, 0.0, 1.0);',
            '}',
            '',
            'void main(void) {',
            '    vec2 coord = vTextureCoord;',
            '    vec4 color;',
            '    ',
            '    // 広域ビューの場合（Mode7風）',
            '    if (uViewMode > 0.5) {',
            '        // Mode7風の設定：スキャンラインごとに異なる変換を適用する擬似的な実装',
            '        // Mode7では地平線が画面の1/3の位置にあり、そこから下が変換される',
            '        ',
            '        // Mode7パラメータ',
            '        float mode7Scale = 3.0;     // 全体のスケール',
            '        float mode7Height = 1.2;    // カメラの高さ（Mode7のY座標変換に相当）',
            '        float mode7Horizon = 0.35;  // Mode7の地平線位置（画面上部35%）',
            '        ',
            '        if (coord.y < mode7Horizon) {',
            '            // 空の処理（美しいグラデーション）',
            '            float skyY = coord.y / mode7Horizon;',
            '            vec3 skyColor;',
            '            ',
            '            // 天候に応じた美しいグラデーション',
            '            float weatherType = uWeatherType;',
            '            if(weatherType < 0.5) {',
            '                // 晴れ - 明るく澄んだ空',
            '                vec3 zenithColor = vec3(0.2, 0.4, 0.9);   // 天頂の深い青',
            '                vec3 horizonColor = vec3(0.85, 0.9, 1.0); // 地平線の明るい水色',
            '                skyColor = mix(horizonColor, zenithColor, pow(skyY, 0.7));',
            '            } else if(weatherType < 1.5) {',
            '                // 雨 - 重く暗い空',
            '                vec3 zenithColor = vec3(0.15, 0.2, 0.25);  // 暗い灰色',
            '                vec3 horizonColor = vec3(0.35, 0.4, 0.45); // やや明るい灰色',
            '                skyColor = mix(horizonColor, zenithColor, pow(skyY, 0.8));',
            '            } else if(weatherType < 2.5) {',
            '                // 雪 - 明るい灰白色',
            '                vec3 zenithColor = vec3(0.65, 0.7, 0.75);  // 薄い灰色',
            '                vec3 horizonColor = vec3(0.9, 0.9, 0.95);  // ほぼ白',
            '                skyColor = mix(horizonColor, zenithColor, pow(skyY, 0.9));',
            '            } else if(weatherType < 3.5) {',
            '                // 嵐 - 非常に暗い空',
            '                vec3 zenithColor = vec3(0.05, 0.05, 0.1);  // ほぼ黒',
            '                vec3 horizonColor = vec3(0.2, 0.2, 0.25);  // 暗い灰色',
            '                skyColor = mix(horizonColor, zenithColor, pow(skyY, 0.6));',
            '            } else if(weatherType < 4.5) {',
            '                // 砂嵐(4) - 黄土色の空',
            '                vec3 zenithColor = vec3(0.6, 0.5, 0.3);',
            '                vec3 horizonColor = vec3(0.8, 0.7, 0.5);',
            '                skyColor = mix(horizonColor, zenithColor, pow(skyY, 0.8));',
            '            } else if(weatherType < 5.5) {',
            '                // 霧(5) - 白っぽい灰色の空',
            '                vec3 zenithColor = vec3(0.7, 0.72, 0.75);',
            '                vec3 horizonColor = vec3(0.85, 0.87, 0.9);',
            '                skyColor = mix(horizonColor, zenithColor, pow(skyY, 0.9));',
            '            } else if(weatherType < 6.5) {',
            '                // 曇り(6) - 灰色の空',
            '                vec3 zenithColor = vec3(0.4, 0.42, 0.45);',
            '                vec3 horizonColor = vec3(0.6, 0.62, 0.65);',
            '                skyColor = mix(horizonColor, zenithColor, pow(skyY, 0.8));',
            '            } else {',
            '                // その他 - デフォルト（晴れと同じ）',
            '                vec3 zenithColor = vec3(0.2, 0.4, 0.9);',
            '                vec3 horizonColor = vec3(0.85, 0.9, 1.0);',
            '                skyColor = mix(horizonColor, zenithColor, pow(skyY, 0.7));',
            '            }',
            '            ',
            '            // シンプルな雲を追加',
            '            vec2 cloudUV = vec2(',
            '                coord.x * 2.0 + uCameraAngle * 0.15,',
            '                skyY * 1.5',
            '            );',
            '            ',
            '            // 軽い雲のパターン（広角モード用にシンプル化）',
            '            float clouds = 0.0;',
            '            if(weatherType < 0.5) {',
            '                // 晴れ - 軽い雲',
            '                float simpleCloud = smoothNoise(cloudUV * 2.0 + vec2(uTime * 0.00002, 0.0));',
            '                simpleCloud = smoothstep(0.4, 0.7, simpleCloud);',
            '                clouds = simpleCloud * 0.3;',
            '            } else if(weatherType < 3.5) {',
            '                // 雨・雪・嵐 - やや厚い雲',
            '                float simpleCloud = smoothNoise(cloudUV * 1.5 + vec2(uTime * 0.00001, 0.0));',
            '                simpleCloud = smoothstep(0.3, 0.6, simpleCloud);',
            '                clouds = simpleCloud * 0.5;',
            '            } else if(weatherType < 4.5) {',
            '                // 砂嵐(4) - 砂塵',
            '                float simpleCloud = smoothNoise(cloudUV * 3.0 + vec2(uTime * 0.00003, 0.0));',
            '                simpleCloud = smoothstep(0.3, 0.7, simpleCloud);',
            '                clouds = simpleCloud * 0.4;',
            '            } else if(weatherType < 5.5) {',
            '                // 霧(5) - 濃い霧',
            '                float simpleCloud = smoothNoise(cloudUV * 1.0 + vec2(uTime * 0.000005, 0.0));',
            '                simpleCloud = smoothstep(0.2, 0.6, simpleCloud);',
            '                clouds = simpleCloud * 0.7;',
            '            } else if(weatherType < 6.5) {',
            '                // 曇り(6) - 厚い雲で覆われた空',
            '                float simpleCloud = smoothNoise(cloudUV * 1.2 + vec2(uTime * 0.000015, 0.0));',
            '                simpleCloud = smoothstep(0.2, 0.5, simpleCloud);',
            '                clouds = simpleCloud * 0.6;',
            '            }',
            '            ',
            '            // 雲の色',
            '            vec3 cloudColor;',
            '            if(weatherType < 0.5) {',
            '                cloudColor = vec3(1.0, 1.0, 1.0);  // 晴れ - 白い雲',
            '            } else if(weatherType < 3.5) {',
            '                cloudColor = vec3(0.3, 0.3, 0.35);  // 雨雪嵐 - 暗い雲',
            '            } else if(weatherType < 4.5) {',
            '                cloudColor = vec3(0.7, 0.6, 0.4);  // 砂嵐 - 砂色',
            '            } else if(weatherType < 5.5) {',
            '                cloudColor = vec3(0.9, 0.9, 0.92);  // 霧 - 白っぽい',
            '            } else if(weatherType < 6.5) {',
            '                cloudColor = vec3(0.5, 0.52, 0.55);  // 曇り - 灰色の雲',
            '            } else {',
            '                cloudColor = vec3(1.0, 1.0, 1.0);  // その他 - 白い雲',
            '            }',
            '            ',
            '            // 雲を空に合成',
            '            color.rgb = mix(skyColor, cloudColor, clouds * 0.6);',
            '            color.a = 1.0;',
            '        } else {',
            '            // Mode7変換（地面処理）',
            '            // スキャンラインY座標を正規化（地平線から画面下端まで）',
            '            float scanlineY = (coord.y - mode7Horizon) / (1.0 - mode7Horizon);',
            '            ',
            '            // Mode7のアフィン変換を模倣',
            '            // Y座標が下に行くほど（scanlineYが大きいほど）スケールが大きくなる',
            '            float mode7Z = mode7Height / (scanlineY + 0.1);  // Mode7の深度計算',
            '            float mode7X = (coord.x - 0.5) * mode7Z;         // X軸のスケーリング',
            '            ',
            '            // Mode7風の深度とスケール',
            '            float depth = mode7Z * mode7Scale;',
            '            float screenX = mode7X * 2.0;  // Mode7の横幅',
            '            ',
            '            vec2 forward = vec2(sin(uCameraAngle), -cos(uCameraAngle));',
            '            vec2 right = vec2(cos(uCameraAngle), sin(uCameraAngle));',
            '            ',
            '            // Mode7座標変換（飛空艇の真下が見える）',
            '            // 飛空艇が画面中央より少し上（Y=0.45付近）にあり、',
            '            // その真下（Y=0.55-0.7付近）がよく見えるように調整',
            '            float airshipScreenY = 0.15; // 飛空艇の画面上の位置（地平線からの相対位置）',
            '            float positionCorrection = (scanlineY - airshipScreenY) * 3.0; // 飛空艇位置を基準に',
            '            vec2 worldOffset = right * screenX + forward * (depth - positionCorrection * mode7Scale * 0.8);',
            '            vec2 texCoord = (uCameraPos / uWorldSize) + worldOffset * uScale;',
            '            ',
            '            texCoord = fract(texCoord);',
            '            ',
            '            vec2 worldPos = uCameraPos + worldOffset * uScale * uWorldSize;',
            '            worldPos = mod(worldPos, uWorldSize);',
            '            ',
            '            // エフェクトマップのサンプリング',
            '            float waterMask = texture2D(uWaterMask, texCoord).r;',
            '            float heightValue = texture2D(uHeightMap, texCoord).r;',
            '            ',
            '            // テクスチャサンプリング（パララックスなし）',
            '            color = texture2D(uMapTexture, texCoord);',
            '            ',
            '            // 波エフェクト（色の明暗で表現）',
            '            float waveIntensity = calcWaveIntensity(texCoord, uTime);',
            '            color.rgb = applyWaveColor(color.rgb, waterMask, waveIntensity);',
            '            ',
            '            // ハイトマップから動的影を適用',
            '            color.rgb = applyHeightShadow(color.rgb, texCoord, heightValue, uCameraAngle);',
            '            ',
            '            // 大気遠近法を適用',
            '            color.rgb = applyAtmosphericPerspective(color.rgb, heightValue);',
            '            ',
            '            // Mode7風の影（実際の位置に基づいて）',
            '            // 飛空艇の実際の位置（uCameraPos）に影を配置',
            '            vec2 shadowWorldPos = uCameraPos;',
            '            float shadowDist = distance(worldPos, shadowWorldPos);',
            '            ',
            '            // ワールド座標での影の判定',
            '            if(shadowDist < 50.0) {',
            '                // 影の楕円形状を計算',
            '                vec2 shadowDelta = (worldPos - shadowWorldPos) / 50.0;',
            '                float shadowEllipse = (shadowDelta.x * shadowDelta.x) * 0.8 + (shadowDelta.y * shadowDelta.y) * 1.2;',
            '                ',
            '                if(shadowEllipse < 1.0) {',
            '                    // 深度に応じて影のサイズを調整（近いほど大きく）',
            '                    float depthFactor = 1.0 - (scanlineY * 0.3);',
            '                    float shadowAlpha = smoothstep(1.0, 0.1, shadowEllipse) * 0.5 * depthFactor;',
            '                    color.rgb = mix(color.rgb, vec3(0.0, 0.0, 0.0), shadowAlpha);',
            '                }',
            '            }',
            '            ',
            '            vec4 landmarkColor = drawLandmark(worldPos, depth, scanlineY);',
            '            if(landmarkColor.a > 0.0) {',
            '                color = mix(color, landmarkColor, landmarkColor.a);',
            '            }',
            '            ',
            '            // マップ端の隠し処理を削除（シンプルに表示）',
            '            ',
,
            '        }',
            '        ',
            '        gl_FragColor = color;',
            '        return;',
            '    }',
            '    ',
            '    // 通常の3D視点',
            '    float adjustedHorizonY = uHorizonY + uCameraPitch * 0.3;',
            '    adjustedHorizonY = clamp(adjustedHorizonY, 0.2, 0.8);',
            '    ',
            '    if (coord.y < adjustedHorizonY) {',
            '        // 空の処理',
            '        float skyY = coord.y / adjustedHorizonY;',
            '        ',
            '        float weatherType = uWeatherType;',
            '        ',
            '        vec3 skyTop, skyMid, skyHorizon;',
            '        ',
            '        if(weatherType < 0.5) {',
            '            skyTop = vec3(0.35, 0.55, 0.95);',
            '            skyMid = vec3(0.5, 0.7, 0.98);',
            '            skyHorizon = vec3(0.75, 0.85, 1.0);',
            '        } else if(weatherType < 1.5) {',
            '            skyTop = vec3(0.0, 0.0, 0.0);',
            '            skyMid = vec3(0.0, 0.0, 0.0);',
            '            skyHorizon = vec3(0.05, 0.05, 0.05);',
            '        } else if(weatherType < 2.5) {',
            '            skyTop = vec3(0.02, 0.02, 0.03);',
            '            skyMid = vec3(0.05, 0.05, 0.06);',
            '            skyHorizon = vec3(0.08, 0.08, 0.1);',
            '        } else if(weatherType < 3.5) {',
            '            skyTop = vec3(0.0, 0.0, 0.0);',
            '            skyMid = vec3(0.0, 0.0, 0.0);',
            '            skyHorizon = vec3(0.02, 0.02, 0.02);',
            '        } else if(weatherType < 4.5) {',
            '            skyTop = vec3(0.6, 0.5, 0.3);',
            '            skyMid = vec3(0.65, 0.55, 0.35);',
            '            skyHorizon = vec3(0.7, 0.6, 0.4);',
            '        } else {',
            '            skyTop = vec3(0.7, 0.72, 0.75);',
            '            skyMid = vec3(0.75, 0.77, 0.8);',
            '            skyHorizon = vec3(0.8, 0.82, 0.85);',
            '        }',
            '        ',
            '        vec3 skyColor;',
            '        if(skyY < 0.5) {',
            '            skyColor = mix(skyHorizon, skyMid, skyY * 2.0);',
            '        } else {',
            '            skyColor = mix(skyMid, skyTop, (skyY - 0.5) * 2.0);',
            '        }',
            '        ',
            '        vec2 cloudUV = vec2(',
            '            coord.x * 2.0 + uCameraAngle * 0.15,',
            '            skyY * 1.5 - uCameraPitch * 0.5',
            '        );',
            '        ',
            '        float clouds = 0.0;',
            '        ',
            '        if(weatherType < 0.5) {',
            '            float farClouds = cloudShape(cloudUV * vec2(1.5, 1.0) + vec2(0.0, 0.5), uTime * 0.0001);',
            '            clouds += farClouds * 0.3 * (0.5 + skyY * 0.5);',
            '            ',
            '            float midClouds = cumulusCloud(cloudUV + vec2(0.5, 0.2), uTime * 0.00015, 0.8);',
            '            clouds += midClouds * 0.5;',
            '            ',
            '            float nearClouds = cumulusCloud(cloudUV * 0.6 + vec2(0.3, 0.0), uTime * 0.0002, 0.5);',
            '            clouds += nearClouds * 0.7;',
            '        } else if(weatherType < 3.5) {',
            '            float heavyClouds = fbm(cloudUV * 2.0 + vec2(uTime * 0.00005, 0.0), 4.0);',
            '            heavyClouds = smoothstep(0.1, 0.6, heavyClouds);',
            '            clouds = clamp(heavyClouds * 1.5, 0.0, 1.0);',
            '        } else {',
            '            clouds = 0.7 + smoothNoise(cloudUV * 3.0) * 0.3;',
            '        }',
            '        ',
            '        vec3 cloudColorBright = vec3(1.0, 1.0, 1.0);',
            '        vec3 cloudColorDark;',
            '        ',
            '        if(weatherType < 0.5) {',
            '            cloudColorDark = vec3(0.85, 0.88, 0.92);',
            '        } else if(weatherType < 3.5) {',
            '            cloudColorDark = vec3(0.0, 0.0, 0.0);',
            '        } else if(weatherType < 4.5) {',
            '            cloudColorDark = vec3(0.6, 0.5, 0.3);',
            '        } else {',
            '            cloudColorDark = vec3(0.75, 0.77, 0.8);',
            '        }',
            '        ',
            '        vec3 cloudColor = mix(cloudColorDark, cloudColorBright, clouds);',
            '        ',
            '        color.rgb = mix(skyColor, cloudColor, min(clouds * 0.85, 0.95));',
            '        color.a = 1.0;',
            '        ',
            '        float horizonGlow = 1.0 + pow(1.0 - skyY, 3.0) * 0.3;',
            '        color.rgb *= horizonGlow;',
            '        ',
            '        if(weatherType > 2.5 && weatherType < 3.5) {',
            '            float lightning = step(0.99, fract(uTime * 0.00003));',
            '            color.rgb += vec3(0.5) * lightning;',
            '        }',
            '    } else {',
            '        // 地面の処理',
            '        float screenY = (coord.y - adjustedHorizonY) / (1.0 - adjustedHorizonY);',
            '        ',
            '        float pitchFactor = 1.0 + uCameraPitch * 2.0;',
            '        float depth = pitchFactor / (screenY + 0.1);',
            '        float screenX = (coord.x - 0.5) * depth * 2.0;',
            '        ',
            '        vec2 forward = vec2(sin(uCameraAngle), -cos(uCameraAngle));',
            '        vec2 right = vec2(cos(uCameraAngle), sin(uCameraAngle));',
            '        ',
            '        vec2 worldOffset = right * screenX + forward * depth;',
            '        vec2 texCoord = (uCameraPos / uWorldSize) + worldOffset * uScale;',
            '        ',
            '        texCoord = fract(texCoord);',
            '        ',
            '        vec2 worldPos = uCameraPos + worldOffset * uScale * uWorldSize;',
            '        worldPos = mod(worldPos, uWorldSize);',
            '        ',
            '        // エフェクトマップのサンプリング',
            '        float waterMask = texture2D(uWaterMask, texCoord).r;',
            '        float heightValue = texture2D(uHeightMap, texCoord).r;',
            '        ',
            '        // テクスチャサンプリング（パララックスなし）',
            '        color = texture2D(uMapTexture, texCoord);',
            '        ',
            '        // 波エフェクト（色の明暗で表現）',
            '        float waveIntensity = calcWaveIntensity(texCoord, uTime);',
            '        color.rgb = applyWaveColor(color.rgb, waterMask, waveIntensity);',
            '        ',
            '        // ハイトマップから動的影を適用',
            '        color.rgb = applyHeightShadow(color.rgb, texCoord, heightValue, uCameraAngle);',
            '        ',
            '        // 大気遠近法を適用',
            '        color.rgb = applyAtmosphericPerspective(color.rgb, heightValue);',
            '        ',
            '        vec4 landmarkColor = drawLandmark(worldPos, depth, screenY);',
            '        if(landmarkColor.a > 0.0) {',
            '            color = mix(color, landmarkColor, landmarkColor.a);',
            '        }',
            '        ',
            '        float fog = 1.0 - screenY * 0.3;',
            '        vec3 fogColor;',
            '        ',
            '        float weatherType = uWeatherType;',
            '        if(weatherType < 0.5) {',
            '            fogColor = vec3(0.75, 0.85, 0.98);',
            '        } else if(weatherType < 1.5) {',
            '            fogColor = vec3(0.0, 0.0, 0.0);',
            '        } else if(weatherType < 2.5) {',
            '            fogColor = vec3(0.02, 0.02, 0.03);',
            '        } else if(weatherType < 3.5) {',
            '            fogColor = vec3(0.0, 0.0, 0.0);',
            '        } else if(weatherType < 4.5) {',
            '            fogColor = vec3(0.7, 0.6, 0.4);',
            '        } else {',
            '            fogColor = vec3(0.8, 0.82, 0.85);',
            '        }',
            '        ',
            '        color.rgb = mix(fogColor, color.rgb, fog);',
            '    }',
            '    ',
            '    gl_FragColor = color;',
            '}'
        ].join('\n');
        
        onInitialize() {
            // リソースを登録
            this.registerResource('image', 'worldMap', AirshipIllusion.params.worldMapImage);

            // 追加マップリソース（オプション）
            if (landmarkParams.enableWaveEffect && landmarkParams.waterMaskImage) {
                this.registerResource('image', 'waterMask', landmarkParams.waterMaskImage);
            }
            if (landmarkParams.enableHeightMap && landmarkParams.heightMapImage) {
                this.registerResource('image', 'heightMap', landmarkParams.heightMapImage);
            }
            if (landmarkParams.enableShadowMap && landmarkParams.shadowMapImage) {
                this.registerResource('image', 'shadowMap', landmarkParams.shadowMapImage);
            }
            
            // レンダリングプロパティ
            this._screenWidth = Graphics.width;
            this._screenHeight = Graphics.height;
            this._horizonY = this._screenHeight * AirshipIllusionFieldShader.FIELD_CONFIG.horizonY;
            
            // カメラプロパティ
            if (typeof $gameAirshipIllusion !== 'undefined' && $gameAirshipIllusion && $gameAirshipIllusion.position) {
                this._cameraX = $gameAirshipIllusion.position.x;
                this._cameraY = $gameAirshipIllusion.position.y;
                this._cameraAngle = $gameAirshipIllusion.angle || 0;
                this._cameraPitch = $gameAirshipIllusion.cameraPitch || $gameAirshipIllusion.pitch || 0;
            } else {
                this._cameraX = 5000;
                this._cameraY = 5000;
                this._cameraAngle = 0;
                this._cameraPitch = 0;
            }
            this._cameraHeight = AirshipIllusionFieldShader.FIELD_CONFIG.cameraHeight;
            
            // スプライト
            this._container = null;
            this._skySprite = null;
            this._filter = null;
            
            // ランドマーク関連
            this._landmarks = [];
            this._landmarkAtlas = null;
            this._needsLandmarkUpdate = false;
            this._currentLandmark = null;
            this._currentLandmarkName = null;
            
            // タイマー
            this._time = 0;
            
            // 天候状態を追加
            this._currentWeatherType = 'clear';
            
            // ランドマーク関連（重複を削除）
            this._landmarkTexture = null;
            
            // 視点モード（0: 通常3D視点, 1: トップダウン視点）
            this._viewMode = 0;
            this._targetViewMode = 0;
            this._viewModeTransition = 0;
        }
        
        onResourcesLoaded() {
            // イベントデータを収集
            this._collectLandmarkEvents();
            
            // 収集後のデータを確認
            if (this._landmarks && this._landmarks.length > 0) {
                this._createLandmarkAtlas();
            }
            this._createSkySprite();
            
            // 飛空艇内部から戻った時のために、ランドマークシェーダーも再初期化
            setTimeout(() => {
                if (this._landmarkShader && this._landmarkAtlas) {
                    this._landmarkShader.setTexture('u_landmarkAtlas', this._landmarkAtlas);
                    this._updateLandmarkUniforms();
                }
            }, 100);
        }
        
        // イベントデータを収集してランドマークとして処理
        _collectLandmarkEvents() {
            this._landmarks = [];
            
            // 現在のマップデータから収集
            if (!$dataMap || !$dataMap.events) {
                console.warn('Landmark: No map data available');
                return;
            }
            
            const worldWidth = AirshipIllusion.params.worldWidth || 10000;
            const worldHeight = AirshipIllusion.params.worldHeight || 10000;
            const mapWidth = $dataMap.width || 100;
            const mapHeight = $dataMap.height || 100;
            
            // マップ上の全イベントをチェック
            $dataMap.events.forEach(eventData => {
                if (!eventData) return;
                
                // メタデータ解析
                const meta = {};
                if (eventData.note) {
                    // 各タグを個別に検索（改行なしでも対応）
                    const airshipMatch = /<airshipVisible:\s*(true|false)>/gi.exec(eventData.note);
                    if (airshipMatch) {
                        meta.airshipVisible = airshipMatch[1];
                    }
                    
                    const nameMatch = /<landmarkName:\s*([^<>]+)>/gi.exec(eventData.note);
                    if (nameMatch) {
                        meta.landmarkName = nameMatch[1].trim();
                    }
                    
                    const typeMatch = /<landmarkType:\s*([^<>]+)>/gi.exec(eventData.note);
                    if (typeMatch) {
                        meta.landmarkType = typeMatch[1].trim();
                    }
                    
                    const importantMatch = /<important:\s*(true|false)>/gi.exec(eventData.note);
                    if (importantMatch) {
                        meta.important = importantMatch[1];
                    }
                }
                
                // 飛空艇から見えるイベントのみ処理
                if (meta.airshipVisible === 'true') {
                    // SkyShaderの座標系でワールド座標を計算
                    const worldX = ((eventData.x + 0.5) / mapWidth) * worldWidth;
                    const worldY = ((eventData.y + 0.5) / mapHeight) * worldHeight;
                    
                    // イベントの最初のページからグラフィック情報を取得
                    let tileId = 0;
                    let characterName = '';
                    let characterIndex = 0;
                    
                    if (eventData.pages && eventData.pages.length > 0) {
                        const page = eventData.pages[0];
                        if (page.image) {
                            tileId = page.image.tileId || 0;
                            characterName = page.image.characterName || '';
                            characterIndex = page.image.characterIndex || 0;
                        }
                    }
                    
                    // ランドマークデータを作成
                    const calculatedScale = (meta.important === 'true' ? 1.5 : 1.0) * landmarkParams.landmarkScale;
                    
                    const landmark = {
                        id: eventData.id,
                        name: eventData.name || 'Event' + eventData.id,
                        x: eventData.x,
                        y: eventData.y,
                        worldX: worldX,
                        worldY: worldY,
                        tileId: tileId,
                        characterName: characterName,
                        characterIndex: characterIndex,
                        scale: calculatedScale,
                        type: meta.landmarkType || 'default',
                        displayName: meta.landmarkName || eventData.name || '',
                        meta: meta
                    };
                    
                    this._landmarks.push(landmark);
                }
            });
            
            // ミニマップにアイコンを追加
            this._addLandmarksToMinimap();
            
            // グローバル変数に保存（ウィンドウ表示用）
            if (typeof $gameAirshipIllusion !== 'undefined' && $gameAirshipIllusion) {
                if (this._landmarks && this._landmarks.length > 0) {
                    $gameAirshipIllusion.landmarkEvents = this._landmarks;
                    $gameAirshipIllusion.originalDataMap = $dataMap;
                    if ($gameMap && $gameMap.tileset) {
                        $gameAirshipIllusion.originalTileset = $gameMap.tileset();
                    }
                    $gameAirshipIllusion.originalTilesetId = $dataMap ? $dataMap.tilesetId : 0;
                    $gameAirshipIllusion.originalDataTilesets = $dataTilesets;
                    
                    if (SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_AirshipIllusion') {
                        $gameAirshipIllusion.isActive = true;
                    }
                }
            }
        }
        
        // ミニマップにランドマークアイコンを追加
        _addLandmarksToMinimap() {
            // ミニマップアイコン表示が無効の場合は何もしない
            if (!landmarkParams.showMinimapIcons) {
                return;
            }
            
            if (!AirshipIllusion || !AirshipIllusion.eventBus) {
                console.warn('LandmarkIcon: EventBus not available for minimap icons');
                return;
            }
            
            // 再試行カウンターを追加
            if (!this._minimapRetryCount) {
                this._minimapRetryCount = 0;
            }
            
            // UIモジュールが準備できているか確認
            if (!AirshipIllusion.instances || !AirshipIllusion.instances.ui || !AirshipIllusion.instances.ui._isActive) {
                this._minimapRetryCount++;
                
                // 最大50回（5秒）まで再試行
                if (this._minimapRetryCount > 50) {
                    console.warn('LandmarkIcon: UI module not ready after 5 seconds, giving up');
                    this._minimapRetryCount = 0;
                    return;
                }
                
                // 100ms後に再試行
                setTimeout(this._addLandmarksToMinimap.bind(this), 100);
                return;
            }
            
            // リセットカウンター
            this._minimapRetryCount = 0;
            
            this._landmarks.forEach(landmark => {
                // アイコンデータを作成
                const iconData = {
                    id: 'landmark_' + landmark.id,
                    worldX: landmark.worldX,
                    worldY: landmark.worldY,
                    name: landmark.displayName || landmark.name
                };
                
                // landmarkIconメタデータがある場合はそれを使用
                if (landmark.landmarkIcon) {
                    iconData.iconIndex = parseInt(landmark.landmarkIcon);
                } else {
                    // landmarkTypeからアイコンを決定
                    const type = landmark.landmarkType || 'default';
                    iconData.iconIndex = landmarkParams.iconTypes[type] || landmarkParams.iconTypes.default;
                }
                
                // ミニマップにアイコン追加イベントを発火
                AirshipIllusion.eventBus.emit('addMinimapIcon', iconData);
            });
        }
        
        // ランドマークアトラステクスチャの作成（非同期版）
        async _createLandmarkAtlas() {
            const atlasSize = 512; // アトラスのサイズ
            const tileSize = 48; // 各タイルのサイズ
            const tilesPerRow = Math.floor(atlasSize / tileSize);
            
            // アトラス用ビットマップ作成（既存のものがあれば再利用）
            if (!this._landmarkAtlas) {
                this._landmarkAtlas = new Bitmap(atlasSize, atlasSize);
            }
            
            // 描画済みランドマークを追跡
            if (!this._drawnLandmarks) {
                this._drawnLandmarks = {};
            }
            
            // バッチ処理用の配列
            const drawTasks = [];
            
            // 各ランドマークのグラフィックを描画タスクとして準備
            this._landmarks.forEach((landmark, index) => {
                if (index >= landmarkParams.maxLandmarks) return;
                
                const row = Math.floor(index / tilesPerRow);
                const col = index % tilesPerRow;
                const x = col * tileSize;
                const y = row * tileSize;
                
                // UV座標を保存
                landmark.uvBounds = {
                    x1: x / atlasSize,
                    y1: y / atlasSize,
                    x2: (x + tileSize) / atlasSize,
                    y2: (y + tileSize) / atlasSize
                };
                
                // 描画タスクを追加
                drawTasks.push({ landmark, x, y, tileSize });
            });
            
            // 非同期でバッチ処理
            await this._processAtlasDrawTasks(drawTasks);
            
            // ビットマップの更新を通知
            if (this._landmarkAtlas._baseTexture) {
                this._landmarkAtlas._baseTexture.update();
            }
        }
        
        // アトラス描画タスクを非同期で処理
        async _processAtlasDrawTasks(tasks) {
            const batchSize = 5; // 一度に処理するタスク数
            
            for (let i = 0; i < tasks.length; i += batchSize) {
                const batch = tasks.slice(i, i + batchSize);
                
                // バッチを処理
                await new Promise(resolve => {
                    requestAnimationFrame(() => {
                        batch.forEach(task => {
                            // グラフィック描画
                            if (task.landmark.tileId > 0) {
                                // タイルグラフィックの場合
                                this._drawTileToAtlas(task.landmark.tileId, task.x, task.y, task.tileSize);
                            } else if (task.landmark.characterName) {
                                // キャラクターグラフィックの場合
                                this._drawCharacterToAtlas(task.landmark.characterName, task.landmark.characterIndex, task.x, task.y, task.tileSize);
                            } else {
                                // デフォルトグラフィック（円）
                                this._drawDefaultLandmark(task.x, task.y, task.tileSize);
                            }
                        });
                        resolve();
                    });
                });
            }
        }
        
        // タイルをアトラスに描画
        _drawTileToAtlas(tileId, x, y, size) {
            const tileset = $gameMap.tileset();
            if (!tileset) return;
            
            const tilesetNames = tileset.tilesetNames;
            const setNumber = 5 + Math.floor(tileId / 256);
            const tilesetName = tilesetNames[setNumber];
            
            if (tilesetName) {
                const bitmap = ImageManager.loadTileset(tilesetName);
                bitmap.addLoadListener(() => {
                    const sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * 48;
                    const sy = (Math.floor(tileId % 256 / 8) % 16) * 48;
                    this._landmarkAtlas.blt(bitmap, sx, sy, 48, 48, x, y, size, size);
                });
            }
        }
        
        // キャラクターをアトラスに描画
        _drawCharacterToAtlas(characterName, characterIndex, x, y, size) {
            const bitmap = ImageManager.loadCharacter(characterName);
            bitmap.addLoadListener(() => {
                const big = ImageManager.isBigCharacter(characterName);
                const pw = bitmap.width / (big ? 3 : 12);
                const ph = bitmap.height / (big ? 4 : 8);
                const n = big ? 0 : characterIndex;
                const sx = ((n % 4) * 3 + 1) * pw;
                const sy = Math.floor(n / 4) * 4 * ph;
                this._landmarkAtlas.blt(bitmap, sx, sy, pw, ph, x, y, size, size);
            });
        }
        
        // デフォルトランドマーク描画（完全に透明にする）
        _drawDefaultLandmark(x, y, size) {
            // 何も描画しない（完全に透明）
            // イベントグラフィックがない場合は表示しない
        }
        
        // スカイスプライトの作成
        _createSkySprite() {
            // 既存のスプライトがある場合は削除
            if (this._container && this._container.parent) {
                this._container.parent.removeChild(this._container);
            }
            
            // コンテナ作成
            this._container = new PIXI.Container();
            this._container.z = 1;
            
            // スカイスプライト作成
            this._skySprite = new Sprite();
            this._skySprite.bitmap = new Bitmap(this._screenWidth, this._screenHeight);
            
            // シェーダー作成（MZではWebGL判定方法が変更）
            if (Graphics.app && Graphics.app.renderer) {
                this._createShader();
            }
            
            this._container.addChild(this._skySprite);
            
            // シーンに追加
            if (SceneManager._scene) {
                SceneManager._scene.addChild(this._container);
            }
        }
        
        // シェーダー作成
        _createShader() {
            const vertexShader = AirshipIllusionFieldShader.VERTEX_SHADER;
            const fragmentShader = AirshipIllusionFieldShader.FRAGMENT_SHADER;
            
            this._filter = new PIXI.Filter(vertexShader, fragmentShader);
            
            // uniformsを設定
            const config = AirshipIllusionFieldShader.FIELD_CONFIG;
            this._filter.uniforms.uHorizonY = config.horizonY;
            this._filter.uniforms.uCameraHeight = config.cameraHeight;
            this._filter.uniforms.uFieldOfView = config.fieldOfView;
            this._filter.uniforms.uScale = config.scale;
            this._filter.uniforms.uWorldSize = [AirshipIllusion.params.worldWidth, AirshipIllusion.params.worldHeight];
            this._filter.uniforms.uMapSize = [$dataMap ? $dataMap.width : 100, $dataMap ? $dataMap.height : 100];
            this._filter.uniforms.uViewMode = 0; // 初期値は3Dビュー
            
            // テクスチャ設定
            const worldMap = this.getResource('worldMap');
            if (worldMap) {
                // Bitmapが準備できていない場合は待つ
                if (!worldMap.isReady()) {
                    worldMap.addLoadListener(() => {
                        if (worldMap._canvas) {
                            this._filter.uniforms.uMapTexture = PIXI.Texture.from(worldMap._canvas);
                        } else if (worldMap._image) {
                            this._filter.uniforms.uMapTexture = PIXI.Texture.from(worldMap._image);
                        }
                    });
                } else if (worldMap._canvas) {
                    // CanvasからPIXI.Textureを作成
                    this._filter.uniforms.uMapTexture = PIXI.Texture.from(worldMap._canvas);
                } else if (worldMap._image) {
                    // ImageからPIXI.Textureを作成
                    this._filter.uniforms.uMapTexture = PIXI.Texture.from(worldMap._image);
                }
            }
            
            // ランドマークテクスチャ設定
            if (this._landmarkAtlas && this._landmarkAtlas._canvas) {
                // CanvasからPIXI.Textureを作成
                this._filter.uniforms.uLandmarkTexture = PIXI.Texture.from(this._landmarkAtlas._canvas);
            }

            // エフェクトマップテクスチャ設定
            const waterMask = this.getResource('waterMask');
            const heightMap = this.getResource('heightMap');

            // 水マスク
            if (waterMask && waterMask.isReady()) {
                const source = waterMask._canvas || waterMask._image;
                if (source) {
                    this._filter.uniforms.uWaterMask = PIXI.Texture.from(source);
                }
            } else {
                // デフォルトは黒（陸地）
                this._filter.uniforms.uWaterMask = PIXI.Texture.EMPTY;
            }

            // ハイトマップ
            if (heightMap && heightMap.isReady()) {
                const source = heightMap._canvas || heightMap._image;
                if (source) {
                    this._filter.uniforms.uHeightMap = PIXI.Texture.from(source);
                }
            } else {
                // デフォルトは中間の高さ（グレー）
                this._filter.uniforms.uHeightMap = PIXI.Texture.EMPTY;
            }

            // エフェクトパラメータ設定
            this._filter.uniforms.uEnableWaveEffect = landmarkParams.enableWaveEffect ? 1.0 : 0.0;
            this._filter.uniforms.uWaveAmplitude = landmarkParams.waveAmplitude;
            this._filter.uniforms.uWaveSpeed = landmarkParams.waveSpeed;
            this._filter.uniforms.uWaveFrequency = landmarkParams.waveFrequency;
            this._filter.uniforms.uEnableHeightMap = landmarkParams.enableHeightMap ? 1.0 : 0.0;
            this._filter.uniforms.uHeightMapStrength = landmarkParams.heightMapStrength;

            // ハイトマップからの動的影生成パラメータ
            this._filter.uniforms.uEnableHeightShadow = landmarkParams.enableHeightShadow ? 1.0 : 0.0;
            this._filter.uniforms.uHeightShadowStrength = landmarkParams.heightShadowStrength;

            // 光源の方向（度数からラジアンに変換してベクトル化）
            const lightAngle = landmarkParams.lightDirection * Math.PI / 180;
            this._filter.uniforms.uLightDirection = [Math.sin(lightAngle), -Math.cos(lightAngle)];

            // フィルタ適用
            this._skySprite.filters = [this._filter];
            
            // 初期uniform更新
            this._updateUniforms();
        }
        
        // uniform更新
        _updateUniforms() {
            if (!this._filter) return;
            
            // 視点モードのトランジション計算
            let currentViewMode = this._viewMode;
            if (this._viewModeTransition > 0) {
                const t = this._viewModeTransition;
                currentViewMode = this._viewMode * (1 - t) + this._targetViewMode * t;
            }
            
            this._filter.uniforms.uCameraPos = [this._cameraX, this._cameraY];
            this._filter.uniforms.uCameraAngle = this._cameraAngle;
            this._filter.uniforms.uCameraPitch = this._cameraPitch;
            this._filter.uniforms.uTime = this._time;
            this._filter.uniforms.uWeatherType = this._getWeatherTypeValue();
            this._filter.uniforms.uViewMode = currentViewMode;
            
            // ランドマークuniforms更新
            this._updateLandmarkUniforms();
        }
        
        // ランドマークuniforms更新
        _updateLandmarkUniforms() {
            if (!this._filter || !this._landmarks) return;
            
            const landmarkData = [];
            const landmarkUV = [];
            
            this._landmarks.forEach((landmark, index) => {
                if (index >= landmarkParams.maxLandmarks) return;
                
                // ランドマーク位置とスケール
                landmarkData.push([
                    landmark.worldX,
                    landmark.worldY,
                    landmark.scale,
                    0 // 予備
                ]);
                
                // UV座標
                if (landmark.uvBounds) {
                    landmarkUV.push([
                        landmark.uvBounds.x1,
                        landmark.uvBounds.y1,
                        landmark.uvBounds.x2,
                        landmark.uvBounds.y2
                    ]);
                } else {
                    landmarkUV.push([0, 0, 1, 1]);
                }
            });
            
            // 残りを埋める
            for (let i = this._landmarks.length; i < landmarkParams.maxLandmarks; i++) {
                landmarkData.push([0, 0, 0, 0]);
                landmarkUV.push([0, 0, 0, 0]);
            }
            
            this._filter.uniforms.uLandmarkCount = Math.min(this._landmarks.length, landmarkParams.maxLandmarks);
            this._filter.uniforms.uLandmarkData = landmarkData.flat();
            this._filter.uniforms.uLandmarkUV = landmarkUV.flat();
        }
        
        // 天候タイプ値取得
        _getWeatherTypeValue() {
            const typeMap = {
                'clear': 0,
                'rain': 1,
                'snow': 2,
                'storm': 3,
                'sandstorm': 4,
                'fog': 5,
                'cloudy': 6  // 曇り専用
            };
            return typeMap[this._currentWeatherType] || 0;
        }
        
        onActivate() {
            // イベントリスナー登録
            AirshipIllusion.eventBus.on('positionChanged', this._onPositionChanged, this);
            AirshipIllusion.eventBus.on('angleChanged', this._onAngleChanged, this);
            AirshipIllusion.eventBus.on('cameraPitchChanged', this._onCameraPitchChanged, this);
            AirshipIllusion.eventBus.on('weatherChanged', this._onWeatherChanged, this);
        }
        
        onDeactivate() {
            // イベントリスナー削除
            AirshipIllusion.eventBus.off('positionChanged', this._onPositionChanged, this);
            AirshipIllusion.eventBus.off('angleChanged', this._onAngleChanged, this);
            AirshipIllusion.eventBus.off('cameraPitchChanged', this._onCameraPitchChanged, this);
            AirshipIllusion.eventBus.off('weatherChanged', this._onWeatherChanged, this);
        }
        
        _onPositionChanged(data) {
            this._cameraX = data.x;
            this._cameraY = data.y;
            this._checkNearbyLandmarks();
        }
        
        _onAngleChanged(data) {
            this._cameraAngle = data.angle;
        }
        
        _onCameraPitchChanged(data) {
            this._cameraPitch = data.pitch;
        }
        
        _onWeatherChanged(data) {
            this._currentWeatherType = data.type;
        }
        
        // 近くのランドマークをチェック
        _checkNearbyLandmarks() {
            let nearestLandmark = null;
            let nearestDistance = Infinity;
            const maxDisplayDistance = landmarkParams.landmarkNameDisplayDistance;

            this._landmarks.forEach(landmark => {
                if (landmark.displayName) {
                    const dx = landmark.worldX - this._cameraX;
                    const dy = landmark.worldY - this._cameraY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // 表示範囲内で最も近いランドマークを探す
                    if (distance < maxDisplayDistance && distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestLandmark = landmark;
                    }
                }
            });

            // 近いランドマークがあれば名前を表示
            if (nearestLandmark) {
                let displayName = nearestLandmark.displayName;

                // 訪問済み判定連携が有効な場合
                if (landmarkParams.enableVisitedTracking) {
                    const isVisited = this._checkLandmarkVisited(nearestLandmark);
                    if (!isVisited) {
                        displayName = landmarkParams.unvisitedDisplayName;
                    }
                }

                if (displayName !== this._currentLandmarkName) {
                    this._currentLandmarkName = displayName;
                    AirshipIllusion.eventBus.emit('landmarkNameChanged', {
                        name: this._currentLandmarkName,
                        position: landmarkParams.landmarkNamePosition
                    });
                }
            } else if (!nearestLandmark && this._currentLandmarkName) {
                // ランドマークがない場合は名前を消す
                this._currentLandmarkName = null;
                AirshipIllusion.eventBus.emit('landmarkNameChanged', {
                    name: null,
                    position: landmarkParams.landmarkNamePosition
                });
            }
        }

        // ランドマークが訪問済みかチェック
        _checkLandmarkVisited(landmark) {
            // VisitedPlaceTrackerが利用可能かチェック
            if (!$gameSystem || typeof $gameSystem.getVisitedPlaces !== 'function') {
                // VisitedPlaceTrackerがない場合は常に表示
                return true;
            }

            const visitedPlaces = $gameSystem.getVisitedPlaces();

            // ランドマークのマップ座標をチェック
            return visitedPlaces.some(place => {
                // ワールド座標で比較する方法（より正確）
                if (place.worldX !== undefined && place.worldY !== undefined) {
                    const dx = Math.abs(place.worldX - landmark.worldX);
                    const dy = Math.abs(place.worldY - landmark.worldY);
                    // ワールド座標での許容範囲（200ユニット以内）
                    return dx <= 200 && dy <= 200;
                }

                // フィールド座標で比較する方法（VisitedPlaceTrackerが記録したfieldX/fieldY）
                if (place.fieldX !== undefined && place.fieldY !== undefined) {
                    const landmarkMapX = landmark.x;
                    const landmarkMapY = landmark.y;

                    // 許容範囲内（±3タイル）で一致するか確認
                    const dx = Math.abs(place.fieldX - landmarkMapX);
                    const dy = Math.abs(place.fieldY - landmarkMapY);
                    return dx <= 3 && dy <= 3;
                }

                return false;
            });
        }
        
        onUpdate() {
            this._time += 1;
            
            // キー入力チェック（Uキーで視点切り替え）
            if (Input.isTriggered('viewToggle')) {
                this._toggleViewMode();
            }
            
            // 視点モードのトランジション更新
            if (this._viewMode !== this._targetViewMode) {
                this._viewModeTransition += 0.1;
                if (this._viewModeTransition >= 1.0) {
                    this._viewModeTransition = 1.0;
                    this._viewMode = this._targetViewMode;
                }
            } else {
                this._viewModeTransition = 0;
            }
            
            this._updateUniforms();
        }
        
        _toggleViewMode() {
            // 視点モードを切り替え
            this._targetViewMode = 1 - this._viewMode;
            this._viewModeTransition = 0;
            
            // SE再生（任意）
            SoundManager.playCursor();
            
            // イベント発火（UIに通知）
            const modeName = this._targetViewMode === 0 ? '3Dビュー' : '広域ビュー';
            AirshipIllusion.eventBus.emit('viewModeChanged', { 
                mode: this._targetViewMode,
                name: modeName
            });
        }
        
        onDispose() {
            if (this._container && this._container.parent) {
                this._container.parent.removeChild(this._container);
            }
            
            if (this._landmarkAtlas) {
                this._landmarkAtlas.destroy();
            }
        }
    }
    
    // シェーダーキャッシュ
    AirshipIllusionFieldShader._cachedProgram = null;
    AirshipIllusionFieldShader._cachedShaders = null;

    // シェーダープリコンパイル機能
    AirshipIllusionFieldShader.precompileShaders = function() {
        // MZではGraphics._rendererがPIXI.Rendererインスタンス
        if (!Graphics._renderer || Graphics._renderer.type !== PIXI.RENDERER_TYPE.WEBGL) return;

        const gl = Graphics._renderer.gl;
        if (!gl) return;

        try {
            // 頂点シェーダーをコンパイル
            const vertShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertShader, this.VERTEX_SHADER);
            gl.compileShader(vertShader);

            if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
                console.warn('Failed to compile FieldShader vertex shader:', gl.getShaderInfoLog(vertShader));
                return;
            }

            // フラグメントシェーダーをコンパイル
            const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragShader, this.FRAGMENT_SHADER);
            gl.compileShader(fragShader);

            if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
                console.warn('Failed to compile FieldShader fragment shader:', gl.getShaderInfoLog(fragShader));
                return;
            }

            // シェーダープログラムを作成してリンク
            const program = gl.createProgram();
            gl.attachShader(program, vertShader);
            gl.attachShader(program, fragShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.warn('Failed to link FieldShader program:', gl.getProgramInfoLog(program));
                return;
            }

            // キャッシュに保存
            this._cachedShaders = {
                vertex: vertShader,
                fragment: fragShader
            };
            this._cachedProgram = program;

            console.log('FieldShader precompiled successfully');

        } catch (e) {
            console.warn('Error precompiling FieldShader:', e);
        }
    };

    // ゲーム起動時に自動的にプリコンパイル
    const _Scene_Boot_start_Field = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start_Field.call(this);
        // グラフィックスが初期化された後でプリコンパイル
        if (Graphics._renderer && Graphics._renderer.type === PIXI.RENDERER_TYPE.WEBGL) {
            setTimeout(() => {
                AirshipIllusionFieldShader.precompileShaders();
            }, 50);  // WeatherShaderより早めに実行
        }
    };

    // エクスポート
    window.AirshipIllusionFieldShader = AirshipIllusionFieldShader;

})();