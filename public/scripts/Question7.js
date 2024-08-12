function updateDate() {
    const dateElement = document.getElementById("date");
    const now = new Date();
    const dateString = now.toLocaleTimeString() + "<br>" + now.toLocaleDateString();
    dateElement.innerHTML = dateString;
}

window.addEventListener("load", function() {
    updateDate();
    setInterval(updateDate, 1000);
}); 

function bernie_desc() {
    let dest = document.getElementById("bernie");
    let text = "Bernie had an adventurous life helping Ray Charles around. <br> <br>";
    text += "<b>Animal:</b> Dog <br>";
    text += "<b>Breed:</b> Boxer <br>";
    text += "<b>Age:</b> 14 years<br>";
    text += "<b>Sex:</b> Male <br>";
    text += "\u2713 Gets along with other dogs <br>";
    text += "\u2717 Gets along with other cats <br>";
    text += "\u2713 Suitable for a family with small children <br>";
    dest.innerHTML = text;
};

function boogie_desc() {
    let dest = document.getElementById("boogie");
    let text = "Boogie starred in Boogie Nights. <br> <br> <br>";
    text += "<b>Animal:</b> Cat <br>";
    text += "<b>Breed:</b> Bengal <br>";
    text += "<b>Age:</b> 17 years<br>";
    text += "<b>Sex:</b> Female <br>";
    text += "\u2713 Gets along with other dogs <br>";
    text += "\u2713 Gets along with other cats <br>";
    text += "\u2713 Suitable for a family with small children <br>";
    dest.innerHTML = text;
};

function twain_desc() {
    let dest = document.getElementById("twain");
    let text = "Bark Twain has had many adventures along the Mississippi River. <br> <br>";
    text += "<b>Animal:</b> Dog <br>";
    text += "<b>Breed:</b> Dachshund <br>";
    text += "<b>Age:</b> 5 years <br>";
    text += "<b>Sex:</b> Male <br>";
    text += "\u2713 Gets along with other dogs <br>";
    text += "\u2713 Gets along with other cats <br>";
    text += "\u2713 Suitable for a family with small children <br>";
    dest.innerHTML = text;
};

function holmes_desc() {
    let dest = document.getElementById("holmes");
    let text = "Purrlock Holmes loves solving mysteries. He does not come with a pipe. <br> <br>";
    text += "<b>Animal:</b> Cat <br>";
    text += "<b>Breed:</b> Ragdoll <br>";
    text += "<b>Age:</b> 3 years<br>";
    text += "<b>Sex:</b> Male <br>";
    text += "\u2717 Gets along with other dogs <br>";
    text += "\u2717 Gets along with other cats <br>";
    text += "\u2713 Suitable for a family with small children <br>";
    dest.innerHTML = text;
};

function hefner_desc() {
    let dest = document.getElementById("hefner");
    let text = "Ruff throws the best parties in his large mansion. <br> <br> <br>";
    text += "<b>Animal:</b> Dog <br>";
    text += "<b>Breed:</b> Bulldog <br>";
    text += "<b>Age:</b> 2 years<br>";
    text += "<b>Sex:</b> Male <br>";
    text += "\u2713 Gets along with other dogs <br>";
    text += "\u2713 Gets along with other cats <br>";
    text += "\u2713 Suitable for a family with small children <br>";
    dest.innerHTML = text;
};

function luna_desc() {
    let dest = document.getElementById("luna");
    let text = "Luna was the first animal on the moon, shipped into space with Neil Armstrong. <br> <br>";
    text += "<b>Animal:</b> Cat <br>";
    text += "<b>Breed:</b> Birman <br>";
    text += "<b>Age:</b> 1 years<br>";
    text += "<b>Sex:</b> Female <br>";
    text += "\u2717 Gets along with other dogs <br>";
    text += "\u2717 Gets along with other cats <br>";
    text += "\u2713 Suitable for a family with small children <br>";
    dest.innerHTML = text;
};

function load_pets() {
    bernie_desc();
    boogie_desc();
    twain_desc();
    holmes_desc();
    hefner_desc();
    luna_desc();
}

document.addEventListener("DOMContentLoaded", function() {
  
    function load_pets() {
        bernie_desc();
        boogie_desc();
        twain_desc();
        holmes_desc();
        hefner_desc();
        luna_desc();
    }

    load_pets();

});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('find-pet').addEventListener('submit', function(event) {
        event.preventDefault();
        let errorMessage = '';
        const animalType = document.querySelector('input[name="animal-type"]:checked');
        const compatibility = document.querySelectorAll('input[name="compatibility"]:checked');

        if (!animalType) {
            errorMessage = 'Please select what pet you are looking for.';
        } 
        else if (compatibility.length === 0) {
            errorMessage = 'Please select at least one compatibility option.';
        }

        if (errorMessage) {
            document.getElementById('find-pet-error').innerText = errorMessage;
        } else {
            document.getElementById('find-pet').submit();
        }
    })

});

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('donate-pet').addEventListener('submit', function(event) {
        event.preventDefault();
        let errorMessage = '';
        const animalType = document.querySelector('input[name="animal-type"]:checked');
        const compatibility = document.querySelectorAll('input[name="compatibility"]:checked');
        const desc = document.getElementById('comments').value;
        const ownerName = document.getElementById('owner-name').value;
        const ownerEmail = document.getElementById('owner-email').value;
    
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!animalType) {
            errorMessage = 'Please select what pet you are looking for.';
        } 
        else if (compatibility.length === 0) {
            errorMessage = 'Please select at least one compatibility option.';
        }
        else if (!desc) {
            errorMessage = 'Please brag about your pet';
        }
        else if (!ownerName) {
            errorMessage = 'Please enter your name.';
        }
        else if (!emailPattern.test(ownerEmail)) {
            errorMessage = 'Please enter a valid email address.';
        }
    
        if (errorMessage) {
            document.getElementById('donate-pet-error').innerText = errorMessage;
        } 
        else {
            document.getElementById('donate-pet').submit();
        }
    });
});