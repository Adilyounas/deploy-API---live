class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    search() {
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};
  
      this.query = this.query.find(keyword);
      return this;
    }
  
    filter() {
      const queryStrCopy = { ...this.queryStr };
      const removeFields = ["page", "limit", "keyword"];
      removeFields.forEach((key) => delete queryStrCopy[key]);
      //price
      let modified = JSON.stringify(queryStrCopy);
      modified = modified.replace(/\b(gt|lt|gte|lte)\b/g, (key) => `$${key}`);
      this.query = this.query.find(JSON.parse(modified));
      return this;
    }
  
    pagination(resultPerPage) {
      const curruntPage = Number(this.queryStr.page) || 1;
      const skip = resultPerPage * (curruntPage - 1);
      this.query = this.query.limit(resultPerPage).skip(skip);
      return this;
    }
  }
  
  module.exports = ApiFeatures;
  