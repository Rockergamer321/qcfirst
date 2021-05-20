/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
// Get the button we need to click to show/hide the login/signup buttons on mobile
const mobileMenuHamburger = document.querySelector('.mobile-menu-button'); 

if (mobileMenuHamburger) {
  // Add event handler (function in second parameter) that fires when a user clicks 
  // (event is defiend in first paramater) on the mobile menu hamburger
  mobileMenuHamburger.addEventListener('click', (e) => {
    e.preventDefault(); // prevent default events from firing when clicking the mobile menu hamburger

      // Get the mobile menu element. This is the element we need to display/hide when we click 
      // the hamburger
    const mobileMenu = document.querySelector('.header-mobile-menu'); 

    if (mobileMenu) {
      // Toggles the class active. .toggle() will add/remove the given class from the element's 
      // classlist depending on whether the element has the class currently or not
      mobileMenu.classList.toggle('active'); 
    } 

  });
}

// Finds any HTML element that matches the css selector provided in the parameter
const topnavHamburger = document.querySelector('.topnav-hamburger'); 

// Check to make sure topnavHamburger has a value, in this case it should be an html element
if (topnavHamburger) {
  // the element that contains our navigation items
  const myLinks = document.getElementById("myLinks"); 
  //Add event handler (function in second parameter) that fires when a user clicks 
  //(event is defiend in first paramater) on the navigation hamburger
  topnavHamburger.addEventListener('click', (e) => {
    e.preventDefault(); // prevent default events from firing when clicking the navigation hamburger

    // If we have an element in myLinks
    if (myLinks) {
      // Toggles the class active. .toggle() will add/remove the given class from the element's 
      // classlist depending on whether the element has the class currently or not
      myLinks.classList.toggle('active'); 
    }
  });
}

//index.html slide carousel implementation
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("slider-image");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}

  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }

  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}