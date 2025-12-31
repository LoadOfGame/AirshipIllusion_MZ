//=============================================================================
// VisitedPlaceTracker_MZ.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Visited Place Tracker System v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 *
 * @param trackOnMapEnter
 * @text Track on Map Enter
 * @desc Auto-record when entering a map (requires placeName tag in map note)
 * @type boolean
 * @default true
 *
 * @param fieldMapId
 * @text Field Map ID
 * @desc ID of the field map (for recording origin coordinates)
 * @type number
 * @min 1
 * @default 1
 *
 * @param townIcon
 * @text Town Icon
 * @desc Map marker icon number for towns/villages
 * @type number
 * @min 0
 * @max 9999
 * @default 176
 *
 * @param castleIcon
 * @text Castle Icon
 * @desc Map marker icon number for castles
 * @type number
 * @min 0
 * @max 9999
 * @default 177
 *
 * @param dungeonIcon
 * @text Dungeon Icon
 * @desc Map marker icon number for dungeons/caves
 * @type number
 * @min 0
 * @max 9999
 * @default 191
 *
 * @param forestIcon
 * @text Forest Icon
 * @desc Map marker icon number for forests
 * @type number
 * @min 0
 * @max 9999
 * @default 192
 *
 * @param defaultIcon
 * @text Default Icon
 * @desc Icon number for places without a specified type
 * @type number
 * @min 0
 * @max 9999
 * @default 190
 *
 * @help
 * ============================================================================
 * Visited Place Tracker System
 * ============================================================================
 *
 * This plugin automatically records places the player has visited.
 * When transferring from the field map to another map, it records the
 * origin coordinates.
 *
 * ■ Recording Conditions
 * 1. Map note field must have a place name tag
 *    <placeName: PlaceName>
 *
 * 2. No exclusion tag present
 *    <noTrack: true> prevents recording
 *
 * 3. Only auto-records when transferring from field map
 *    - Records origin coordinates as fieldX, fieldY
 *
 * ■ Map Note Tags
 * <placeName: Name>       - Display name of the place (required)
 * <placeType: Type>       - Place type (town/castle/dungeon etc.)
 * <placeIcon: Number>     - Icon number
 * <placeDesc: Description>- Place description (use \n for line breaks)
 * <worldX: X coordinate>  - X coordinate on world map
 * <worldY: Y coordinate>  - Y coordinate on world map
 * <noTrack: true>         - Do not record this place
 *
 * ■ Script Commands
 * $gameSystem.getVisitedPlaces()     - Get visited places list
 * $gameSystem.isPlaceVisited(mapId, eventId) - Check if place is visited
 * $gameSystem.clearVisitedPlaces()   - Clear visited list
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
 */

/*:ja
 * @target MZ
 * @plugindesc 訪問済み場所記録システム v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 *
 * @param trackOnMapEnter
 * @text マップ侵入時に記録
 * @desc マップに入った時に自動記録（マップのメモ欄にplaceNameタグが必要）
 * @type boolean
 * @default true
 *
 * @param fieldMapId
 * @text フィールドマップID
 * @desc フィールドマップのID（移動元座標を記録するため）
 * @type number
 * @min 1
 * @default 1
 *
 * @param townIcon
 * @text 町アイコン
 * @desc 町・村のマップマーカーアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 176
 *
 * @param castleIcon
 * @text 城アイコン
 * @desc 城のマップマーカーアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 177
 *
 * @param dungeonIcon
 * @text ダンジョンアイコン
 * @desc ダンジョン・洞窟のマップマーカーアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 191
 *
 * @param forestIcon
 * @text 森アイコン
 * @desc 森・林のマップマーカーアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 192
 *
 * @param defaultIcon
 * @text デフォルトアイコン
 * @desc タイプが指定されていない場所のアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 190
 *
 * @help
 * ============================================================================
 * 訪問済み場所記録システム
 * ============================================================================
 *
 * このプラグインは、プレイヤーが訪問した場所を自動的に記録します。
 * フィールドマップから他のマップへ移動した際に、移動元の座標を記録します。
 *
 * ■ 記録される条件
 * 1. マップのメモ欄に場所名タグがある
 *    <placeName: 場所名>
 *
 * 2. 記録除外タグがない
 *    <noTrack: true> があると記録されません
 *
 * 3. フィールドマップから移動した場合のみ自動記録
 *    - 移動元の座標を fieldX, fieldY として記録
 *
 * ■ マップのメモ欄タグ
 * <placeName: 名前>       - 場所の表示名（必須）
 * <placeType: タイプ>     - 場所のタイプ（town/castle/dungeon等）
 * <placeIcon: 番号>       - アイコン番号
 * <placeDesc: 説明>       - 場所の説明文（改行は\nを使用）
 * <worldX: X座標>         - ワールドマップ上のX座標
 * <worldY: Y座標>         - ワールドマップ上のY座標
 * <noTrack: true>         - この場所を記録しない
 *
 * ■ スクリプトコマンド
 * $gameSystem.getVisitedPlaces()     - 訪問済み場所リストを取得
 * $gameSystem.isPlaceVisited(mapId, eventId) - 特定の場所が訪問済みか
 * $gameSystem.clearVisitedPlaces()   - 訪問済みリストをクリア
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
 */

(() => {
    'use strict';
    
    // プラグインパラメータ
    const pluginName = 'VisitedPlaceTracker_MZ';
    const parameters = PluginManager.parameters(pluginName);
    const trackOnMapEnter = parameters['trackOnMapEnter'] !== 'false';
    const fieldMapId = Number(parameters['fieldMapId'] || 1);
    
    // アイコン設定
    const placeIcons = {
        town: Number(parameters['townIcon'] || 176),
        castle: Number(parameters['castleIcon'] || 177),
        dungeon: Number(parameters['dungeonIcon'] || 191),
        forest: Number(parameters['forestIcon'] || 192),
        default: Number(parameters['defaultIcon'] || 190)
    };
    
    // 移動元の座標を記録する変数
    let lastFieldPosition = null;
    
    //=============================================================================
    // アイコン設定を外部から取得できるようにする
    //=============================================================================
    
    window.VisitedPlaceTracker = window.VisitedPlaceTracker || {};
    window.VisitedPlaceTracker.getIconForPlace = function(place) {
        if (!place) return placeIcons.default;
        
        // カスタムアイコンが設定されている場合
        if (place.icon) return place.icon;
        
        // タイプ別のアイコンを返す
        return placeIcons[place.type] || placeIcons.default;
    };
    
    //=============================================================================
    // Game_System - 訪問済み場所の管理
    //=============================================================================
    
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._visitedPlaces = [];
    };
    
    // 訪問済み場所を追加
    Game_System.prototype.addVisitedPlace = function(placeData) {
        if (!this._visitedPlaces) {
            this._visitedPlaces = [];
        }
        
        // 既に訪問済みかチェック（マップIDベース）
        const existingIndex = this._visitedPlaces.findIndex(place => {
            return place.mapId === placeData.mapId;
        });
        
        if (existingIndex >= 0) {
            // 既存のデータを更新（座標が更新される可能性があるため）
            this._visitedPlaces[existingIndex] = placeData;
        } else {
            // 新規追加
            this._visitedPlaces.push(placeData);
        }
        
        // カスタムイベントを発火（他のプラグインが利用可能）
        if (window.AirshipIllusion && AirshipIllusion.eventBus) {
            AirshipIllusion.eventBus.emit('placeVisited', placeData);
        }
    };
    
    // 訪問済み場所リストを取得
    Game_System.prototype.getVisitedPlaces = function() {
        if (!this._visitedPlaces) {
            this._visitedPlaces = [];
        }
        return this._visitedPlaces;
    };
    
    // 特定の場所が訪問済みかチェック
    Game_System.prototype.isPlaceVisited = function(mapId, eventId) {
        if (!this._visitedPlaces) return false;
        
        return this._visitedPlaces.some(place => {
            return place.mapId === mapId && place.eventId === eventId;
        });
    };
    
    // 訪問済みリストをクリア
    Game_System.prototype.clearVisitedPlaces = function() {
        this._visitedPlaces = [];
    };
    
    //=============================================================================
    // Game_Player - フィールドマップからの移動を追跡
    //=============================================================================
    
    const _Game_Player_reserveTransfer = Game_Player.prototype.reserveTransfer;
    Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
        // フィールドマップから移動する場合、現在座標を記録
        if ($gameMap && $gameMap.mapId() === fieldMapId) {
            lastFieldPosition = {
                x: this.x,
                y: this.y,
                mapId: $gameMap.mapId()
            };
        }
        
        _Game_Player_reserveTransfer.call(this, mapId, x, y, d, fadeType);
    };
    
    //=============================================================================
    // Scene_Map - マップ侵入時の自動記録
    //=============================================================================
    
    if (trackOnMapEnter) {
        const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
        Scene_Map.prototype.onMapLoaded = function() {
            _Scene_Map_onMapLoaded.call(this);
            
            // フィールドマップから移動してきた場合のみ処理
            if (!lastFieldPosition || lastFieldPosition.mapId !== fieldMapId) {
                return;
            }
            
            // マップのメモ欄をチェック
            if ($dataMap && $dataMap.meta) {
                // 記録除外タグがある場合はスキップ
                if ($dataMap.meta.noTrack === 'true') {
                    lastFieldPosition = null;
                    return;
                }
                
                // 場所名がある場合は記録
                if ($dataMap.meta.placeName) {
                    const placeType = $dataMap.meta.placeType || 'town';
                    const placeData = {
                        mapId: $gameMap.mapId(),
                        name: $dataMap.meta.placeName,
                        type: placeType,
                        // カスタムアイコンが指定されていればそれを使用、なければタイプ別のアイコンを使用
                        icon: $dataMap.meta.placeIcon ? Number($dataMap.meta.placeIcon) : 
                              (placeIcons[placeType] || placeIcons.default),
                        // 説明文（\nを改行に変換）
                        description: $dataMap.meta.placeDesc ? 
                                    $dataMap.meta.placeDesc.replace(/\\n/g, '\n') : ''
                    };
                    
                    // フィールドマップから来た場合は移動元座標を記録
                    placeData.fieldX = lastFieldPosition.x;
                    placeData.fieldY = lastFieldPosition.y;
                    
                               
                    // マップのメモ欄に座標が指定されている場合（優先）
                    if ($dataMap.meta.worldX && $dataMap.meta.worldY) {
                        placeData.worldX = Number($dataMap.meta.worldX);
                        placeData.worldY = Number($dataMap.meta.worldY);
                    }
                    // AirshipIllusionが有効な場合はワールド座標に変換
                    else if (window.AirshipIllusion && AirshipIllusion.params) {
                        const worldWidth = AirshipIllusion.params.worldWidth || 10000;
                        const worldHeight = AirshipIllusion.params.worldHeight || 10000;
                        const mapWidth = AirshipIllusion.params.mapWidth || 100;
                        const mapHeight = AirshipIllusion.params.mapHeight || 100;
                        
                        // フィールドマップ座標をワールド座標に変換
                        placeData.worldX = (lastFieldPosition.x / mapWidth) * worldWidth;
                        placeData.worldY = (lastFieldPosition.y / mapHeight) * worldHeight;
                    }
                    
                    $gameSystem.addVisitedPlace(placeData);
                    
                    // 移動元座標をクリア
                    lastFieldPosition = null;
                }
            }
        };
    }
    
    //=============================================================================
    // DataManager - セーブデータの互換性
    //=============================================================================
    
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        
        // 古いセーブデータとの互換性
        if ($gameSystem && !$gameSystem._visitedPlaces) {
            $gameSystem._visitedPlaces = [];
        }
    };
    
})();