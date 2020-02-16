const mongoose = require('mongoose');

const damageDone = 'damage-done';
const damageTaken = 'damage-done';
const healing =  'healing';
const casts = 'casts';
const summons = 'summons';
const buffs = 'buffs';
const debuffs = 'debuffs';
const deaths = 'deaths';
const survivability = 'survivability';
const resources = 'resources';
const ressourcesGains = 'resources-gains';

const reportTypes = [
  damageDone,
  damageTaken,
  healing,
  casts,
  summons,
  buffs,
  debuffs,
  deaths,
  survivability,
  resources,
  ressourcesGains
];

const Report = new mongoose.Schema({
  _id: String,
  title: String,
  date: Date
});

reportTypes.forEach(function(reportType) {
  Report[reportType] = {
    type: Map
  }
});

module.exports = mongoose.model('Report', Report);
module.exports = { reportTypes: reportTypes };
