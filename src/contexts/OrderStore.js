import { createStore } from 'redux'

const orderReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      state = [ ...state, ...action.payload ]
    case "REMOVE":
      break;
  }
  return state;
};

let orderStore = createStore(orderReducer, []);

orderStore.subscribe(() => {
  console.log("Stored Update! ", orderStore.getState())
});

orderStore.dispatch({
  type: "ADD",
  payload: ["test"]
})