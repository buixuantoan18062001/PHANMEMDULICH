const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/db_dulich', {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
});

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  name: String,
  sex: String,
  dateOfBirth: String,
  phone: String,
  email: String,
  username: String,
  password: String,
  address: String,
  role: String,
  color: String,
}, {
    collection: 'account'
});

const AccountModel = mongoose.model('account', AccountSchema)
module.exports = AccountModel