import { ResponseMessages } from '../config/response_messages.js'
import { Constants } from '../config/constants.js'

const get404 = (req, res, next) => {
  res.status(Constants.RESPONSE_STATUS_CODE.NOT_FOUND_CODE).json({
    message: ResponseMessages.Route.ERROR_FOUND_ROUTE,
    path: req.url
  });
};

export default get404;