let pos;
let map;
let bounds;
let infoWindow;
let currentInfoWindow;
let service;

let infoPane;
var lati = 0;
var longi = 0;

var mangDiemtrungtam = [];

var arrMarkers = [];
var arrMarker = [];
var placeDisplay;
var display;
var directionsDisplay;
var temp;

var count = 0;


var buttonLoca = document.getElementById('show-location')
buttonLoca.addEventListener('click', swapper, false);

function swapper() {
    document.querySelector('.direction').style.display = "block";
    document.querySelector('.directions').style.display = "none";
};
var buttonLocas = document.getElementById('hide-location')

buttonLocas.addEventListener('click', swappers, false);

function swappers() {
    document.querySelector('.direction').style.display = "none";
    document.querySelector('.directions').style.display = "block";
};


const menushow = document.querySelector('.menushow');
var toggle = document.getElementById('showmenu')
toggle.onclick = function () {
    toggle.classList.toggle('open')
    menushow.classList.toggle('show')
}

function timdiadiem(loai) {
    if (!loai || loai == '') return;
    var req = {
        location: {
            lat: lati,
            lng: longi,
        }, // trung tâm vùng tìm kiếm
        radius: '3000', //bán kính vùng tìm kiếm
        type: loai,
    }
    var service = new google.maps.places.PlacesService(map) // dịch vụ tìm kiếm địa điểm
    service.nearbySearch(req, function (result, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK && result && result.length > 0) {
            for (var i in arrMarkers) // set lại map khi đã thay đổi vị trí tìm kiếm
                arrMarkers[i].setMap(null);
            arrMarkers = [];
            for (var i in result) {
                var place = result[i];
                console.log(place)
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                }
                var marker = new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    content: "<strong>" + place.name + "</strong>" + "<br/>" + place.vicinity + "<br/>",
                    position: place.geometry.location,
                    data: place
                });
                marker.addListener('click', function () {
                    infoWindow.setContent(this.content);
                    infoWindow.open(map, this)
                    timduong(this.data)
                });
                arrMarkers.push(marker);
            }
        }
    });
}
function timduong(place) {
    var service = new google.maps.DirectionsService();
    if (display) display.setMap(null)
    display = new google.maps.DirectionsRenderer();
    display.setMap(map);
    var req = {
        origin: { lat: lati, lng: longi }, // vị trí bắt đầu
        destination: place.geometry.location, //  vị trí kết thúc
        travelMode: "DRIVING", // phương tiện di chuyển
        provideRouteAlternatives: true, // chỉ đường ngắn và phù hợp nhất
    }
    service.route(req, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            display.setDirections(result);
            directionsDisplay.setMap(null);
            placeDisplay.setMap(null);
        }
    })
}
function calcRoute() {
    const travelModes = document.getElementById("mode").value;
    let directionsService = new google.maps.DirectionsService();
    if (directionsDisplay) directionsDisplay.setMap(null);
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    var request = {
        origin: { lat: lati, lng: longi },
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode[travelModes],
    }
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            placeDisplay.setMap(null);
            display.setMap(null);

        } else {
            directionsDisplay.setDirections({ routes: [] });
            map.setCenter({ lat: lati, lng: longi });
        }
    });
}
function calcRoutes() {
    const travelModes = document.getElementById("modes").value;
    let directionsService = new google.maps.DirectionsService();
    if (directionsDisplay) directionsDisplay.setMap(null);
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    var request = {
        origin: document.getElementById("tu").value,
        destination: document.getElementById("den").value,
        travelMode: google.maps.TravelMode[travelModes],
    }
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            console.log(result)
            directionsDisplay.setDirections(result);
            placeDisplay.setMap(null);
            display.setMap(null);

        } else {
            directionsDisplay.setDirections({ routes: [] });
            map.setCenter({ lat: lati, lng: longi });
        }
    });
}


function initMap() {
        // Khởi tạo biến
        bounds = new google.maps.LatLngBounds(); //xác định khu vực tìm kiếm hình chữ nhật
        infoWindow = new google.maps.InfoWindow; // khởi tạo cửa sổ thông tin bản đồ
        currentInfoWindow = infoWindow; // Cửa sổ thông tin hiện tại
    
        infoPane = document.getElementById('panel');
    
        // Thử định vị địa lý HTML5
        navigator.geolocation.getCurrentPosition(position => {
            lati = parseFloat(position.coords.latitude); // 7,8 lấy ra kinh độ , vĩ độ;
            longi = parseFloat(position.coords.longitude);
            pos = {
            lat: lati, // xác định vĩ độ 
            lng: longi// xác định kinh độ 
            };

            map = new google.maps.Map(document.getElementById('map'), { // tìm thẻ có id = map và gán vào biến bản đồ
            center: pos, // lấy tọa độ trung tâm
            zoom: 15, // zoom từ 14 - 16 là ok
            });

            var diemtrungtam = new google.maps.Marker({ // tạ0 ra điểm chấm mốc
            position: pos,
            map: map,
            animation: google.maps.Animation.DROP,
            title: "Vị trí của bạn",
            mapTypeId: "roadmap",
            })
        //Vòng tròn
            mangDiemtrungtam.push(diemtrungtam);
            addPanToMarker(map, mangDiemtrungtam);
        // Thời tiết
        textWeather(pos)
    
        const geocoder = new google.maps.Geocoder();
        const infowindow = new google.maps.InfoWindow();
        
        google.maps.event.addListener(diemtrungtam, "click", () => {
            geocodeLatLng(geocoder, map, infowindow, pos);
            // document.querySelector('.tabs-content').style.transform = "translateX(-100%)"
        });
    
            var options = {
                componentRestrictions: { 'country': ['vn'] },
                fields: ['geometry', 'name'],
                types: ['establishment']
            }
            var input2 = document.getElementById("to");
            var autocomplete2 = new google.maps.places.Autocomplete(input2, options);
            var input3 = document.getElementById("tu");
            var autocomplete2 = new google.maps.places.Autocomplete(input3, options);
            var input4 = document.getElementById("den");
            var autocomplete2 = new google.maps.places.Autocomplete(input4, options);
        });
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var textMapNgay = document.getElementById('textMapNgay');
            textMapNgay.onclick = function() {
                // Khởi tạo biến
                bounds = new google.maps.LatLngBounds(); //xác định khu vực tìm kiếm hình chữ nhật
                infoWindow = new google.maps.InfoWindow; // khởi tạo cửa sổ thông tin bản đồ
                currentInfoWindow = infoWindow; // Cửa sổ thông tin hiện tại
            
                infoPane = document.getElementById('panel');
            
                // Thử định vị địa lý HTML5
                navigator.geolocation.getCurrentPosition(position => {
                    lati = parseFloat(position.coords.latitude); // 7,8 lấy ra kinh độ , vĩ độ;
                    longi = parseFloat(position.coords.longitude);
                    pos = {
                    lat: lati, // xác định vĩ độ 
                    lng: longi// xác định kinh độ 
                    };
                    

                    map = new google.maps.Map(document.getElementById('map'), { // tìm thẻ có id = map và gán vào biến bản đồ
                    center: pos, // lấy tọa độ trung tâm
                    zoom: 15, // zoom từ 14 - 16 là ok
                    });
                    var diemtrungtam = new google.maps.Marker({ // tạ0 ra điểm chấm mốc
                    position: pos,
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: "Vị trí của bạn",
                    mapTypeId: "roadmap",
                })
                //Vòng tròn
                mangDiemtrungtam.push(diemtrungtam);
                addPanToMarker(map, mangDiemtrungtam);
                // Thời tiết
                textWeather(pos)
            
                const geocoder = new google.maps.Geocoder();
                const infowindow = new google.maps.InfoWindow();
                
                google.maps.event.addListener(diemtrungtam, "click", () => {
                    geocodeLatLng(geocoder, map, infowindow, pos);
                    document.querySelector('.tabs-content').style.transform = "translateX(-100%)"
                });
            
                    var options = {
                        componentRestrictions: { 'country': ['vn'] },
                        fields: ['geometry', 'name'],
                        types: ['establishment']
                    }
                    var input2 = document.getElementById("to");
                    var autocomplete2 = new google.maps.places.Autocomplete(input2, options);
                    var input3 = document.getElementById("tu");
                    var autocomplete2 = new google.maps.places.Autocomplete(input3, options);
                    var input4 = document.getElementById("den");
                    var autocomplete2 = new google.maps.places.Autocomplete(input4, options);
                });
                }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var textMapDem = document.getElementById('textMapDem');
        textMapDem.onclick = function() {
            // Khởi tạo biến
            bounds = new google.maps.LatLngBounds(); //xác định khu vực tìm kiếm hình chữ nhật
            infoWindow = new google.maps.InfoWindow; // khởi tạo cửa sổ thông tin bản đồ
            currentInfoWindow = infoWindow; // Cửa sổ thông tin hiện tại
        
            infoPane = document.getElementById('panel');
        
            // Thử định vị địa lý HTML5
            navigator.geolocation.getCurrentPosition(position => {
                lati = parseFloat(position.coords.latitude); // 7,8 lấy ra kinh độ , vĩ độ;
                longi = parseFloat(position.coords.longitude);
                pos = {
                lat: lati, // xác định vĩ độ 
                lng: longi// xác định kinh độ 
                };
                

                map = new google.maps.Map(document.getElementById('map'), { // tìm thẻ có id = map và gán vào biến bản đồ
                    center: pos,
                    zoom: 15,
                    styles: [
                    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                    {
                        featureType: "administrative.locality",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#d59563" }],
                    },
                    {
                        featureType: "poi",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#d59563" }],
                    },
                    {
                        featureType: "poi.park",
                        elementType: "geometry",
                        stylers: [{ color: "#263c3f" }],
                    },
                    {
                        featureType: "poi.park",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#6b9a76" }],
                    },
                    {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [{ color: "#38414e" }],
                    },
                    {
                        featureType: "road",
                        elementType: "geometry.stroke",
                        stylers: [{ color: "#212a37" }],
                    },
                    {
                        featureType: "road",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#9ca5b3" }],
                    },
                    {
                        featureType: "road.highway",
                        elementType: "geometry",
                        stylers: [{ color: "#746855" }],
                    },
                    {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [{ color: "#1f2835" }],
                    },
                    {
                        featureType: "road.highway",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#f3d19c" }],
                    },
                    {
                        featureType: "transit",
                        elementType: "geometry",
                        stylers: [{ color: "#2f3948" }],
                    },
                    {
                        featureType: "transit.station",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#d59563" }],
                    },
                    {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{ color: "#17263c" }],
                    },
                    {
                        featureType: "water",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#515c6d" }],
                    },
                    {
                        featureType: "water",
                        elementType: "labels.text.stroke",
                        stylers: [{ color: "#17263c" }],
                    },
                    ],
                });
                var diemtrungtam = new google.maps.Marker({ // tạ0 ra điểm chấm mốc
                position: pos,
                map: map,
                animation: google.maps.Animation.DROP,
                title: "Vị trí của bạn",
                mapTypeId: "roadmap",
            })
            //Vòng tròn
            mangDiemtrungtam.push(diemtrungtam);
            addPanToMarker(map, mangDiemtrungtam);            
            // Thời tiết
            textWeather(pos)
        
            const geocoder = new google.maps.Geocoder();
            const infowindow = new google.maps.InfoWindow();
            
            google.maps.event.addListener(diemtrungtam, "click", () => {
                geocodeLatLng(geocoder, map, infowindow, pos);
                document.querySelector('.tabs-content').style.transform = "translateX(-100%)"
            });
        
                var options = {
                    componentRestrictions: { 'country': ['vn'] },
                    fields: ['geometry', 'name'],
                    types: ['establishment']
                }
                var input2 = document.getElementById("to");
                var autocomplete2 = new google.maps.places.Autocomplete(input2, options);
                var input3 = document.getElementById("tu");
                var autocomplete2 = new google.maps.places.Autocomplete(input3, options);
                var input4 = document.getElementById("den");
                var autocomplete2 = new google.maps.places.Autocomplete(input4, options);
            });
            }
}

// Vòng tròn
function addPanToMarker(map, markers) {
    let circle;
    markers.map(marker => {
      marker.addListener('click', event => {
        const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        map.panTo(location);
        if (circle) {
          circle.setMap(null);
        }
        circle = drawCircle(map, location);
      });
    });
  }
  
  function drawCircle(map, location) {
    const circleOptions = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      map: map,
      center: location,
      radius: 500
    }
    const circle = new google.maps.Circle(circleOptions);
    return circle;
  }

// Vòng tròn



  
function geocodeLatLng(geocoder, map, infowindow, pos) {
  
  // const input = document.getElementById("latlng").value;
  // const latlngStr = input.split(",", 2);
  const latlng = pos
  console.log(latlng)
  geocoder
  .geocode({ location: latlng })
  .then((response) => {
    console.log(response.results[0])
    console.log(response.results[0].place_id)
    if (response.results[0]) {
      map.setZoom(11);
  
      const marker = new google.maps.Marker({
        position: latlng,
        map: map,
      });
  
  
      google.maps.event.addListener(marker, 'click', () => {
        let request = {
          placeId: response.results[0].place_id, // thuộc tính placeId chỉ định một nơi duy nhất cho yêu cầu chi tiết 
          fields: ['name', 'formatted_address', 'geometry', 'rating', // thuộc tính fields là một dãy tên của trường cho thông tin mà bạn muốn trả về về địa điểm.
            'website', 'photos']
        };
  
        const service = new google.maps.places.PlacesService(map);
  
        /* Chỉ tìm nạp thông tin chi tiết của địa điểm khi người dùng nhấp vào điểm đánh dấu.
          * Nếu chúng tôi lấy thông tin chi tiết cho tất cả các kết quả về địa điểm ngay khi chúng tôi nhận được
          * phản hồi tìm kiếm, chúng tôi sẽ đạt giới hạn tốc độ API. */
        service.getDetails(request, (placeResult, status) => {
          showDetails(placeResult, marker, status)
        });
        // console.log('Hello world')
      });
  
     infowindow.setContent(response.results[0].formatted_address);
  // infowindow.setContent(response.results[0].address_components[3].long_name);
    let textaddress = response.results[0].address_components[3].long_name
    console.log('textaddress',textaddress)
    // Thời tiết sau khi click
    textWeather123(pos, textaddress)
  
    marker.addListener('mouseout', function () {
      infowindow.close();
      document.querySelector('.open').style.opacity = 0;
    });
    marker.addListener('mouseover', function () {
      infowindow.open(map, marker);
    });
  
    infowindow.open(map, marker);
  
  
  
    } else {
      window.alert("No results found");
    }
    
  })
  .catch((e) => window.alert("Geocoder failed due to: " + e));
  }
  
  
  
  /* CẦN LÀM: Bước 4C: Hiển thị chi tiết địa điểm trong cửa sổ thông tin */
   // Xây dựng một InfoWindow để hiển thị chi tiết phía trên điểm đánh dấu
   function showDetails(placeResult, marker, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      // let placeInfowindow = new google.maps.InfoWindow();
      // let rating = "None";
      // if (placeResult.rating) rating = placeResult.rating;
      // placeInfowindow.setContent('<div><strong>' + placeResult.name +
      //   '</strong><br>' + 'Rating: ' + rating + '</div>');
      // placeInfowindow.open(marker.map, marker);
      // currentInfoWindow.close();
      // currentInfoWindow = placeInfowindow;
      showPanel(placeResult);
    } else {
      console.log('showDetails failed: ' + status);
    }
  }
  
  /* TODO: Step 4D: Tải chi tiết địa điểm trong thanh bên */
  // Hiển thị chi tiết địa điểm trong thanh bên
  function showPanel(placeResult) {
    // Nếu infoPane đã mở, hãy đóng nó lại
    if (infoPane.classList.contains("open")) {
      infoPane.classList.remove("open");
    }
  
    // Xóa các chi tiết trước đó
    while (infoPane.lastChild) {
      infoPane.removeChild(infoPane.lastChild);
    }
  
    /* TODO: Step 4E: Hiển thị Ảnh Địa điểm với Chi tiết Địa điểm */
    // Thêm ảnh chính, nếu có
    if (placeResult.photos) {
      let firstPhoto = placeResult.photos[0];
      let photo = document.createElement('img');
      photo.classList.add('hero');
      photo.src = firstPhoto.getUrl();
      infoPane.appendChild(photo);
    }
  
    // Thêm chi tiết địa điểm với định dạng văn bản
    let name = document.createElement('h1');
    name.classList.add('place');
    name.textContent = placeResult.name;
    infoPane.appendChild(name);
    if (placeResult.rating) {
      let rating = document.createElement('p');
      rating.classList.add('details');
      rating.textContent = `Rating: ${placeResult.rating} \u272e`;
      infoPane.appendChild(rating);
    }
    let address = document.createElement('p');
    address.classList.add('details');
    address.textContent = placeResult.formatted_address;
    infoPane.appendChild(address);
    if (placeResult.website) {
      let websitePara = document.createElement('p');
      let websiteLink = document.createElement('a');
      let websiteUrl = document.createTextNode(placeResult.website);
      websiteLink.appendChild(websiteUrl);
      websiteLink.title = placeResult.website;
      websiteLink.href = placeResult.website;
      websitePara.appendChild(websiteLink);
      infoPane.appendChild(websitePara);
    }
  
    // Mở bảng thông tin
    infoPane.classList.add("open");
    document.querySelector('.open').style.opacity = 1;
  }
  
  // 
  //-- Thời tiết --//
  async function textWeather(posis) {
  // console.log(posis.lat, posis.lng)
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${posis.lat}&lon=${posis.lng}&appid=677bb5e89a8c0e450ebca93fc6296070`
  let data = await fetch(apiURL).then(response => response.json())
  var iconurl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
  document.querySelector('#wicon').src = iconurl
  // tìm thời tiết
  var thoitiet = data.weather[0].description
  if (thoitiet === 'clear sky' || thoitiet === 'few clouds') {
    if (data.name === "Bien Hoa") {
        document.querySelector('.city').innerHTML = "Đồng Nai"
    } else {
        document.querySelector('.city').innerHTML = data.name
    }
    document.querySelector('.status').innerHTML = 'Trời nắng';
    document.querySelector('.temp').innerHTML ="Nhiệt độ : " + String(Math.round(data.main.temp - 273.15)) + "°C"
  } else if (thoitiet === 'scattered clouds' || thoitiet === 'broken clouds') {
    if (data.name === "Bien Hoa") {
        document.querySelector('.city').innerHTML = "Đồng Nai"
    } else {
        document.querySelector('.city').innerHTML = data.name
    }
    document.querySelector('.status').innerHTML = 'Trời mây';
    document.querySelector('.temp').innerHTML ="Nhiệt độ : " + String(Math.round(data.main.temp - 273.15)) + "°C"
  } else {
    if (data.name === "Bien Hoa") {
        document.querySelector('.city').innerHTML = "Đồng Nai"
    } else {
        document.querySelector('.city').innerHTML = data.name
    }
    document.querySelector('.status').innerHTML = 'Trời mưa';
    document.querySelector('.temp').innerHTML ="Nhiệt độ : " + String(Math.round(data.main.temp - 273.15)) + "°C"
  }
  
  }
  
  async function textWeather123(posis, textaddress) {
  // console.log(posis.lat, posis.lng)
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${posis.lat}&lon=${posis.lng}&appid=677bb5e89a8c0e450ebca93fc6296070`
  let data = await fetch(apiURL).then(response => response.json())
  var iconurl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
  document.querySelector('#wicon').src = iconurl
  // tìm thời tiết
  var thoitiet = data.weather[0].description
  if (thoitiet === 'clear sky' || thoitiet === 'few clouds') {
      console.log('Trời nắng')
      document.querySelector('.city').innerHTML = textaddress;
      document.querySelector('.status').innerHTML = 'Trời nắng';
      document.querySelector('.temp').innerHTML ="Nhiệt độ : " + String(Math.round(data.main.temp - 273.15)) + "°C"
  } else if (thoitiet === 'scattered clouds' || thoitiet === 'broken clouds') {
      document.querySelector('.city').innerHTML = textaddress;
      document.querySelector('.status').innerHTML = 'Trời mây';
      document.querySelector('.temp').innerHTML ="Nhiệt độ : " + String(Math.round(data.main.temp - 273.15)) + "°C"
  } else {
      document.querySelector('.city').innerHTML = textaddress;
      document.querySelector('.status').innerHTML = 'Trời mưa';
      document.querySelector('.temp').innerHTML ="Nhiệt độ : " + String(Math.round(data.main.temp - 273.15)) + "°C"
  }
  
  }





//////////////////////////////////////////////////////////////
// Thời-Tiết
// Thời-Tiết
// Thời-Tiết
// Thời-Tiết
// Thời-Tiết
//////////////////////////////////////////////////////////////
  var courseApi = 'http://localhost:4000/diadiem'

  function start() {
  
      getCourses(function(dulich) {
          myFunction(dulich)
          myFunctionNgayDem(dulich)
      });
  }
  start()

  function getCourses(callback) { // GET lấy ra courses
      fetch(courseApi)
          .then(function(response) {
              return response.json();
          })
          .then(callback); // Dùng callback để gọi lại/lấy qua hàm getCourses trả về start
  }
async function myFunction(dulich) {
    var textbutton = document.getElementById('buttonThoiTiet');
    textbutton.addEventListener('click', function(){
            // location.reload();
          console.log("Chạy ngay đi !!!!!");
          alert('Run');
          document.querySelector('.stores-list-container').style.display = 'block';
          setTimeout(async function(){
          clearLocations();
          displayStores(dulich);
          showStoresMarkers(dulich);
          setOnClickListener();
        }, 2500);
    });
    
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < arrMarker.length; i++) {
        arrMarker[i].setMap(null);
    }
    arrMarker.length = 0;
}

var today = new Date();


function displayStores(data) {
    var storesHtml = '';
    var thoitiet123 = document.querySelector('.status').innerText
    // console.log(thoitiet123);
    var listCourse = data.filter(function(store, index) {
        return store.weather === thoitiet123
    });
    // console.log(listCourse.length);
    // console.log(listCourse);
    for (let i = 0; i < listCourse.length; i++) {
        // var latlongz = listCourse[i].latlong;
        // console.log(latlngz)
        var name = listCourse[i].name;
        var ranking = listCourse[i].ranking;
        var address = listCourse[i].address;
        storesHtml +=
            `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-name"><span>${name}</span></div>
                        <div class="store-ranking"><span>${ranking} \u272e</span></div>
                        <div class="store-address">${address}</div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">${i + 1}</div>
                    </div>
                </div>
            </div>
            `
        document.querySelector('.stores-list').innerHTML = storesHtml;

    }
}


function setOnClickListener() {
    var storeElements = document.querySelectorAll('.store-container-background');
    storeElements.forEach(function (element, index) {
        element.addEventListener('click', function () {
            new google.maps.event.trigger(arrMarker[index], "click");
            
        })
    })
    // document.querySelector(".tabs-content").style.opacity = 1;
    // console.log(latlng)

}

function showStoresMarkers(stores) {

    var thoitiet123 = document.querySelector('.status').innerText
    var bounds = new google.maps.LatLngBounds();

    var listCourse = stores.filter(function(store, index) {
        return store.weather === thoitiet123
    });
    
    for (let i = 0; i < listCourse.length; i++) {
        var name = listCourse[i].name;
        var address = listCourse[i].address;
        var image = listCourse[i].image_link;
        var address_link = listCourse[i].address_link;
        var sodienthoai = listCourse[i].sodienthoai;
        var website = listCourse[i].website;
        var ranking = listCourse[i].ranking;
        var weather = listCourse[i].weather;
        const latlng = {
                lat: parseFloat(listCourse[i].latlong.split(', ')[0]),
                lng: parseFloat(listCourse[i].latlong.split(', ')[1]),
        };
        var latlongz = listCourse[i].latlong;
        // console.log(listCourse);
        createMarker(latlng, name, address, image, website, sodienthoai, address_link, ranking, weather, i + 1, latlongz);
        bounds.extend(latlng);
    }
    map.fitBounds(bounds);

}


function ChiDuong() {
    var sideBar = document.getElementById('sidebar');
    sideBar.classList.toggle('show');
    sideBar.classList.toggle('hide');
}



function createMarker(latlng, name, address, image, website, sodienthoai, address_link, ranking, weather, index, latlongz) {

    // console.log(latlng)

    var html2 = `

        <div class="store-info-window">
          <div class="store-info-name">
            ${name}
          </div>
          <div class="store-info-address">
            <i class='bx bx-map-pin'></i>
            ${address}
          </div>
        </div>

    `
    // tabsMenu
    var tabsMenu = `
        <div class="tabs-image">
            <img src="${image}" alt="">
        </div>
        <div class="tabs-name">
            <span>${name}</span>
        </div>            
        <div class="tabs-ranking">
            <span>${ranking} \u272e  ${weather}</span>
        </div>
        
        <div class="dongngang"></div>

        <div class="tabs-app">
                <div class="tab-app-item" onclick="ChiDuong()">
                    <div class="tab-app-com">
                        <a href="#" class="ChiDuong">
                            <span class="bx bxs-navigation"></span>
                            <div class="name-app">Chỉ Đường</div>
                        </a>
                    </div>
                </div>
                <div class="tab-app-item">
                    <div class="tab-app-com">
                        <a href = "${address_link}" class="button-app">
                            <span class="bx bxs-extension"></span>
                            <div class="name-app">Mở Rộng</div>
                        </a>
                    </div>
                </div>
                <div class="tab-app-item">
                    <div class="tab-app-com">
                        <a class="button-app">
                            <span class="bx bxs-share-alt"></span>
                            <div class="name-app">Chia Sẻ</div>
                        </a>
                    </div>
                </div>
                <div class="tab-app-item">
                    <div class="tab-app-com">
                        <a class="button-app" onclick="LichTrinh123(${index},\`${name}\`,\`${address}\`,\`${latlng}\`,\`${latlongz}\`)">
                            <span class="bx bxs-map"></span>
                            <div class="name-app">Lịch Trình</div>
                        </a>
                    </div>
                </div>
            </div>

            <div class="dongngang"></div>

            <div class="show-address">
                <div class="address-item-list">
                    <div class="address-item-address">
                        <i class='bx bx-map'></i>
                        <span class="address-name">${address}</span>
                    </div>
                    <div class="address-item">
                        <i class='bx bx-run'></i>
                        <span class="kilomet"></span>
                        <span class="thoigian"></span>
                    </div>
                    <div class="address-item">
                        <i class='bx bx-map-pin'></i>
                        <a class="address-website" href="${website}">${name}</a>
                    </div>
                    <div class="address-item">
                    <i class='bx bx-phone'></i>
                        <span class="address-phone">${sodienthoai}</span>
                    </div>
                </div>
            </div
    `

    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: index.toString(),
        icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        animation: google.maps.Animation.BOUNCE,
    });
    marker.addListener('mouseover', function () {
        infoWindow.setContent(html2);
        infoWindow.open(map, marker);
    });
    marker.addListener('mouseout', function () {
        infoWindow.close();
    });
    marker.addListener('click', function () {
        run_place(latlng);
        textaddress = address.split(',').slice(-2,-1)
        textWeatherMarker(latlng, textaddress)

        var deleteTextDemo = document.querySelector('.tabs-content')
        deleteTextDemo.classList.toggle('tabs-content-hide')
        deleteTextDemo.classList.toggle('tabs-content-show')
        
        document.querySelector('.tabs-content').innerHTML = tabsMenu;
    });
    arrMarker.push(marker);
    
}

async function textWeatherMarker(posis, textaddress) {
    // console.log(posis.lat, posis.lng)
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${posis.lat}&lon=${posis.lng}&appid=677bb5e89a8c0e450ebca93fc6296070`
    let data = await fetch(apiURL).then(response => response.json())
    var iconurl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    document.querySelector('#wicon').src = iconurl
    // tìm thời tiết
    var thoitiet = data.weather[0].description
    if (thoitiet === 'clear sky' || thoitiet === 'few clouds') {
        console.log('Trời nắng')
        document.querySelector('.city').innerHTML = textaddress;
        document.querySelector('.status').innerHTML = 'Trời nắng';
        document.querySelector('.temp').innerHTML ="Nhiệt độ : " + String(Math.round(data.main.temp - 273.15)) + "°C"
    } else if (thoitiet === 'scattered clouds' || thoitiet === 'broken clouds') {
        document.querySelector('.city').innerHTML = textaddress;
        document.querySelector('.status').innerHTML = 'Trời mây';
        document.querySelector('.temp').innerHTML ="Nhiệt độ : " + String(Math.round(data.main.temp - 273.15)) + "°C"
    } else {
        document.querySelector('.city').innerHTML = textaddress;
        document.querySelector('.status').innerHTML = 'Trời mưa';
        document.querySelector('.temp').innerHTML ="Nhiệt độ : " + String(Math.round(data.main.temp - 273.15)) + "°C"
    }
    
    }


function run_place(latlng) {
    
    textPos = {
        lat: lati, // xác định vĩ độ 
        lng: longi// xác định kinh độ 
      };

    const directionsService = new google.maps.DirectionsService();

    if (placeDisplay) placeDisplay.setMap(null);

    placeDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map,
      panel: document.getElementById("banchiduong"),
    });

    placeDisplay.addListener("directions_changed", () => {
      const directions = placeDisplay.getDirections();
      if (directions) {
        computeTotalDistance(directions);
      }
    });

    displayRoute(
        textPos,
        latlng,
        directionsService,
        placeDisplay
    );

    var textchiduong = document.querySelectorAll('#banchiduong')
    for (let i = 0; i < textchiduong.length; i++) {
        // console.log(textchiduong[i].firstElementChild)
        var xoaElement = textchiduong[i].firstElementChild
        if (xoaElement !== null) {
            xoaElement.remove();
        }
    }
}


function displayRoute(origin, destination, service, display) {
    service
      .route({
        origin: origin,
        destination: destination,
        // waypoints: [
        //   { location: "Adelaide, SA" },
        //   { location: "Broken Hill, NSW" },
        // ],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true,
      })
      .then((result) => {
        display.setDirections(result);
      })
      .catch((e) => {
        alert("Could not display directions due to: " + e);
      });
  }
  
  var hours;
  var minutes;
  var tongtime = 0;
  var tongQuangduong = 0;

  function computeTotalDistance(result) {

    var timerun = 0;
    var quangduong = 0;

    const myroute = result.routes[0];
  
    if (!myroute) {
      return;
    }
  
    for (let i = 0; i < myroute.legs.length; i++) {
        quangduong += myroute.legs[i].distance.value;
        timerun += myroute.legs[i].duration.value;

    }
  
    quangduong = (quangduong / 1000).toFixed(1);
    tongtime = Math.round(timerun / 60);
    hours = Math.floor(tongtime / 60);
    minutes = tongtime % 60;


    document.getElementById("kilomet").innerHTML = quangduong + " km ";
    document.querySelector('.kilomet').innerHTML = quangduong + "km";
    document.querySelector('.thoigian').innerHTML = "/" + hours + " giờ" + minutes + " phút";
    
}

///////////////////////// - Lịch Trình -///////////////////////////////////////////////////

var danhsach = [];
var textDS = [];
var flightPlanCoordinates = [];
var mangLatlong = [];

var condition = true;
// var checkPoint = true
var countext = 1;
//--------Khai Báo Lịch Trình--------------//

function LichTrinh123(index, name, address, latlng, latlongz) {
    var infoWindow = new google.maps.InfoWindow;
    var textLat = parseFloat(latlongz.split(', ')[0])
    var textLong = parseFloat(latlongz.split(', ')[1])


    const latlongLichtrinh = {
        lat: textLat,
        lng: textLong
    };
    // console.log(latlongLichtrinh)



    var textQuangduong = parseFloat(kilomet.textContent)

    var ds = [index, name, address, textQuangduong, hours, minutes, latlongLichtrinh];

    for (let i = 0; i < danhsach.length; i++) {
        if (danhsach[i][1] == name) {
            return;
        }
    }

//--------Chạy Lịch Trình--------------//

var runTest = document.getElementById("runTest");
runTest.onclick = function() {

        // if (condition == true) {
            for (var i = 0; i < danhsach.length; i++) {
                if (placeDisplay) placeDisplay.setMap(null);
                clearLocations()
                var latlong555 = danhsach[i][6];
                var textcontentx = danhsach[i][1];
                flightPlanCoordinates.push(new google.maps.LatLng(danhsach[i][6]))
                lichtrinhDiadiem123(latlong555, textcontentx); 
            }      
        chayngaydi123(danhsach);
        // lichtrinhDiadiem123(latlong555, mangLatlong, textcontentx);            
        document.getElementById('runTest').style.opacity = 0;         
};
    danhsach.push(ds);
    showPlace(ds);
}

//--------Địa Điểm Lịch Trình--------------//

function lichtrinhDiadiem123(latlong555, textcontentx) {
        
    var markerlichtrinh = new google.maps.Marker({
        map: map,
        position: latlong555,
        // label: index.toString(),
        content: textcontentx,
        icon: "./text.png",
        animation: google.maps.Animation.BOUNCE,
    });

    markerlichtrinh.addListener('mouseover', function () {
        // infoWindow.open(map, content);
        infoWindow.setContent(this.content);
        infoWindow.open(map, this)
    });
    markerlichtrinh.addListener('mouseout', function () {
        infoWindow.close();
    });
    markerlichtrinh.addListener('click', function () {
        document.querySelector('.stores-list-container').style.display = 'none';
    });
    textDS.push(markerlichtrinh);
    const flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        editable: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map,
    });
}


var mangLatlong = [];

function chayngaydi123(danhsach) {
    for (var i = 0; i < danhsach.length; i++) {
        mangLatlong.push(danhsach[i][6])
    }

    var mangCuoi = mangLatlong.slice(mangLatlong.length-1)[0] // mảng cuối
    var mangGiua = mangLatlong.slice(0, mangLatlong.length - 1);// mảng giữa

    textPos123 = {
        lat: lati, // xác định vĩ độ 
        lng: longi // xác định kinh độ 
      };

    const directionsService123 = new google.maps.DirectionsService();

    if (placeDisplay) placeDisplay.setMap(null);

    placeDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map,
      panel: document.getElementById("banchiduong"),
    });

    placeDisplay.addListener("directions_changed", () => {
      const directions123 = placeDisplay.getDirections();
    //   if (directions123) {
    //     computeTotalDistance(directions123);
    //   }
    });

        displayRoute123(
            textPos123,
            mangCuoi,
            mangGiua,
            // mangDau,
            directionsService123,
            placeDisplay,
        );

    var textchiduong123 = document.querySelectorAll('#banchiduong')
    for (let i = 0; i < textchiduong123.length; i++) {
        var xoaElement = textchiduong123[i].firstElementChild
        if (xoaElement !== null) {
            xoaElement.remove();
        }
    }
}

var datatext = [];
function displayRoute123(textPos123, mangCuoi, mangGiua, service, display) {

for (var i = 0; i < mangGiua.length; i++) {
        var text1 = { location: mangGiua[i]}
        datatext.push(text1)
}
// console.log(datatext)

    service
      .route({
        origin: textPos123,
        destination: mangCuoi,
        waypoints: datatext,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true,
      })
      .then((result) => {
        display.setDirections(result);
      })
      .catch((e) => {
        alert("Could not display directions due to: " + e);
      });
}
  
//--------Bảng Lịch Trình--------------//
function showPlace(ds) {
    // console.log(ds); 
var sumkm = 0;
var sumgio = 0;
var sumphut = 0;

var tableLichtrinh = document.querySelector('#mylistText');


for (let i = 0; i < danhsach.length; i++) {
    var textsokilomet = danhsach[i][3]
    sumkm = sumkm + textsokilomet
    var textsogio = danhsach[i][4]  
    var textsophut = danhsach[i][5]
    sumgio = sumgio + textsogio
    sumphut = sumphut + textsophut
}
if (sumphut > 60) {
    var texttongsogio = sumgio + (sumphut / 60)
    // console.log(texttongsogio)
    document.getElementById("tongsoGio").innerHTML = Math.round(texttongsogio);
    var texttongsophut = sumphut % 60
    document.getElementById("tongsoPhut").innerHTML = Math.round(texttongsophut);
} else {
    document.getElementById("tongsoGio").innerHTML = Math.round(sumgio);
    document.getElementById("tongsoPhut").innerHTML = Math.round(sumphut);
}
// console.log(sum)
document.getElementById("tongsoKm").innerHTML = sumkm.toFixed(1);

        var addcontents = `
        <tr>
            <td>${ds[0]}</td>
            <td>${ds[1]}</td>
            <td>${ds[2]}</td>
            <td>${ds[3]}</td>
            <td>${ds[4]}</td>
            <td>${ds[5]}</td>
            <td><a onclick="xoalist123(this)" class="btn-del btn btn-danger btn-sm">Delete</a></td>
        </tr>
        `;
    
    tableLichtrinh.insertAdjacentHTML('beforeend', addcontents);
}

//--------Xóa Lịch Trình--------------//

function xoalist123(x) {
    var tr = x.parentElement.parentElement;
    var tensp = tr.children[1].innerText;
    tr.remove();
    for (let i = 0; danhsach.length; i++) {
        if(danhsach[i] === undefined) {return}
        if (danhsach[i][1] == tensp) {
            danhsach.splice(i, 1);
        }
    }

}

///////////////////////// - Lịch Trình -///////////////////////////////////////////////////

// nutLichTrinh

var hideshowNutLichTrinh = document.querySelector('.nutLichTrinh')
hideshowNutLichTrinh.onclick = function() {
    var Nutlichtrinh123 = document.getElementById('lichtrinh123');
    Nutlichtrinh123.classList.toggle('show');
    Nutlichtrinh123.classList.toggle('hide');
}

// nutLichTrinh







// ----------------Ngày/Đêm--------------//

          // Hàm khởi tạo đồng hồ
          function startTime()
          {
            // Lấy Object ngày hiện tại
            var today = new Date();
            
            // Giờ, phút, giây hiện tại
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            if (h < 12) {
            //   console.log('Ngày')
                var textDay =  'Ngày'
            } else {
            //   console.log('Đêm')
                var textDay =  'Đêm'
            }
            // Chuyển đổi sang dạng 01, 02, 03
            m = checkTime(m);
            s = checkTime(s);
            // Ghi ra trình duyệt
            document.getElementById('timer').innerHTML = textDay + ":" +  h + ":" + m + ":" + s;

            // Dùng hàm setTimeout để thiết lập gọi lại 0.5 giây / lần
            var t = setTimeout(function() {
                startTime();
            }, 500);
          }
           
          // Hàm này có tác dụng chuyển những số bé hơn 10 thành dạng 01, 02, 03, ...
          function checkTime(i)
          {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
          }






//////////////////////////////////////////////////////////////
// Ngày - Đêm
// Ngày - Đêm
// Ngày - Đêm
// Ngày - Đêm
// Ngày - Đêm
//////////////////////////////////////////////////////////////
async function myFunctionNgayDem(dulich) {
    var textbutton = document.getElementById('buttonngaydem');
    textbutton.addEventListener('click', function(){
            console.log("Chạy Ngày/Đêm !!!!!");
            alert('Run Ngày Đêm');
            document.querySelector('.stores-list-container').style.display = 'block';
            setTimeout(async function(){
            clearLocationsNgayDem();
            displayStoresNgayDem(dulich);
            showStoresMarkersNgayDem(dulich);
            setOnClickListenerNgayDem();
        }, 2500);
    });
    
}

function clearLocationsNgayDem() {
    infoWindow.close();
    for (var i = 0; i < arrMarker.length; i++) {
        arrMarker[i].setMap(null);
    }

    arrMarker.length = 0;
}


function displayStoresNgayDem(data) {

    var storesHtml = '';
    var textNgayDem123 = document.getElementById('timer').innerText
    // NgayDem123.split(':')[0]
    var NgayDem123 = textNgayDem123.split(':')[0]
    var listCourse = data.filter(function(store, index) {
        return store.day_or_night === NgayDem123
    });
    // console.log(listCourse.length);
    // console.log(listCourse);
    for (let i = 0; i < listCourse.length; i++) {
        // var latlongz = listCourse[i].latlong;
        // console.log(latlngz)
        var name = listCourse[i].name;
        var ranking = listCourse[i].ranking;
        var address = listCourse[i].address;
        storesHtml +=
            `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-name"><span>${name}</span></div>
                        <div class="store-ranking"><span>${ranking} \u272e</span></div>
                        <div class="store-address">${address}</div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">${i + 1}</div>
                    </div>
                </div>
            </div>
            `
        document.querySelector('.stores-list').innerHTML = storesHtml;

    }
}


function setOnClickListenerNgayDem() {
    var storeElements = document.querySelectorAll('.store-container-background');
    storeElements.forEach(function (element, index) {
        element.addEventListener('click', function () {
            new google.maps.event.trigger(arrMarker[index], "click");
            
        })
    })
    // document.querySelector(".tabs-content").style.opacity = 1;
    // console.log(latlng)

}

function showStoresMarkersNgayDem(stores) {
    var bounds = new google.maps.LatLngBounds();

    var textNgayDem123 = document.getElementById('timer').innerText
    // NgayDem123.split(':')[0]
    var NgayDem123 = textNgayDem123.split(':')[0]
    var listCourse = stores.filter(function(store, index) {
        return store.day_or_night === NgayDem123
    });
    
    for (let i = 0; i < listCourse.length; i++) {
        var name = listCourse[i].name;
        var address = listCourse[i].address;
        var image = listCourse[i].image_link;
        var address_link = listCourse[i].address_link;
        var sodienthoai = listCourse[i].sodienthoai;
        var website = listCourse[i].website;
        var ranking = listCourse[i].ranking;
        var day_or_night = listCourse[i].day_or_night;
        const latlng = {
                lat: parseFloat(listCourse[i].latlong.split(', ')[0]),
                lng: parseFloat(listCourse[i].latlong.split(', ')[1]),
        };
        var latlongz = listCourse[i].latlong;
        // console.log(listCourse);
        createMarker(latlng, name, address, image, website, sodienthoai, address_link, ranking, day_or_night, i + 1, latlongz);
        bounds.extend(latlng);
    }
    map.fitBounds(bounds);

}


function ChiDuongNgayDem() {
    var sideBar = document.getElementById('sidebar');
    sideBar.classList.toggle('show');
    sideBar.classList.toggle('hide');
}



function createMarkerNgayDem(latlng, name, address, image, website, sodienthoai, address_link, ranking, day_or_night, index, latlongz) {

    // console.log(latlng)

    var html2 = `

        <div class="store-info-window">
          <div class="store-info-name">
            ${name}
          </div>
          <div class="store-info-address">
            <i class='bx bx-map-pin'></i>
            ${address}
          </div>
        </div>

    `
    // tabsMenu
    var tabsMenu = `
        <div class="tabs-image">
            <img src="${image}" alt="">
        </div>
        <div class="tabs-name">
            <span>${name}</span>
        </div>            
        <div class="tabs-ranking">
            <span>${ranking} \u272e  ${day_or_night}</span>
        </div>
        
        <div class="dongngang"></div>

        <div class="tabs-app">
                <div class="tab-app-item" onclick="ChiDuongNgayDem()">
                    <div class="tab-app-com">
                        <a href="#" class="ChiDuongNgayDem">
                            <span class="bx bxs-navigation"></span>
                            <div class="name-app">Chỉ Đường</div>
                        </a>
                    </div>
                </div>
                <div class="tab-app-item">
                    <div class="tab-app-com">
                        <a href = "${address_link}" class="button-app">
                            <span class="bx bxs-extension"></span>
                            <div class="name-app">Mở Rộng</div>
                        </a>
                    </div>
                </div>
                <div class="tab-app-item">
                    <div class="tab-app-com">
                        <a class="button-app">
                            <span class="bx bxs-share-alt"></span>
                            <div class="name-app">Chia Sẻ</div>
                        </a>
                    </div>
                </div>
                <div class="tab-app-item">
                    <div class="tab-app-com">
                        <a class="button-app" onclick="LichTrinh123(${index},\`${name}\`,\`${address}\`,\`${latlng}\`,\`${latlongz}\`)">
                            <span class="bx bxs-map"></span>
                            <div class="name-app">Lịch Trình</div>
                        </a>
                    </div>
                </div>
            </div>

            <div class="dongngang"></div>

            <div class="show-address">
                <div class="address-item-list">
                    <div class="address-item-address">
                        <i class='bx bx-map'></i>
                        <span class="address-name">${address}</span>
                    </div>
                    <div class="address-item">
                        <i class='bx bx-run'></i>
                        <span class="kilomet"></span>
                        <span class="thoigian"></span>
                    </div>
                    <div class="address-item">
                        <i class='bx bx-map-pin'></i>
                        <a class="address-website" href="${website}">${name}</a>
                    </div>
                    <div class="address-item">
                    <i class='bx bx-phone'></i>
                        <span class="address-phone">${sodienthoai}</span>
                    </div>
                </div>
            </div
    `

    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: index.toString(),
        icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        animation: google.maps.Animation.BOUNCE,
    });
    marker.addListener('mouseover', function () {
        infoWindow.setContent(html2);
        infoWindow.open(map, marker);
    });
    marker.addListener('mouseout', function () {
        infoWindow.close();
    });
    marker.addListener('click', function () {
        run_place(latlng);
        textaddress = address.split(',').slice(-2,-1)
        textWeatherMarker(latlng, textaddress)

        var deleteTextDemo = document.querySelector('.tabs-content')
        deleteTextDemo.classList.toggle('tabs-content-hide')
        deleteTextDemo.classList.toggle('tabs-content-show')
        
        document.querySelector('.tabs-content').innerHTML = tabsMenu;
    });
    arrMarker.push(marker);
    
}

async function textWeatherMarkerNgayDem(posis, textaddress) {
    // console.log(posis.lat, posis.lng)
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${posis.lat}&lon=${posis.lng}&appid=677bb5e89a8c0e450ebca93fc6296070`
    let data = await fetch(apiURL).then(response => response.json())
    var iconurl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    document.querySelector('#wicon').src = iconurl
    // tìm thời tiết
    var thoitiet = data.weather[0].description
    if (thoitiet === 'clear sky' || thoitiet === 'few clouds') {
        console.log('Trời nắng')
        document.querySelector('.city').innerHTML = textaddress;
        document.querySelector('.status').innerHTML = 'Trời nắng';
        document.querySelector('.temp').innerHTML ="Nhiệt độ : " + String(Math.round(data.main.temp - 273.15)) + "°C"
    } else if (thoitiet === 'scattered clouds' || thoitiet === 'broken clouds') {
        document.querySelector('.city').innerHTML = textaddress;
        document.querySelector('.status').innerHTML = 'Trời mây';
        document.querySelector('.temp').innerHTML ="Nhiệt độ : " + String(Math.round(data.main.temp - 273.15)) + "°C"
    } else {
        document.querySelector('.city').innerHTML = textaddress;
        document.querySelector('.status').innerHTML = 'Trời mưa';
        document.querySelector('.temp').innerHTML ="Nhiệt độ : " + String(Math.round(data.main.temp - 273.15)) + "°C"
    }
    
    }


function run_placeNgayDem(latlng) {
    
    textPos = {
        lat: lati, // xác định vĩ độ 
        lng: longi// xác định kinh độ 
      };

    const directionsService = new google.maps.DirectionsService();

    if (placeDisplay) placeDisplay.setMap(null);

    placeDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map,
      panel: document.getElementById("banchiduong"),
    });

    placeDisplay.addListener("directions_changed", () => {
      const directions = placeDisplay.getDirections();
      if (directions) {
        computeTotalDistance(directions);
      }
    });

    displayRoute(
        textPos,
        latlng,
        directionsService,
        placeDisplay
    );

    var textchiduong = document.querySelectorAll('#banchiduong')
    for (let i = 0; i < textchiduong.length; i++) {
        // console.log(textchiduong[i].firstElementChild)
        var xoaElement = textchiduong[i].firstElementChild
        if (xoaElement !== null) {
            xoaElement.remove();
        }
    }
}


function displayRouteNgayDem(origin, destination, service, display) {
    service
      .route({
        origin: origin,
        destination: destination,
        // waypoints: [
        //   { location: "Adelaide, SA" },
        //   { location: "Broken Hill, NSW" },
        // ],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true,
      })
      .then((result) => {
        display.setDirections(result);
      })
      .catch((e) => {
        alert("Could not display directions due to: " + e);
      });
  }
  

  var hours123;
  var minutes123;
  function computeTotalDistance(result) {
    var tongtime = 0;
    var tongQuangduong = 0;
    var timerun = 0;
    var quangduong = 0;

    const myroute = result.routes[0];
  
    if (!myroute) {
      return;
    }
  
    for (let i = 0; i < myroute.legs.length; i++) {
        quangduong += myroute.legs[i].distance.value;
        timerun += myroute.legs[i].duration.value;

    }
  
    quangduong = (quangduong / 1000).toFixed(1);
    tongtime = Math.round(timerun / 60);
    hours123 = Math.floor(tongtime / 60);
    minutes123 = tongtime % 60;

    // console.log(hours123, minutes123)

    document.getElementById("kilomet").innerHTML = quangduong + " km ";
    document.querySelector('.kilomet').innerHTML = quangduong + "km";
    document.querySelector('.thoigian').innerHTML = "/" + hours123 + " giờ" + minutes123 + " phút";
}




//////////////////////////////////////////////////////////////
// Lịch Trình
// Lịch Trình
// Lịch Trình
// Lịch Trình
// Lịch Trình
//////////////////////////////////////////////////////////////

///////////////////////// - Lịch Trình -///////////////////////////////////////////////////

var danhsach = [];
var textDS = [];
var flightPlanCoordinates = [];
var mangLatlong = [];

var condition = true;
// var checkPoint = true
var countext = 1;
//--------Khai Báo Lịch Trình--------------//

function LichTrinh123(index, name, address, latlng, latlongz) {
    var infoWindow = new google.maps.InfoWindow;
    var textLat = parseFloat(latlongz.split(', ')[0])
    var textLong = parseFloat(latlongz.split(', ')[1])


    const latlongLichtrinh = {
        lat: textLat,
        lng: textLong
    };
    // console.log(hours123, minutes123)


    var textQuangduong = parseFloat(kilomet.textContent)

    var ds = [index, name, address, textQuangduong, hours123, minutes123, latlongLichtrinh];

    for (let i = 0; i < danhsach.length; i++) {
        if (danhsach[i][1] == name) {
            return;
        }
    }

//--------Chạy Lịch Trình--------------//

var runTest = document.getElementById("runTest");
runTest.onclick = function() {

        // if (condition == true) {
            for (var i = 0; i < danhsach.length; i++) {
                if (placeDisplay) placeDisplay.setMap(null);
                clearLocations()
                var latlong555 = danhsach[i][6];
                var textcontentx = danhsach[i][1];
                flightPlanCoordinates.push(new google.maps.LatLng(danhsach[i][6]))
                lichtrinhDiadiem(latlong555, textcontentx); 
            }      
        chayngaydi(danhsach);
        // lichtrinhDiadiem(latlong555, mangLatlong, textcontentx);            
        document.getElementById('runTest').style.opacity = 0;         
};
    danhsach.push(ds);
    showPlace123(ds);
}

//--------Địa Điểm Lịch Trình--------------//

function lichtrinhDiadiem(latlong555, textcontentx) {
        
    var markerlichtrinh = new google.maps.Marker({
        map: map,
        position: latlong555,
        // label: index.toString(),
        content: textcontentx,
        icon: "./text.png",
        animation: google.maps.Animation.BOUNCE,
    });

    markerlichtrinh.addListener('mouseover', function () {
        // infoWindow.open(map, content);
        infoWindow.setContent(this.content);
        infoWindow.open(map, this)
    });
    markerlichtrinh.addListener('mouseout', function () {
        infoWindow.close();
    });
    markerlichtrinh.addListener('click', function () {
        document.querySelector('.stores-list-container').style.display = 'none';
    });
    textDS.push(markerlichtrinh);
    const flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        editable: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map,
    });
}


var mangLatlong = [];

function chayngaydi(danhsach) {
    for (var i = 0; i < danhsach.length; i++) {
        mangLatlong.push(danhsach[i][6])
    }

    var mangCuoi = mangLatlong.slice(mangLatlong.length-1)[0] // mảng cuối
    var mangGiua = mangLatlong.slice(0, mangLatlong.length - 1);// mảng giữa

    textPos123 = {
        lat: lati, // xác định vĩ độ 
        lng: longi // xác định kinh độ 
      };

    const directionsService123 = new google.maps.DirectionsService();

    if (placeDisplay) placeDisplay.setMap(null);

    placeDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map,
      panel: document.getElementById("banchiduong"),
    });

    placeDisplay.addListener("directions_changed", () => {
      const directions123 = placeDisplay.getDirections();
    //   if (directions123) {
    //     computeTotalDistance(directions123);
    //   }
    });

        displayRoute123(
            textPos123,
            mangCuoi,
            mangGiua,
            // mangDau,
            directionsService123,
            placeDisplay,
        );

    var textchiduong123 = document.querySelectorAll('#banchiduong')
    for (let i = 0; i < textchiduong123.length; i++) {
        var xoaElement = textchiduong123[i].firstElementChild
        if (xoaElement !== null) {
            xoaElement.remove();
        }
    }
}

var datatext = [];
function displayRoute123(textPos123, mangCuoi, mangGiua, service, display) {

for (var i = 0; i < mangGiua.length; i++) {
        var text1 = { location: mangGiua[i]}
        datatext.push(text1)
}
// console.log(datatext)

    service
      .route({
        origin: textPos123,
        destination: mangCuoi,
        waypoints: datatext,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true,
      })
      .then((result) => {
        display.setDirections(result);
      })
      .catch((e) => {
        alert("Could not display directions due to: " + e);
      });
}
  
//--------Bảng Lịch Trình--------------//
var sumkm = 0;
var sumgio = 0;
var sumphut = 0;
function showPlace123(ds) {
    // console.log(ds); 


var tableLichtrinh = document.querySelector('#mylistText');


for (let i = 0; i < danhsach.length; i++) {
    var textsokilomet = danhsach[i][3]
    sumkm = sumkm + textsokilomet
    var textsogio = danhsach[i][4]  
    var textsophut = danhsach[i][5]
    sumgio = sumgio + textsogio
    sumphut = sumphut + textsophut
}
if (sumphut > 60) {
    var texttongsogio = sumgio + (sumphut / 60)
    // console.log(texttongsogio)
    document.getElementById("tongsoGio").innerHTML = Math.round(texttongsogio);
    var texttongsophut = sumphut % 60
    document.getElementById("tongsoPhut").innerHTML = Math.round(texttongsophut);
} else {
    document.getElementById("tongsoGio").innerHTML = Math.round(sumgio);
    document.getElementById("tongsoPhut").innerHTML = Math.round(sumphut);
}
// console.log(sumgio)
document.getElementById("tongsoKm").innerHTML = sumkm.toFixed(1);

        var addcontents = `
        <tr>
            <td>${ds[0]}</td>
            <td>${ds[1]}</td>
            <td>${ds[2]}</td>
            <td>${ds[3]}</td>
            <td>${ds[4]}</td>
            <td>${ds[5]}</td>
            <td><a onclick="xoalist(this)" class="btn-del btn btn-danger btn-sm">Delete</a></td>
        </tr>
        `;
    
    tableLichtrinh.insertAdjacentHTML('beforeend', addcontents);
}

//--------Xóa Lịch Trình--------------//

function xoalist(x) {
    var tr = x.parentElement.parentElement;
    var tensp = tr.children[1].innerText;
    tr.remove();
    for (let i = 0; danhsach.length; i++) {
        if(danhsach[i] === undefined) {return}
        if (danhsach[i][1] == tensp) {
            danhsach.splice(i, 1);
        }
    }

}





//////////////////////////////////////////////////////////////
// Menus
// Menus
// Menus
// Menus
// Menus
//////////////////////////////////////////////////////////////
// -----------------------Menus --------------------//
var openMenu = document.querySelector('.logo0');
openMenu.onclick = function() {
    openMenu.classList.toggle('showOpenMenu')
    openMenu.classList.toggle('hideOpenMenu')

    var openMenu2 = document.querySelector('.logo05');
    openMenu2.classList.toggle('showOpenMenu2')
    openMenu2.classList.toggle('hideopenMenu2')

    var tabMemu = document.getElementById('tabMemu');
    tabMemu.classList.toggle('hideTabMenu')
    tabMemu.classList.toggle('showTabMenu')

            //////////////////////////////////////////////////////
            // var logo0 = document.querySelector('.logo0');
            // logo0.classList.toggle('hideIcon')
            // var logo05 = document.querySelector('.logo05');
            // logo05.classList.toggle('hideIcon')


            // 
            var logo1 = document.querySelector('.logo1');
            logo1.classList.toggle('hideIcon')
            
            var logo2 = document.querySelector('.logo2');
            logo2.classList.toggle('hideIcon')
            
            var logo3 = document.querySelector('.logo3');
            logo3.classList.toggle('hideIcon')
            
            var logo4 = document.querySelector('.logo4');
            logo4.classList.toggle('hideIcon')
            
            var logo5 = document.querySelector('.logo5');
            logo5.classList.toggle('hideIcon')

            var logo6 = document.querySelector('.logo6');
            logo6.classList.toggle('hideIcon')
            
            var logo7 = document.querySelector('.logo7');
            logo7.classList.toggle('hideIcon')
            
            var logo8 = document.querySelector('.logo8');
            logo8.classList.toggle('hideIcon')
            
            var logo85 = document.querySelector('.logo85');
            logo85.classList.toggle('hideIcon')
            
            // var logo9 = document.querySelector('.logo9');
            // logo9.classList.toggle('hideIcon')

            // var logo10 = document.querySelector('.logo10');
            // logo10.classList.toggle('hideIcon')

            // var logo11 = document.querySelector('.logo11');
            // logo11.classList.toggle('hideIcon')

            var logo12 = document.querySelector('.logo12');
            logo12.classList.toggle('hideIcon')
    
}


// // Bản đồ ngày đêm

var logo8 = document.querySelector('.logo8');
logo8.onclick = function() {
    logo8.classList.toggle('logo8-show')
    logo8.classList.toggle('logo8-hide')

    var logo85 = document.querySelector('.logo85');
    logo85.classList.toggle('logo85-hide')
    logo85.classList.toggle('logo85-show')

    // Div
    var logo81div = document.querySelector('.logo8div');
    logo81div.classList.toggle('logo8div-show')
    logo81div.classList.toggle('logo8div-hide')

    var logo85div = document.querySelector('.logo85div');
    logo85div.classList.toggle('logo85div-hide')
    logo85div.classList.toggle('logo85div-show')


} 

var logo86 = document.querySelector('.logo85');
logo86.onclick = function() {
    logo86.classList.toggle('logo85-show')
    logo86.classList.toggle('logo85-hide')

    var logo81 = document.querySelector('.logo8');
    logo81.classList.toggle('logo8-hide')
    logo81.classList.toggle('logo8-show')

    // Div 
    var logo81div = document.querySelector('.logo8div');
    logo81div.classList.toggle('logo8div-show')
    logo81div.classList.toggle('logo8div-hide')
    
    var logo85div = document.querySelector('.logo85div');
    logo85div.classList.toggle('logo85div-hide')
    logo85div.classList.toggle('logo85div-show')
} 

// Div Click
var logo8div = document.querySelector('.logo8div');
logo8div.onclick = function() {
    logo8div.classList.toggle('logo8div-show')
    logo8div.classList.toggle('logo8div-hide')

    var logo85div = document.querySelector('.logo85div');
    logo85div.classList.toggle('logo85div-hide')
    logo85div.classList.toggle('logo85div-show')

    // 
    var logo8 = document.querySelector('.logo8');
    logo8.classList.toggle('logo8-show')
    logo8.classList.toggle('logo8-hide')
    
    var logo85 = document.querySelector('.logo85');
    logo85.classList.toggle('logo85-hide')
    logo85.classList.toggle('logo85-show')
} 

var logo86div = document.querySelector('.logo85div');
logo86div.onclick = function() {
    logo86div.classList.toggle('logo85div-show')
    logo86div.classList.toggle('logo85div-hide')

    var logo81div = document.querySelector('.logo8div');
    logo81div.classList.toggle('logo8div-show')
    logo81div.classList.toggle('logo8div-hide')

    // 
    var logo81 = document.querySelector('.logo8');
    logo81.classList.toggle('logo8-show')
    logo81.classList.toggle('logo8-hide')
    
    var logo86 = document.querySelector('.logo85');
    logo86.classList.toggle('logo85-hide')
    logo86.classList.toggle('logo85-show')
} 
