import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import AddMeetingRoom from "./AddMeetingRoom";
import SelectMeetingRoom from "./SelectMeetingRoom";

const client = new ApolloClient({
  uri: "http://smart-meeting.herokuapp.com",
  cache: new InMemoryCache(),
  headers: {
    token: "a123gjhgjsdf6576",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/add_meeting" element={<AddMeetingRoom />} />
          <Route path="/rooms" element={<SelectMeetingRoom />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
