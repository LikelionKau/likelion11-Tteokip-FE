

const baseUrl = "http://13.124.88.252:8080";


function moveMypage() {
    location.href = "../html/mypage.html";
}


const getResult = async () => {
    try {
        const response = await axios.get(baseUrl + `/api/raffles/result`, {
            params: {
                raffleId: 1
            }
        });

        const responseData = response.data;
        console.log(responseData);
        return responseData;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


const result = async () => {
    try {
        const data = await getResult();
        console.log(data);
        const nameinfo = document.getElementById('item_name');
        nameinfo.innerText = data.itemName;

        const resultinfo = document.getElementById('raffleStatus');

        if (data.raffleStatus == 'true') {
            resultinfo.innerText = '당첨 / ' + data.raffleCount + ' 매';
        }

        const timeinfo = document.getElementById('time');
        timeinfo.innerText = data.dateTime;

        const seatinfo = document.getElementById('seat');
        seatinfo.innerText = data.sectionName;

        const rateinfo = document.getElementById('rate');
        rateinfo.innerText = data.sectionRate;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

result();