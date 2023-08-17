
const baseUrl = "http://ec2-3-34-90-9.ap-northeast-2.compute.amazonaws.com:8080";

const getiteminfo = () => {
    axios.get(baseUrl + '/api/items/search',{
        params: {
            itemName: getTitleFromURL()
        }
    }).then(response =>{
        console.log(response.data);
        let itemdata = response.data;

        document.getElementById('venue').innerText = itemdata.venue;
        document.getElementById('dateTime').innerText = itemdata.dateTime;
        document.getElementById('postimg').src=itemdata.post;

        let itemid = itemdata.id;

        getseatinfo(itemid);


    }).catch(function (error) {
        console.log(error);
    })
}

const getseatinfo = (id) => {
    axios.get(baseUrl + '/api/sections/item',{
        params: {
            itemId: id
        }
    }).then(response =>{
        console.log(response.data);
        let seatdata = response.data;


        for (let i = 0; i <= 6; i++) {
            let seat = document.getElementById(`seat${i}`);
            seat.innerText = seatdata[i].sectionName;

            let price = document.getElementById(`price${i}`);
            price.innerText = seatdata[i].price+ ' 원';

            let seatQuantity = document.getElementById(`seatQuantity${i}`);
            seatQuantity.innerText = seatdata[i].seatQuantity+ '석';


        }



    }).catch(function (error) {
        console.log(error);
    })
}

const paybox = document.getElementById("pay");
const areaElements = document.querySelectorAll('.area-a, .area-b, .area-c, .area-d, .area-e, .area-f, .area-g');
const quantity = document.getElementById("ticketNum");
const max = document.getElementById("maxNotice");
const plus = document.getElementById("plusBtn");
const minus = document.getElementById("minusBtn");
const totalprice = document.getElementById("price");


for (const area of areaElements) {
    area.addEventListener("click", function() {
        paybox.style.display = "block";
        quantity.innerText = 1;
        max.style.display = "none";
        plus.disabled = false;
        minus.disabled = true;
        const areaName = this.querySelector("h3").innerText;
        const pricedata = this.querySelector(".area-price").innerText;
        totalprice.innerText = pricedata;
        document.getElementById("selectArea").innerText = areaName;

        //2매일때
        plus.addEventListener("click", function (){
            quantity.innerText = 2;
            max.style.display = "block";
            const price = parseInt(pricedata.replace(/[^0-9]/g, ''), 10);
            totalprice.innerText = (price * 2).toLocaleString() + ' 원';
            minus.disabled = false;
            plus.disabled = true;

        })
        //1매일때
        minus.addEventListener("click", function (){
            quantity.innerText = 1;
            max.style.display = "none";
            totalprice.innerText = pricedata;
            minus.disabled = true;
            plus.disabled = false;
        })

    });
}

const paybtn = document.getElementById("payBtn");
paybtn.addEventListener('click', () => {
    createRaffle();
});


const createRaffle = () => {
    let sectionid;
    for(i = 0;i<7;i++){
        let seat = document.getElementById(`seat${i}`);
        let chosen = document.getElementById("selectArea");
        if(seat.innerText == chosen.innerText){
            sectionid = i;
            console.log(sectionid+1);
        }
    }
    axios.post(baseUrl + "/api/raffles", {
        "raffleCount": quantity.innerText,
        "raffleDrawDate": getFormattedDateTime(),
        "userId": 1,
        "itemName": getTitleFromURL(),
        "sectionId": sectionid+1
    }).then(function (response) {
        alert('응모가 완료되었습니다.' + '\n' + 'Koun이 당신의 행운을 빕니다.');
        window.location.href = "main.html";
    }).catch(function (error) {
        console.log("error")
    })
}


/*콘서트 제목으로 detail-raffle 연결*/
function getTitleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('raffle');
}

function renderResult() {
    const titleTerm = getTitleFromURL();
    const Result = document.getElementById('mainTitle');
    Result.innerText = titleTerm;
}

function getFormattedDateTime() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

    return formattedDateTime;
}

window.addEventListener('DOMContentLoaded', () => {
    renderResult();
    getiteminfo();
});
