const headers = {
  'Content-Type' : 'application/json',
  'Content-Disposition' : `attachment; filename=file-${Math.random()}.json`,
};

exports.headers = headers;
