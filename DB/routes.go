package main

import (
    "github.com/gorilla/mux"
)

func InitializeRoutes() *mux.Router {
    r := mux.NewRouter()
    r.HandleFunc("/samples", FetchSamples).Methods("GET")
    return r
}
