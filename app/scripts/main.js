console.log('\'Allo \'Allo!');

$(function() {
  initializeMenu();

  initializeKnobs();
  initializePassword();
});

//===================
// menuing
//===================
function initializeMenu() {
  $(".puzzle").hide();

  if (window.location.hash)
    $(window.location.hash).show();

  $(window).on('hashchange', function() {
    $(".puzzle").hide();
    $(window.location.hash).show();
  });
}

//====================
// knobs
//====================
function initializeKnobs() {
  $(".knob").click(function () {
    toggleLight(this);
    updateDirection(buildLightString());
  });
}

function toggleLight(light) {
    $(light).toggleClass("lit");
    $(light).toggleClass("unlit");
    $(light).text($(light).hasClass("lit") ? "ON" : "OFF");
}

function buildLightString() {
  bits = _.range(1,7)
    .map(function(n) {return "#knob" + n;})
    .map(function(knob) { return $(knob).text();})
    .map(function(b) {
           if (b == "OFF")  return "0";
           else return "1";
     })
     .reduce(function(all, n) {return all+n;}, "");
  return bits;
}

function updateDirection( bitstring ) {
  switch (bitstring) {
    case "001111":
    case "101011":
      $("#knobs-direction").text("up");
      break;
    case "011111":
    case "101010":
      $("#knobs-direction").text("down");
      break;
    case "000100":
    case "000000":
      $("#knobs-direction").text("left");
      break;
    case "101111":
      $("#knobs-direction").text("right");
      break;
    default:
      $("#knobs-direction").text("invalid");
      break;
  }
}

//====================
// password
//====================
inputMax = 6;

words = ["about","after","again","below","could",
         "every","first","found","great","house",
         "large","learn","never","other","place",
         "plant","point","right","small","sound",
         "spell","still","study","their","there",
         "these","thing","think","three","water",
         "where","which","world","would","write"];

function initializePassword() {
  $(".password-input").val("");
  updateSolution();
  $(".password-input").on('input', function () {
    capInput(this);
    updateSolution();
  });
}

function updateSolution() {
    matched = testWords(buildRegex());
    $("#password-solution").text(matched ? matched : "---");
}

function capInput(inpt) {
  if ($(inpt).val().length >= inputMax) {
    $(inpt).val($(inpt).val().substring(0,inputMax));
  }
}

function buildRegex() {
    letters = _.range(1,6)
    .map(function(n) {return "#space" + n;})
    .map(function(cell) { return $(cell).val();})
    .map(function(value) {
           if (!value) {
             return ".";
           } else {
             return "(" + value.split("").join("|") + ")";
           }
     })
     .reduce(function(all, n) {return all+n;}, "^") + "$";
  return new RegExp(letters, "i");
}

function testWords(regex) {
  matches = _.map(words, function(word) {
    if (regex.test(word))
      return word;
  })
  .filter(function(b) { return b;});
  return matches.join(", ");
}
