// code away!
require('dotenv').config();

const server = require('./server');
const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`\n*** Server Running on port ${port} ***\n`);
});