const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/db_dulich', {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
});

const Schema = mongoose.Schema;

const diadiemSchema = new Schema({
  name: String,
  address: String,
  address_link: String,
  image_link: String,
  website: String,
  sodienthoai: String,
  latlong: String,
  weather: String,
  ranking: String,
  day_or_night: String,
}, {
    collection: 'diadiem'
});

const diadiemModel = mongoose.model('diadiem', diadiemSchema)
module.exports = diadiemModel