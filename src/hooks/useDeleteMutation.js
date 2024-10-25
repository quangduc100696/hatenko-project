import { useState } from "react";
import { InAppEvent } from "utils/FuseUtils";
import RequestUtils from "utils/RequestUtils";

const useDeleteMutation = () => {

    const [ loading, setLoading ] = useState(false);
    const deleteRecord = async({ api, input, update}) => {
        setLoading(true);
        const { success, message, data } = await RequestUtils.Post('/'.concat(api), {}, input);
        if(!success) {
            InAppEvent.normalError("Lỗi xoá nội dung .!");
            return;
        }
        setLoading(false);
        update && update(data);
        InAppEvent.normalSuccess(message);
    }

    return [
        deleteRecord,
        loading
    ]
}

export default useDeleteMutation;