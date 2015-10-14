var App = require('lfa-core').App;
var Storage = require('lfa-core').Storage;
var $ = require('jquery');

var companies = {
  dq: 'Diagnostic Questions',
  gameplan: 'GamePlan',
  stackbox: 'Stackbox',
  traincamp: 'TrainCamp',
  edurio: 'Edurio',
}

function setIntroButton() {
  $caption = $('.btn-intro .caption');
  var name = Storage.getItem('investorName');
  if ($caption.length) {
    if (!name) {
      $caption.html('Setup a name to get introduced.<br>Click here to do that.');
      $('.btn-intro button').addClass("disabled");
    } else {
      $caption.html('You are ' + name + '<br/>(click to change)');
      $('.btn-intro button').removeClass("disabled")
        .unbind('click', onGetIntroduced)
        .on('click', onGetIntroduced);
    }

    function onGetIntroduced(e) {
      var hash = window.location.hash;
      var id = hash.substr(hash.lastIndexOf('_')+1);
      var company = companies[id];
      console.log(company);
      var text = [
        'Investor: ',
        name,
        '',
        'Company:',
        company,
        '',
        'Interest expressed at: ',
        new Date(),
        'Person user agent:',
        navigator.userAgent
      ].join('\r\n');
      $.post('http://lfwd.io:3725/', {
        to: 'dan',
        s: 'De la mine',
        t: text,
      }).done(function( data ) {
        console.log(data);
        $(e.target).text('Thank you');
      });
    }

    function onClick() {
      var newName = prompt();
      if (newName.match(/\S+\s+\S+/)) {
        Storage.setItem('investorName', newName);
        setIntroButton();
      }
      else {
        alert('Please enter at least two words. Click again.');
      }
    }

    $caption.unbind('click', onClick).on('click', onClick);
  }
}

App.book.on('render', function (opts) {
  setIntroButton();
});
