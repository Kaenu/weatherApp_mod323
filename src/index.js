import initModel from './model';
import update from './update';
import view from './view';
import app from './app';

// Initialize the application
const rootNode = document.getElementById("app");
app(
  { ...initModel, showForm: true},
  update,
  view,
  rootNode
);