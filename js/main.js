var slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1
    }
    slides[slideIndex - 1].style.display = "block";

    setTimeout(showSlides, 3000); // 2초마다 이미지 체인지
}

const goMyPage = () => {
    window.location.href = '../html/mypage.html';
}

function moveMypage() {
    location.href = "../html/mypage.html";
}

const setupCarousel = (wrapperClass, carouselClass) => {
    const wrapper = document.querySelector(`.${wrapperClass}`);
    const carousel = document.querySelector(`.${carouselClass}`);
    const firstCardWidth = carousel.querySelector(".card").offsetWidth;
    const arrowBtns = wrapper.querySelectorAll(`.${wrapperClass} .arrow-btn`);
    const carouselChildrens = [...carousel.children];

    let isDragging = false, startX, startScrollLeft, timeoutId, isAutoPlay = true;

    let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

    carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
        carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
    });

    carouselChildrens.slice(0, cardPerView).forEach(card => {
        carousel.insertAdjacentHTML("beforeend", card.outerHTML);
    });

    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");


    arrowBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.classList.contains("fa-angle-left")) {
                // 왼쪽 화살표
                carousel.scrollLeft -= firstCardWidth;
            } else if (btn.classList.contains("fa-angle-right")) {
                // 오른쪽 화살표
                carousel.scrollLeft += firstCardWidth;
            }
        });
    });

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    carousel.addEventListener("mouseup", dragStop);
    carousel.addEventListener("mouseleave", dragStop); // 드래그 멈춤 추가
    carousel.addEventListener("scroll", infiniteScroll);

    function dragStart(e) {
        isDragging = true;
        carousel.classList.add("dragging");
        startX = e.pageX;
        startScrollLeft = carousel.scrollLeft;
    }

    function dragging(e) {
        if(!isDragging) return;
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
    }

    function dragStop() {
        isDragging = false;
        carousel.classList.remove("dragging");
    }

    function infiniteScroll() {
        if(carousel.scrollLeft === 0) {
            carousel.classList.add("no-transition");
            carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
            carousel.classList.remove("no-transition");
        } else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
            carousel.classList.add("no-transition");
            carousel.scrollLeft = carousel.offsetWidth;
            carousel.classList.remove("no-transition");
        }
        clearTimeout(timeoutId);
        if(!wrapper.matches(":hover")) autoPlay();
    }

    const autoPlay = () => {
        if(window.innerWidth < 800 || !isAutoPlay) return;
        timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
    }
    autoPlay();
}

setupCarousel('wrapper1', 'carousel1');
setupCarousel('wrapper2', 'carousel2');



const navLogin = document.getElementById('login');

navLogin.addEventListener('click', function(){
    if(navLogin.innerText == '로그아웃'){
        localStorage.removeItem('login-token');
        localStorage.removeItem('user-id');
        window.location.href= '../html/login.html'
        navLogin.innerText == '로그인'
    }
    else{
        window.location.href= '../html/login.html'
    }

})

function updateCarousel(carouselSelector, data) {
    const cards = document.querySelectorAll(`${carouselSelector} .card`);
    const cardsArray = Array.from(cards);

    cardsArray.forEach((card, index) => {
        console.log(data[index]);
        if (data[index]) {
            const item = data[index];
            card.querySelector('h3').textContent = item.itemName;
            card.querySelector('.card-title span').textContent = item.artist;
            let dDay = dday(item.uploadTime);
            card.querySelector('.d-day p').textContent = dDay;
            card.querySelector('.little-title1').innerHTML = `<img src="../img/location.png" alt="">${item.venue}`;
            card.querySelector('.little-title2').innerHTML = `<img src="../img/calendar.png" alt="">${item.dateTime}`;
            card.querySelector('.img img').src = item.post;
        }
    });
}


const likeChart = () => {
    axios.get(baseUrl + '/api/items/tops')
        .then(response => {
            console.log(response.data.content)
            updateCarousel('.carousel2', response.data.content);
        })
        .catch(error => console.error(error));
}

const newChart = () => {
    axios.get(baseUrl + '/api/items/uploads')
        .then(response => {
            console.log(response.data.content)
            updateCarousel('.carousel1', response.data.content);
        })
        .catch(error => console.error(error));
}

window.addEventListener('load', function() {
    newChart();
    likeChart();

    if(localStorage.getItem('login-token')){
        navLogin.innerText = '로그아웃'
    }

})

const dday = (Time) => {
    let now = new Date();
    let today_year = now.getFullYear();
    let today_month = now.getMonth() + 1;
    let today_date = now.getDate();

    let uploadTime = Time;
    let update_year = uploadTime.split('-')[0];
    let update_month = uploadTime.split('-')[1];
    let update_date = uploadTime.split('-')[2];

    if (today_year < update_year) {
        today_month += 12;
        let day30 = [2, 4, 6, 9, 11];
        let day31 = [1, 3, 5, 7, 8, 10, 12];
        if ((today_month < update_month) && (day30.includes(update_month))) {
            if (today_month != 2) {
                today_date += 30;
            } else {
                if ((today_year % 4 == 0 && today_year % 100 != 0) || today_year % 400 == 0) {
                    today_date += 29;
                } else {
                    today_date += 28;
                }
            }
        } else if (today_month < update_month && day31.includes(update_month)) {
            today_date += 31;
        }
    }

    let number = 5 - (today_date - update_date);

    if (number <= 0) {
        return '마감';
    } else return "D-" + number;
}


