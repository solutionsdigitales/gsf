/* global expect, agent, token */


const budgetLine = require('./budgetLine');
const member = require('./member');
const service = require('./service');
const cellule = require('./cellule');
const transations = require('./transactions');
const user = require('./user');


describe('GSF test', () => {
  describe('(User) Create session first', () => user());
  describe('Service', () => service());
  describe('Cellule', () => cellule());
  describe('Member', () => member());
  describe('Transations', () => transations());
});
