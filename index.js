// Define an array of quotes
const quotes = [
    "The first draft is just you telling yourself the story - Terry Pratchett",
    "Books are a uniquely portable magic. - Stephen King",
    "The only way out is through. - Robert Frost",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
    "The only person you should try to be better than is the person you were yesterday.",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "You are not a drop in the ocean. You are the entire ocean in a drop. - Rumi",
    "The only thing necessary for the triumph of evil is for good men to do nothing. - Edmund Burke",
    "Happiness can be found, even in the darkest of times, if one only remembers to turn on the light. - J.K. Rowling",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson",
    "You never know how strong you are until being strong is your only choice. - Bob Marley",
    "To take another look over what you know as life, might just change it forever.",
    "The public eye has a distorted vision.",
    "The maze of comparison is where we lose ourselves.",
    "Some of us are strangers to ourselves."
];


let currentQuoteIndex = 0;

function displayNextQuote() {
    const quoteElement = document.getElementById("quote");
    quoteElement.style.opacity = 0; // Fade out the current quote

    setTimeout(() => {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length; // Increment the quote index
        quoteElement.textContent = quotes[currentQuoteIndex]; // Set the next quote
        quoteElement.style.opacity = 1; // Fade in the next quote
    }, 500); // Adjust the delay (in milliseconds) as desired
}

// Call the function to display the first quote initially
displayNextQuote();

// Set an interval to update the quote every certain amount of time
setInterval(displayNextQuote, 7000); // Change 6000 to the desired interval in milliseconds

document.addEventListener("DOMContentLoaded", function() {
    // Get all links within the nav
    const navLinks = document.querySelectorAll('nav ul li a');

    // Add a click event listener to each link
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // Blur the link to remove focus
            link.blur();
        });
    });
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const STAR_COUNT = ( window.innerWidth + window.innerHeight ) / 8,
      STAR_SIZE = 3,
      STAR_MIN_SCALE = 0.2,
      OVERFLOW_THRESHOLD = 50;

const canvas = document.querySelector('#starfield canvas'),
      context = canvas.getContext('2d');
      
      

let scale = 1,
    width,
    height;

let stars = [];

let pointerX,
    pointerY;

let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

let touchInput = false;

generate();
resize();
step();

window.onresize = resize;

function generate() {

   for( let i = 0; i < STAR_COUNT; i++ ) {
    stars.push({
      x: 0,
      y: 0,
      z: STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE )
    });
   }

}

function placeStar( star ) {

  star.x = Math.random() * width;
  star.y = Math.random() * height;

}

function recycleStar( star ) {

  let direction = 'z';

  let vx = Math.abs( velocity.tx ),
	    vy = Math.abs( velocity.ty );

  if( vx > 1 && vy > 1 ) {
    let axis;

    if( vx > vy ) {
      axis = Math.random() < Math.abs( velocity.x ) / ( vx + vy ) ? 'h' : 'v';
    }
    else {
      axis = Math.random() < Math.abs( velocity.y ) / ( vx + vy ) ? 'v' : 'h';
    }

    if( axis === 'h' ) {
      direction = velocity.x > 0 ? 'l' : 'r';
    }
    else {
      direction = velocity.y > 0 ? 't' : 'b';
    }
  }
  
  star.z = STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE );

  if( direction === 'z' ) {
    star.z = 0.1;
    star.x = Math.random() * width;
    star.y = Math.random() * height;
  }
  else if( direction === 'l' ) {
    star.x = -STAR_SIZE;
    star.y = height * Math.random();
  }
  else if( direction === 'r' ) {
    star.x = width + STAR_SIZE;
    star.y = height * Math.random();
  }
  else if( direction === 't' ) {
    star.x = width * Math.random();
    star.y = -STAR_SIZE;
  }
  else if( direction === 'b' ) {
    star.x = width * Math.random();
    star.y = height + STAR_SIZE;
  }

}

function resize() {
    scale = window.devicePixelRatio || 1;

    width = canvas.parentNode.offsetWidth * scale;
    height = canvas.parentNode.offsetHeight * scale;

    canvas.width = width;
    canvas.height = height;

    stars.forEach(placeStar);
}


function step() {

  context.clearRect( 0, 0, width, height );

  update();
  render();

  requestAnimationFrame( step );

}

function update() {

  velocity.tx *= 0.95;
  velocity.ty *= 0.95;

  velocity.x += ( velocity.tx - velocity.x ) * 0.7;
  velocity.y += ( velocity.ty - velocity.y ) * 0.7;

  stars.forEach( ( star ) => {

    star.x += velocity.x * star.z;
    star.y += velocity.y * star.z;

    star.x += ( star.x - width/2 ) * velocity.z * star.z;
    star.y += ( star.y - height/2 ) * velocity.z * star.z;
    star.z += velocity.z;
  
    if( star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD ) {
      recycleStar( star );
    }

  } );

}

function render() {

  stars.forEach( ( star ) => {

    context.beginPath();
    context.lineCap = 'round';
    context.lineWidth = STAR_SIZE * star.z * scale;
    context.strokeStyle = 'rgba(255,255,255,'+(0.5 + 0.5*Math.random())+')';

    context.beginPath();
    context.moveTo( star.x, star.y );

    var tailX = velocity.x * 2,
        tailY = velocity.y * 2;

    if( Math.abs( tailX ) < 0.1 ) tailX = 0.5;
    if( Math.abs( tailY ) < 0.1 ) tailY = 0.5;

    context.lineTo( star.x + tailX, star.y + tailY );

    context.stroke();

  } );

}

function movePointer( x, y ) {

  if( typeof pointerX === 'number' && typeof pointerY === 'number' ) {

    let ox = x - pointerX,
        oy = y - pointerY;

    velocity.tx = velocity.x + ( ox / 8*scale ) * ( touchInput ? -1 : 1 );
    velocity.ty = velocity.y + ( oy / 8*scale ) * ( touchInput ? -1 : 1 );

  }

  pointerX = x;
  pointerY = y;

}

