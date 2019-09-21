'use strict';

Product.names = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
Product.data = [];
Product.all = [];

Product.container = document.getElementById('image_container');

Product.chartButtonEl = document.getElementById('chartButton');
Product.chartButtonEl.addEventListener('click', handleChart);

Product.justViewed = [];
Product.pics = [
  document.getElementById('left'),
  document.getElementById('center'),
  document.getElementById('right')
];
Product.tally = document.getElementById('tally');
Product.totalClicks = 0;

function Product(name) {
  this.name = name;
  this.path = 'img/' + name + '.jpg';
  this.votes = 0;
  this.views = 0;
  Product.all.push(this);
}
for(var i = 0; i < Product.names.length; i++) {
  new Product(Product.names[i]);
}

function makeRandom() {
  return Math.floor(Math.random() * Product.names.length);
}

function displayPics(){
  var randomImages = [];

  randomImages[0] = makeRandom();
  randomImages[1] = makeRandom();

  while(randomImages[0] === randomImages[1]){
    console.log('Duplicate Found');
    randomImages[1] = makeRandom();
  }
  randomImages[2] = makeRandom();
  while(randomImages[2] === randomImages[1] || randomImages[2] === randomImages[0]){
    console.log('Duplicate Found');
    randomImages[2] = makeRandom();
  }
  //dynamically setting the src atttribute of the <img> tags
  for( var i = 0; i < 3; i++ ) {
    Product.pics[i].src = Product.all[randomImages[i]].path;
    Product.pics[i].id = Product.all[randomImages[i]].name;
    Product.all[randomImages[i]].views += 1;
    Product.justViewed[i] = randomImages[i];
  }
}

function handleClick(event) {
  console.log(Product.totalClicks, 'total clicks');
  localStorage.setItem('totalClicks', JSON.stringify(Product.data));

  if(Product.totalClicks > 4) {
    Product.container.removeEventListener('click', handleClick);
    showTally();
  }
  if (event.target.id === 'image_container') {
    return alert('Click on an image, dumbass!');
  }
  Product.totalClicks += 1;
  for(var i = 0; i < Product.names.length; i++){
    if(event.target.id === Product.all[i].name) {
      Product.all[i].votes += 1;
      console.log(event.target.id + ' has ' + Product.all[i].votes + ' votes in ' + Product.all[i].views + ' views');
    }
  }
  displayPics();
}

function handleChart(event) {
  makeChart();
  console.log('handleChart function');
}

function showTally() {
  for(var i = 0; i < Product.all.length; i++) {
    var liEl = document.createElement('li');
    liEl.textContent = Product.all[i].name + ' has ' + Product.all[i].votes + ' votes in ' + Product.all[i].views + ' views';
    Product.tally.appendChild(liEl);
  }
}

Product.namesData = [];
Product.votesData = [];
Product.viewsData = [];

function makeChart() {
  console.log('makeChart function');

  for (var i = 0; i < Product.all.length; i++) {
  Product.namesData.push(Product.all[i].name);
  Product.votesData.push(Product.all[i].votes);
  Product.viewsData.push(Product.all[i].views);
}
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

(function() {
  if(localStorage.totalClicks) {
    Product.data = JSON.parse(localStorage.totalClicks);
    console.log('data received from local storage.');
  }
  console.log('Product.data from LC: ', Product.data)
})();

Product.container.addEventListener('click', handleClick);
displayPics();
