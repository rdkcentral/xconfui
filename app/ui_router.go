package app

import (
	"embed"
	"net/http"
)

//go:embed all:shared/*
var sharedFiles embed.FS

//go:embed all:xconf/*
var xconfFiles embed.FS

func RouteUiFiles(mux *http.ServeMux) {
	mux.Handle("/app/shared/", http.StripPrefix("/app/shared", http.FileServer(http.FS(sharedFiles))))
	mux.Handle("/app/xconf/", http.StripPrefix("/app/shared", http.FileServer(http.FS(xconfFiles))))
}
