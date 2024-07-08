require("dotenv").config();
const app = require("./src/app.js");

const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
