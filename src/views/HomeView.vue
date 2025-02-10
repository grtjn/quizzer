<template>
  <main>
    <div class="content">
      <b-container>
        <b-row>
          <b-col>
            <b-form @submit.prevent="fetchTrivia">

              <b-form-group label="How many questions?" label-class="font-weight-bold">
                <b-form-input type="number" v-model="size"></b-form-input>
              </b-form-group>

              <b-form-group label="What categories? (none to select all)" label-class="font-weight-bold">
                <b-form-select v-model="category" multiple :options="categories"></b-form-select>
              </b-form-group>
              
              <b-button-group>
                <b-button type="reset" variant="warning" @click.prevent="size = 5"> Reset </b-button>
                <b-button type="submit" variant="primary"> Riddle Me! </b-button>
              </b-button-group>
            </b-form>
          </b-col>
          <b-col cols="3">
            <dl class="row">
              <dt class="col-sm-10"># questions</dt>
              <dd class="col-sm-2">{{ totalQuestions }}</dd>
              <dt class="col-sm-10"># tries</dt>
              <dd class="col-sm-2">{{ totalTries }}</dd>
              <dt class="col-sm-10"># correct</dt>
              <dd class="col-sm-2">{{ totalScore }}</dd>
            </dl>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="6" v-for="(t, $tIndex) in trivia" :key="$tIndex">
            <b-card
              :header="'Question #' + ($tIndex + 1)"
              :title="t.question"
              :footer="outcome[t._id] !== undefined ? (outcome[t._id] ? 'YEAH!' : 'BOO!') : '\u00A0'" class="question-card">
              <b-form @submit.prevent="checkAnswer($tIndex)">
                <b-form-group label="Answers:" label-class="font-weight-bold">
                  <b-form-radio-group
                    v-model="picked[t._id]"
                    :options="t.randomizedAnswers"
                    stacked
                  ></b-form-radio-group>
                </b-form-group>

                <b-form-group label="Your answer:" label-cols-sm="3" label-class="font-weight-bold">
                   <b-input type="text" :value="picked[t._id]" disabled></b-input>
                </b-form-group>

                <b-button-group size="sm">
                  <b-button type="reset" variant="warning" @click="delete outcome[t._id]"> Reset </b-button>
                  <b-button type="submit" variant="primary"> Check Answer </b-button>
                </b-button-group>
              </b-form>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function parseHtmlEntities(str) {
    return str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
        var num = parseInt(numStr, 10); // read num as normal number
        return String.fromCharCode(num);
    });
}

export default {
  name: 'App',
  data() {
    return {
      size: 5,
      categories: [],
      category: [],
      trivia: [],
      picked: {},
      outcome: {},
      totalQuestions: 0,
      totalTries: 0,
      totalScore: 0
    };
  },
  created() {
    axios.get('https://eu-west-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/quizdb-idctl/service/QuizDB/incoming_webhook/categories')
    .then(response => {
      this.categories = response.data;
    })
    .catch(console.log);
  },
  methods: {
    fetchTrivia() {
      let cats = this.category.map(c => 'category=' + encodeURIComponent(c)).join('&');
      axios.get('https://eu-west-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/quizdb-idctl/service/QuizDB/incoming_webhook/randomTrivia?size=' + encodeURIComponent(this.size) + '&' + cats)
      .then(response => {
        console.log(response);
        this.trivia = response.data.randomTrivia.map(t => {
          t.correct_answer = parseHtmlEntities(t.correct_answer);
          t.incorrect_answers = t.incorrect_answers.map(a => parseHtmlEntities(a));
          t.randomizedAnswers = shuffle([t.correct_answer].concat(t.incorrect_answers));
          return t;
        });
        this.totalQuestions += this.trivia.length;
      }).catch(console.log);
    },
    checkAnswer($index) {
      let t = this.trivia[$index];
      let outcome = this.picked[t._id] === t.correct_answer;
      if (this.outcome[t._id] === undefined) {
        this.totalTries += 1;
        this.totalScore += outcome ? 1 : 0;
      }
      this.$set(this.outcome, t._id, outcome);
      //this.totalScore = Object.values(this.outcome).filter(o => o).length;
    }
  }
}
</script>

<style lang="scss">
  .content {
    margin-top: 60px;
    margin-bottom: 60px;

    .question-card {
      margin-top: 20px;
    }
  }
</style>
