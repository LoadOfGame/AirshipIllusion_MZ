//=============================================================================
// AirshipIllusionUI_MZ.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Airship Illusion - UI Module v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 * @help
 * ============================================================================
 * Airship Illusion - UI Module v1.0.0 for RPG Maker MZ
 * ============================================================================
 *
 * This module handles the UI components (minimap and compass) for the
 * Airship Illusion system.
 * Displays a minimap showing current position and a compass showing direction.
 * Also supports landmark icon display.
 * Must be used together with AirshipIllusionCore_MZ.js.
 *
 * v1.0.0 - Initial MZ release
 *
 * Controls:
 * Tab key: Toggle minimap display mode (Close-up Map / World View)
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
 * @plugindesc 飛空艇イリュージョン - UIモジュール v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 * @help
 * ============================================================================
 * 飛空艇イリュージョン - UIモジュール v1.0.0 for RPG Maker MZ
 * ============================================================================
 *
 * このモジュールは飛空艇イリュージョンシステムのUIコンポーネント（ミニマップとコンパス）を処理します。
 * 現在位置を表示するミニマップと方向を表示するコンパスを表示します。
 * ランドマークアイコンの表示にも対応しています。
 * AirshipIllusionCore_MZ.jsと一緒に使用する必要があります。
 *
 * v1.0.0 - MZ版初版リリース
 *
 * 操作方法:
 * Tabキー: ミニマップの表示モード切り替え（近接マップ/全体マップ）
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

    // Check if core plugin is loaded
    if (!window.AirshipIllusion || !window.AirshipIllusion.Base) {
        throw new Error('AirshipIllusionUI_MZ requires AirshipIllusionCore_MZ to be loaded first');
    }
    
    //=============================================================================
    // AirshipIllusionUI
    //=============================================================================
    
    class AirshipIllusionUI extends AirshipIllusion.Base {
        // マップモード
        static MAP_MODES = {
            CLOSE_UP: 'close_up',    // 近接マップ
            WORLD_VIEW: 'world_view' // 全体マップ
        };
        
        // UI configuration
        static UI_CONFIG = {
            minimap: {
                borderWidth: 2,
                borderColor: '#FFFFFF',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                playerColor: '#FF0000',
                playerSize: 6,
                playerSizeWorldView: 4,  // 全体マップ時のプレイヤーサイズ
                scale: 0.5,              // 近接マップのスケール
                blinkSpeed: 30,          // 全体マップでの点滅速度
                modeTextColor: '#FFFFFF',
                modeTextSize: 12
            },
            compass: {
                borderWidth: 2,
                borderColor: '#FFFFFF',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                needleColor: '#FF0000',
                textColor: '#FFFFFF',
                fontSize: 16
            }
        };
        
        onInitialize() {
            // Register resources
            this.registerResource('image', 'minimapTexture', AirshipIllusion.params.worldMapImage);
            
            // UI elements
            this._uiContainer = null;
            this._minimapSprite = null;
            this._minimapBitmap = null;
            this._minimapPlayerDot = null;
            this._minimapModeText = null;
            this._compassSprite = null;
            this._compassBitmap = null;
            
            // Position tracking
            this._currentX = 5000;
            this._currentY = 5000;
            this._currentAngle = 0;
            
            // Map mode
            this._mapMode = AirshipIllusionUI.MAP_MODES.CLOSE_UP;
            this._blinkTimer = 0;
            
            // UI settings from parameters
            this._minimapPosition = AirshipIllusion.params.minimapPosition;
            this._minimapSize = AirshipIllusion.params.minimapSize;
            this._compassPosition = AirshipIllusion.params.compassPosition;
            this._compassSize = AirshipIllusion.params.compassSize;
            
            // ランドマークアイコン用
            this._landmarkIcons = [];
            this._landmarkIconContainer = null;
            
            // 街名ウィンドウ用
            this._landmarkNameWindow = null;
        }
        
        onResourcesLoaded() {
            this._createUIContainer();
            this._createMinimap();
            this._createCompass();
            this._createLandmarkNameWindow();
            this._createAutoFlightIndicator();
            
            // 初期表示を早めに行う（発進演出中でも表示）
            if (this._minimapSprite) {
                this._minimapSprite.opacity = 255;
                this._minimapSprite.visible = true;
            }
            if (this._compassSprite) {
                this._compassSprite.opacity = 255;
                this._compassSprite.visible = true;
            }
        }
        
        _createAutoFlightIndicator() {
            // 自動飛行インジケーター作成
            this._autoFlightWindow = new Window_Base(new Rectangle(
                Graphics.width / 2 - 150,
                50,
                300,
                60
            ));
            this._autoFlightWindow.opacity = 0;
            this._autoFlightWindow.contents.fontSize = 20;
            this._autoFlightWindow.visible = false;
            
            if (SceneManager._scene) {
                SceneManager._scene.addChild(this._autoFlightWindow);
            }
            
            // イベントリスナー登録
            if (AirshipIllusion.eventBus) {
                // 自動飛行開始
                AirshipIllusion.eventBus.on('autoFlightStarted', (data) => {
                    if (this._autoFlightWindow && data.target) {
                        this._autoFlightWindow.visible = true;
                        this._autoFlightWindow.contents.clear();
                        const text = `自動飛行中: ${data.target.name}`;
                        this._autoFlightWindow.drawText(text, 0, 0, 280, 'center');
                        this._autoFlightWindow.contentsOpacity = 255;
                        
                        // 点滅アニメーション
                        this._autoFlightBlinkTimer = 0;
                    }
                });
                
                // 自動飛行完了
                AirshipIllusion.eventBus.on('autoFlightCompleted', (data) => {
                    if (this._autoFlightWindow && data.target) {
                        this._autoFlightWindow.contents.clear();
                        const text = `${data.target.name}に到着しました！`;
                        this._autoFlightWindow.drawText(text, 0, 0, 280, 'center');
                        
                        // 2秒後にフェードアウト
                        setTimeout(() => {
                            if (this._autoFlightWindow) {
                                this._autoFlightFadeOut = true;
                            }
                        }, 2000);
                    }
                });
                
                // 自動飛行キャンセル
                AirshipIllusion.eventBus.on('autoFlightCancelled', () => {
                    if (this._autoFlightWindow) {
                        this._autoFlightWindow.contents.clear();
                        const text = `自動飛行をキャンセルしました`;
                        this._autoFlightWindow.drawText(text, 0, 0, 280, 'center');
                        
                        // 1秒後にフェードアウト
                        setTimeout(() => {
                            if (this._autoFlightWindow) {
                                this._autoFlightFadeOut = true;
                            }
                        }, 1000);
                    }
                });
            }
        }
        
        _createLandmarkNameWindow() {
            // Create the window
            this._landmarkNameWindow = new Window_LandmarkName();
            
            // Add to the current scene
            if (SceneManager._scene) {
                SceneManager._scene.addChild(this._landmarkNameWindow);
                // 最前面に移動
                if (SceneManager._scene.children && this._landmarkNameWindow.parent) {
                    const index = SceneManager._scene.children.indexOf(this._landmarkNameWindow);
                    if (index >= 0) {
                        SceneManager._scene.children.splice(index, 1);
                        SceneManager._scene.children.push(this._landmarkNameWindow);
                    }
                }
            }
            
            // Set up event listener for landmark name changes (only if not already registered)
            if (AirshipIllusion.eventBus && !this._landmarkNameListenerRegistered) {
                this._landmarkNameListener = (data) => {
                    if (this._landmarkNameWindow) {
                        if (data.name) {
                            this._landmarkNameWindow.setLandmarkName(data.name, data.position);
                        } else {
                            // 即座に消す
                            this._landmarkNameWindow._currentLandmarkName = '';
                            this._landmarkNameWindow._fadeTimer = 0;
                            this._landmarkNameWindow.opacity = 0;
                            this._landmarkNameWindow.contentsOpacity = 0;
                            this._landmarkNameWindow.refresh();
                        }
                    }
                };
                AirshipIllusion.eventBus.on('landmarkNameChanged', this._landmarkNameListener);
                this._landmarkNameListenerRegistered = true;
            }
        }
        
        _createUIContainer() {
            this._uiContainer = new Sprite();
            this._uiContainer.z = 100; // High z-index for UI
            
            if (SceneManager._scene) {
                SceneManager._scene.addChild(this._uiContainer);
            }
        }
        
        _createMinimap() {
            const config = AirshipIllusionUI.UI_CONFIG.minimap;
            
            // Create minimap sprite
            this._minimapSprite = new Sprite();
            this._minimapBitmap = new Bitmap(this._minimapSize, this._minimapSize);
            this._minimapSprite.bitmap = this._minimapBitmap;
            
            // Position minimap
            const pos = this._calculateMinimapPosition();
            this._minimapSprite.x = pos.x;
            this._minimapSprite.y = pos.y;
            
            // Draw minimap background and border
            this._drawMinimapBackground();

            // Apply circular mask if shape is circle
            if (AirshipIllusion.params.minimapShape === 'circle') {
                this._applyCircularMask(this._minimapSprite, this._minimapSize);
            }

            // Create landmark icon container
            this._landmarkIconContainer = new Sprite();
            this._minimapSprite.addChild(this._landmarkIconContainer);
            
            // Create player dot
            this._minimapPlayerDot = new Sprite();
            const dotSize = config.playerSize * 2;
            this._minimapPlayerDot.bitmap = new Bitmap(dotSize, dotSize);
            this._drawPlayerDot();
            this._minimapPlayerDot.anchor.x = 0.5;
            this._minimapPlayerDot.anchor.y = 0.5;
            
            // Create mode text sprite
            this._minimapModeText = new Sprite();
            this._minimapModeText.bitmap = new Bitmap(this._minimapSize, 20);
            this._minimapModeText.y = this._minimapSize + 5;
            this._drawModeText();
            
            // Add to container
            this._uiContainer.addChild(this._minimapSprite);
            this._minimapSprite.addChild(this._minimapPlayerDot);
            this._minimapSprite.addChild(this._minimapModeText);
            
            // Initial update
            this._updateMinimapDisplay();
        }
        
        _calculateMinimapPosition() {
            const margin = 20;
            let x = 0;
            let y = 0;
            
            switch (this._minimapPosition) {
                case 'topLeft':
                    x = margin;
                    y = margin;
                    break;
                case 'topCenter':
                    x = (Graphics.width - this._minimapSize) / 2;
                    y = margin;
                    break;
                case 'topRight':
                    x = Graphics.width - this._minimapSize - margin;
                    y = margin;
                    break;
                case 'topMiddleLeft':
                    x = margin;
                    y = margin + (Graphics.height / 2 - this._minimapSize - margin) / 2;
                    break;
                case 'topMiddleRight':
                    x = Graphics.width - this._minimapSize - margin;
                    y = margin + (Graphics.height / 2 - this._minimapSize - margin) / 2;
                    break;
                case 'middleLeft':
                    x = margin;
                    y = (Graphics.height - this._minimapSize) / 2;
                    break;
                case 'middleRight':
                    x = Graphics.width - this._minimapSize - margin;
                    y = (Graphics.height - this._minimapSize) / 2;
                    break;
                case 'bottomMiddleLeft':
                    x = margin;
                    y = (Graphics.height / 2) + (Graphics.height / 2 - this._minimapSize - margin) / 2;
                    break;
                case 'bottomMiddleRight':
                    x = Graphics.width - this._minimapSize - margin;
                    y = (Graphics.height / 2) + (Graphics.height / 2 - this._minimapSize - margin) / 2;
                    break;
                case 'bottomLeft':
                    x = margin;
                    y = Graphics.height - this._minimapSize - margin;
                    break;
                case 'bottomCenter':
                    x = (Graphics.width - this._minimapSize) / 2;
                    y = Graphics.height - this._minimapSize - margin;
                    break;
                case 'bottomRight':
                    x = Graphics.width - this._minimapSize - margin;
                    y = Graphics.height - this._minimapSize - margin;
                    break;
                case 'none':
                    // 表示しない場合は画面外に配置
                    x = -this._minimapSize * 2;
                    y = -this._minimapSize * 2;
                    break;
            }

            return { x: x, y: y };
        }
        
        _drawMinimapBackground() {
            const config = AirshipIllusionUI.UI_CONFIG.minimap;
            const context = this._minimapBitmap.context;
            const isCircle = AirshipIllusion.params.minimapShape === 'circle';
            const centerX = this._minimapSize / 2;
            const centerY = this._minimapSize / 2;
            const radius = this._minimapSize / 2 - config.borderWidth / 2;

            // Draw background
            context.fillStyle = config.backgroundColor;
            if (isCircle) {
                context.beginPath();
                context.arc(centerX, centerY, radius + config.borderWidth / 2, 0, Math.PI * 2);
                context.fill();
            } else {
                context.fillRect(0, 0, this._minimapSize, this._minimapSize);
            }

            // Draw border
            context.strokeStyle = config.borderColor;
            context.lineWidth = config.borderWidth;
            if (isCircle) {
                context.beginPath();
                context.arc(centerX, centerY, radius, 0, Math.PI * 2);
                context.stroke();
            } else {
                context.strokeRect(
                    config.borderWidth / 2,
                    config.borderWidth / 2,
                    this._minimapSize - config.borderWidth,
                    this._minimapSize - config.borderWidth
                );
            }

            this._minimapBitmap._baseTexture.update();
        }

        _applyCircularMask(sprite, size) {
            // Create circular mask using PIXI Graphics
            const mask = new PIXI.Graphics();
            const radius = size / 2;
            mask.beginFill(0xFFFFFF);
            mask.drawCircle(radius, radius, radius);
            mask.endFill();
            sprite.mask = mask;
            sprite.addChild(mask);
        }
        
        _drawPlayerDot() {
            const config = AirshipIllusionUI.UI_CONFIG.minimap;
            const bitmap = this._minimapPlayerDot.bitmap;
            const context = bitmap.context;
            const centerX = bitmap.width / 2;
            const centerY = bitmap.height / 2;

            // Clear
            context.clearRect(0, 0, bitmap.width, bitmap.height);

            // Determine dot size based on mode
            const dotSize = this._mapMode === AirshipIllusionUI.MAP_MODES.WORLD_VIEW ?
                config.playerSizeWorldView : config.playerSize;

            // Draw player dot (circle)
            context.fillStyle = config.playerColor;
            context.beginPath();
            context.arc(centerX, centerY, dotSize, 0, Math.PI * 2);
            context.fill();

            // Draw direction indicator line (both modes)
            const lineLength = dotSize * 2.5;  // 線の長さ（円の直径より少し長く）
            context.strokeStyle = config.playerColor;
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(centerX, centerY);
            context.lineTo(centerX, centerY - lineLength);
            context.stroke();

            bitmap._baseTexture.update();
        }
        
        _drawModeText() {
            const config = AirshipIllusionUI.UI_CONFIG.minimap;
            const bitmap = this._minimapModeText.bitmap;
            const context = bitmap.context;
            
            // Clear
            context.clearRect(0, 0, bitmap.width, bitmap.height);
            
            // Draw mode text
            context.fillStyle = config.modeTextColor;
            context.font = config.modeTextSize + 'px GameFont';
            context.textAlign = 'center';
            context.textBaseline = 'top';
            
            const modeText = this._mapMode === AirshipIllusionUI.MAP_MODES.CLOSE_UP ? 
                '近接マップ' : '全体マップ';
            context.fillText(modeText, bitmap.width / 2, 0);
            
            bitmap._baseTexture.update();
        }
        
        _updateMinimapDisplay() {
            if (this._mapMode === AirshipIllusionUI.MAP_MODES.CLOSE_UP) {
                this._updateCloseUpMap();
            } else {
                this._updateWorldViewMap();
            }
            
            // ランドマークアイコンの位置も更新
            this._updateLandmarkIconPositions();
        }
        
        _updateCloseUpMap() {
            const masterBitmap = this.getResource('minimapTexture');
            if (!masterBitmap || !masterBitmap.isReady()) {
                return;
            }
            
            const config = AirshipIllusionUI.UI_CONFIG.minimap;
            const context = this._minimapBitmap.context;
            
            // Clear and redraw background
            context.clearRect(0, 0, this._minimapSize, this._minimapSize);
            this._drawMinimapBackground();
            
            // Calculate visible area
            const visibleSize = this._minimapSize - config.borderWidth * 2;
            
            // Calculate scale to show a reasonable portion of the map
            const worldWidth = AirshipIllusion.params.worldWidth;
            const worldHeight = AirshipIllusion.params.worldHeight;
            const viewportSize = Math.min(worldWidth, worldHeight) * 0.1;
            
            // マスターマップとワールド座標の比率を計算
            const masterToWorldRatioX = masterBitmap.width / worldWidth;
            const masterToWorldRatioY = masterBitmap.height / worldHeight;
            
            // ワールド座標を正規化（ラップアラウンド対応）
            const normalizedX = ((this._currentX % worldWidth) + worldWidth) % worldWidth;
            const normalizedY = ((this._currentY % worldHeight) + worldHeight) % worldHeight;
            
            // 正規化された座標をマスターマップ座標に変換
            const centerX = normalizedX * masterToWorldRatioX;
            const centerY = normalizedY * masterToWorldRatioY;
            
            // 表示するマスターマップの範囲を計算
            const sourceSize = viewportSize * Math.min(masterToWorldRatioX, masterToWorldRatioY);
            const sourceX = centerX - sourceSize / 2;
            const sourceY = centerY - sourceSize / 2;
            
            // Set up clipping
            context.save();
            context.beginPath();
            context.rect(
                config.borderWidth,
                config.borderWidth,
                visibleSize,
                visibleSize
            );
            context.clip();
            
            // 境界を越える場合の処理
            const drawTile = (sx, sy, dx, dy, sw, sh) => {
                // ソース座標を0-マップサイズの範囲に収める
                const actualSX = ((sx % masterBitmap.width) + masterBitmap.width) % masterBitmap.width;
                const actualSY = ((sy % masterBitmap.height) + masterBitmap.height) % masterBitmap.height;
                
                // 実際に描画可能な幅と高さ
                const actualWidth = Math.min(sw, masterBitmap.width - actualSX);
                const actualHeight = Math.min(sh, masterBitmap.height - actualSY);
                
                if (actualWidth > 0 && actualHeight > 0) {
                    context.drawImage(
                        masterBitmap.canvas,
                        actualSX, actualSY, actualWidth, actualHeight,
                        dx, dy, 
                        actualWidth * (visibleSize / sourceSize),
                        actualHeight * (visibleSize / sourceSize)
                    );
                }
                
                // 右端の処理
                if (actualWidth < sw) {
                    context.drawImage(
                        masterBitmap.canvas,
                        0, actualSY, sw - actualWidth, actualHeight,
                        dx + actualWidth * (visibleSize / sourceSize), dy,
                        (sw - actualWidth) * (visibleSize / sourceSize),
                        actualHeight * (visibleSize / sourceSize)
                    );
                }
                
                // 下端の処理
                if (actualHeight < sh) {
                    context.drawImage(
                        masterBitmap.canvas,
                        actualSX, 0, actualWidth, sh - actualHeight,
                        dx, dy + actualHeight * (visibleSize / sourceSize),
                        actualWidth * (visibleSize / sourceSize),
                        (sh - actualHeight) * (visibleSize / sourceSize)
                    );
                }
                
                // 右下隅の処理
                if (actualWidth < sw && actualHeight < sh) {
                    context.drawImage(
                        masterBitmap.canvas,
                        0, 0, sw - actualWidth, sh - actualHeight,
                        dx + actualWidth * (visibleSize / sourceSize),
                        dy + actualHeight * (visibleSize / sourceSize),
                        (sw - actualWidth) * (visibleSize / sourceSize),
                        (sh - actualHeight) * (visibleSize / sourceSize)
                    );
                }
            };
            
            try {
                drawTile(sourceX, sourceY, config.borderWidth, config.borderWidth, sourceSize, sourceSize);
            } catch (e) {
                // Fallback gradient
                const gradient = context.createLinearGradient(0, 0, visibleSize, visibleSize);
                gradient.addColorStop(0, 'rgba(50, 100, 50, 0.8)');
                gradient.addColorStop(1, 'rgba(100, 150, 100, 0.8)');
                context.fillStyle = gradient;
                context.fillRect(
                    config.borderWidth,
                    config.borderWidth,
                    visibleSize,
                    visibleSize
                );
            }
            
            context.restore();
            
            // Update player dot position (center in close-up mode)
            this._minimapPlayerDot.x = this._minimapSize / 2;
            this._minimapPlayerDot.y = this._minimapSize / 2;
            this._minimapPlayerDot.visible = true;
            
            this._minimapBitmap._baseTexture.update();
        }
        
        _updateWorldViewMap() {
            const masterBitmap = this.getResource('minimapTexture');
            if (!masterBitmap || !masterBitmap.isReady()) {
                return;
            }
            
            const config = AirshipIllusionUI.UI_CONFIG.minimap;
            const context = this._minimapBitmap.context;
            
            // Clear and redraw background
            context.clearRect(0, 0, this._minimapSize, this._minimapSize);
            this._drawMinimapBackground();
            
            // Calculate visible area
            const visibleSize = this._minimapSize - config.borderWidth * 2;
            
            // Set up clipping
            context.save();
            context.beginPath();
            context.rect(
                config.borderWidth,
                config.borderWidth,
                visibleSize,
                visibleSize
            );
            context.clip();
            
            try {
                // Draw the entire master map scaled to fit
                context.drawImage(
                    masterBitmap.canvas,
                    0, 0, masterBitmap.width, masterBitmap.height,
                    config.borderWidth, config.borderWidth,
                    visibleSize, visibleSize
                );
            } catch (e) {
                // Fallback gradient
                const gradient = context.createLinearGradient(0, 0, visibleSize, visibleSize);
                gradient.addColorStop(0, 'rgba(50, 100, 50, 0.8)');
                gradient.addColorStop(1, 'rgba(100, 150, 100, 0.8)');
                context.fillStyle = gradient;
                context.fillRect(
                    config.borderWidth,
                    config.borderWidth,
                    visibleSize,
                    visibleSize
                );
            }
            
            context.restore();
            
            // Update player dot position based on world position
            const worldWidth = AirshipIllusion.params.worldWidth;
            const worldHeight = AirshipIllusion.params.worldHeight;
            
            // 位置を正規化（0-1の範囲）して、負の値も正しく処理
            const normalizedX = ((this._currentX % worldWidth) + worldWidth) % worldWidth / worldWidth;
            const normalizedY = ((this._currentY % worldHeight) + worldHeight) % worldHeight / worldHeight;
            
            const dotX = normalizedX * visibleSize + config.borderWidth;
            const dotY = normalizedY * visibleSize + config.borderWidth;
            
            this._minimapPlayerDot.x = dotX;
            this._minimapPlayerDot.y = dotY;
            
            // Handle blinking effect in world view
            this._blinkTimer++;
            if (this._blinkTimer > config.blinkSpeed * 2) {
                this._blinkTimer = 0;
            }
            this._minimapPlayerDot.visible = this._blinkTimer < config.blinkSpeed;
            
            this._minimapBitmap._baseTexture.update();
        }
        
        _createCompass() {
            const config = AirshipIllusionUI.UI_CONFIG.compass;
            
            // Create compass sprite
            this._compassSprite = new Sprite();
            this._compassBitmap = new Bitmap(this._compassSize, this._compassSize);
            this._compassSprite.bitmap = this._compassBitmap;
            
            // Position compass
            const pos = this._calculateCompassPosition();
            this._compassSprite.x = pos.x;
            this._compassSprite.y = pos.y;
            
            // Draw compass
            this._drawCompass();
            
            // Add to container
            this._uiContainer.addChild(this._compassSprite);
        }
        
        _calculateCompassPosition() {
            const margin = 20;
            let x = 0;
            let y = margin;

            switch (this._compassPosition) {
                case 'topLeft':
                    x = margin;
                    y = margin;
                    break;
                case 'topCenter':
                    x = (Graphics.width - this._compassSize) / 2;
                    y = margin;
                    break;
                case 'topRight':
                    x = Graphics.width - this._compassSize - margin;
                    y = margin;
                    break;
                case 'topMiddleLeft':
                    x = margin;
                    y = margin + (Graphics.height / 2 - this._compassSize - margin) / 2;
                    break;
                case 'topMiddleRight':
                    x = Graphics.width - this._compassSize - margin;
                    y = margin + (Graphics.height / 2 - this._compassSize - margin) / 2;
                    break;
                case 'middleLeft':
                    x = margin;
                    y = (Graphics.height - this._compassSize) / 2;
                    break;
                case 'middleRight':
                    x = Graphics.width - this._compassSize - margin;
                    y = (Graphics.height - this._compassSize) / 2;
                    break;
                case 'bottomMiddleLeft':
                    x = margin;
                    y = (Graphics.height / 2) + (Graphics.height / 2 - this._compassSize - margin) / 2;
                    break;
                case 'bottomMiddleRight':
                    x = Graphics.width - this._compassSize - margin;
                    y = (Graphics.height / 2) + (Graphics.height / 2 - this._compassSize - margin) / 2;
                    break;
                case 'bottomLeft':
                    x = margin;
                    y = Graphics.height - this._compassSize - margin;
                    break;
                case 'bottomCenter':
                    x = (Graphics.width - this._compassSize) / 2;
                    y = Graphics.height - this._compassSize - margin;
                    break;
                case 'bottomRight':
                    x = Graphics.width - this._compassSize - margin;
                    y = Graphics.height - this._compassSize - margin;
                    break;
                case 'none':
                    // 表示しない場合は画面外に配置
                    x = -this._compassSize * 2;
                    y = -this._compassSize * 2;
                    break;
            }

            return { x: x, y: y };
        }
        
        _drawCompass() {
            const config = AirshipIllusionUI.UI_CONFIG.compass;
            const context = this._compassBitmap.context;
            const centerX = this._compassSize / 2;
            const centerY = this._compassSize / 2;
            const radius = (this._compassSize - config.borderWidth * 2) / 2;
            
            // Clear
            context.clearRect(0, 0, this._compassSize, this._compassSize);
            
            // Draw background circle
            context.fillStyle = config.backgroundColor;
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, Math.PI * 2);
            context.fill();
            
            // Draw border
            context.strokeStyle = config.borderColor;
            context.lineWidth = config.borderWidth;
            context.stroke();
            
            // Draw cardinal directions
            context.fillStyle = config.textColor;
            context.font = config.fontSize + 'px GameFont';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            
            // North
            context.fillText('N', centerX, centerY - radius + 15);
            // South
            context.fillText('S', centerX, centerY + radius - 15);
            // East (東 - 右側)
            context.fillText('E', centerX + radius - 15, centerY);
            // West (西 - 左側)
            context.fillText('W', centerX - radius + 15, centerY);
            
            // Draw compass needle
            context.save();
            context.translate(centerX, centerY);
            // コンパスの針は現在の向きと逆方向に回転（コンパスは固定、世界が回転）
            context.rotate(this._currentAngle);
            
            // Red needle (North)
            context.fillStyle = config.needleColor;
            context.beginPath();
            context.moveTo(0, -radius * 0.7);
            context.lineTo(-5, 0);
            context.lineTo(0, -5);
            context.lineTo(5, 0);
            context.closePath();
            context.fill();
            
            // White needle (South)
            context.fillStyle = '#FFFFFF';
            context.beginPath();
            context.moveTo(0, radius * 0.7);
            context.lineTo(-5, 0);
            context.lineTo(0, 5);
            context.lineTo(5, 0);
            context.closePath();
            context.fill();
            
            // Center dot
            context.fillStyle = '#000000';
            context.beginPath();
            context.arc(0, 0, 3, 0, Math.PI * 2);
            context.fill();
            
            context.restore();
            
            this._compassBitmap._baseTexture.update();
        }
        
        onActivate() {
            // 街名ウィンドウを再作成（シーン切り替え対応）
            if (!this._landmarkNameWindow || !this._landmarkNameWindow.parent) {
                this._createLandmarkNameWindow();
            }
            
            // Listen to position and angle updates
            AirshipIllusion.eventBus.on('positionChanged', this._onPositionChanged, this);
            AirshipIllusion.eventBus.on('angleChanged', this._onAngleChanged, this);
            
            // ランドマークアイコン追加リクエストをリッスン
            AirshipIllusion.eventBus.on('addMinimapIcon', this._onAddMinimapIcon, this);
        }
        
        onDeactivate() {
            // Remove event listeners
            AirshipIllusion.eventBus.off('positionChanged', this._onPositionChanged, this);
            AirshipIllusion.eventBus.off('angleChanged', this._onAngleChanged, this);
            AirshipIllusion.eventBus.off('addMinimapIcon', this._onAddMinimapIcon, this);
            
            // 街名ウィンドウのリスナーも削除
            if (this._landmarkNameListener) {
                AirshipIllusion.eventBus.off('landmarkNameChanged', this._landmarkNameListener);
                this._landmarkNameListenerRegistered = false;
            }
        }
        
        _onPositionChanged(data) {
            this._currentX = data.x;
            this._currentY = data.y;
            
            // Update minimap
            this._updateMinimapDisplay();
        }
        
        _onAngleChanged(data) {
            this._currentAngle = data.angle;

            // Update compass
            this._drawCompass();

            // Update player dot rotation (both modes)
            if (this._minimapPlayerDot) {
                this._minimapPlayerDot.rotation = this._currentAngle;
            }
        }
        
        _onAddMinimapIcon(data) {
            // 既に追加済みかチェック
            if (this._landmarkIcons.some(icon => icon.id === data.id)) {
                return;
            }
            
            // アイコンスプライトを作成（16x16のミニマップ用サイズ）
            const iconSprite = new Sprite();
            const iconSize = 16;  // ミニマップ用のサイズ
            iconSprite.bitmap = new Bitmap(iconSize, iconSize);
            
            // アイコンインデックスを取得（FieldShaderで既に決定されている）
            const iconIndex = data.iconIndex || 176;  // デフォルトは街のアイコン
            
            // IconSetから必ずアイコンを描画
            const iconSet = ImageManager.loadSystem('IconSet');
            iconSet.addLoadListener(() => {
                const pw = 32;
                const ph = 32;
                const sx = (iconIndex % 16) * pw;
                const sy = Math.floor(iconIndex / 16) * ph;
                
                // iconSizeにリサイズして描画
                iconSprite.bitmap.blt(iconSet, sx, sy, pw, ph, 0, 0, iconSize, iconSize);
            });
            
            // アイコンコンテナに追加
            if (this._landmarkIconContainer) {
                this._landmarkIconContainer.addChild(iconSprite);
            }
            
            // アイコン情報を保存
            this._landmarkIcons.push({
                id: data.id,
                sprite: iconSprite,
                worldX: data.worldX || data.x,
                worldY: data.worldY || data.y,
                name: data.name
            });
            
            // 位置を更新
            this._updateLandmarkIconPositions();
        }
        
        _updateLandmarkIconPositions() {
            const config = AirshipIllusionUI.UI_CONFIG.minimap;
            const visibleSize = this._minimapSize - config.borderWidth * 2;
            
            this._landmarkIcons.forEach((icon, index) => {
                if (this._mapMode === AirshipIllusionUI.MAP_MODES.WORLD_VIEW) {
                    // 全体マップモード：アイコンは非表示
                    icon.sprite.visible = false;
                } else {
                    // 近接マップモード：範囲内のみ表示
                    let dx = icon.worldX - this._currentX;
                    let dy = icon.worldY - this._currentY;
                    const worldWidth = AirshipIllusion.params.worldWidth;
                    const worldHeight = AirshipIllusion.params.worldHeight;
                    
                    // ラップアラウンド処理
                    if (Math.abs(dx - worldWidth) < Math.abs(dx)) {
                        dx = dx - worldWidth;
                    } else if (Math.abs(dx + worldWidth) < Math.abs(dx)) {
                        dx = dx + worldWidth;
                    }
                    
                    if (Math.abs(dy - worldHeight) < Math.abs(dy)) {
                        dy = dy - worldHeight;
                    } else if (Math.abs(dy + worldHeight) < Math.abs(dy)) {
                        dy = dy + worldHeight;
                    }
                    
                    const viewportSize = Math.min(worldWidth, worldHeight) * 0.1;
                    
                    if (Math.abs(dx) < viewportSize / 2 && Math.abs(dy) < viewportSize / 2) {
                        const relX = dx / viewportSize + 0.5;
                        const relY = dy / viewportSize + 0.5;
                        
                        // アイコンサイズの半分をオフセットとして使用（中心に配置）
                        const iconOffset = 8;  // 16x16アイコンの半分
                        icon.sprite.x = relX * visibleSize + config.borderWidth - iconOffset;
                        icon.sprite.y = relY * visibleSize + config.borderWidth - iconOffset;
                        icon.sprite.visible = true;
                    } else {
                        icon.sprite.visible = false;
                    }
                }
            });
        }
        
        onUpdate() {
            // Handle Tab key for mode switching
            if (Input.isTriggered('tab')) {
                this._switchMapMode();
            }
            
            // Update auto-flight indicator
            this._updateAutoFlightIndicator();
            
            // Update blinking effect for world view
            if (this._mapMode === AirshipIllusionUI.MAP_MODES.WORLD_VIEW) {
                this._updateWorldViewMap();
            }
        }
        
        _updateAutoFlightIndicator() {
            if (!this._autoFlightWindow) return;
            
            // 点滅アニメーション
            if (this._autoFlightWindow.visible && !this._autoFlightFadeOut) {
                if (this._autoFlightBlinkTimer !== undefined) {
                    this._autoFlightBlinkTimer++;
                    if (this._autoFlightBlinkTimer % 30 === 0) {
                        // 点滅
                        this._autoFlightWindow.contentsOpacity = 
                            this._autoFlightWindow.contentsOpacity === 255 ? 180 : 255;
                    }
                }
            }
            
            // フェードアウト処理
            if (this._autoFlightFadeOut) {
                this._autoFlightWindow.contentsOpacity -= 5;
                if (this._autoFlightWindow.contentsOpacity <= 0) {
                    this._autoFlightWindow.visible = false;
                    this._autoFlightFadeOut = false;
                    this._autoFlightBlinkTimer = undefined;
                }
            }
        }
        
        _switchMapMode() {
            // Toggle between modes
            if (this._mapMode === AirshipIllusionUI.MAP_MODES.CLOSE_UP) {
                this._mapMode = AirshipIllusionUI.MAP_MODES.WORLD_VIEW;
            } else {
                this._mapMode = AirshipIllusionUI.MAP_MODES.CLOSE_UP;
            }
            
            // Update display
            this._drawPlayerDot();
            this._drawModeText();
            this._updateMinimapDisplay();
            
            // Play sound effect
            SoundManager.playCursor();
            
            // Emit mode change event
            this.emit('mapModeChanged', { mode: this._mapMode });
        }
        
        onDispose() {
            // Clean up UI container
            if (this._uiContainer && this._uiContainer.parent) {
                this._uiContainer.parent.removeChild(this._uiContainer);
            }
            
            // Clean up bitmaps
            if (this._minimapBitmap) {
                if (typeof this._minimapBitmap.destroy === 'function') {
                    this._minimapBitmap.destroy();
                }
            }
            if (this._compassBitmap) {
                if (typeof this._compassBitmap.destroy === 'function') {
                    this._compassBitmap.destroy();
                }
            }
            if (this._minimapPlayerDot && this._minimapPlayerDot.bitmap) {
                if (typeof this._minimapPlayerDot.bitmap.destroy === 'function') {
                    this._minimapPlayerDot.bitmap.destroy();
                }
            }
            if (this._minimapModeText && this._minimapModeText.bitmap) {
                if (typeof this._minimapModeText.bitmap.destroy === 'function') {
                    this._minimapModeText.bitmap.destroy();
                }
            }
            
            // Clean up landmark icons
            this._landmarkIcons.forEach(icon => {
                if (icon.sprite.bitmap && typeof icon.sprite.bitmap.destroy === 'function') {
                    icon.sprite.bitmap.destroy();
                }
            });
        }
        
        // Public methods
        showUI() {
            if (this._uiContainer) {
                this._uiContainer.visible = true;
            }
        }
        
        hideUI() {
            if (this._uiContainer) {
                this._uiContainer.visible = false;
            }
        }
        
        setMinimapOpacity(opacity) {
            if (this._minimapSprite) {
                this._minimapSprite.opacity = opacity * 255;
            }
        }
        
        setCompassOpacity(opacity) {
            if (this._compassSprite) {
                this._compassSprite.opacity = opacity * 255;
            }
        }
        
        getMapMode() {
            return this._mapMode;
        }
        
        setMapMode(mode) {
            if (mode === AirshipIllusionUI.MAP_MODES.CLOSE_UP || 
                mode === AirshipIllusionUI.MAP_MODES.WORLD_VIEW) {
                this._mapMode = mode;
                this._drawPlayerDot();
                this._drawModeText();
                this._updateMinimapDisplay();
            }
        }
    }
    
    // Export
    window.AirshipIllusionUI = AirshipIllusionUI;
    
    //=============================================================================
    // Window_LandmarkName - 街名表示ウィンドウ
    //=============================================================================
    
    class Window_LandmarkName extends Window_Base {
        initialize() {
            const rect = this.windowRect();
            super.initialize(rect);
            this._currentLandmarkName = '';
            this._fadeTimer = 0;
            this._position = 'topCenter'; // デフォルト位置
            this.opacity = 0;
            this.contentsOpacity = 0;
            this.z = 100;  // ワールドマップ（z=1000〜1002）より後ろ、他のUIより前
        }

        windowRect() {
            const width = 300;
            const height = this.fittingHeight(1);
            const margin = 20;
            let x = 0;
            let y = 0;

            // 位置設定に応じて座標を計算
            switch (this._position) {
                case 'topLeft':
                    x = margin;
                    y = margin;
                    break;
                case 'topCenter':
                    x = (Graphics.width - width) / 2;
                    y = margin;
                    break;
                case 'topRight':
                    x = Graphics.width - width - margin;
                    y = margin;
                    break;
                case 'topMiddleLeft':
                    x = margin;
                    y = margin + (Graphics.height / 2 - height - margin) / 2;
                    break;
                case 'topMiddleRight':
                    x = Graphics.width - width - margin;
                    y = margin + (Graphics.height / 2 - height - margin) / 2;
                    break;
                case 'middleLeft':
                    x = margin;
                    y = (Graphics.height - height) / 2;
                    break;
                case 'middleRight':
                    x = Graphics.width - width - margin;
                    y = (Graphics.height - height) / 2;
                    break;
                case 'bottomMiddleLeft':
                    x = margin;
                    y = (Graphics.height / 2) + (Graphics.height / 2 - height - margin) / 2;
                    break;
                case 'bottomMiddleRight':
                    x = Graphics.width - width - margin;
                    y = (Graphics.height / 2) + (Graphics.height / 2 - height - margin) / 2;
                    break;
                case 'bottomLeft':
                    x = margin;
                    y = Graphics.height - height - margin;
                    break;
                case 'bottomCenter':
                    x = (Graphics.width - width) / 2;
                    y = Graphics.height - height - margin;
                    break;
                case 'bottomRight':
                    x = Graphics.width - width - margin;
                    y = Graphics.height - height - margin;
                    break;
                default:
                    x = (Graphics.width - width) / 2;
                    y = margin;
                    break;
            }

            return new Rectangle(x, y, width, height);
        }

        setLandmarkName(name, position) {
            // 位置が変更された場合は再配置
            if (position && position !== this._position) {
                this._position = position;
                const rect = this.windowRect();
                this.move(rect.x, rect.y, rect.width, rect.height);
            }

            if (this._currentLandmarkName !== name) {
                this._currentLandmarkName = name;
                this._fadeTimer = -1; // -1 = 永続表示（自動フェードアウトなし）
                this.refresh();
            }
        }
        
        refresh() {
            this.contents.clear();
            if (this._currentLandmarkName) {
                this.changeTextColor(ColorManager.normalColor());
                this.drawText(this._currentLandmarkName, 0, 0, this.contentsWidth(), 'center');
            }
        }
        
        update() {
            super.update();
            
            // _fadeTimer = -1 の場合は永続表示（フェードイン後はそのまま維持）
            if (this._fadeTimer === -1) {
                // フェードイン処理
                if (this.opacity < 255) {
                    this.opacity = Math.min(this.opacity + 15, 255);
                    this.contentsOpacity = Math.min(this.contentsOpacity + 15, 255);
                }
            }
            // _fadeTimer = 30 の場合はフェードアウト（ランドマークから離れた時）
            else if (this._fadeTimer > 0) {
                this._fadeTimer--;
                // フェードアウト
                if (this._fadeTimer < 30) {
                    this.opacity = Math.max(this.opacity - 10, 0);
                    this.contentsOpacity = Math.max(this.contentsOpacity - 10, 0);
                }
            } else {
                this.opacity = 0;
                this.contentsOpacity = 0;
            }
        }
    }
    
    //=============================================================================
    // Scene_Map extensions - ランドマーク名表示を追加
    //=============================================================================
    
    // Scene_Map用
    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createLandmarkNameWindow();
    };
    
    Scene_Map.prototype.createLandmarkNameWindow = function() {
        // UIモジュールがウィンドウを作成するので、ここでは何もしない
        // AirshipIllusionUIが全て管理する
    };
    
})();