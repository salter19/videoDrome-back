const splitter = (data) => {
  if (typeof data === 'string') {
    const re = /\s*(?:,|$)\s*/;

    const res = data.split(re);
   
    return res;
  }
}

module.exports = splitter