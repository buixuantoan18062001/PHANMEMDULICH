var express = require('express');
var router = express.Router();
const AccountModel = require('../models/account')
var cors = require('cors')
var app = express()


class CourseController {

    //lay du lieu tu DB

    show(req, res, next) {
        AccountModel.find({})
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.status(500).json('loi he thong')
            })
    }

    //lay du lieu 1 phan tu trong DB
    showId(req, res, next) {
        var id = req.params.id
        AccountModel.findById(id)
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.status(500).json('loi he thong')
            })
    }
    //them du lieu tu DB
    create(req, res, next) {
        var name = req.body.name
        var sex = req.body.sex
        var dateOfBirth = req.body.dateOfBirth
        var phone = req.body.phone
        var email = req.body.email
        var username = req.body.username
        var password = req.body.password
        var address = req.body.address
        var role = req.body.role
        var color = req.body.color

        AccountModel.create({
            name: name,
            sex: sex,
            dateOfBirth: dateOfBirth,
            phone: phone,
            email: email,
            username: username,
            password: password,
            address: address,
            role: role,
            color: color,
        })
            .then(data => {
                res.json('them account thanh cong')
            })
            .catch(err => {
                res.status(500).json('loi he thong')
            })
    }
    //update All du lieu tu DB

    editAll(req, res, next) {
        var id = req.params.id
        var name = req.body.name
        var sex = req.body.sex
        var dateOfBirth = req.body.dateOfBirth
        var phone = req.body.phone
        var email = req.body.email
        var username = req.body.username
        var password = req.body.password
        var address = req.body.address
        var role = req.body.role
        var color = req.body.color

        AccountModel.findByIdAndUpdate(id, {
            name: name,
            sex: sex,
            dateOfBirth: dateOfBirth,
            phone: phone,
            email: email,
            username: username,
            password: password,
            address: address,
            role: role,
            color: color,
        })
            .then(data => {
                res.json('Update All thanh cong')
            })
            .catch(err => {
                res.status(500).json('loi he thong')
            })
    }

        //update One du lieu tu DB

        editOne(req, res, next) {
            var id = req.params.id
            var name = req.body.name
            var sex = req.body.sex
            var dateOfBirth = req.body.dateOfBirth
            var phone = req.body.phone
            var email = req.body.email
            var username = req.body.username
            var password = req.body.password
            var address = req.body.address
            var role = req.body.role
            var color = req.body.color
    
            AccountModel.findByIdAndUpdate(id, {
                name: name,
                sex: sex,
                dateOfBirth: dateOfBirth,
                phone: phone,
                email: email,
                username: username,
                password: password,
                address: address,
                role: role,
                color: color,
            })
                .then(data => {
                    res.json('Update One thanh cong')
                })
                .catch(err => {
                    res.status(500).json('loi he thong')
                })
        }

    //xoa du lieu tu DB
    delete(req, res, next) {
        var id = req.params.id
        AccountModel.deleteOne({
            _id: id
        })
            .then(data => {
                res.json('Xoa thanh cong')
            })
            .catch(err => {
                res.status(500).json('loi he thong')
            })
    }

}

module.exports = new CourseController();