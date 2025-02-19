package main

import (
	"io"
	"net/http"
	"os"
)

func DownloadPCSheet() (bool, error) {
	url := "https://docs.google.com/spreadsheets/d/1B3sxmpaW7RGrQAAxAyeR-xS4mdKCTTs_DzgV0qo2p_8/export?format=xlsx"

	// Send HTTP GET request
	resp, err := http.Get(url)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	// Create local file
	file, err := os.Create("sheet.xlsx")
	if err != nil {
		return false, err
	}
	defer file.Close()

	// Copy response body to file
	_, err = io.Copy(file, resp.Body)
	if err != nil {
		return false, err
	}

	return true, nil
}
