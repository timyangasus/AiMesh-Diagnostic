# AiMesh Diagnostic 規格

Figma：[AiMesh Diagnostic](https://www.figma.com/design/DdMLHjlc77yfzpCWUUXFev/AiMesh%E2%80%A8Diagnostic?node-id=0-1)（只看 Page 1，backup 不用）
架構參考 [QIS](https://timyangasus.github.io/QIS/QIS_index.html)：flow 形式的原型，上方 demo bar 顯示頁碼與說明。
流程起點是 Settings › Diagnostics 選單（548:464），它前面的 Settings 頁不做。

## 畫布

- 尺寸 **390 × 844 pt**（和 Figma 畫框一樣），**不加手機外框、不加圓角**。
- 瀏覽器預覽：畫布固定大小，空間不夠時整個等比縮小；安裝成 PWA 時就是實際螢幕大小。
- 上方安全區 47 pt（模擬狀態列），底部固定 tab bar 67 pt（Feedback 頁沒有 tab bar）。

## Demo bar

- 左邊是頁碼，點開可以跳到任一頁；接著是這一頁的說明；最右邊 RESET 回到起點。
- 遇到流程判斷（DEMO 流程判斷）時右下角跳出選項，選過的判斷會留在 demo bar，可以重新選。
- 網址加 `?debug` 會框出可點的區域；加 `?demo=0` 隱藏 demo bar。

## 頁碼表

頁碼開頭：1 主流程、2 Testing History、3 Advanced Test、4 結果頁 B 版。

| 頁碼 | id | 頁面 | 從哪裡進來 | Figma |
|---|---|---|---|---|
| 1_010 | `diagnostics` | Diagnostics 選單 | 起點 | 548:464 |
| 1_020 | `home` | AiMesh Diagnostic 首頁 | 1_010 AiMesh Diagnostic | 250:507 |
| 1_021 | `home-tip` | 使用提示（底部面板） | 首頁 ⓘ | 352:2421 |
| 1_030 | `testing` | 測試中（動畫） | Start / Test Again / 3_010 Start | 294:412 / 294:413 / 294:410 |
| 1_040 | `result` | 測試結果 A 版 | 測完（選 A 版） | 145:2382 |
| 1_050 | `detail` | Detail Result 拓撲 | 1_040 Detail Result | 294:409 |
| 1_060 | `hop-udp` | 單段詳細結果 UDP | 1_050 點卡片 | 146:2936 |
| 1_070 | `hop-tcp` | 單段詳細結果 TCP | 1_050 點卡片 | 146:2852 |
| 1_080 | `suggestions` | Suggestions | 結果頁點 Wifi signal weak | 252:1859 |
| 1_090 | `feedback` | Feedback | Report Issue | 352:2565 |
| 2_010 | `history-empty` | Testing History（沒有資料） | 時鐘圖示 | 567:277 |
| 2_020 | `history` | Testing History | 時鐘圖示 | 146:3631 |
| 2_030 | `history-actions` | 紀錄操作選單 | 點 ••• | 562:500 |
| 2_040 | `history-note` | 編輯備註（位置） | Edit a note | 562:728 / 727:209 |
| 2_050 | `history-delete` | 刪除紀錄確認 | Delete | 562:730 → 562:927 |
| 3_010 | `advanced` | Advanced Test | 首頁 Advanced Test | 146:3061 |
| 3_020 | `select-server` | Select Server | 3_010 Server | 146:3207 |
| 3_030 | `select-client` | Select Client | 3_010 Client | 146:3334 |
| 4_010 | `result-b-suggest` | 測試結果 B 版：Suggestions 分頁 | 測完（選 B 版） | 568:322 |
| 4_020 | `result-b-detail` | 測試結果 B 版：Detail Result 分頁 | 4_010 分頁 | 568:448 / 568:1325 |
| 4_030 | `hop-b` | 單段詳細結果 B 版（UDP + TCP 同一頁） | 4_020 點卡片 | 568:1430 |

## 流程判斷

| 判斷 | 出現位置 | 選項 |
|---|---|---|
| 結果頁 | 1_030 測完時（選過之後就不再問） | A 版 → 1_040、B 版 → 4_010 |
| Protocol | 1_050 點任一段卡片 | UDP → 1_060、TCP → 1_070 |
| History | 點右上時鐘圖示 | 有資料 → 2_020、沒有資料 → 2_010 |

## 測試中動畫（1_030）

- 由 ZenWiFi BT8 往 Phone 一段一段測，每段約 2.6 秒。
- 正在測的那段：兩端節點有綠色旋轉光環、連線是往下流動的藍點、數字藍／紫色跳動往上數。
- 測完：數字變黑色，連線依下載速度變色（≥ 50 Mbps 綠色、< 50 Mbps 橘色）。
- 三段都測完會存一筆到 Testing History，然後進結果頁（取代歷史紀錄，所以在結果頁按返回會回首頁）。

## 互動細節

- Testing History：點卡片看那次的結果；••• → Edit a note（選位置或輸入，Apply 存回）或 Delete（OK 刪除，全部刪完變成沒有資料）。
- Advanced Test：Duration、Protocol 可切換；Server、Client 進清單選一台後返回。
- Feedback：清除鈕、下拉選單、字數計算可用；e-mail 空白時不能送出，送出後返回。
- 尚未加入的功能（Floor Plan Assistant、Firmware 等）點了會跳提示。

## 待辦

- Diagnostics 選單在 Figma 是新版 App 的截圖（tab bar 不同），目前沿用其他頁的 tab bar。
- 插圖與 tab bar 目前是 Figma 匯出的 1 倍圖，之後換成高解析度圖或 SVG。
- Advanced Test 選的 Server / Client / Protocol 目前不會改變測試畫面的內容。
