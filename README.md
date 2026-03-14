🌍 Smart Tourism Map

🎥 Demo

Video demo hệ thống:

[![Demo](https://img.youtube.com/vi/qHg-MSrg5cI/0.jpg)](https://www.youtube.com/watch?v=qHg-MSrg5cI)

Smart Tourism Map là ứng dụng bản đồ du lịch thông minh giúp người dùng:

khám phá địa điểm du lịch

xem thông tin địa điểm

tạo lịch trình tham quan

xem thời tiết

chỉ đường trên Google Maps

Ứng dụng được xây dựng bằng JavaScript + Google Maps API.

🧭 System Overview

Hệ thống cung cấp một nền tảng hỗ trợ lập kế hoạch du lịch thông minh.

Các chức năng chính:

✔ Hiển thị địa điểm du lịch trên bản đồ
✔ Gợi ý địa điểm theo Ngày / Đêm
✔ Xem thông tin địa điểm
✔ Chỉ đường giữa các địa điểm
✔ Xem thời tiết tại địa điểm
✔ Tạo lịch trình du lịch

🗺 Features
1️⃣ Interactive Map

Ứng dụng sử dụng Google Maps JavaScript API để hiển thị bản đồ.

Chức năng:

hiển thị marker

hiển thị info window

hiển thị tuyến đường

animation marker

Ví dụ code:

var marker = new google.maps.Marker({
  map: map,
  position: latlng,
  label: index.toString(),
  animation: google.maps.Animation.BOUNCE
});
🌞 Day / 🌙 Night Suggestion

Hệ thống phân loại địa điểm theo thời gian ngày và đêm.

var listCourse = data.filter(function(store) {
  return store.day_or_night === NgayDem123
});
Day locations

parks

tourist attractions

museums

Night locations

restaurants

cafes

entertainment areas

📍 Location Information

Khi click marker, hệ thống hiển thị:

địa chỉ

xếp hạng

website

số điện thoại

khoảng cách

thời gian di chuyển

🧭 Navigation System

Hệ thống sử dụng Google Directions API để tìm đường.

service.route({
  origin: origin,
  destination: destination,
  travelMode: google.maps.TravelMode.DRIVING
})

Hiển thị:

tuyến đường

thời gian

khoảng cách

🌦 Weather Information

Thời tiết được lấy từ OpenWeatherMap API.

https://api.openweathermap.org/data/2.5/weather

Hiển thị:

nhiệt độ

icon thời tiết

trạng thái thời tiết

📅 Travel Itinerary

Người dùng có thể tạo lịch trình du lịch.

Dữ liệu được lưu trong:

var danhsach = [];

Thông tin mỗi địa điểm:

[index, name, address, distance, hours, minutes, coordinates]
📊 Distance Calculation

Hệ thống tự động tính:

tổng km

tổng giờ

tổng phút

document.getElementById("tongsoKm").innerHTML = sumkm.toFixed(1);
🛣 Multi-Destination Route

Ứng dụng hỗ trợ route nhiều địa điểm.

service.route({
  origin: textPos123,
  destination: mangCuoi,
  waypoints: datatext,
  travelMode: google.maps.TravelMode.DRIVING
})
📋 Itinerary Table

Danh sách lịch trình được hiển thị dưới dạng bảng.

No	Place	Address	Distance	Hours	Minutes
🧩 User Interface

Giao diện bao gồm:

menu điều khiển

bảng lịch trình

danh sách địa điểm

thông tin địa điểm

bản đồ

🏗 Project Structure
smart-tourism-map
│
├── index.html
├── map.js
├── style.css
├── data.json
│
├── images
│
└── README.md
⚙️ Technologies

HTML5

CSS3

JavaScript

Google Maps JavaScript API

Google Directions API

OpenWeatherMap API

🔑 Required APIs
Google Maps API

https://console.cloud.google.com/

Enable:

Maps JavaScript API

Directions API

OpenWeatherMap

https://openweathermap.org/api

▶️ Run Project

Clone project

git clone https://github.com/username/smart-tourism-map.git

Open project

index.html

in browser.

📈 Future Improvements

🔍 search địa điểm

📱 mobile responsive

💾 lưu lịch trình

🤖 AI recommendation

🌐 tourism database

👨‍💻 Author

Smart Tourism Project

Tourism Information System

⭐ If you like this project, please star the repository.

💡 Nếu bạn muốn, mình có thể viết thêm README bản cực đẹp (giống project 2000⭐ GitHub) gồm:

📸 ảnh screenshot giao diện

🧠 sơ đồ hệ thống (architecture diagram)

🗺 sơ đồ luồng thuật toán

🎨 banner project đẹp

📊 database design

README đó đưa lên GitHub nhìn rất chuyên nghiệp như đồ án tốt nghiệp hoặc project startup.
