//This class adds the required utility features such as pagination
class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }


    pagination(numberOfItemsPerPage) {
        let curPage = 1;
        if(this.queryStr.page) {
            curPage = Number(this.queryStr.page);
        }
        const skip = (curPage - 1) * numberOfItemsPerPage;

        this.query = this.query.skip(skip).limit(numberOfItemsPerPage);
        return this;
    }
}

module.exports = APIFeatures;
  
  