var express = require('express');
var router = express.Router();
const diadiemModel = require('../models/diadiem')
var cors = require('cors')
var app = express()


class CourseController {

    //lay du lieu tu DB

    show(req, res, next) {
        diadiemModel.find({})
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.status(500).json('loi he thong 1234')
            })
    }

    //lay du lieu 1 phan tu trong DB
    showId(req, res, next) {
        var id = req.params.id
        diadiemModel.findById(id)
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.status(500).json('loi he thong 123')
            })
    }
    //them du lieu tu DB
    create(req, res, next) {
        var name = req.body.name
        var address = req.body.address
        var address_link = req.body.address_link
        var image_link = req.body.image_link
        var website = req.body.website
        var sodienthoai = req.body.sodienthoai
        var latlong = req.body.latlong
        var weather = req.body.weather
        var ranking = req.body.ranking
        var day_or_night = req.body.day_or_night

        diadiemModel.create({
            name: name,
            address: address,
            address_link: address_link,
            image_link: image_link,
            website: website,
            sodienthoai: sodienthoai,
            latlong: latlong,
            weather: weather,
            ranking: ranking,
            day_or_night: day_or_night,
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
        var address = req.body.address
        var address_link = req.body.address_link
        var image_link = req.body.image_link
        var website = req.body.website
        var sodienthoai = req.body.sodienthoai
        var latlong = req.body.latlong
        var weather = req.body.weather
        var ranking = req.body.ranking
        var day_or_night = req.body.day_or_night

        diadiemModel.findByIdAndUpdate(id, {
            name: name,
            address: address,
            address_link: address_link,
            image_link: image_link,
            website: website,
            sodienthoai: sodienthoai,
            latlong: latlong,
            weather: weather,
            ranking: ranking,
            day_or_night: day_or_night,
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
            var address = req.body.address
            var address_link = req.body.address_link
            var image_link = req.body.image_link
            var website = req.body.website
            var sodienthoai = req.body.sodienthoai
            var latlong = req.body.latlong
            var weather = req.body.weather
            var ranking = req.body.ranking
            var day_or_night = req.body.day_or_night
    
            diadiemModel.findByIdAndUpdate(id, {
                name: name,
                address: address,
                address_link: address_link,
                image_link: image_link,
                website: website,
                sodienthoai: sodienthoai,
                latlong: latlong,
                weather: weather,
                ranking: ranking,
                day_or_night: day_or_night,
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
        diadiemModel.deleteOne({
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