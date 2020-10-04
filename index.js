/*
 * @Date: 2020-09-29 19:39:44
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2020-10-02 16:05:44
 */

/*
if you open the initializer feature, please implement the initializer function, as below:
*/
const { handler, initializer } = require('./dist/index');

module.exports.initializer = function (context, callback) {
    initializer(context, callback);
};

module.exports.handler = function (req, resp, context) {
    resp.setHeader('access-control-allow-origin', '*');
    handler(req, resp, context);
};
