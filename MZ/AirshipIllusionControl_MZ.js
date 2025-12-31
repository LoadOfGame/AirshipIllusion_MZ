//=============================================================================
// AirshipIllusionControl_MZ.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Airship Illusion - Control Module v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 * @help
 * ============================================================================
 * Airship Illusion - Control Module v1.0.0 for RPG Maker MZ
 * ============================================================================
 *
 * This module handles player input and movement control for the
 * Airship Illusion system.
 * Processes keyboard input for movement, turning, boost, camera pitch,
 * and landing.
 * Must be used together with AirshipIllusionCore_MZ.js.
 *
 * Controls:
 * Up/Down keys: Move forward/backward
 * Left/Right keys: Turn
 * Shift: Boost
 * PageUp: Tilt camera up
 * PageDown: Tilt camera down
 * V: Land
 * C: Enter airship interior
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
 */

/*:ja
 * @target MZ
 * @plugindesc 飛空艇イリュージョン - 操作制御モジュール v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 * @help
 * ============================================================================
 * 飛空艇イリュージョン - 操作制御モジュール v1.0.0 for RPG Maker MZ
 * ============================================================================
 *
 * このモジュールは飛空艇イリュージョンシステムのプレイヤー入力と移動制御を処理します。
 * 移動、旋回、ブースト、カメラピッチ、着陸のキーボード入力を処理します。
 * AirshipIllusionCore_MZ.jsと一緒に使用する必要があります。
 *
 * 操作方法:
 * 上下キー: 前進・後退
 * 左右キー: 旋回
 * Shift: ブースト
 * PageUp: カメラを上向きに
 * PageDown: カメラを下向きに
 * V: 着陸
 * C: 飛空艇内部へ
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
 */

(() => {
    'use strict';

    // コアプラグインが読み込まれているかチェック
    if (!window.AirshipIllusion || !window.AirshipIllusion.Base) {
        throw new Error('AirshipIllusionControl_MZ requires AirshipIllusionCore_MZ to be loaded first');
    }
    
    // カスタムキー入力を追加
    Input.keyMapper[86] = 'landing';  // Vキー（キーコード86）を'landing'としてマッピング
    
    // Cキーのデフォルトマッピングを保存してから上書き
    const originalCKey = Input.keyMapper[67];
    Input.keyMapper[67] = 'interior'; // Cキー（キーコード67）を'interior'としてマッピング
    
    // 元のInput.isTriggeredを保存
    const _Input_isTriggered = Input.isTriggered;
    Input.isTriggered = function(keyName) {
        // Cキーが押された時、'interior'として認識
        if (keyName === 'interior' && Input._currentState[67] && !Input._previousState[67]) {
            return true;
        }
        // 'ok'が呼ばれた時、Cキーを除外
        if (keyName === 'ok' && Input._currentState[67]) {
            return false;
        }
        return _Input_isTriggered.call(this, keyName);
    };
    
    //=============================================================================
    // AirshipIllusionControl
    //=============================================================================
    
    class AirshipIllusionControl extends AirshipIllusion.Base {
        // 移動状態
        static MOVEMENT_STATES = {
            IDLE: 'idle',
            CRUISING: 'cruising',
            BOOSTING: 'boosting',
            LANDING: 'landing'
        };
        
        // 操作設定
        static CONTROL_CONFIG = {
            speedInterpolation: 0.05,      // 速度変化の滑らかさ
            turnInterpolation: 0.1,        // 旋回の滑らかさ
            maxTurnSpeed: 3.0,             // 最大旋回速度（度/フレーム）
            brakeStrength: 0.95,           // ブレーキ強度係数
            boostAcceleration: 0.2,        // ブースト加速率
            normalAcceleration: 0.1,       // 通常加速率
            // カメラピッチ設定
            pitchSpeed: 0.02,              // ピッチ変更速度（ラジアン/フレーム）
            pitchInterpolation: 0.1        // ピッチ変更の滑らかさ
        };
        
        onInitialize() {
            // 移動状態
            this._movementState = AirshipIllusionControl.MOVEMENT_STATES.IDLE;
            
            // 位置と移動
            this._position = { x: 5000, y: 5000 };
            this._angle = 0; // ラジアン（0 = 北向き、時計回り）
            this._currentSpeed = 0;
            this._targetSpeed = 0;
            this._currentTurnSpeed = 0;
            this._targetTurnSpeed = 0;
            
            // カメラピッチ（最大上向きから開始）
            this._cameraPitch = AirshipIllusion.params.maxCameraPitchUp || 0;
            this._targetPitch = this._cameraPitch;
            
            // 入力状態
            this._isMovingForward = false;
            this._isMovingBackward = false;
            this._isTurningLeft = false;
            this._isTurningRight = false;
            this._isBoosting = false;
            this._isLanding = false;
            this._isGoingToInterior = false;  // 内部への移動
            this._isPitchingUp = false;   // PageUpキー
            this._isPitchingDown = false; // PageDownキー
            
            // オートパイロット用
            this._autoFlightTarget = null;
            this._isAutoFlying = false;
            this._autoFlightLogShown = false;
            this._autoFlightStartFrame = 0;  // 開始フレームを記録
            
            // プラグイン設定からの移動パラメータ
            this._cruiseSpeed = AirshipIllusion.params.cruiseSpeed;
            this._boostMultiplier = AirshipIllusion.params.boostMultiplier;
            this._rotationSpeed = AirshipIllusion.params.rotationSpeed * Math.PI / 180; // ラジアンに変換
            this._enableCameraPitch = AirshipIllusion.params.enableCameraPitch;
            this._maxPitchUp = AirshipIllusion.params.maxCameraPitchUp;
            this._maxPitchDown = AirshipIllusion.params.maxCameraPitchDown;
            
            // 境界制限（ワールドサイズパラメータから設定）
            this._minX = 0;
            this._maxX = AirshipIllusion.params.worldWidth;
            this._minY = 0;
            this._maxY = AirshipIllusion.params.worldHeight;
            
            // ゲーム状態から位置を初期化
            if (typeof $gameAirshipIllusion !== 'undefined' && $gameAirshipIllusion) {
                this._position.x = $gameAirshipIllusion.position.x;
                this._position.y = $gameAirshipIllusion.position.y;
                this._angle = $gameAirshipIllusion.angle;
                this._cameraPitch = $gameAirshipIllusion.cameraPitch || 0;
            }
        }
        
        onActivate() {
            // 自動飛行中の場合は$gameAirshipIllusionから位置を再同期
            if ($gameAirshipIllusion && $gameAirshipIllusion.isAutoFlying) {
                this._position.x = $gameAirshipIllusion.position.x;
                this._position.y = $gameAirshipIllusion.position.y;
                this._angle = $gameAirshipIllusion.angle;
            }
            
            // 初期イベントを発火
            this.emit('positionChanged', {
                x: this._position.x,
                y: this._position.y,
                speed: this._currentSpeed
            });
            
            this.emit('angleChanged', {
                angle: this._angle,
                degrees: this._angle * 180 / Math.PI
            });
            
            if (this._enableCameraPitch) {
                this.emit('cameraPitchChanged', {
                    pitch: this._cameraPitch,
                    degrees: this._cameraPitch * 180 / Math.PI
                });
            }
        }
        
        onDeactivate() {
            // ゲーム状態に位置を保存
            if (typeof $gameAirshipIllusion !== 'undefined' && $gameAirshipIllusion) {
                $gameAirshipIllusion.position.x = this._position.x;
                $gameAirshipIllusion.position.y = this._position.y;
                $gameAirshipIllusion.angle = this._angle;
                $gameAirshipIllusion.speed = this._currentSpeed;
                $gameAirshipIllusion.cameraPitch = this._cameraPitch;
            }
        }
        
        onUpdate() {
            this._updateInput();
            
            // 自動飛行の状態を同期
            if ($gameAirshipIllusion) {
                const wasAutoFlying = this._isAutoFlying;
                this._isAutoFlying = $gameAirshipIllusion.isAutoFlying;
                this._autoFlightTarget = $gameAirshipIllusion.autoFlightTarget;

                // 新しくオートパイロットが開始された場合
                if (!wasAutoFlying && this._isAutoFlying) {
                    this._autoFlightStartFrame = Graphics.frameCount;
                }
            }

            // 自動飛行中は専用の処理
            if (this._isAutoFlying && this._autoFlightTarget) {
                this._updateAutoFlight();
                this._checkBoundaries();
                this._emitEvents();
                return;
            }
            
            // 自動飛行中は手動制御をスキップ
            if ($gameAirshipIllusion && $gameAirshipIllusion.isAutoFlying) {
                // 自動飛行中は$gameAirshipIllusionの位置を同期
                this._position.x = $gameAirshipIllusion.position.x;
                this._position.y = $gameAirshipIllusion.position.y;
                this._angle = $gameAirshipIllusion.angle;
                this._currentSpeed = 0;  // 速度は0に設定（自動飛行が管理）
                this._emitEvents();
                return;
            }
            
            this._updateMovementState();
            this._updateSpeed();
            this._updateTurning();
            if (this._enableCameraPitch) {
                this._updateCameraPitch();
            }
            this._updatePosition();
            this._checkBoundaries();
            this._emitEvents();
        }
        
        _updateInput() {
            // 自動飛行中は手動操作を無効化
            if (this._isAutoFlying) {
                this._isMovingForward = false;
                this._isMovingBackward = false;
                this._isTurningLeft = false;
                this._isTurningRight = false;
                this._isBoosting = false;
                this._isPitchingUp = false;
                this._isPitchingDown = false;
                
                // キャンセルで自動飛行を中断
                if (Input.isTriggered('cancel')) {
                    this._cancelAutoFlight();
                }
                return;
            }
            
            // 入力状態を更新
            this._isMovingForward = Input.isPressed('up');
            this._isMovingBackward = Input.isPressed('down');
            this._isTurningLeft = Input.isPressed('left');
            this._isTurningRight = Input.isPressed('right');
            
            // ブースト（Shiftキー）
            this._isBoosting = Input.isPressed('shift');
            
            // カメラピッチ操作
            if (this._enableCameraPitch) {
                this._isPitchingUp = Input.isPressed('pageup');
                this._isPitchingDown = Input.isPressed('pagedown');
            }
            
            // Vキーで着陸
            if (Input.isTriggered('landing')) {
                this._isLanding = true;
            }
            
            // Cキー専用で内部へ（Zキーは除外）
            if (Input.isTriggered('interior')) {
                this._isGoingToInterior = true;
            }
        }
        
        _updateMovementState() {
            let newState = this._movementState;
            
            if (this._isLanding) {
                newState = AirshipIllusionControl.MOVEMENT_STATES.LANDING;
            } else if (this._isBoosting && this._isMovingForward) {
                newState = AirshipIllusionControl.MOVEMENT_STATES.BOOSTING;
            } else if (this._isMovingForward || this._isMovingBackward) {
                newState = AirshipIllusionControl.MOVEMENT_STATES.CRUISING;
            } else {
                newState = AirshipIllusionControl.MOVEMENT_STATES.IDLE;
            }
            
            // 状態変更イベントを発行
            if (newState !== this._movementState) {
                const oldState = this._movementState;
                this._movementState = newState;
                
                this.emit('movementStateChanged', {
                    from: oldState,
                    to: newState
                });
                
                // 特定のブースト状態変更を発行
                if (oldState === AirshipIllusionControl.MOVEMENT_STATES.BOOSTING ||
                    newState === AirshipIllusionControl.MOVEMENT_STATES.BOOSTING) {
                    this.emit('boostStateChanged', {
                        isBoosting: newState === AirshipIllusionControl.MOVEMENT_STATES.BOOSTING
                    });
                }
            }
        }
        
        _updateSpeed() {
            const config = AirshipIllusionControl.CONTROL_CONFIG;
            
            // 入力に基づいて目標速度を計算
            if (this._isMovingForward) {
                if (this._isBoosting) {
                    this._targetSpeed = this._cruiseSpeed * this._boostMultiplier;
                } else {
                    this._targetSpeed = this._cruiseSpeed;
                }
            } else if (this._isMovingBackward) {
                this._targetSpeed = -this._cruiseSpeed * 0.5; // 後退時は半分の速度
            } else {
                this._targetSpeed = 0;
            }
            
            // 加速/減速を適用
            const acceleration = this._isBoosting ? config.boostAcceleration : config.normalAcceleration;
            
            if (Math.abs(this._targetSpeed - this._currentSpeed) < 0.01) {
                this._currentSpeed = this._targetSpeed;
            } else if (this._targetSpeed > this._currentSpeed) {
                this._currentSpeed += acceleration;
                if (this._currentSpeed > this._targetSpeed) {
                    this._currentSpeed = this._targetSpeed;
                }
            } else if (this._targetSpeed < this._currentSpeed) {
                if (this._targetSpeed === 0) {
                    // ブレーキを適用
                    this._currentSpeed *= config.brakeStrength;
                    if (Math.abs(this._currentSpeed) < 0.01) {
                        this._currentSpeed = 0;
                    }
                } else {
                    // 通常の減速
                    this._currentSpeed -= acceleration;
                    if (this._currentSpeed < this._targetSpeed) {
                        this._currentSpeed = this._targetSpeed;
                    }
                }
            }
        }
        
        _updateTurning() {
            const config = AirshipIllusionControl.CONTROL_CONFIG;
            
            // 目標旋回速度を計算
            if (this._isTurningLeft && !this._isTurningRight) {
                this._targetTurnSpeed = -this._rotationSpeed;  // 左は負の回転（反時計回り）
            } else if (this._isTurningRight && !this._isTurningLeft) {
                this._targetTurnSpeed = this._rotationSpeed;   // 右は正の回転（時計回り）
            } else {
                this._targetTurnSpeed = 0;
            }
            
            // 移動速度に応じて旋回速度をスケール
            // 停止時でも旋回できるように最小値を設定
            const speedFactor = Math.min(1, Math.abs(this._currentSpeed) / this._cruiseSpeed + 0.3);
            this._targetTurnSpeed *= speedFactor;
            
            // 旋回速度を補間
            const turnDiff = this._targetTurnSpeed - this._currentTurnSpeed;
            this._currentTurnSpeed += turnDiff * config.turnInterpolation;
            
            // 旋回を適用
            if (Math.abs(this._currentTurnSpeed) > 0.001) {
                this._angle += this._currentTurnSpeed;
                
                // 角度を0-2πに正規化
                while (this._angle < 0) {
                    this._angle += Math.PI * 2;
                }
                while (this._angle >= Math.PI * 2) {
                    this._angle -= Math.PI * 2;
                }
            }
            
            // 旋回状態変更を発行（旋回していない場合も含めて常に発行）
            this.emit('turningStateChanged', {
                turningLeft: this._isTurningLeft,
                turningRight: this._isTurningRight,
                turnSpeed: this._currentTurnSpeed
            });
        }
        
        _updateCameraPitch() {
            const config = AirshipIllusionControl.CONTROL_CONFIG;
            
            // 目標ピッチを計算
            if (this._isPitchingUp && !this._isPitchingDown) {
                this._targetPitch = Math.min(this._cameraPitch + config.pitchSpeed, this._maxPitchUp);
            } else if (this._isPitchingDown && !this._isPitchingUp) {
                this._targetPitch = Math.max(this._cameraPitch - config.pitchSpeed, this._maxPitchDown);
            }
            
            // スムーズに補間
            const pitchDiff = this._targetPitch - this._cameraPitch;
            this._cameraPitch += pitchDiff * config.pitchInterpolation;
            
            // 非常に小さい値は0にする
            if (Math.abs(this._cameraPitch) < 0.001) {
                this._cameraPitch = 0;
            }
        }
        
        _updatePosition() {
            if (Math.abs(this._currentSpeed) < 0.001) {
                // 速度が0なので移動しない
                return;
            }
            
            // 移動方向を計算
            // 座標系の定義：
            // - 角度0 = 北向き（画面上方向）
            // - 時計回りで角度が増加
            // - Y軸は下が正（スクリーン座標系）
            
            // 重要な修正：Y軸の符号を考慮
            const directionX = Math.sin(this._angle);      // 東西方向
            const directionY = -Math.cos(this._angle);     // 南北方向（Y軸反転）
            
            // 速度に方向を掛けて実際の移動量を計算
            const dx = directionX * this._currentSpeed;
            const dy = directionY * this._currentSpeed;
            
            // 位置を更新
            this._position.x += dx;
            this._position.y += dy;
        }
        
        _checkBoundaries() {
            // 座標を常にワールドサイズの範囲内に保つ（ラップアラウンド）
            this._position.x = ((this._position.x % this._maxX) + this._maxX) % this._maxX;
            this._position.y = ((this._position.y % this._maxY) + this._maxY) % this._maxY;
            
            // 注: $gameAirshipIllusionへの同期は_emitEventsで行うため、ここでは行わない
        }
        
        _emitEvents() {
            // $gameAirshipIllusionと座標を同期
            // Control層が移動を管理しているので、常に同期する
            if ($gameAirshipIllusion) {
                $gameAirshipIllusion.position.x = this._position.x;
                $gameAirshipIllusion.position.y = this._position.y;
                $gameAirshipIllusion.angle = this._angle;
            }
            
            // 位置変更イベントを発行
            this.emit('positionChanged', {
                x: this._position.x,
                y: this._position.y,
                speed: this._currentSpeed
            });
            
            // 角度変更イベントを発行
            this.emit('angleChanged', {
                angle: this._angle,
                degrees: this._angle * 180 / Math.PI
            });
            
            // カメラピッチ変更イベントを発行
            if (this._enableCameraPitch) {
                this.emit('cameraPitchChanged', {
                    pitch: this._cameraPitch,
                    degrees: this._cameraPitch * 180 / Math.PI
                });
            }
            
            // 着陸リクエストを発行
            if (this._isLanding) {
                this.emit('landingRequested', {
                    x: this._position.x,
                    y: this._position.y
                });
                this._isLanding = false; // フラグをリセット
            }
            
            // 内部への移動リクエストを発行
            if (this._isGoingToInterior) {
                this.emit('interiorRequested', {
                    x: this._position.x,
                    y: this._position.y
                });
                this._isGoingToInterior = false; // フラグをリセット
            }
        }
        
        onDispose() {
            // 最終状態を保存
            this.onDeactivate();
        }
        
        // パブリックメソッド
        getPosition() {
            return { x: this._position.x, y: this._position.y };
        }
        
        getAngle() {
            return this._angle;
        }
        
        getSpeed() {
            return this._currentSpeed;
        }
        
        getMovementState() {
            return this._movementState;
        }
        
        getCameraPitch() {
            return this._cameraPitch;
        }
        
        setPosition(x, y) {
            this._position.x = x;
            this._position.y = y;
            this._emitEvents();
        }
        
        setAngle(angle) {
            this._angle = angle;
            this._emitEvents();
        }
        
        setCameraPitch(pitch) {
            this._cameraPitch = Math.max(this._maxPitchDown, Math.min(this._maxPitchUp, pitch));
            this._emitEvents();
        }
        
        setBoundaries(minX, maxX, minY, maxY) {
            this._minX = minX;
            this._maxX = maxX;
            this._minY = minY;
            this._maxY = maxY;
        }
        // オートパイロット機能
        _updateAutoFlight() {
            const target = this._autoFlightTarget;
            
            // targetが無効な場合はキャンセル
            if (!target || typeof target.x === 'undefined' || typeof target.y === 'undefined') {
                this._cancelAutoFlight();
                return;
            }
            
            // ラップアラウンドを考慮した最短距離を計算
            let dx = target.x - this._position.x;
            let dy = target.y - this._position.y;
            
            // X方向の最短経路を計算（直接、左端経由、右端経由の3通り）
            if (Math.abs(dx) > this._maxX / 2) {
                if (dx > 0) {
                    dx = dx - this._maxX;  // 左端を経由した方が近い
                } else {
                    dx = dx + this._maxX;  // 右端を経由した方が近い
                }
            }
            
            // Y方向の最短経路を計算（直接、上端経由、下端経由の3通り）
            if (Math.abs(dy) > this._maxY / 2) {
                if (dy > 0) {
                    dy = dy - this._maxY;  // 上端を経由した方が近い
                } else {
                    dy = dy + this._maxY;  // 下端を経由した方が近い
                }
            }
            
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 到着判定（距離が閾値以下）
            // ただし、開始から最低10フレームは移動する（同じ場所への再移動対応）
            const framesSinceStart = Graphics.frameCount - this._autoFlightStartFrame;
            if (distance < 50 && framesSinceStart > 10) {
                this._completeAutoFlight();
                return;
            }
            
            // 目標方向を計算
            const targetAngle = Math.atan2(dx, -dy);
            
            // 現在の角度との差を計算
            let angleDiff = targetAngle - this._angle;
            
            // 角度を-π～πの範囲に正規化
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            
            // 徐々に方向転換（最大0.05ラジアン/フレーム）
            const turnSpeed = 0.05;
            if (Math.abs(angleDiff) > turnSpeed) {
                this._angle += Math.sign(angleDiff) * turnSpeed;
            } else {
                this._angle = targetAngle;
            }
            
            // 角度を0～2πの範囲に正規化
            while (this._angle < 0) this._angle += Math.PI * 2;
            while (this._angle >= Math.PI * 2) this._angle -= Math.PI * 2;
            
            // 前進（角度がほぼ合っている場合のみ全速、そうでなければ減速）
            const alignmentFactor = Math.max(0.3, 1 - Math.abs(angleDiff) / Math.PI);  // 最低速度を保証
            const speed = this._cruiseSpeed * alignmentFactor * 1.5;  // 自動飛行は少し速めに

            // 位置を更新（_updatePositionと同じ計算）
            const directionX = Math.sin(this._angle);
            const directionY = -Math.cos(this._angle);
            
            this._position.x += directionX * speed;
            this._position.y += directionY * speed;
            
            // 速度を設定（表示用）
            this._currentSpeed = speed;
        }
        
        _completeAutoFlight() {
            // イベント発行用に目標を保存
            const completedTarget = this._autoFlightTarget;

            // 自動飛行フラグをクリア
            this._isAutoFlying = false;
            this._autoFlightTarget = null;
            this._autoFlightLogShown = false;

            // $gameAirshipIllusionも更新
            if ($gameAirshipIllusion) {
                $gameAirshipIllusion.isAutoFlying = false;
                $gameAirshipIllusion.autoFlightTarget = null;
            }

            // SE再生
            SoundManager.playOk();
            
            // メッセージ表示（UIモジュール経由）
            AirshipIllusion.eventBus.emit('autoFlightCompleted', {
                target: completedTarget,
                position: this._position
            });
        }
        
        _cancelAutoFlight() {
            this._isAutoFlying = false;
            this._autoFlightTarget = null;
            this._autoFlightLogShown = false;

            // $gameAirshipIllusionも更新
            if ($gameAirshipIllusion) {
                $gameAirshipIllusion.isAutoFlying = false;
                $gameAirshipIllusion.autoFlightTarget = null;
            }

            // キャンセル通知
            AirshipIllusion.eventBus.emit('autoFlightCancelled', {});
        }

        // カメラ制御用メソッド（Cinema連携）
        setCameraPosition(x, y, z, duration) {
            // カメラ移動イベントを発火（FieldShaderが受け取る）
            this.emit('cameraMove', {
                targetX: x,
                targetY: y,
                targetZ: z || 0,
                duration: duration || 60
            });
        }

        setCameraZoom(zoom, duration) {
            this.emit('cameraZoom', {
                zoom: zoom,
                duration: duration || 60
            });
        }

        setCameraRotation(rotation, duration) {
            this.emit('cameraRotation', {
                rotation: rotation,
                duration: duration || 60
            });
        }
    }

    // エクスポート
    window.AirshipIllusionControl = AirshipIllusionControl;
    
})();