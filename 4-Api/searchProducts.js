function buildPipeline({
  category = "",
  marketplace = "",
  minRating = 0,
  maxRating = 5,
}) {
  const pipeline = [];
  if (category.length > 0)
    pipeline.push({
      $match: {
        category,
      },
    });
  if (marketplace.length > 0)
    pipeline.push({
      $match: {
        marketplace,
      },
    });
  // Not quite there but close! For min ratings / max ratings
  // if (minRating !== 0) {
  //   pipeline.push([
  //     {
  //       $lookup: {
  //         from: "reviews",
  //         localField: "item_id",
  //         foreignField: "asin",
  //         as: "reviews",
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: "$reviews.asin",
  //         avg: {
  //           $avg: "$overall",
  //         },
  //       },
  //     },
  //   ]);
  // }
  pipeline.push({
    $limit: 60,
  });
  return pipeline;
}

exports = function ({ query, headers, body }, response) {
  const pipeline = buildPipeline(query);

  const results = context.services
    .get("mongodb-atlas")
    .db("mongoshop")
    .collection("products")
    .aggregate(pipeline)
    .toArray();

  return results;
};
