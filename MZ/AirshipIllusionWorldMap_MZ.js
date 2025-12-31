//=============================================================================
// AirshipIllusionWorldMap_MZ.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Airship Illusion - World Map Module v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 *
 * @param markerIcon
 * @text Marker Icon
 * @desc Icon number to display at selected location
 * @type number
 * @min 0
 * @max 9999
 * @default 190
 *
 * @param visitedIcon
 * @text Visited Icon
 * @desc Icon number for visited places in the list
 * @type number
 * @min 0
 * @max 9999
 * @default 191
 *
 * @param travelConfirmMessage
 * @text Travel Confirm Message
 * @desc Message displayed when confirming travel. Use %1 for place name.
 * @type string
 * @default Travel to %1?
 *
 * @param confirmYes
 * @text Confirm Yes Text
 * @desc Text for the "Yes" option in the confirm dialog.
 * @type string
 * @default Yes
 *
 * @param confirmNo
 * @text Confirm No Text
 * @desc Text for the "No" option in the confirm dialog.
 * @type string
 * @default No
 *
 * @param enableAutoFlight
 * @text Enable Auto Flight
 * @desc Enable/disable the auto flight feature from the world map.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @help
 * This module provides world map functionality for the Airship Illusion system.
 *
 * ■ Required Plugins
 * - VisitedPlaceTracker_MZ.js (Visited place management)
 * - AirshipIllusionCore_MZ.js (Airship core system)
 *
 * ■ Features
 * - Display a large world map in the center of the screen
 * - Show a list of visited places on the left side
 * - Selecting a place from the list displays a marker on the map
 * - Open/close the map with key controls
 *
 * ■ Usage
 * - Press M key during airship scene to open the world map
 * - Visited places are automatically recorded by the VisitedPlaceTracker plugin
 *
 * v1.0.0 - Initial release
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
 * @plugindesc 飛空艇イリュージョン - ワールドマップモジュール v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 *
 * @param markerIcon
 * @text マーカーアイコン
 * @desc 選択した場所に表示するアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 190
 *
 * @param visitedIcon
 * @text 訪問済みアイコン
 * @desc 訪問済み場所のリストアイコン番号
 * @type number
 * @min 0
 * @max 9999
 * @default 191
 *
 * @param travelConfirmMessage
 * @text 移動確認メッセージ
 * @desc 移動確認時に表示するメッセージ。%1が場所名に置換されます。
 * @type string
 * @default %1へ移動しますか？
 *
 * @param confirmYes
 * @text 「はい」テキスト
 * @desc 確認ダイアログの「はい」選択肢のテキスト。
 * @type string
 * @default はい
 *
 * @param confirmNo
 * @text 「いいえ」テキスト
 * @desc 確認ダイアログの「いいえ」選択肢のテキスト。
 * @type string
 * @default いいえ
 *
 * @param enableAutoFlight
 * @text オートフライト有効
 * @desc ワールドマップからのオートフライト機能の有効/無効を設定します。
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 *
 * @help
 * このモジュールは飛空艇イリュージョンシステムのワールドマップ機能を提供します。
 *
 * ■ 必要プラグイン
 * - VisitedPlaceTracker_MZ.js (訪問済み場所の管理)
 * - AirshipIllusionCore_MZ.js (飛空艇コアシステム)
 *
 * ■ 機能
 * - 大きなワールドマップを画面中央に表示
 * - 左側に訪問済み場所のリストを表示
 * - リストから場所を選択すると、マップ上にマーカーを表示
 * - キー操作でマップの開閉が可能
 *
 * ■ 使用方法
 * - 飛空艇シーン中にMキーを押すとワールドマップが開きます
 * - 訪問済みの場所はVisitedPlaceTrackerプラグインが自動的に記録します
 *
 * v1.0.0 - 初版リリース
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

    // プラグインパラメータの取得
    const pluginName = 'AirshipIllusionWorldMap_MZ';
    const parameters = PluginManager.parameters(pluginName);
    const mapConfig = {
        markerIcon: Number(parameters['markerIcon'] || 190),
        visitedIcon: Number(parameters['visitedIcon'] || 191),
        travelConfirmMessage: String(parameters['travelConfirmMessage'] || '%1へ移動しますか？'),
        confirmYes: String(parameters['confirmYes'] || 'はい'),
        confirmNo: String(parameters['confirmNo'] || 'いいえ'),
        enableAutoFlight: parameters['enableAutoFlight'] !== 'false'
    };
    
    // Mキーのマッピングを追加
    Input.keyMapper[77] = 'worldmap';  // M key
    
    // コアプラグインチェック
    if (!window.AirshipIllusion || !window.AirshipIllusion.Base) {
        throw new Error('AirshipIllusionWorldMap_MZ requires AirshipIllusionCore_MZ');
    }
    
    //=============================================================================
    // AirshipIllusionWorldMap
    //=============================================================================
    
    class AirshipIllusionWorldMap extends AirshipIllusion.Base {
        
        onInitialize() {
            this._mapWindow = null;
            this._listWindow = null;
            this._descWindow = null;  // 説明ウィンドウ
            this._markerSprite = null;
            this._backgroundSprite = null;  // 青空背景スプライト
            this._isOpen = false;
            this._visitedPlaces = [];
            this._selectedIndex = 0;
            this._mapBitmap = null;
            this._masterBitmap = null;
            
            // リソースを登録（UIモジュールと同じ方式）
            this.registerResource('image', 'worldMapTexture', AirshipIllusion.params.worldMapImage);
        }
        
        onResourcesLoaded() {
            // リソース準備完了後の処理
            this._masterBitmap = this.getResource('worldMapTexture');
            
            // IconSetをロード
            this._iconSet = ImageManager.loadSystem('IconSet');
            
            this._collectVisitedPlaces();
            // ウィンドウの作成はonActivateに移動
        }
        
        onActivate() {
            // ウィンドウをここで作成
            if (!this._mapWindow) {
                this._createWindows();
            }
            
            // キー入力のリスナーを設定
            this._setupInputHandlers();
        }
        
        _setupInputHandlers() {
            // キー入力処理は onUpdate で行う
        }
        
        onUpdate() {
            // マップ開閉キーのチェック
            if (this._checkOpenMapKey()) {
                if (!this._isOpen) {
                    this.openMap();
                } else {
                    this.closeMap();
                }
            }
            
            if (this._isOpen) {
                // ウィンドウの更新は削除（Sceneが自動的に行う）
                this._updateMapControls();
            }
        }
        
        _checkOpenMapKey() {
            // Mキーのみで開閉
            return Input.isTriggered('worldmap');
        }
        
        openMap() {
            if (this._isOpen) return;
            
            this._isOpen = true;
            
            // マップを開く時に訪問済み場所を再取得
            this._collectVisitedPlaces();
            
            this._showWindows();
            this._refreshListWindow();
            
            // 飛空艇の操作を無効化（onUpdateメソッドを一時的に上書き）
            if (AirshipIllusion && AirshipIllusion.instances && AirshipIllusion.instances.control) {
                const control = AirshipIllusion.instances.control;
                // 元のonUpdateを保存
                this._originalControlUpdate = control.onUpdate;
                // 空の関数で上書き
                control.onUpdate = function() {};
            }
            
            // 天気エフェクトを停止
            if (AirshipIllusion && AirshipIllusion.instances && AirshipIllusion.instances.weather) {
                const weather = AirshipIllusion.instances.weather;
                // 元のonUpdateを保存
                this._originalWeatherUpdate = weather.onUpdate;
                // 空の関数で上書き
                weather.onUpdate = function() {};
                // 天気パーティクルを非表示
                if (weather._particleContainer) {
                    this._weatherWasVisible = weather._particleContainer.visible;
                    weather._particleContainer.visible = false;
                }
            }
        }
        
        closeMap() {
            if (!this._isOpen) return;
            
            this._isOpen = false;
            this._hideWindows();
            
            // 飛空艇の操作を復元
            if (AirshipIllusion && AirshipIllusion.instances && AirshipIllusion.instances.control) {
                const control = AirshipIllusion.instances.control;
                // 元のonUpdateメソッドを復元
                if (this._originalControlUpdate) {
                    control.onUpdate = this._originalControlUpdate;
                    this._originalControlUpdate = null;
                }
            }
            
            // 天気エフェクトを復元
            if (AirshipIllusion && AirshipIllusion.instances && AirshipIllusion.instances.weather) {
                const weather = AirshipIllusion.instances.weather;
                // 元のonUpdateメソッドを復元
                if (this._originalWeatherUpdate) {
                    weather.onUpdate = this._originalWeatherUpdate;
                    this._originalWeatherUpdate = null;
                }
                // 天気パーティクルの表示状態を復元
                if (weather._particleContainer && this._weatherWasVisible !== undefined) {
                    weather._particleContainer.visible = this._weatherWasVisible;
                    this._weatherWasVisible = undefined;
                }
            }
        }
        
        _collectVisitedPlaces() {
            // VisitedPlaceTrackerプラグインから訪問済み場所を取得
            if ($gameSystem && typeof $gameSystem.getVisitedPlaces === 'function') {
                this._visitedPlaces = $gameSystem.getVisitedPlaces();
            } else {
                console.warn('WorldMap: VisitedPlaceTracker plugin not found or not loaded');
                this._visitedPlaces = [];
            }
            
            // デバッグ用：訪問済み場所がない場合、テストデータを追加
            if (this._visitedPlaces.length === 0 && AirshipIllusion.params.debugMode) {
                
                // 飛空艇シーンのランドマークからテストデータを作成
                if ($gameAirshipIllusion && $gameAirshipIllusion.landmarkEvents) {
                    $gameAirshipIllusion.landmarkEvents.slice(0, 3).forEach(landmark => {
                        const testPlace = {
                            mapId: 1,
                            eventId: landmark.id,
                            name: landmark.displayName || landmark.name,
                            worldX: landmark.worldX,
                            worldY: landmark.worldY,
                            type: landmark.landmarkType || 'town'
                        };
                        
                        // VisitedPlaceTrackerのメソッドが利用可能な場合のみ追加
                        if ($gameSystem && typeof $gameSystem.addVisitedPlace === 'function') {
                            $gameSystem.addVisitedPlace(testPlace);
                        }
                    });
                    
                    // 再度取得
                    if ($gameSystem && typeof $gameSystem.getVisitedPlaces === 'function') {
                        this._visitedPlaces = $gameSystem.getVisitedPlaces();
                    }
                }
            }
        }
        
        _createWindows() {
            const scene = SceneManager._scene;
            if (!scene) return;
            
            // 青空背景スプライトを作成（最背面）
            this._createBackgroundSprite();
            
            // マップウィンドウを画面サイズで作成（リスト分のスペースを確保）
            const listWidth = 250;  // リストウィンドウの幅を固定
            const rect1 = new Rectangle(
                listWidth,  // リストの右側から開始
                0,
                Graphics.width - listWidth,  // 残りの画面幅
                Graphics.height  // 画面の高さ
            );
            this._mapWindow = new Window_WorldMap(rect1);
            this._mapWindow.visible = false;
            this._mapWindow.z = 1000;  // 最前面に表示
            
            // 説明ウィンドウの高さを先に決める（コンパクトに）
            const descHeight = 100;
            
            // リストウィンドウを作成（左側に配置、説明ウィンドウの分だけ高さを縮める）
            const rect2 = new Rectangle(
                0,
                0,
                listWidth,
                Graphics.height - descHeight  // 説明ウィンドウの分だけ縮める
            );
            this._listWindow = new Window_PlaceList(rect2);
            this._listWindow.visible = false;
            this._listWindow.z = 1001;  // マップより前面に表示
            this._listWindow.setHandler('ok', this._onPlaceSelected.bind(this));
            this._listWindow.setHandler('cancel', this.closeMap.bind(this));
            
            // WorldMapモジュールへの参照を設定
            this._listWindow._worldMapModule = this;
            
            // 説明ウィンドウを作成（リストウィンドウの下に配置）
            const rect3 = new Rectangle(
                0,  // 左端から
                Graphics.height - descHeight,  // リストウィンドウの下
                listWidth,  // リストと同じ幅
                descHeight
            );
            this._descWindow = new Window_PlaceDescription(rect3);
            this._descWindow.visible = false;
            this._descWindow.z = 1002;  // 最前面（リストウィンドウより前）
            
            // シーンに追加（順番重要：後に追加したものが前面に表示される）
            scene.addChild(this._mapWindow);
            scene.addChild(this._descWindow);  // 説明ウィンドウ
            scene.addChild(this._listWindow);  // リストウィンドウを最前面に
            
            // マーカースプライトを作成してマップウィンドウに直接追加
            this._createMarkerSprite();
        }
        
        _createMarkerSprite() {
            // マーカースプライトコンテナを作成
            this._markerContainer = new Sprite();
            this._markerContainer.z = 100;  // contentsより上に表示
            
            // マーカースプライトを作成
            this._markerSprite = new Sprite();
            this._markerSprite.bitmap = new Bitmap(32, 32);  // コンパクトなサイズに
            this._markerSprite.anchor.x = 0.5;
            this._markerSprite.anchor.y = 0.5;
            this._markerSprite.visible = false;
            
            // コンテナにマーカーを追加
            this._markerContainer.addChild(this._markerSprite);
            
            // マップウィンドウのchildrenに直接追加（contentsの上に表示）
            if (this._mapWindow) {
                this._mapWindow.addChild(this._markerContainer);
            }
            
            // アイコンを後で描画
            this._needsDrawMarkerIcon = true;
        }
        
        _drawMarkerIcon(place) {
            if (!this._iconSet) {
                this._iconSet = ImageManager.loadSystem('IconSet');
            }
            
            // VisitedPlaceTrackerから適切なアイコンを取得
            const iconIndex = window.VisitedPlaceTracker && window.VisitedPlaceTracker.getIconForPlace ?
                            window.VisitedPlaceTracker.getIconForPlace(place) : 
                            mapConfig.markerIcon;
            
            const pw = 32;
            const ph = 32;
            const sx = (iconIndex % 16) * pw;
            const sy = Math.floor(iconIndex / 16) * ph;
            
            // アイコンが読み込まれていない場合は後で描画
            if (!this._iconSet.isReady()) {
                this._iconSet.addLoadListener(() => {
                    this._drawMarkerIcon(place);
                });
                // とりあえず赤い円を描画（中心に）
                this._markerSprite.bitmap.drawCircle(16, 16, 14, 'rgba(255, 0, 0, 0.8)');
                return;
            }
            
            // ビットマップをクリアして再描画
            this._markerSprite.bitmap.clear();
            
            // 背景に半透明の円を描画（小さく）
            this._markerSprite.bitmap.drawCircle(16, 16, 14, 'rgba(255, 255, 0, 0.3)');
            
            // アイコンを中央に描画（24x24サイズで）
            this._markerSprite.bitmap.blt(this._iconSet, sx, sy, pw, ph, 4, 4, 24, 24);
        }
        
        _showWindows() {
            const scene = SceneManager._scene;
            
            // 青空背景を表示
            if (this._backgroundSprite) {
                this._backgroundSprite.visible = true;
                // フェードイン効果
                this._backgroundSprite.opacity = 0;
                const fadeInInterval = setInterval(() => {
                    this._backgroundSprite.opacity += 15;
                    if (this._backgroundSprite.opacity >= 255) {
                        this._backgroundSprite.opacity = 255;
                        clearInterval(fadeInInterval);
                    }
                }, 16);
            }
            
            if (this._mapWindow) {
                this._mapWindow.visible = true;
                this._mapWindow.openness = 255;  // 即座に開く
                // 最前面に移動
                if (scene) {
                    scene.removeChild(this._mapWindow);
                    scene.addChild(this._mapWindow);
                }
            }
            if (this._listWindow) {
                this._listWindow.visible = true;
                this._listWindow.openness = 255;  // 即座に開く
                this._listWindow.activate();
                // 初期選択を設定
                if (this._visitedPlaces.length > 0) {
                    this._listWindow.select(0);
                    // 初期選択のマーカーも表示
                    this._onCursorMove(0);
                }
                
                // 最前面に移動
                if (scene) {
                    scene.removeChild(this._listWindow);
                    scene.addChild(this._listWindow);
                }
            }
            if (this._descWindow) {
                this._descWindow.visible = true;
                this._descWindow.openness = 255;  // 即座に開く
                // 最前面に移動
                if (scene) {
                    scene.removeChild(this._descWindow);
                    scene.addChild(this._descWindow);
                }
            }
        }
        
        _hideWindows() {
            // 青空背景をフェードアウト
            if (this._backgroundSprite) {
                const fadeOutInterval = setInterval(() => {
                    this._backgroundSprite.opacity -= 15;
                    if (this._backgroundSprite.opacity <= 0) {
                        this._backgroundSprite.opacity = 0;
                        this._backgroundSprite.visible = false;
                        clearInterval(fadeOutInterval);
                    }
                }, 16);
            }
            
            if (this._mapWindow) {
                this._mapWindow.close();
                setTimeout(() => {
                    this._mapWindow.visible = false;
                }, 200);
            }
            if (this._listWindow) {
                this._listWindow.close();
                this._listWindow.deactivate();
                setTimeout(() => {
                    this._listWindow.visible = false;
                }, 200);
            }
            if (this._descWindow) {
                this._descWindow.close();
                setTimeout(() => {
                    this._descWindow.visible = false;
                }, 200);
            }
            if (this._markerSprite) {
                this._markerSprite.visible = false;
            }
        }
        
        _refreshListWindow() {
            if (this._listWindow) {
                this._listWindow.setPlaces(this._visitedPlaces);
                this._listWindow.refresh();
            }
        }
        
        _onCursorMove(index) {
            // インデックスが有効な場合のみ処理
            if (index >= 0 && index < this._visitedPlaces.length) {
                const place = this._visitedPlaces[index];
                if (place) {
                    this._showMarkerAtPlace(place);
                    
                    // 説明ウィンドウを更新
                    if (this._descWindow) {
                        this._descWindow.setPlace(place);
                    }
                }
            }
        }
        
        _onPlaceSelected() {
            // オートフライトが無効の場合は何もしない
            if (!mapConfig.enableAutoFlight) {
                this._listWindow.activate();
                return;
            }

            const index = this._listWindow.index();

            // VisitedPlaceTrackerから最新のデータを取得
            if ($gameSystem && typeof $gameSystem.getVisitedPlaces === 'function') {
                this._visitedPlaces = $gameSystem.getVisitedPlaces();
            }

            const place = this._visitedPlaces[index];

            if (!place) {
                console.error('No place found at index:', index);
                return;
            }

            // fieldX/fieldYがあれば処理可能
            if (place.fieldX === undefined || place.fieldY === undefined) {
                console.error('Place has no field coordinates:', place);
                return;
            }

            // 選択された場所を保存（確認ウィンドウで使用）
            this._selectedPlace = place;

            // 確認ウィンドウを表示
            this._showConfirmWindow(place);
        }
        
        _showConfirmWindow(place) {
            // 選択肢ウィンドウを作成
            const scene = SceneManager._scene;
            if (!scene) return;
            
            // タイトルウィンドウを作成
            const titleRect = new Rectangle(
                Graphics.width / 2 - 200,
                Graphics.height / 2 - 120,
                400,
                80
            );
            this._confirmTitleWindow = new Window_Base(titleRect);
            this._confirmTitleWindow.z = 1999;
            const text = mapConfig.travelConfirmMessage.replace('%1', place.name);
            this._confirmTitleWindow.drawText(text, 0, 10, 360, 'center');
            scene.addChild(this._confirmTitleWindow);
            
            // カスタムWindow_Commandクラスを作成
            class Window_PlaceConfirm extends Window_Command {
                makeCommandList() {
                    this.addCommand(mapConfig.confirmYes, 'yes');
                    this.addCommand(mapConfig.confirmNo, 'no');
                }
            }
            
            // 確認メッセージウィンドウ (選択肢)
            const rect = new Rectangle(
                Graphics.width / 2 - 100,
                Graphics.height / 2 - 20,
                200,
                120
            );
            
            this._confirmWindow = new Window_PlaceConfirm(rect);
            this._confirmWindow.z = 2000;
            
            // ハンドラーを設定（クロージャーで場所を保持）
            const targetPlace = place;  // クロージャーで確実に保持
            this._confirmWindow.setHandler('yes', () => {
                this._startAutoFlight(targetPlace);
            });
            this._confirmWindow.setHandler('no', () => {
                this._closeConfirmWindow();
            });
            this._confirmWindow.setHandler('cancel', () => {
                this._closeConfirmWindow();
            });
            
            // リストウィンドウを非アクティブ化
            this._listWindow.deactivate();
            
            // 確認ウィンドウを表示
            scene.addChild(this._confirmWindow);
            this._confirmWindow.activate();
            this._confirmWindow.select(0);
            this._confirmWindow.open();  // ウィンドウを開く
        }
        
        _closeConfirmWindow() {
            const scene = SceneManager._scene;
            if (!scene) return;
            
            if (this._confirmWindow) {
                scene.removeChild(this._confirmWindow);
                this._confirmWindow = null;
            }
            if (this._confirmTitleWindow) {
                scene.removeChild(this._confirmTitleWindow);
                this._confirmTitleWindow = null;
            }
            
            // リストウィンドウを再アクティブ化
            this._listWindow.activate();
        }
        
        _startAutoFlight(place) {
            
            
            // 確認ウィンドウを閉じる
            this._closeConfirmWindow();
            
            // 自動飛行を開始（マップを閉じる前に設定）
            if ($gameAirshipIllusion && $gameAirshipIllusion.startAutoFlight) {
                // startAutoFlightメソッドを使用（フィールド座標を渡す）
                $gameAirshipIllusion.startAutoFlight(place.fieldX, place.fieldY);
                
                // SE再生
                SoundManager.playOk();
            } else {
                console.error('[AUTOFLIGHT] $gameAirshipIllusion or startAutoFlight not available');
            }
            
            // マップを閉じる（自動飛行設定後）
            setTimeout(() => {
                this.closeMap();
            }, 100);
        }
        
        _showMarkerAtPlace(place) {
            if (!this._markerSprite || !this._mapWindow) {
                console.error('WorldMap: Missing required components');
                return;
            }
            
            // アイコンを描画（まだの場合、または場所が変わった場合）
            if (this._needsDrawMarkerIcon || this._lastMarkerPlace !== place) {
                this._drawMarkerIcon(place);
                this._needsDrawMarkerIcon = false;
                this._lastMarkerPlace = place;
            }
            
            const worldWidth = AirshipIllusion.params.worldWidth || 10000;
            const worldHeight = AirshipIllusion.params.worldHeight || 10000;
            
            // worldX/worldYが未定義の場合のデフォルト値
            const placeWorldX = place.worldX !== undefined ? place.worldX : 5000;
            const placeWorldY = place.worldY !== undefined ? place.worldY : 5000;
            
            // ワールド座標をウィンドウのコンテンツ座標に変換
            const padding = this._mapWindow.itemPadding();
            const contentWidth = this._mapWindow.contents.width;
            const contentHeight = this._mapWindow.contents.height;
            
            // 座標を計算（contentsの座標系で）
            const mapX = (placeWorldX / worldWidth) * contentWidth;
            const mapY = (placeWorldY / worldHeight) * contentHeight;
            
            // マーカーの位置を設定（コンテナはウィンドウ相対なのでパディングを追加）
            this._markerSprite.x = mapX + padding;
            this._markerSprite.y = mapY + padding;
            this._markerSprite.visible = true;
            
            // マーカーを点滅させる
            this._animateMarker();
        }
        
        _animateMarker() {
            if (!this._markerSprite) return;
            
            // 簡単な点滅アニメーション
            this._markerSprite.opacity = 255;
            let blinkCount = 0;
            const blinkInterval = setInterval(() => {
                this._markerSprite.opacity = this._markerSprite.opacity === 255 ? 128 : 255;
                blinkCount++;
                if (blinkCount >= 6) {
                    clearInterval(blinkInterval);
                    this._markerSprite.opacity = 255;
                }
            }, 200);
        }
        
        _updateMapControls() {
            // リストウィンドウの操作を更新
            if (this._listWindow && this._listWindow.active) {
                if (Input.isTriggered('cancel')) {
                    this.closeMap();
                }
            }
        }
        
        _createBackgroundSprite() {
            const scene = SceneManager._scene;
            if (!scene) return;
            
            // 青空背景用のスプライトを作成
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._backgroundSprite.visible = false;
            this._backgroundSprite.z = 999;  // ウィンドウの背後、シーンの前面
            
            // 青空のグラデーションを描画（FieldShader風）
            const bitmap = this._backgroundSprite.bitmap;
            const context = bitmap.context;
            
            // FieldShader風の美しい空のグラデーション（より深い色から明るい色へ）
            const gradient = context.createLinearGradient(0, 0, 0, Graphics.height);
            gradient.addColorStop(0, '#0066CC');     // 深い青（頂点）
            gradient.addColorStop(0.15, '#1E90FF');  // ドッジャーブルー
            gradient.addColorStop(0.3, '#4DA6FF');   // 明るい青
            gradient.addColorStop(0.5, '#87CEEB');   // スカイブルー
            gradient.addColorStop(0.65, '#ADD8E6');  // ライトブルー
            gradient.addColorStop(0.8, '#E0F6FF');   // とても薄い青
            gradient.addColorStop(0.9, '#F0F8FF');   // アリスブルー（地平線近く）
            gradient.addColorStop(1, '#FFFFFF');     // 白（地平線）
            
            context.fillStyle = gradient;
            context.fillRect(0, 0, Graphics.width, Graphics.height);
            
            // 雲のような模様を追加（より自然に）
            this._drawFieldShaderClouds(bitmap);
            
            // シーンに追加（最背面）
            scene.addChildAt(this._backgroundSprite, 0);
        }
        
        _drawFieldShaderClouds(bitmap) {
            const context = bitmap.context;
            
            // FieldShader風の雲を描画（より柔らかく自然に）
            context.save();
            
            // 大きな雲（ソフトなグラデーション付き）
            for (let i = 0; i < 3; i++) {
                const x = Math.random() * Graphics.width;
                const y = 80 + Math.random() * 150;
                const radius = 80 + Math.random() * 100;
                
                // 放射状グラデーションで雲を表現
                const cloudGradient = context.createRadialGradient(x, y, 0, x, y, radius);
                cloudGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
                cloudGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
                cloudGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                context.fillStyle = cloudGradient;
                context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
            }
            
            // 中サイズの雲（より多く、薄め）
            for (let j = 0; j < 6; j++) {
                const x2 = Math.random() * Graphics.width;
                const y2 = 100 + Math.random() * 250;
                const radius2 = 50 + Math.random() * 80;
                
                const cloudGradient2 = context.createRadialGradient(x2, y2, 0, x2, y2, radius2);
                cloudGradient2.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
                cloudGradient2.addColorStop(0.6, 'rgba(255, 255, 255, 0.1)');
                cloudGradient2.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                context.fillStyle = cloudGradient2;
                context.fillRect(x2 - radius2, y2 - radius2, radius2 * 2, radius2 * 2);
            }
            
            // 小さな雲（かすみのような効果）
            context.fillStyle = 'rgba(255, 255, 255, 0.08)';
            for (let k = 0; k < 10; k++) {
                const x3 = Math.random() * Graphics.width;
                const y3 = 150 + Math.random() * 300;
                const width3 = 60 + Math.random() * 100;
                const height3 = 20 + Math.random() * 40;
                
                context.beginPath();
                context.ellipse(x3, y3, width3 / 2, height3 / 2, 0, 0, Math.PI * 2);
                context.fill();
            }
            
            context.restore();
        }
        
        onDispose() {
            // クリーンアップ
            if (this._mapBitmap) {
                this._mapBitmap.clear();
            }
            if (this._markerSprite && this._markerSprite.bitmap) {
                this._markerSprite.bitmap.clear();
            }
            if (this._backgroundSprite && this._backgroundSprite.bitmap) {
                this._backgroundSprite.bitmap.clear();
            }
        }
    }
    
    // グローバル登録
    window.AirshipIllusionWorldMap = AirshipIllusionWorldMap;
    
    //=============================================================================
    // Window_WorldMap - ワールドマップウィンドウ
    //=============================================================================
    
    class Window_WorldMap extends Window_Base {
        
        initialize(rect) {
            super.initialize(rect);
            this._masterBitmap = null;
            
            // ウィンドウを半透明に設定
            this.setBackgroundType(2);  // 透明背景タイプ
            this.backOpacity = 140;  // 背景をより透明に
            this.opacity = 180;  // ウィンドウ枠も半透明に
            
            this.loadMapImage();
        }
        
        loadMapImage() {
            // WorldMapモジュールから画像を取得
            if (AirshipIllusion.modules && AirshipIllusion.modules.worldMap) {
                this._masterBitmap = AirshipIllusion.modules.worldMap.getResource('worldMapTexture');
                if (this._masterBitmap) {
                    if (this._masterBitmap.isReady()) {
                        this.refresh();
                    } else {
                        this._masterBitmap.addLoadListener(this.refresh.bind(this));
                    }
                    return;
                }
            }
            
            // フォールバック: 直接ロード
            let masterMapName = 'WorldMap';
            if (window.AirshipIllusion && AirshipIllusion.params && AirshipIllusion.params.worldMapImage) {
                masterMapName = AirshipIllusion.params.worldMapImage;
            }
            this._masterBitmap = ImageManager.loadBitmap('img/airship_illusion/', masterMapName, '', true);
            this._masterBitmap.addLoadListener(this.refresh.bind(this));
        }
        
        refresh() {
            this.contents.clear();
            
            if (this._masterBitmap && this._masterBitmap.isReady()) {
                // マップ画像を描画（ウィンドウサイズに合わせてスケーリング）
                const dw = this.contents.width;
                const dh = this.contents.height;
                this.contents.blt(this._masterBitmap, 0, 0, 
                    this._masterBitmap.width, this._masterBitmap.height,
                    0, 0, dw, dh);
            } else {
                // プレースホルダー
                this.contents.fillRect(0, 0, this.contents.width, this.contents.height, '#333333');
                this.drawText('World Map', 0, this.contents.height / 2 - 20, this.contents.width, 'center');
            }
        }
    }
    
    //=============================================================================
    // Window_PlaceList - 場所リストウィンドウ
    //=============================================================================
    
    class Window_PlaceList extends Window_Selectable {
        
        initialize(rect) {
            // 親クラスの初期化を先に呼ぶ
            super.initialize(rect);
            
            // その後で独自のプロパティを設定
            this._places = [];
            this._iconSet = ImageManager.loadSystem('IconSet');
            this._savedIndex = 0;
            
            // デフォルトのウィンドウスキンを使用（半透明にして青空を見せる）
            this.setBackgroundType(2);  // 透明背景タイプ
            this.backOpacity = 160;  // 背景を半透明に
            this.opacity = 200;  // ウィンドウ枠も半透明に
            
            // 初期化後にリフレッシュ
            this.refresh();
        }
        
        updateBackgroundColor() {
            // コンテンツエリアは透明にして、青空背景が透けて見えるようにする
        }
        
        setPlaces(places) {
            this._places = places || [];
        }
        
        maxItems() {
            return this._places ? this._places.length : 0;
        }
        
        itemHeight() {
            return 36;
        }
        
        drawItem(index) {
            const place = this._places[index];
            if (!place) return;
            
            const rect = this.itemRect(index);
            
            // デバッグ: 各場所の座標を確認
            
            // アイコンを描画
            if (this._iconSet && this._iconSet.isReady()) {
                const iconIndex = mapConfig.visitedIcon;
                this.drawIcon(iconIndex, rect.x + 2, rect.y + 2);
            }
            
            // 場所名を描画
            this.drawText(place.name, rect.x + 36, rect.y, rect.width - 36);
        }
        
        drawIcon(iconIndex, x, y) {
            const bitmap = this._iconSet;
            const pw = 32;
            const ph = 32;
            const sx = iconIndex % 16 * pw;
            const sy = Math.floor(iconIndex / 16) * ph;
            this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
        }
        
        // カーソル移動時にマーカーを更新
        update() {
            // 初期化
            if (this._lastTrackedIndex === undefined) {
                this._lastTrackedIndex = -1;
            }
            
            // 親クラスのupdateを呼ぶ
            super.update();
            
            // インデックスが変更されたらマーカーを更新
            if (this.index() !== this._lastTrackedIndex && this.index() >= 0) {
                this._lastTrackedIndex = this.index();
                
                // WorldMapモジュールに通知（直接参照を使用）
                if (this._worldMapModule) {
                    this._worldMapModule._onCursorMove(this.index());
                }
            }
        }
        
        processOk() {
            // 標準処理を呼び出すが、activateは呼ばない
            if (this.isCurrentItemEnabled()) {
                this.playOkSound();
                this.updateInputData();
                this.callOkHandler();
                // OKハンドラー実行後もアクティブ状態を維持
            }
        }
        
        isCurrentItemEnabled() {
            return true;
        }
        
        refresh() {
            this.createContents();
            this.updateBackgroundColor();
            this.drawAllItems();
        }
    }
    
    //=============================================================================
    // Window_PlaceDescription - 場所説明ウィンドウ
    //=============================================================================
    
    class Window_PlaceDescription extends Window_Base {
        
        initialize(rect) {
            super.initialize(rect);
            this._place = null;
            
            // デフォルトのウィンドウスキンを使用（半透明にして青空を見せる）
            this.setBackgroundType(2);  // 透明背景タイプ
            this.backOpacity = 160;  // 背景を半透明に
            this.opacity = 200;  // ウィンドウ枠も半透明に
            
            this.refresh();
        }
        
        itemPadding() {
            return 8;
        }
        
        lineHeight() {
            return 22;  // 行の高さも調整
        }
        
        updateBackgroundColor() {
            // コンテンツエリアは透明にして、青空背景が透けて見えるようにする
        }
        
        setPlace(place) {
            if (this._place !== place) {
                this._place = place;
                this.refresh();
            }
        }
        
        refresh() {
            this.contents.clear();
            this.updateBackgroundColor();
            
            if (!this._place) {
                return;
            }
            
            // 説明文のみを描画（自動改行付き）
            this.changeTextColor(ColorManager.normalColor());
            let text = '';
            if (this._place.description) {
                text = this._place.description;
            } else {
                text = this._getDefaultDescription(this._place.type);
            }
            
            // drawTextExを使用して自動改行とエスケープ文字の処理
            this.drawTextEx(text, 4, 0);
        }
        
        _getDefaultDescription(type) {
            switch (type) {
                case 'town':
                    return '平和な町です。';
                case 'castle':
                    return '立派な城がそびえ立っています。';
                case 'dungeon':
                    return '危険なダンジョンです。';
                case 'forest':
                    return '深い森が広がっています。';
                default:
                    return '興味深い場所です。';
            }
        }
        
        drawIcon(iconIndex, x, y) {
            const bitmap = ImageManager.loadSystem('IconSet');
            const pw = 32;
            const ph = 32;
            const sx = iconIndex % 16 * pw;
            const sy = Math.floor(iconIndex / 16) * ph;
            this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
        }
    }
    
})();