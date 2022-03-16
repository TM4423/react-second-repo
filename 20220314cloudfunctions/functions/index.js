const functions = require("firebase-functions");
const express = require("express");
const requestPromise = require("request-promise-native"); // 追加
const cors = require("cors"); // 追加

const app = express();

app.use(cors()); // 追加

// APIにリクエストを送る関数を定義
const getDataFromApi = async (keyword) => {
  // cloud functionsから実行する場合には地域の設定が必要になるため，`country=JP`を追加している
  const requestUrl =
    "https://www.googleapis.com/books/v1/volumes?country=JP&q=isbn:";
  const result = await requestPromise(`${requestUrl}${keyword}`);
  return result;
};

// メトロポリタン美術館から、アーティストの生年を指定してデータを取得する
const getTmmDataFromApi = async (keyword) => {
  // cloud functionsから実行する場合には地域の設定が必要になるため，`country=JP`を追加している
  const requestUrl =
    "https://collectionapi.metmuseum.org/public/collection/v1/objects?q=artistBeginDate:";
  const result = await requestPromise(`${requestUrl}${keyword}`);
  return result;
};

// メトロポリタン美術館から、オブジェクトIDを指定してデータを取得す
const getTmmObjectDataFromApi = async (keyword) => {
  // cloud functionsから実行する場合には地域の設定が必要になるため，`country=JP`を追加している
  const requestUrl =
    "https://collectionapi.metmuseum.org/public/collection/v1/objects?q=objectID:";
  const result = await requestPromise(`${requestUrl}${keyword}`);
  return result;
};

// ポケモンGoから、名前を指定してデータを取得す
const getPokeDataFromApi = async (keyword) => {
  // cloud functionsから実行する場合には地域の設定が必要になるため，`country=JP`を追加している
  const requestUrl =
    "https://pokeapi.co/api/v2/pokemon/:";
  const result = await requestPromise(`${requestUrl}${keyword}`);
  return result;
};

app.get("/hello", (req, res) => {
  res.send("Hello Express!");
});

// ↓↓↓ エンドポイントを追加 ↓↓↓
app.get("/user/:userId", (req, res) => {
  const users = [
    { id: 1, name: "ジョナサン" },
    { id: 2, name: "ジョセフ" },
    { id: 3, name: "承太郎" },
    { id: 4, name: "仗助" },
    { id: 5, name: "ジョルノ" },
  ];
  // req.params.userIdでURLの後ろにつけた値をとれる．
  const targetUser = users.find(
    (user) => user.id === Number(req.params.userId)
  );
  res.send(targetUser);
});

// エンドポイント追加
app.get("/gbooks/:keyword", async (req, res) => {
  // APIリクエストの関数を実行
  const response = await getDataFromApi(req.params.keyword);
  res.send(response);
});

// エンドポイント追加
app.get("/metro/:year", async (req, res) => {
  // APIリクエストの関数を実行
  const response = await getTmmDataFromApi(req.params.year);
  res.send(response);
});

// エンドポイント追加
app.get("/metroobject/:object", async (req, res) => {
  // APIリクエストの関数を実行
  const response = await getTmmObjectDataFromApi(req.params.object);
  res.send(response);
});

// エンドポイント追加
app.get("/poke/:pokemon", async (req, res) => {
  // APIリクエストの関数を実行
  const response = await getPokeDataFromApi(req.params.pokemon);
  res.send(response);
});

// 出力
const api = functions.https.onRequest(app);
module.exports = { api };
