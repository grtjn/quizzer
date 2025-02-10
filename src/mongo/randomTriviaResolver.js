function buildQuery(query) {
    let match = {};
    if (query) {
      Object.keys(query).forEach(key => {
        switch (key) {
          case "category":
            match.category = match.category || { $in: [] };
            match.category.$in.push(query.category);
            break;
          case "category_in":
            match.category = match.category || { $in: [] };
            match.category.$in = match.category.$in.concat(query.category_in);
            break;
          case "difficulty":
            match.difficulty = match.difficulty || { $in: [] };
            match.difficulty.$in.push(query.difficulty);
            break;
          case "difficulty_in":
            match.difficulty = match.difficulty || { $in: [] };
            match.difficulty.$in = match.difficulty.$in.concat(query.difficulty_in);
            break;
        }
      });
    }
    return match;
  }
  
  exports = function(args){
    args = args || {};
    let collection = context.services.get("mongodb-atlas").db("QuizDB").collection("trivia");
    let pipeline = [];
    pipeline.push({ $match: buildQuery(args.query) });
    pipeline.push({ $sample: { size: args.size || 1 } })
    let sample = collection.aggregate(pipeline).toArray();
    return sample.then(arr => {
      return {
        randomTrivia: JSON.parse(JSON.stringify(arr))
      };
    });
  };