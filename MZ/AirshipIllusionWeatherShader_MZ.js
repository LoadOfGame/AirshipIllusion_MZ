//=============================================================================
// AirshipIllusionWeatherShader_MZ.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Airship Illusion - Weather Shader System Module v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 *
 * @help
 * This module handles weather effects for the Airship Illusion system
 * using WebGL shaders.
 * Achieves high-quality weather effects through GPU acceleration.
 * Supports 6 weather types: Cloudy, Rain, Snow, Storm, Sandstorm, Fog.
 * Must be used together with AirshipIllusionCore_MZ.js.
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
 * @plugindesc 飛空艇イリュージョン - 天候シェーダーシステムモジュール v1.0.0
 * @author LoadOfGame(UmiAizu)
 * @url https://loadofgame.stars.ne.jp/
 *
 * @help
 * このモジュールは飛空艇イリュージョンシステムの天候効果をWebGLシェーダーで処理します。
 * GPUアクセラレーションにより高品質な天候効果を実現します。
 * 6種類の天候タイプをサポートします：曇り、雨、雪、嵐、砂嵐、霧。
 * AirshipIllusionCore_MZ.jsと一緒に使用する必要があります。
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

    // コアプラグインが読み込まれているかチェック
    if (!window.AirshipIllusion || !window.AirshipIllusion.Base) {
        throw new Error('AirshipIllusionWeatherShader_MZ requires AirshipIllusionCore_MZ to be loaded first');
    }
    
    //=============================================================================
    // AirshipIllusionWeather
    //=============================================================================
    
    class AirshipIllusionWeather extends AirshipIllusion.Base {
        
        // シェーダーキャッシュ
        static _compiledShaders = new Map();
        static _shaderPrograms = new Map();
        
        // 天候タイプ
        static WEATHER_TYPES = {
            CLEAR: 'clear',
            CLOUDY: 'cloudy',
            RAIN: 'rain',
            SNOW: 'snow',
            STORM: 'storm',
            SANDSTORM: 'sandstorm',
            FOG: 'fog'
        };
        
        // 天候共通頂点シェーダー
        static VERTEX_SHADER = `
            attribute vec2 aVertexPosition;
            attribute vec2 aTextureCoord;
            
            uniform mat3 projectionMatrix;
            varying vec2 vTextureCoord;
            
            void main(void) {
                gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
                vTextureCoord = aTextureCoord;
            }
        `;

        // 曇りのフラグメントシェーダー（雨シェーダーベース、雨粒なし）
        static CLOUDY_SHADER = `
            #ifdef GL_ES
            precision mediump float;
            #endif

            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform float uTime;
            uniform float uIntensity;

            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }

            // 雨シェーダーと同じrainLayer（雲の影として薄く表示）
            float rainLayer(vec2 uv, float scale, float speed, float seed) {
                vec2 st = uv * vec2(scale, scale * 3.0);
                vec2 id = floor(st);
                float n = noise(id + seed);
                float n2 = noise(id + seed + 100.0);
                float n3 = noise(id + seed + 200.0);
                float individualSpeed = speed * (1.5 + n * 1.0);
                st.y -= uTime * individualSpeed * 2.0;
                st.x -= uTime * individualSpeed * 0.3 * (0.5 + n2 * 0.5);
                vec2 f = fract(st);
                float xPos = 0.5 + (n - 0.5) * 0.6;
                xPos += sin(uTime * 0.001 + n3 * 6.28) * 0.1;
                float thickness = 0.008 + n2 * 0.008;
                float rain = 1.0 - smoothstep(0.0, thickness, abs(f.x - xPos));
                float length = 0.3 + n3 * 0.4;
                rain *= smoothstep(0.9, 0.9 - length * 0.1, f.y);
                rain *= 1.0 - smoothstep(length, 0.0, f.y);
                rain *= 0.4 + 0.6 * n2;
                rain *= step(0.1 + n * 0.2, noise(id + seed + 50.0));
                return rain;
            }

            void main(void) {
                vec4 color = texture2D(uSampler, vTextureCoord);

                // 雨と同じ計算だが、非常に薄く表示（ほぼ見えない程度）
                float rain = 0.0;
                rain += rainLayer(vTextureCoord, 30.0, 0.03, 0.0) * 0.8;
                rain += rainLayer(vTextureCoord + 0.1, 20.0, 0.035, 10.0) * 0.6;
                rain += rainLayer(vTextureCoord + 0.2, 15.0, 0.04, 20.0) * 0.4;
                rain *= pow(vTextureCoord.y, 0.3) * uIntensity;

                // 曇りなので雨粒は非常に薄く（ほぼ見えない）
                vec3 rainColor = vec3(0.7, 0.8, 0.9);
                color.rgb = mix(color.rgb, rainColor, rain * 0.05);

                // 全体を暗くする（雨シェーダーと同じ処理）
                color.rgb *= 0.7 + 0.3 * (1.0 - uIntensity);

                gl_FragColor = color;
            }
        `;

        // 雨のフラグメントシェーダー
        static RAIN_SHADER = `
            #ifdef GL_ES
            precision mediump float;
            #endif
            
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform float uTime;
            uniform float uIntensity;
            
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            float rainLayer(vec2 uv, float scale, float speed, float seed) {
                // 縦長のグリッド（雨は縦に伸びる）
                vec2 st = uv * vec2(scale, scale * 3.0);
                
                // ランダム化
                vec2 id = floor(st);
                float n = noise(id + seed);
                float n2 = noise(id + seed + 100.0);
                float n3 = noise(id + seed + 200.0);
                
                // 各雨粒の速度をランダムに
                float individualSpeed = speed * (1.5 + n * 1.0);  // 速度に個体差
                
                // 高速落下（下向き）
                st.y -= uTime * individualSpeed * 2.0;
                st.x -= uTime * individualSpeed * 0.3 * (0.5 + n2 * 0.5);  // 斜め角度もランダム
                
                // セル内の位置
                vec2 f = fract(st);
                
                // 雨粒の位置（より不規則に）
                float xPos = 0.5 + (n - 0.5) * 0.6;
                xPos += sin(uTime * 0.001 + n3 * 6.28) * 0.1;  // 微妙な横揺れ
                
                // リアルな雨の筋（太さも変化）
                float thickness = 0.008 + n2 * 0.008;
                float rain = 1.0 - smoothstep(0.0, thickness, abs(f.x - xPos));
                
                // 雨の長さ（ランダムに）
                float length = 0.3 + n3 * 0.4;
                rain *= smoothstep(0.9, 0.9 - length * 0.1, f.y);
                rain *= 1.0 - smoothstep(length, 0.0, f.y);
                
                // 輝度変化（不規則に）
                rain *= 0.4 + 0.6 * n2;
                
                // 出現率（ランダムに）
                rain *= step(0.1 + n * 0.2, noise(id + seed + 50.0));
                
                return rain;
            }
            
            void main(void) {
                vec4 color = texture2D(uSampler, vTextureCoord);
                
                float rain = 0.0;
                
                // 複数レイヤー（異なる速度とサイズ）
                rain += rainLayer(vTextureCoord, 30.0, 0.03, 0.0) * 0.8;
                rain += rainLayer(vTextureCoord + 0.1, 20.0, 0.035, 10.0) * 0.6;
                rain += rainLayer(vTextureCoord + 0.2, 15.0, 0.04, 20.0) * 0.4;
                
                // 深度による調整
                rain *= pow(vTextureCoord.y, 0.3) * uIntensity;
                
                // 雨の色（青みがかった白）
                vec3 rainColor = vec3(0.7, 0.8, 0.9);
                color.rgb = mix(color.rgb, rainColor, rain * 0.6);
                
                // 全体を暗くする
                color.rgb *= 0.7 + 0.3 * (1.0 - uIntensity);
                
                gl_FragColor = color;
            }
        `;
        
        // 雪のフラグメントシェーダー
        static SNOW_SHADER = `
            #ifdef GL_ES
            precision mediump float;
            #endif
            
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform float uTime;
            uniform float uIntensity;
            
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            // シンプルな雪片（ぼやけた点）
            float snowflake(vec2 p, float n) {
                float r = length(p);
                
                // シンプルな円形の雪片（少し大きめに）
                float snow = 1.0 - smoothstep(0.0, 0.12 + n * 0.06, r);
                
                // 中心をより明るく
                snow += (1.0 - smoothstep(0.0, 0.05, r)) * 0.5;
                
                // わずかな不規則性
                snow *= 0.7 + 0.3 * n;
                
                return snow;
            }
            
            float snowLayer(vec2 uv, float scale, float time, float seed) {
                // タイリング
                uv *= scale;
                
                // セルごとの処理
                vec2 id = floor(uv);
                vec2 f = fract(uv) - 0.5;  // 中心を0,0に
                
                // ランダムオフセット
                float n = noise(id + seed);
                float n2 = noise(id + seed + 100.0);
                float n3 = noise(id + seed + 200.0);
                float n4 = noise(id + seed + 300.0);
                
                // 各雪片の落下速度を個別に（風の影響も）
                float fallSpeed = time * (1.5 + n * 1.0);  // 速度差
                uv.y -= fallSpeed;
                
                // 風の影響（時間経過で変化）
                float windStrength = sin(uTime * 0.0002 + n2 * 3.14) * 0.3;
                uv.x += windStrength * (0.5 + n3 * 0.5);
                
                // 再計算
                f = fract(uv) - 0.5;
                
                // 複雑な横揺れ（ジグザグに落下）
                float swayAmplitude = 0.1 + n2 * 0.15;
                float swayFreq = 1.5 + n3 * 1.5;
                f.x += sin(fallSpeed * swayFreq + n * 6.28) * swayAmplitude;
                
                // 上下の揺れも追加（浮遊感）
                f.y += sin(fallSpeed * 0.8 + n4 * 6.28) * 0.05;
                
                // 雪の結晶を描画（位置をランダムに、少し拡大）
                vec2 offset = vec2(n - 0.5, n2 - 0.5) * 0.3;
                float snow = snowflake((f + offset) * (1.5 + n3 * 1.5), n);
                
                // サイズ変化（より大きな差）
                snow *= 0.3 + 0.7 * n4;
                
                // 出現率（塊で降る効果、かなり多めに）
                float clusterNoise = noise(id * 0.3 + seed + 400.0);
                snow *= step(0.05 + clusterNoise * 0.15, noise(id + seed + 200.0));
                
                return snow;
            }
            
            void main(void) {
                vec4 color = texture2D(uSampler, vTextureCoord);
                vec2 uv = vTextureCoord;
                
                // Mode7風の深度（画面下部ほど近い）
                float depth = pow(uv.y, 0.7);
                
                // 3つのレイヤーを手動で重ねる
                float snow = 0.0;
                
                // 遠景レイヤー（小さく、多め）
                snow += snowLayer(uv, 80.0, uTime * 0.0015, 0.0) * 0.8;
                snow += snowLayer(uv + 0.05, 70.0, uTime * 0.0012, 30.0) * 0.7;
                snow += snowLayer(uv + 0.03, 60.0, uTime * 0.0013, 60.0) * 0.6;
                
                // 中景レイヤー
                snow += snowLayer(uv, 45.0, uTime * 0.002, 10.0) * 1.0;
                snow += snowLayer(uv + 0.1, 40.0, uTime * 0.0018, 40.0) * 0.9;
                snow += snowLayer(uv + 0.07, 35.0, uTime * 0.0019, 70.0) * 0.8;
                
                // 近景レイヤー（大きく、速く落下）
                snow += snowLayer(uv, 25.0, uTime * 0.003, 20.0) * 1.5;
                snow += snowLayer(uv + 0.15, 20.0, uTime * 0.0025, 50.0) * 1.3;
                snow += snowLayer(uv + 0.12, 18.0, uTime * 0.0028, 80.0) * 1.2;
                
                // 深度とインテンシティを適用
                snow *= depth * uIntensity;
                
                // 雪の色（わずかに青みがかった白）
                vec3 snowColor = vec3(0.94, 0.96, 1.0);
                
                // ブレンド
                color.rgb = mix(color.rgb, snowColor, clamp(snow, 0.0, 0.85));
                
                // 上部を暗くして雪雲を表現
                float cloudDarkness = 1.0 - (1.0 - uv.y) * 0.3 * uIntensity;
                color.rgb *= cloudDarkness;
                
                gl_FragColor = color;
            }
        `;
        
        // 嵐のフラグメントシェーダー
        static STORM_SHADER = `
            #ifdef GL_ES
            precision mediump float;
            #endif
            
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform float uTime;
            uniform float uIntensity;
            
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            float stormRain(vec2 uv, float scale, float speed) {
                // 風で斜めになった雨
                vec2 st = uv * vec2(scale, scale * 3.0);
                
                // 斜め落下（下向きに修正）
                st.y -= uTime * speed * 2.0;  // 下向きに高速落下
                st.x -= st.y * 0.3 + sin(uTime * 0.5) * 0.1; // 風の影響
                
                vec2 id = floor(st);
                vec2 f = fract(st);
                
                float n = noise(id);
                
                // 斜めの雨粒（より太く、より見やすく）
                vec2 dropPos = vec2(0.5 + (n - 0.5) * 0.3, 0.9);
                float rain = 1.0 - smoothstep(0.0, 0.05, distance(f, dropPos));  // 雨粒を太く
                
                // 斜めの軌跡（より太く、より長く）
                float trail = 1.0 - smoothstep(0.0, 0.03, abs(f.x - dropPos.x + (f.y - dropPos.y) * 0.3));  // 軌跡も太く
                trail *= smoothstep(0.0, 0.1, f.y) * smoothstep(1.0, 0.8, f.y);  // より長い軌跡
                
                rain = max(rain, trail * 0.9);  // 軌跡をより強調
                rain *= step(0.1, noise(id + 100.0));  // より多くの雨粒を表示
                
                return rain;
            }
            
            float lightning(vec2 uv) {
                // 稲妻のタイミング（より頻繁に、より見やすく）
                float lightningTime = fract(uTime * 0.1);  // より頻繁に
                float flash = step(0.95, lightningTime) * step(lightningTime, 0.97);  // より長い表示時間
                
                // 稲妻の形状（分岐する線）
                float bolt = 0.0;
                
                // メインの稲妻（より太く、より見やすく）
                float x = uv.x + sin(uv.y * 15.0) * 0.03;  // より大きな蛇行
                bolt = 1.0 - smoothstep(0.0, 0.02, abs(x - 0.5));  // より太い稲妻
                bolt *= smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.2, uv.y);  // より長い稲妻
                
                // 分岐（より太く）
                float branch = 1.0 - smoothstep(0.0, 0.015, abs(x - 0.6 + uv.y * 0.1));  // 分岐も太く
                branch *= smoothstep(0.2, 0.4, uv.y) * smoothstep(0.8, 0.4, uv.y);  // より長い分岐
                
                bolt = max(bolt, branch);
                
                return bolt * flash;
            }
            
            void main(void) {
                vec4 color = texture2D(uSampler, vTextureCoord);
                
                // 激しい雨（速度を上げて視認性を向上）
                float rain = 0.0;
                rain += stormRain(vTextureCoord, 80.0, 0.8) * 0.9;  // 速度を大幅に上げる
                rain += stormRain(vTextureCoord + 0.1, 60.0, 0.7) * 0.7;
                rain += stormRain(vTextureCoord + 0.2, 40.0, 0.6) * 0.5;
                
                rain *= uIntensity;
                
                // 稲妻
                float bolt = lightning(vTextureCoord);
                
                // 合成
                vec3 rainColor = vec3(0.5, 0.6, 0.7);
                color.rgb = mix(color.rgb, rainColor, rain * 0.7);
                
                // 稲妻の閃光（より明るく）
                color.rgb += vec3(1.0, 1.0, 0.9) * bolt * 2.0;  // より明るい閃光
                
                // 暗い雰囲気（稲妻時はより明るく）
                color.rgb *= 0.5 + bolt * 1.5;  // 稲妻時の明るさを強調
                
                gl_FragColor = color;
            }
        `;
        
        // 砂嵐のフラグメントシェーダー
        static SANDSTORM_SHADER = `
            #ifdef GL_ES
            precision mediump float;
            #endif
            
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform float uTime;
            uniform float uIntensity;
            
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            float sandParticle(vec2 uv, float scale, vec2 windSpeed) {
                vec2 st = uv * scale;
                
                // 横方向の強い移動
                st.x += uTime * windSpeed.x;
                st.y += uTime * windSpeed.y + sin(st.x * 2.0) * 0.1;
                
                vec2 id = floor(st);
                vec2 f = fract(st);
                
                float n = noise(id);
                
                // 砂粒の形（不規則な形）
                vec2 offset = vec2(noise(id + 1.0), noise(id + 2.0)) - 0.5;
                vec2 pos = vec2(0.5) + offset * 0.3;
                
                float d = distance(f, pos);
                float particle = 1.0 - smoothstep(0.0, 0.05 + n * 0.05, d);
                
                // ランダムな出現
                particle *= step(0.4, noise(id + 100.0));
                
                // 乱流効果
                particle *= 0.5 + noise(id + uTime * 0.001) * 0.5;
                
                return particle;
            }
            
            void main(void) {
                vec4 color = texture2D(uSampler, vTextureCoord);
                
                // 風の歪み効果
                vec2 distortion = vec2(
                    sin(vTextureCoord.y * 10.0 + uTime * 0.002) * 0.01,
                    cos(vTextureCoord.x * 10.0 + uTime * 0.003) * 0.005
                );
                vec4 distortedColor = texture2D(uSampler, vTextureCoord + distortion * uIntensity);
                color = mix(color, distortedColor, 0.5);
                
                // 砂粒パーティクル
                float sand = 0.0;
                
                // 複数レイヤー（異なる速度とサイズ）
                sand += sandParticle(vTextureCoord, 30.0, vec2(0.02, 0.001)) * 0.4;
                sand += sandParticle(vTextureCoord + 0.1, 20.0, vec2(0.025, 0.002)) * 0.6;
                sand += sandParticle(vTextureCoord + 0.2, 15.0, vec2(0.03, 0.003)) * 0.8;
                
                sand *= uIntensity;
                
                // 砂の色
                vec3 sandColor = vec3(0.9, 0.7, 0.4);
                color.rgb = mix(color.rgb, sandColor, sand * 0.6);
                
                // 視界の低下
                float visibility = 1.0 - uIntensity * 0.5;
                color.rgb = mix(sandColor * 0.5, color.rgb, visibility);
                
                gl_FragColor = color;
            }
        `;
        
        // 霧のフラグメントシェーダー
        static FOG_SHADER = `
            #ifdef GL_ES
            precision mediump float;
            #endif
            
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform float uTime;
            uniform float uIntensity;
            
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            // 2Dフラクタルノイズ
            float fbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                
                // 4オクターブ（GLSL ES 1.0ではループ展開が必要）
                value += noise(p) * amplitude;
                amplitude *= 0.5;
                p *= 2.0;
                
                value += noise(p) * amplitude;
                amplitude *= 0.5;
                p *= 2.0;
                
                value += noise(p) * amplitude;
                amplitude *= 0.5;
                p *= 2.0;
                
                value += noise(p) * amplitude;
                
                return value;
            }
            
            float fogLayer(vec2 uv, float scale, vec2 speed, float density) {
                vec2 st = uv * scale;
                st += vec2(uTime * speed.x, uTime * speed.y);
                
                // フラクタルノイズで霧のパターンを生成
                float fog = fbm(st);
                fog = smoothstep(0.4 - density * 0.2, 0.6 + density * 0.2, fog);
                
                return fog;
            }
            
            void main(void) {
                vec4 color = texture2D(uSampler, vTextureCoord);
                
                // 複数の霧レイヤー（異なる速度とスケール）
                float fog = 0.0;
                
                // 遠景の霧（ゆっくり、大きい）
                fog += fogLayer(vTextureCoord, 2.0, vec2(0.0001, 0.00005), 0.3) * 0.4;
                
                // 中景の霧
                fog += fogLayer(vTextureCoord, 3.0, vec2(-0.00015, 0.0001), 0.5) * 0.6;
                
                // 近景の霧（速い、小さい）
                fog += fogLayer(vTextureCoord, 5.0, vec2(0.0002, -0.00005), 0.7) * 0.8;
                
                // 深度による濃さの調整（下部ほど濃い）
                float depthFog = pow(vTextureCoord.y, 0.5);
                fog *= depthFog * uIntensity;
                
                // 霧の色（青みがかった灰色）
                vec3 fogColor = vec3(0.7, 0.75, 0.8);
                
                // 霧の合成
                color.rgb = mix(color.rgb, fogColor, clamp(fog * 0.8, 0.0, 0.9));
                
                // 全体的な視界の低下
                color.rgb = mix(color.rgb, fogColor, uIntensity * 0.2);
                
                gl_FragColor = color;
            }
        `;
        
        onInitialize() {
            // パラメータからリージョン天候マップを構築
            this._regionWeatherMap = {};

            // デバッグ：パラメータ値を確認
            console.log('[Weather] Region params:', {
                cloudy: AirshipIllusion.params.cloudyRegion,
                rain: AirshipIllusion.params.rainRegion,
                snow: AirshipIllusion.params.snowRegion,
                storm: AirshipIllusion.params.stormRegion,
                sandstorm: AirshipIllusion.params.sandstormRegion,
                fog: AirshipIllusion.params.fogRegion
            });

            this._regionWeatherMap[AirshipIllusion.params.cloudyRegion] = AirshipIllusionWeather.WEATHER_TYPES.CLOUDY;
            this._regionWeatherMap[AirshipIllusion.params.rainRegion] = AirshipIllusionWeather.WEATHER_TYPES.RAIN;
            this._regionWeatherMap[AirshipIllusion.params.snowRegion] = AirshipIllusionWeather.WEATHER_TYPES.SNOW;
            this._regionWeatherMap[AirshipIllusion.params.stormRegion] = AirshipIllusionWeather.WEATHER_TYPES.STORM;
            this._regionWeatherMap[AirshipIllusion.params.sandstormRegion] = AirshipIllusionWeather.WEATHER_TYPES.SANDSTORM;
            this._regionWeatherMap[AirshipIllusion.params.fogRegion] = AirshipIllusionWeather.WEATHER_TYPES.FOG;

            // デバッグ：最終的なマッピングを確認
            console.log('[Weather] Region weather map:', this._regionWeatherMap);
            
            // 天候状態
            this._currentWeather = AirshipIllusionWeather.WEATHER_TYPES.CLEAR;
            this._targetWeather = AirshipIllusionWeather.WEATHER_TYPES.CLEAR;
            this._transitionTimer = 0;
            this._transitionDuration = 30; // 0.5秒間のトランジション
            this._intensity = 0;
            
            // ビジュアル要素
            this._weatherContainer = null;
            this._weatherSprite = null;
            this._currentFilter = null;
            
            // リージョンチェック用の現在位置
            this._currentX = 5000;
            this._currentY = 5000;
            
            // タイマー
            this._time = 0;
        }
        
        onResourcesLoaded() {
            this._createWeatherSprite();
        }
        
        _createWeatherSprite() {
            // コンテナを作成
            this._weatherContainer = new PIXI.Container();
            this._weatherContainer.z = 10; // 地面の上、UIの下

            // 天候用のスプライトを作成（全画面）
            const bitmap = new Bitmap(Graphics.width, Graphics.height);
            bitmap.fillAll('transparent');
            this._weatherSprite = new Sprite(bitmap);

            this._weatherContainer.addChild(this._weatherSprite);

            // シーンに追加
            if (SceneManager._scene) {
                SceneManager._scene.addChild(this._weatherContainer);
            }
        }
        
        _createWeatherFilter(weatherType) {
            let fragmentShader = null;

            // デバッグ：weatherTypeの値を確認
            console.log('[Weather] Creating filter for weatherType:', weatherType);
            console.log('[Weather] CLOUDY type value:', AirshipIllusionWeather.WEATHER_TYPES.CLOUDY);
            console.log('[Weather] Match check:', weatherType === AirshipIllusionWeather.WEATHER_TYPES.CLOUDY);

            switch (weatherType) {
                case AirshipIllusionWeather.WEATHER_TYPES.CLOUDY:
                    console.log('[Weather] Matched CLOUDY case');
                    fragmentShader = AirshipIllusionWeather.CLOUDY_SHADER;
                    break;
                case AirshipIllusionWeather.WEATHER_TYPES.RAIN:
                    console.log('[Weather] Matched RAIN case');
                    fragmentShader = AirshipIllusionWeather.RAIN_SHADER;
                    break;
                case AirshipIllusionWeather.WEATHER_TYPES.SNOW:
                    console.log('[Weather] Matched SNOW case');
                    fragmentShader = AirshipIllusionWeather.SNOW_SHADER;
                    break;
                case AirshipIllusionWeather.WEATHER_TYPES.STORM:
                    console.log('[Weather] Matched STORM case');
                    fragmentShader = AirshipIllusionWeather.STORM_SHADER;
                    break;
                case AirshipIllusionWeather.WEATHER_TYPES.SANDSTORM:
                    console.log('[Weather] Matched SANDSTORM case');
                    fragmentShader = AirshipIllusionWeather.SANDSTORM_SHADER;
                    break;
                case AirshipIllusionWeather.WEATHER_TYPES.FOG:
                    console.log('[Weather] Matched FOG case');
                    fragmentShader = AirshipIllusionWeather.FOG_SHADER;
                    break;
                default:
                    console.log('[Weather] No match, returning null');
                    return null;
            }
            
            if (fragmentShader) {
                const filter = new PIXI.Filter(
                    AirshipIllusionWeather.VERTEX_SHADER,
                    fragmentShader
                );
                
                filter.uniforms.uTime = this._time;
                filter.uniforms.uIntensity = this._intensity;
                
                return filter;
            }
            
            return null;
        }
        
        onActivate() {
            // 位置更新をリッスン
            AirshipIllusion.eventBus.on('positionChanged', this._onPositionChanged, this);
            
            // $gameAirshipIllusionから初期位置を取得
            if (typeof $gameAirshipIllusion !== 'undefined' && $gameAirshipIllusion) {
                this._currentX = $gameAirshipIllusion.position.x;
                this._currentY = $gameAirshipIllusion.position.y;
            }
            
            // 初期天候チェック
            this._checkWeatherChange();
        }
        
        onDeactivate() {
            // イベントリスナーを削除
            AirshipIllusion.eventBus.off('positionChanged', this._onPositionChanged, this);
        }
        
        _onPositionChanged(data) {
            this._currentX = data.x;
            this._currentY = data.y;
            this._checkWeatherChange();
        }
        
        _checkWeatherChange() {
            // トランジション中は新しい変更を受け付けない
            if (this._transitionTimer > 0 && this._transitionTimer < this._transitionDuration) {
                return;
            }

            // 現在位置のリージョンIDを取得
            const regionId = this._getRegionIdAtPosition(this._currentX, this._currentY);

            // リージョンから天候タイプを決定
            const weatherType = this._regionWeatherMap[regionId] || AirshipIllusionWeather.WEATHER_TYPES.CLEAR;

            // デバッグ：リージョンIDと天気タイプをログ出力
            console.log('[Weather] Check: regionId=' + regionId + ', weatherType=' + weatherType + ', current=' + this._currentWeather);
            
            // 天候が変わったらトランジションを開始
            if (weatherType !== this._currentWeather && weatherType !== this._targetWeather) {
                this._targetWeather = weatherType;
                this._transitionTimer = 0;
                
                // 天候変更イベントを発行
                this.emit('weatherChanged', { 
                    from: this._currentWeather, 
                    to: weatherType,
                    regionId: regionId 
                });
                
                // グローバルイベントバスにも送信（SkyShader用）
                if (AirshipIllusion.eventBus) {
                    AirshipIllusion.eventBus.emit('weatherChanged', {
                        type: weatherType,
                        from: this._currentWeather,
                        to: weatherType,
                        regionId: regionId
                    });
                }
            }
        }
        
        _getRegionIdAtPosition(x, y) {
            // 飛空艇のワールド座標を元のマップ座標に変換
            const mapCoords = this._convertWorldToMapCoordinates(x, y);

            // $gameAirshipIllusionが存在するかチェック
            if (typeof $gameAirshipIllusion === 'undefined' || !$gameAirshipIllusion) {
                return 0;
            }

            // 保存されたマップデータからリージョンを読み取り
            if ($gameAirshipIllusion.mapData) {
                const mapData = $gameAirshipIllusion.mapData;
                const width = mapData.width;
                const height = mapData.height;

                // マップ範囲内かチェック
                if (mapCoords.x >= 0 && mapCoords.x < width &&
                    mapCoords.y >= 0 && mapCoords.y < height) {

                    // RPG Maker MZのマップデータ構造:
                    // data配列は6層分のデータを格納
                    // 各レイヤーは width * height のサイズ
                    const layerIndex = 5; // リージョンレイヤー
                    const tileIndex = mapCoords.y * width + mapCoords.x;
                    const dataIndex = (layerIndex * height * width) + tileIndex;

                    if (dataIndex >= 0 && dataIndex < mapData.data.length) {
                        // リージョンレイヤーの値がそのままリージョンID
                        const regionId = mapData.data[dataIndex] || 0;
                        return regionId;
                    }
                }
            }

            return 0;
        }
        
        _convertWorldToMapCoordinates(worldX, worldY) {
            // ワールド座標をマップタイル座標に変換
            const worldWidth = AirshipIllusion.params.worldWidth;
            const worldHeight = AirshipIllusion.params.worldHeight;
            
            // マップサイズを取得（優先順位: $dataMap > パラメータ設定）
            let mapWidth = AirshipIllusion.params.mapWidth;
            let mapHeight = AirshipIllusion.params.mapHeight;
            
            if ($gameAirshipIllusion && $gameAirshipIllusion.mapData) {
                mapWidth = $gameAirshipIllusion.mapData.width;
                mapHeight = $gameAirshipIllusion.mapData.height;
            } else if ($dataMap) {
                mapWidth = $dataMap.width;
                mapHeight = $dataMap.height;
            }
            
            // 正規化座標を介して変換
            const normalizedX = worldX / worldWidth;
            const normalizedY = worldY / worldHeight;
            
            let mapX = Math.floor(normalizedX * mapWidth);
            let mapY = Math.floor(normalizedY * mapHeight);
            
            // 範囲制限
            mapX = Math.max(0, Math.min(mapX, mapWidth - 1));
            mapY = Math.max(0, Math.min(mapY, mapHeight - 1));
            
            return { x: mapX, y: mapY };
        }
        
        onUpdate() {
            this._time++;
            
            // コントロールモジュールから現在位置を取得
            if (AirshipIllusion.instances.control) {
                const currentPos = AirshipIllusion.instances.control.getPosition();
                if (currentPos.x !== this._currentX || currentPos.y !== this._currentY) {
                    this._currentX = currentPos.x;
                    this._currentY = currentPos.y;
                    this._checkWeatherChange();
                }
            }
            
            this._updateWeatherTransition();
            this._updateFilter();
        }
        
        _updateWeatherTransition() {
            if (this._targetWeather !== this._currentWeather) {
                this._transitionTimer++;

                const progress = this._transitionTimer / this._transitionDuration;

                // トランジション開始時にフィルターを作成
                if (this._transitionTimer === 1) {
                    console.log('[Weather] Transition started: creating filter for', this._targetWeather);

                    // 古いフィルターを破棄
                    if (this._currentFilter) {
                        if (typeof this._currentFilter.destroy === 'function') {
                            this._currentFilter.destroy();
                        }
                        this._currentFilter = null;
                    }

                    // コンテナの存在を確認
                    if (!this._weatherContainer || !this._weatherContainer.parent) {
                        this._createWeatherSprite();
                    }

                    // 新しいフィルターを作成（CLEARでない場合）
                    if (this._targetWeather !== AirshipIllusionWeather.WEATHER_TYPES.CLEAR) {
                        this._currentFilter = this._createWeatherFilter(this._targetWeather);
                        console.log('[Weather] Filter created:', this._currentFilter);
                    }

                    // フィルターを適用
                    if (this._weatherContainer) {
                        this._weatherContainer.filters = this._currentFilter ? [this._currentFilter] : null;
                        this._weatherContainer.visible = true;
                        console.log('[Weather] Filter applied to container, filters:', this._weatherContainer.filters);
                    } else {
                        console.error('[Weather] Failed to apply filter - no weather container!');
                    }
                }

                if (progress >= 1.0) {
                    // トランジション完了
                    this._currentWeather = this._targetWeather;
                    this._transitionTimer = 0;
                    this._intensity = 1.0;
                    console.log('[Weather] Transition complete: weather is now', this._currentWeather);
                } else {
                    // トランジション中
                    this._intensity = progress;
                }
            }
        }
        
        _updateFilter() {
            if (this._currentFilter) {
                this._currentFilter.uniforms.uTime = this._time;
                this._currentFilter.uniforms.uIntensity = this._intensity;
            }
        }
        
        onDispose() {
            // 天候コンテナをクリーンアップ
            if (this._weatherContainer && this._weatherContainer.parent) {
                this._weatherContainer.parent.removeChild(this._weatherContainer);
            }

            // フィルターを破棄
            if (this._currentFilter) {
                if (typeof this._currentFilter.destroy === 'function') {
                    this._currentFilter.destroy();
                }
                this._currentFilter = null;
            }
        }
        
        // パブリックメソッド
        getCurrentWeather() {
            return this._currentWeather;
        }
        
        setWeather(weatherType) {
            if (this._regionWeatherMap[weatherType]) {
                this._targetWeather = weatherType;
                this._transitionTimer = 0;
            }
        }
    }
    
    // シェーダープリコンパイル機能
    AirshipIllusionWeather.precompileShaders = function() {
        // MZではGraphics._rendererがPIXI.Rendererインスタンス
        if (!Graphics._renderer || Graphics._renderer.type !== PIXI.RENDERER_TYPE.WEBGL) return;
        
        const gl = Graphics._renderer.gl;
        if (!gl) return;
        
        // 各天候タイプのシェーダーをプリコンパイル
        const shaderTypes = [
            { type: 'cloudy', fragment: this.CLOUDY_SHADER },
            { type: 'rain', fragment: this.RAIN_SHADER },
            { type: 'snow', fragment: this.SNOW_SHADER },
            { type: 'storm', fragment: this.STORM_SHADER },
            { type: 'sandstorm', fragment: this.SANDSTORM_SHADER },
            { type: 'fog', fragment: this.FOG_SHADER }
        ];
        
        shaderTypes.forEach(shader => {
            try {
                // 頂点シェーダーをコンパイル
                const vertShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vertShader, this.VERTEX_SHADER);
                gl.compileShader(vertShader);
                
                if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
                    console.warn(`Failed to compile vertex shader for ${shader.type}`);
                    return;
                }
                
                // フラグメントシェーダーをコンパイル
                const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fragShader, shader.fragment);
                gl.compileShader(fragShader);
                
                if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
                    console.warn(`Failed to compile fragment shader for ${shader.type}`);
                    return;
                }
                
                // シェーダープログラムを作成してリンク
                const program = gl.createProgram();
                gl.attachShader(program, vertShader);
                gl.attachShader(program, fragShader);
                gl.linkProgram(program);
                
                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    console.warn(`Failed to link shader program for ${shader.type}`);
                    return;
                }
                
                // キャッシュに保存
                this._compiledShaders.set(shader.type, {
                    vertex: vertShader,
                    fragment: fragShader
                });
                this._shaderPrograms.set(shader.type, program);
                
            } catch (e) {
                console.warn(`Error precompiling shader for ${shader.type}:`, e);
            }
        });
    };
    
    // ゲーム起動時に自動的にプリコンパイル
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        // グラフィックスが初期化された後でプリコンパイル
        if (Graphics._renderer && Graphics._renderer.type === PIXI.RENDERER_TYPE.WEBGL) {
            setTimeout(() => {
                AirshipIllusionWeather.precompileShaders();
            }, 100);
        }
    };
    
    // エクスポート
    window.AirshipIllusionWeather = AirshipIllusionWeather;
    
})();