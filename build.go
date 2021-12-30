package main

import (
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"html/template"
	"bytes"
	"encoding/json"
	"strings"
	"github.com/otiai10/copy"
)

const (
	POST_TEMPLATE = "templates/post.html"
	DEFAULT_TEMPLATE = "templates/default.html"
)

type Link struct{
	Title string
	Url string
}

type PageLink struct{
	Prev Link
	Next Link
}
type Meta struct {
	Title string
	Links PageLink
}

// just stoled from golang website toolkit
func extractMetadata(b []byte) (meta Meta, tail []byte, _ error) {
	tail = b
	if !bytes.HasPrefix(b, jsonStart) {
		return Meta{}, tail, nil
	}
	end := bytes.Index(b, jsonEnd)
	if end < 0 {
		return Meta{}, tail, nil
	}
	b = b[len(jsonStart)-1 : end+1] // drop leading <!-- and include trailing }
	if err := json.Unmarshal(b, &meta); err != nil {
		return Meta{}, nil, err
	}
	tail = tail[end+len(jsonEnd):]
	return meta, tail, nil
}

var (
	jsonStart = []byte("<!--{")
	jsonEnd   = []byte("}-->")
)


func file2html(filenameIn, filenameOut, tmplFile string) {

	fout, err := os.Create(filenameOut)
	if err != nil {
		log.Fatal("Can't create output file " + filenameOut)
	}

	tmpl, err := template.ParseFiles(tmplFile)

	if err != nil {
		log.Fatal("Can't open template file", err)
	}

	content, err := ioutil.ReadFile(filenameIn)
	meta, content, err := extractMetadata(content)

	if err != nil {
		log.Fatal("Can't extract metadata from file", err)
	}

	if err != nil {
		log.Fatal("Can't open content file", err)
	}
	data := struct{
			Title string
			Links PageLink
			Content template.HTML
		}{
			Title: meta.Title,
			Links: meta.Links,
			Content: template.HTML(content),
		}

	tmpl.Execute(fout, data)

	err = fout.Close()
	if err != nil {
		log.Fatal("Can't close output file")
	}
}

func getFileName(filename string) string {
	idx := strings.LastIndex(filename, ".")
	if idx == -1 {
		return filename
	}

	return filename[0:idx]
}

func getFileNames(dir string) []string {

	fileList := make([]string, 0)

	fileInfo, err := ioutil.ReadDir(dir)
	if err != nil {
		return fileList
	}

	for _, file := range fileInfo {
		if !file.IsDir() {
			fileList = append(fileList, dir+file.Name())
		}
	}

	return fileList
}

func prepareDirs() {
	if _, err := os.Stat("_site"); os.IsNotExist(err) {
		os.Mkdir("_site", 0777)
	} else {
		err := os.RemoveAll("_site")

		if err != nil {
			log.Panic("Can't remove _site directory")
		}

		os.Mkdir("_site", 0777)
	}

	os.Mkdir("_site/pages", 0777)
	copy.Copy("img", "_site/img")
	copy.Copy("assets", "_site/assets")
	copy.Copy("book", "_site/book")
}

func convertFiles(filenames []string, tmplFile string) {

	for i := range filenames {
		baseName := filepath.Base(filenames[i])

		ext := filepath.Ext(baseName)
		if ext == ".html" {
			pth := filenames[i][2:len(filenames[i]) - 5]
			bp := "_site/" + pth
			os.Mkdir(bp, 0777)
			fullPath := bp + "/index.html"
			file2html(filenames[i], fullPath, tmplFile)
		}
	}
}

func generateSite() {

	prepareDirs()

	postsFiles := getFileNames("./pages/")
	convertFiles(postsFiles, POST_TEMPLATE)

	otherFiles := getFileNames("./")
	convertFiles(otherFiles, DEFAULT_TEMPLATE)

	file2html("./index.html", "_site/index.html", DEFAULT_TEMPLATE)

}

func main() {
	generateSite()
}

