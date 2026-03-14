// alert('Hello World !')
const url = 'http://localhost:4000';
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
        <td>${user.sex}</td>
        <td>${user.dateOfBirth}</td>
        <td>${user.phone}</td>
        <td>${user.email}</td>
        <td>${user.username}</td>
        <td>${user.password}</td>
        <td>${user.address}</td>
        <td>${user.role}</td>
        <td>${user.color}</td>
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
            editModalForm.sex.value = user.sex,
            editModalForm.dateOfBirth.value = user.dateOfBirth,
            editModalForm.phone.value = user.phone,
            editModalForm.email.value = user.email,
            editModalForm.username.value = user.username,
            editModalForm.password.value = user.password,
            editModalForm.address.value = user.address,
            editModalForm.role.value = user.role,
            editModalForm.color.value = user.color
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
            sex: addModalForm.sex.value,
            dateOfBirth: addModalForm.dateOfBirth.value,
            phone: addModalForm.phone.value,
            email: addModalForm.email.value,
            username: addModalForm.username.value,
            password: addModalForm.password.value,
            address: addModalForm.address.value,
            role: addModalForm.role.value,
            color: addModalForm.color.value
        })
    })
        .then(res => res.json())
        .then(data => {
            const dataArr = [];
            dataArr.push(data);
            renderUser(dataArr);
        })
        .then(() => location.reload());
        // addModalForm.name.value = '',
        // addModalForm.sex.value = '',
        // addModalForm.dateOfBirth.value = '',
        // addModalForm.phone.value = '',
        // addModalForm.email.value = '',
        // addModalForm.username.value = '',
        // addModalForm.password.value = '',
        // addModalForm.address.value = '',
        // addModalForm.role.value = '',
        // addModalForm.color.value = ''

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
            sex: editModalForm.sex.value,
            dateOfBirth: editModalForm.dateOfBirth.value,
            phone: editModalForm.phone.value,
            email: editModalForm.email.value,
            username: editModalForm.username.value,
            password: editModalForm.password.value,
            address: editModalForm.address.value,
            role: editModalForm.role.value,
            color: editModalForm.color.value
        })
    })
        .then(res => res.json())
        .then(() => location.reload())
        editModalForm.name.value = '',
        editModalForm.sex.value = '',
        editModalForm.dateOfBirth.value = '',
        editModalForm.phone.value = '',
        editModalForm.email.value = '',
        editModalForm.username.value = '',
        editModalForm.password.value = '',
        editModalForm.address.value = '',
        editModalForm.role.value = '',
        editModalForm.color.value = ''
})