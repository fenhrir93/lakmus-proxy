const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
const cors = require('cors');
const app = express();


const targetUrl = 'https://global.lakmus.org/Dictionaries/icpc2?IsPublic=true';

const apiProxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    
    secure: false
});

app.use('/api', apiProxy);
app.use(cors());




  app.get('/', async (req, res) => {
    try {
        const searchTerm = req.query.Search; 

        const apiUrl = targetUrl + (searchTerm ? `&Search=${encodeURIComponent(searchTerm)}` : '');
        console.log(apiUrl);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Fetch failed with status: ${response.status}`);
        }
    
        const data = await response.json();
       
        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' }); 
      }
      
  })

const port = 3000; 
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
