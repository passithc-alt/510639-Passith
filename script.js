// ====== 1. ดึง Elements ทั้งหมดจาก HTML มาเตรียมพร้อมใช้งาน ======
const profileCard = document.getElementById('myCard');
const greetingText = document.getElementById('greeting');
const nameText = document.getElementById('name');
const bioText = document.getElementById('bio');
const department = document.getElementById('department');
const weatherBox = document.getElementById('weather-box');

// กลุ่มปุ่มเมนูหลัก
const mainButton = document.getElementById('mainButton');
const magicButton = document.getElementById('magicBtn');
const buttonReason = document.getElementById('buttonReason');

// กลุ่มปุ่มฟีเจอร์เสริม
const likeButton = document.getElementById('likeBtn');
const likeCountText = document.getElementById('likeCount');
const themeToggle = document.getElementById('themeToggle');


// ====== 2. กำหนดข้อมูลเริ่มต้น (ทำงานทันทีเมื่อโหลดหน้าเว็บ) ======
greetingText.innerText = "สวัสดีครับ";
nameText.innerText = "ผมชื่อ นายภัสสิษฐ์ ชัยธนะกุลมงคล";
bioText.innerText = "ยินดีที่ได้รู้จักครับ ตอนนี้กำลังศึกษาการเขียนเว็บพื้นฐาน HTML, CSS และ JavaScript อยู่ครับ";
department.innerText = "วศก.6 สังกัด ผกส. กดท. ฝดข.";

// ตัวแปรเก็บยอดไลค์ (เริ่มที่ 0)
let currentLikes = 0;


// ดึงข้อมูลสภาพอากาศ (Weather API - Open-Meteo)
// กำหนดพิกัดละติจูดและลองจิจูดของกรุงเทพฯ
const lat = 13.75;
const lon = 100.50;
// URL สำหรับดึงข้อมูลสภาพอากาศจาก Open-Meteo (ระบุให้อินพุตอุณหภูมิปัจจุบันและรหัสสภาพอากาศ)
const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;

// ตารางแมปปิ้งรหัสสภาพอากาศสากล WMO (Weather Code) เป็นภาษาไทยและกำหนดไอคอน
const weatherCodes = {
    0: { desc: "ท้องฟ้าแจ่มใส", icon: "01d" },
    1: { desc: "ท้องฟ้าโปร่ง", icon: "02d" },
    2: { desc: "มีเมฆบางส่วน", icon: "03d" },
    3: { desc: "เมฆครึ้ม", icon: "04d" },
    45: { desc: "มีหมอก", icon: "50d" },
    48: { desc: "มีหมอกจัด", icon: "50d" },
    51: { desc: "ฝนตกปรอยๆ", icon: "09d" },
    53: { desc: "ฝนตกปรอยๆ", icon: "09d" },
    55: { desc: "ฝนตกปรอยๆ", icon: "09d" },
    56: { desc: "ฝนเยือกแข็งปรอยๆ", icon: "09d" },
    57: { desc: "ฝนเยือกแข็งปรอยๆ", icon: "09d" },
    61: { desc: "ฝนตกเล็กน้อย", icon: "10d" },
    63: { desc: "ฝนตกปานกลาง", icon: "10d" },
    65: { desc: "ฝนตกหนัก", icon: "10d" },
    66: { desc: "ฝนเยือกแข็งตกเล็กน้อย", icon: "10d" },
    67: { desc: "ฝนเยือกแข็งตกหนัก", icon: "10d" },
    71: { desc: "หิมะตกเล็กน้อย", icon: "13d" },
    73: { desc: "หิมะตกปานกลาง", icon: "13d" },
    75: { desc: "หิมะตกหนัก", icon: "13d" },
    77: { desc: "เกล็ดหิมะตก", icon: "13d" },
    80: { desc: "ฝนตกไล่เฉดเล็กน้อย", icon: "09d" },
    81: { desc: "ฝนซู่ปานกลาง", icon: "09d" },
    82: { desc: "ฝนซู่รุนแรง", icon: "09d" },
    85: { desc: "หิมะตกซู่เล็กน้อย", icon: "13d" },
    86: { desc: "หิมะตกซู่หนัก", icon: "13d" },
    95: { desc: "พายุฝนฟ้าคะนอง", icon: "11d" },
    96: { desc: "พายุฝนฟ้าคะนองกับลูกเห็บตกเล็กน้อย", icon: "11d" },
    99: { desc: "พายุฝนฟ้าคะนองกับลูกเห็บตกหนัก", icon: "11d" }
};

// ส่ง request ดึงข้อมูลแบบ Asynchronous
fetch(url)
    .then(response => {
        // ตรวจสอบว่า HTTP status เป็น 200-299 หรือไม่ (ดึงข้อมูลสำเร็จ)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // แปลงผลลัพธ์เป็นวัตถุ JSON
        return response.json();
    })
    .then(data => {
        // ดึงอุณหภูมิและรหัสสภาพอากาศออกมาจาก JSON
        const temp = data.current.temperature_2m;
        const code = data.current.weather_code;
        // ค้นหาข้อความอธิบายและรหัสไอคอนจากรหัสสภาพอากาศที่ได้มา (ถ้าไม่พบในตารางจะใช้ค่าเริ่มต้น)
        const weatherInfo = weatherCodes[code] || { desc: "ไม่สามารถระบุสภาพอากาศได้", icon: "01d" };

        // นำภาพไอคอนและรายละเอียดข้อมูลสภาพอากาศไปแสดงผลใน HTML (weatherBox)
        weatherBox.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${weatherInfo.icon}.png" alt="weather icon" style="vertical-align: middle; width: 40px;">
            <span>ตอนนี้ที่ กรุวเทพฯ อุณหภูมิ ${temp}°C (${weatherInfo.desc})</span>
        `;
    })

    .catch(error => {
        // หากเกิดข้อผิดพลาดระหว่างดึงข้อมูล (เช่น ไม่มีเน็ต หรือเซิร์ฟเวอร์ล่ม) จะแสดงข้อความแจ้งเตือน
        console.error("เกิดข้อผิดพลาดสภาพอากาศ:", error);
        weatherBox.innerText = "ไม่สามารถโหลดข้อมูลสภาพอากาศได้";
    });



//  จัดการปุ่มเมนูสลับเนื้อหา (คลิกปุ่มต่างๆ)

// ปุ่มหน้าแรก
mainButton.addEventListener('click', () => {
    greetingText.innerText = "สวัสดีครับ";
    nameText.innerText = "ผมชื่อ นายภัสสิษฐ์ ชัยธนะกุลมงคล";
    bioText.innerText = "ยินดีที่ได้รู้จักครับ ตอนนี้กำลังศึกษาการเขียนเว็บพื้นฐาน HTML, CSS และ JavaScript อยู่ครับ";
    department.innerText = "วศก.6 สังกัด ผกส. กดท. ฝดข.";

    mainButton.classList.add('highlight');
    magicButton.classList.remove('highlight');
    buttonReason.classList.remove('highlight');
});

// ปุ่มทักทาย
magicButton.addEventListener('click', () => {
    greetingText.innerText = "ฝากตัวด้วยนะครับ";
    nameText.innerText = "";
    bioText.innerText = "";
    department.innerText = "";

    mainButton.classList.remove('highlight');
    magicButton.classList.add('highlight');
    buttonReason.classList.remove('highlight');

    alert("ขอบคุณที่แวะมาทักทายกันนะครับ!");
});

// ปุ่มเหตุผลที่เรียน
buttonReason.addEventListener('click', () => {
    greetingText.innerText = "เหตุผลที่เรียน";
    nameText.innerText = "";
    bioText.innerText = "อยากเรียนรู้วิธีการพัฒนาระบบ และเทคโนโลยีในปัจจุบัน";
    department.innerText = "";
    mainButton.classList.remove('highlight');
    magicButton.classList.remove('highlight');
    buttonReason.classList.add('highlight');
});


//ปุ่มหัวใจนับจำนวนไลค์
likeButton.addEventListener('click', () => {
    currentLikes = currentLikes + 1;
    likeCountText.innerText = currentLikes;

    likeButton.classList.add('pop');
    setTimeout(() => {
        likeButton.classList.remove('pop');
    }, 100);
});


// ปุ่มสลับธีม มืด/สว่าง
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerText = "☀️ โหมดสว่าง";
    } else {
        themeToggle.innerText = "🌙 โหมดมืด";
    }
});