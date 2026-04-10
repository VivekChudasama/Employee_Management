import { ResponseMessages } from '../config/response_messages.js'

const get404 = (req, res, next) => {
  res.status(404).json(() => {
    ResponseMessages.Route.ERROR_FOUND_ROUTE,
      path = req.url
  }
  );
};

export default get404;