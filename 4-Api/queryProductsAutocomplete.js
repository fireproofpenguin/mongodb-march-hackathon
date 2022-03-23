function getPipeline(query) {
  return [
    {
      $search: {
        index: "product_name_autocomplete",
        autocomplete: {
          query: query,
          path: "item_name.en_IN",
          tokenOrder: "any",
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    },
  ];
}

exports = function ({ query, headers, body }, response) {
  const { searchQuery } = query;

  const pipeline = getPipeline(searchQuery);

  const results = context.services
    .get("mongodb-atlas")
    .db("mongoshop")
    .collection("products")
    .aggregate(pipeline)
    .toArray();

  return results;
};
