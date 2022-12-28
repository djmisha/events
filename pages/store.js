import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// import { configureStore } from "@reduxjs/toolkit";
// import eventReducer from "../features/events/eventsSlice";

// export default configureStore({
//   reducer: {
//     events: eventReducer,
//   },
// });
