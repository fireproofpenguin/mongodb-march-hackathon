exports = function ({ query, headers, body }, response) {
  // check content type
  const contentTypes = headers["Content-Type"];
  if (!contentTypes.includes("application/json")) {
    console.log("Bad content type");
    response.setStatusCode(400);
    return;
  }

  // Get the body of the request
  const json = JSON.parse(body.text());

  // we should probably check that the item exists instead of blindly pushing it

  // Try to insert data into user collection
  context.services
    .get("mongodb-atlas")
    .db("mongoshop")
    .collection("users")
    .updateOne(
      { _id: BSON.ObjectId(json.userId) },
      { $addToSet: { wishlistedItems: json.productId } }
    );
};
