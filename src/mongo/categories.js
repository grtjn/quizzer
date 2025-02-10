exports = function(payload, response){
    let collection = context.services.get("mongodb-atlas").db("QuizDB").collection("trivia");
    return collection.distinct('category');
  }
  