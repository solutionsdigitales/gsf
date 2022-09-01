const path = require('path');

function sendTemplateFile(req, res, next) {
  try {
    const { filename } = req.params;
    res.sendFile(path.resolve(__dirname, `../../lib/xlsx_templates/${filename}`));
  } catch (error) {
    next(error);
  }
}
module.exports = {
  sendTemplateFile,
}