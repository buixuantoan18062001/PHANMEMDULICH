// alert('Hello World !')
const url = 'http://localhost:4000/diadiem';
const addModalForm = document.querySelector('.form-user');
const editModalForm = document.querySelector('#myEditModal .form-user');

let id = '';

fetch(url)
    .then(res => res.json())
    .then(data => {
        data.forEach(user => {
            renderUser(user);
        });
    });

const tableUsers = document.querySelector('#table-user');
const renderUser = (user) => {
    const output = `
    <tr data-id = '${user._id}'>
    <td>${user.name}</td>
    <td>${user.address}</td>
    <td><a href="${user.address_link}">${user.address_link}</a></td>
    <td><img src="${user.image_link}" style="width:40%"/></td>
    <td><a href="${user.website}">${user.name}</a></td>
    <td>${user.sodienthoai}</td>
    <td>${user.latlong.split(', ')}</td>
    <td>${user.weather}</td>
    <td>${user.ranking} \u272e</td>
    <td>${user.day_or_night}</td>
    <td><a class="btn-edit btn btn-primary btn-sm">Edit</a></td>
    <td><a class="btn-del btn btn-danger btn-sm">Delete</a></td>
        </tr>
    `; // dấu Basic `` không phải dấu nháy đơn ''
    tableUsers.insertAdjacentHTML('beforeend', output);

    // sự kiện Delete

    const btndel = document.querySelector(`[data-id = '${user._id}'] .btn-del`);
    btndel.addEventListener('click', (e) => {
        // console.log('Delete ở đây nè !!!' + user.fullname);
        fetch(`${url}/${user._id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(() => location.reload());// nếu không reload() lại trang web thì phải nhấn F% để reload()

    });

    // sự kiện Edit

    const btnedit = document.querySelector(`[data-id = '${user._id}'] .btn-edit`);
    btnedit.addEventListener('click', (e) => {
        e.preventDefault();
        id = user._id;
        $("#myEditModal").modal('show');
        // console.log('edit');
            editModalForm.name.value = user.name,
            editModalForm.address.value = user.address,
            editModalForm.address_link.value = user.address_link,
            editModalForm.image_link.value = user.image_link,
            editModalForm.website.value = user.website,
            editModalForm.sodienthoai.value = user.sodienthoai,
            editModalForm.latlong.value = user.latlong,
            editModalForm.weather.value = user.weather,
            editModalForm.ranking.value = user.ranking,
            editModalForm.day_or_night.value = user.day_or_night
    });
}

addModalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log('addModalForm' + addModalForm.fullname.value);// Lấy value fullname trong dữ liệu
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ // Chúng ta sẽ truyền vào đây
            name: addModalForm.name.value,
            address: addModalForm.address.value,
            address_link: addModalForm.address_link.value,
            image_link: addModalForm.image_link.value,
            website: addModalForm.website.value,
            sodienthoai: addModalForm.sodienthoai.value,
            latlong: addModalForm.latlong.value,
            weather: addModalForm.weather.value,
            ranking: addModalForm.ranking.value,
            day_or_night: addModalForm.day_or_night.value
        })
    })
        .then(res => res.json())
        // .then(data => {
        //     const dataArr = [];
        //     dataArr.push(data);
        //     renderUser(dataArr);
        // })
        .then(() => location.reload());
})

editModalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(id);// Lấy value fullname trong dữ liệu
    fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ // Chúng ta sẽ truyền vào đây
            name: editModalForm.name.value,
            address: editModalForm.address.value,
            address_link: editModalForm.address_link.value,
            image_link: editModalForm.image_link.value,
            website: editModalForm.website.value,
            sodienthoai: editModalForm.sodienthoai.value,
            latlong: editModalForm.latlong.value,
            weather: editModalForm.weather.value,
            ranking: editModalForm.ranking.value,
            day_or_night: editModalForm.day_or_night.value
        })
    })
        .then(res => res.json())
        .then(() => location.reload())
        editModalForm.name.value = '',
        editModalForm.address.value = '',
        editModalForm.address_link.value = '',
        editModalForm.image_link.value = '',
        editModalForm.website.value = '',
        editModalForm.sodienthoai.value = '',
        editModalForm.weather.value = '',
        editModalForm.address.value = '',
        editModalForm.ranking.value = '',
        editModalForm.day_or_night.value = ''
})