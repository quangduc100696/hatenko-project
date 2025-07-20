import { SUCCESS_CODE } from "configs";
import RequestUtils from "utils/RequestUtils";

const UserService = {
  async findId(id) {
    const { data, errorCode, message } = await RequestUtils.Get("/user/find-id", { id });
    if(errorCode === SUCCESS_CODE) {
      return [null, data];
    }
    return [message, null];
  }
}

export default UserService;