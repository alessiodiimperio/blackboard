const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const admin = firebase.initializeApp();
const db = admin.firestore();
const postsRef = db.collection("posts");
const usersRef = db.collection("users");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

/**************** POSTS ***************/
//Get all posts from database
app.get("/", async (request, response) => {
  try {
    const snapshot = await postsRef.get();
    if (snapshot.empty) {
      return response.status(204).send();
    }

    let posts = [];
    snapshot.forEach((document) => {
      const id = document.id;
      const data = document.data();
      posts.push({ id, ...data });
    });
    return response.status(200).send(JSON.stringify(posts));
  } catch (error) {
    return response.send(500).send(error.message);
  }
});

//Post a post to database
app.post("/", async (request, response) => {
  try {
    const body = request.body;

    if (!body.title || !body.author) {
      return response.status(400).send("Missing required input.");
    }

    let docRef = await postsRef.doc();
    await docRef.set({
      ...body,
      id: docRef.id,
    });
    return response.status(201).send({ id: docRef.id });
  } catch (error) {
    return response.status(500).send(error.message);
  }
});

//Delete a post from db with post id:
app.delete("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    if (!id) {
      return response(400).send("Missing relevant document id");
    }
    await postsRef.doc(id).delete();
    return response.status(200).send();
  } catch (error) {
    return response.status(500).send(error.message);
  }
});

//Update post from on db with id:
app.put("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const data = request.body;

    if ((!id, !data)) {
      return response.status(400).send("Error: Incompatible id or data");
    }
    await postsRef.doc(id).update(data);
    return response.status(200).send();
  } catch (error) {
    return response.status(400).send(error.message);
  }
});

/*************** USERS ***************/

//Upload User data to firestore after auth create
app.post("/user", async (request, response) => {
  const user = request.body;

  if (!user.id) {
    return response
      .status(400)
      .send("Missing user id. Cannot complete request");
  }
  let docRef = await usersRef.doc(user.id);
  await docRef.set({
    ...user,
  });
  return response.status(200).send();
});

//Download user info after auth login
app.get("/user/:id", async (request, response) => {
  try {
    const id = request.params.id;
    if (!id) {
      return response
        .status(400)
        .send("Cannot complete request without valid document id");
    }
    const snapshot = await usersRef.doc(id).get();
    if (!snapshot.exists) {
      return response
        .status(204)
        .send("There is no document for the current user");
    }
    const document = await snapshot.data();

    return response.status(200).send(JSON.stringify(document));
  } catch (error) {
    response.status(500).send(error.message);
  }
});

exports.posts = functions.https.onRequest(app);
