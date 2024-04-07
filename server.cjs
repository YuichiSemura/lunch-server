const WebSocket = require("ws");

// WebSocketサーバーのポート
const PORT = 3000;

// WebSocketサーバーの作成
const wss = new WebSocket.Server({ host: "0.0.0.0", port: PORT });

// 接続されたクライアントを格納する配列
const clients = [];

// 接続が確立されたときの処理
wss.on("connection", function connection(ws) {
  console.log("Client connected");

  // 新しいクライアントを配列に追加
  clients.push(ws);

  // クライアントからのメッセージを受信したときの処理
  ws.on("message", function incoming(data, isBinary) {
    const message = isBinary ? data : data.toString();
    if (isBinary) {
      return;
    }
    console.log("Received: %s", message);
    // 接続されたすべてのクライアントにメッセージをブロードキャスト
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // クライアントとの接続が閉じられたときの処理
  ws.on("close", function close() {
    console.log("Client disconnected");

    // 配列からクライアントを削除
    const index = clients.indexOf(ws);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});

console.log(`WebSocket server listening on ws://localhost:${PORT}`);
