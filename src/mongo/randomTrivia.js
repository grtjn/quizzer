function buildQuery(query) {
    let match = {};
    if (query) {
      Object.keys(query).forEach(key => {
        switch (key) {
          case "category":
            if (query.category) {
              match.category = match.category || { $in: [] };
              match.category.$in.push(query.category);
            }
            break;
          case "category_in":
            if (query.category_in) {
              match.category = match.category || { $in: [] };
              match.category.$in = match.category.$in.concat(query.category_in);
            }
            break;
          case "difficulty":
            if (query.difficulty) {
              match.difficulty = match.difficulty || { $in: [] };
              match.difficulty.$in.push(query.difficulty);
            }
            break;
          case "difficulty_in":
            if (query.difficulty_in) {
              match.difficulty = match.difficulty || { $in: [] };
              match.difficulty.$in = match.difficulty.$in.concat(query.difficulty_in);
            }
            break;
        }
      });
    }
    return match;
  }
  
  exports = function(payload, response){
    let collection = context.services.get("mongodb-atlas").db("QuizDB").collection("trivia");
    let pipeline = [];
    let filters = payload.query;
    let size = payload.query && payload.query.size !== undefined ? +payload.query.size : 1;
    pipeline.push({ $match: buildQuery(filters) });
    pipeline.push({ $sample: { size } });
    let sample = collection.aggregate(pipeline).toArray();
    return sample.then(arr => {
      return {
        filters,
        randomTrivia: JSON.parse(JSON.stringify(arr))
      };
    });
  };