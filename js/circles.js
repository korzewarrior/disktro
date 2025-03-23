const container = document.querySelector('.circlecontainer');

const circleDiameter = 50 + 10; 
const circlesHorizontal = Math.ceil(window.innerWidth / circleDiameter);
const circlesVertical = Math.ceil(window.innerHeight / circleDiameter);
const totalCircles = circlesHorizontal * circlesVertical;

for (let i = 0; i < totalCircles; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    container.appendChild(circle);
}

document.addEventListener('mousemove', (e) => {
    const circles = document.querySelectorAll('.circle');

    circles.forEach(circle => {
        const rect = circle.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;

        // Calculate the intensity based on the distance
        const intensity = Math.min(1, (maxDistance - distance) / maxDistance);

        // Interpolate the colors
        const alphaForBorder = 0.15 + (intensity * (0.4 - 0.15)); // interpolate between 0.15 and 0.4e
        const alphaForBackground = intensity * 0.07; // interpolates from 0 to 0.07

        if (intensity > 0) {
            circle.style.borderColor = `rgba(212, 175, 55, ${alphaForBorder})`;
            circle.style.backgroundColor = `rgba(212, 175, 55, ${alphaForBackground})`;
        } else {
            circle.style.borderColor = '#aaaaaa15';
            circle.style.backgroundColor = 'transparent';
        }
    });
});


function getDistanceBetweenElements(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    const dx = aRect.left + aRect.width / 2 - (bRect.left + bRect.width / 2);
    const dy = aRect.top + aRect.height / 2 - (bRect.top + bRect.height / 2);
    return Math.sqrt(dx * dx + dy * dy);
}

function propagateRipple(clickedCircle) {
    const circles = document.querySelectorAll('.circle');

    circles.forEach(circle => {
        const distance = getDistanceBetweenElements(circle, clickedCircle);
        const maxDistance = 150; 
        const delay = distance / 500; 

        if (distance < maxDistance) {
            setTimeout(() => {
                circle.classList.add('clicked');
                
                // Set a timeout for the individual circle
                const circleTimeout = setTimeout(() => {
                    circle.classList.remove('clicked');
                }, 500);

                // Store the timeout ID as a data attribute on the circle
                circle.dataset.timeoutId = circleTimeout;
            }, delay * 1000);
        }
    });
}

document.addEventListener('click', (e) => {
    const clickedElement = e.target;

    if (clickedElement.classList.contains('circle')) {
        // If the circle has an existing timeout, clear it
        if (clickedElement.dataset.timeoutId) {
            clearTimeout(clickedElement.dataset.timeoutId);
        }

        propagateRipple(clickedElement);
    }
});
