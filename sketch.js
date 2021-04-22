let mobilenet;
let classifier;
let video;
let label = 'Find an ethical alternative!';
let labelWithLink = null;
let shoesButton;
let bagButton;
let trainButton;
let trainingComplete = false;
let divResults = null

let labelshoes = '<a href="https://www.vinted.fr/femmes/baskets-baskets/1019649185-veja-a-scratch" target="_blank">Find these Veja shoes on Vinted!</a>';
let labelbag = '<a href="https://www.vinted.fr/femmes/sacs-a-main/1041296823-sac-a-main-ou-bandouliere-noir-kamila-nat-et-nin" target="_blank">Find this Nat and Nin bag on Vinted!</a>';

function modelReady() {
  console.log('Model is ready!');
  classifier.load('./model.json', customModelReady);
}

//function weightReady() {
//  console.log('Weights are loaded!');
// classifier.load('./model.weights.bin', customModelReady);
//}

function customModelReady() {
  console.log('Custom Model is ready!');
  label = 'model ready';
  classifier.classify(gotResults);
}

function videoReady() {
  console.log('Video is ready!');
}

function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  classifier = mobilenet.classification(video, videoReady);

  divResults = createDiv().html(label).addClass('resultsLink');

  const div = createDiv().addClass('buttons');

  const divActions = createDiv().addClass('buttons').addClass('actions');
  div.child(createButton('Shoes').mousePressed(function() {
    classifier.addImage('shoes');
    //    createA('https://www.vinted.fr/femmes/baskets-baskets/1019649185-veja-a-scratch', 'buy here', 'target = _blank')
  }))
  div.child(createButton('Bag').mousePressed(function() {
    classifier.addImage('bag');
    //    createA('https://www.vinted.fr/femmes/sacs-a-main/1041296823-sac-a-main-ou-bandouliere-noir-kamila-nat-et-nin', 'buy here', 'target = _blank');
  }))
  divActions.child(createButton('Train').mousePressed(function() {
    classifier.train(whileTraining);
  }))
  divActions.child(createButton('Save').mousePressed(function() {
    classifier.save();
  }))

  // shoesButton = createButton('shoes');
  // shoesButton.mousePressed(function() {
  // classifier.addImage('shoes');
  //});

  //  bagButton = createButton('bag');
  //  bagButton.mousePressed(function() {
  //    classifier.addImage('bag');
  //  });

  //  trainButton = createButton('train');
  //  trainButton.mousePressed(function() {
  //    classifier.train(whileTraining);
  //  });

  //  saveButton = createButton('save');
  //  saveButton.mousePressed(function() {
  //    classifier.save();
  //  });
}

function draw() {
  image(video, 0, 0, 320, 240);
}

function whileTraining(loss) {
  if (loss == null) {
    trainingComplete = true
    console.log('Training Complete');
    classifier.classify(gotResults);
    return;
  }
  console.log(loss);
  trainingComplete = false
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    // updated to work with newer version of ml5
    // label = result;
    label = result[0].label;
    if (trainingComplete === true) {
      const keyLabelValue = 'label' + label.toLowerCase().trim();
      if (typeof eval(keyLabelValue) !== 'undefined') {
        divResults.html(eval(keyLabelValue));
      }
    }
    classifier.classify(gotResults);
  }
}
