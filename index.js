const http = require("http")
const fs = require("fs")
const path = require("path")

const PORT = process.env.PORT || 3000

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
}

const server = http.createServer((req, res) => {
  let filePath = req.url === "/" ? "/page/index.html" : req.url

  // Handle routes
  if (filePath === "/page/index.html" || filePath === "/") {
    filePath = "/page/index.html"
  } else if (filePath.startsWith("/src/")) {
    // Allow access to snippet files and library.json
    filePath = filePath
  } else if (filePath.startsWith("/page/")) {
    // Allow access to page assets
    filePath = filePath
  } else {
    // Default to page directory for other requests
    filePath = "/page" + filePath
  }

  const fullPath = path.join(__dirname, filePath)
  const ext = path.extname(fullPath)
  const contentType = mimeTypes[ext] || "text/plain"

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Serve 404 page
        fs.readFile(path.join(__dirname, "page/404.html"), (err404, data404) => {
          if (err404) {
            res.writeHead(404, { "Content-Type": "text/plain" })
            res.end("404 - Page Not Found")
          } else {
            res.writeHead(404, { "Content-Type": "text/html" })
            res.end(data404)
          }
        })
      } else {
        // Serve 500 page
        fs.readFile(path.join(__dirname, "page/500.html"), (err500, data500) => {
          if (err500) {
            res.writeHead(500, { "Content-Type": "text/plain" })
            res.end("500 - Internal Server Error")
          } else {
            res.writeHead(500, { "Content-Type": "text/html" })
            res.end(data500)
          }
        })
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType })
      res.end(data)
    }
  })
})

server.listen(PORT, () => {
  console.log(`🚀 Yeonelle's Library is running on http://localhost:${PORT}`)
  console.log(`📚 Browse snippets at http://localhost:${PORT}`)
})
