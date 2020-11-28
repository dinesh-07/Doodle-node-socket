const express = require("express");
const app = express();
const PORT = 7001;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
