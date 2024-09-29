import { uploadAdminAvatarAPI, uploadAvatarAPI, uploadCategoryAPI } from "@/apis/uploadApli";
import type { result } from "./interfaceType";
import { ElMessage } from "element-plus";


// 上传头像
const uploadAvatar = async (formData: FormData): Promise<result> => {
    const res: result = await uploadAvatarAPI(formData);

    if (res.code === 1) {
        ElMessage.success("修改成功");
    } else {
        ElMessage.error(res.msg);
    }

    return res;
}

// 上传分类图片
const uploadCategory = async (formData: FormData): Promise<result> => {
    const res: result = await uploadCategoryAPI(formData);

    if (res.code === 1) {
        ElMessage.success("上传成功");
    } else {
        ElMessage.error(res.msg);
    }

    return res;
}

// 上传管理员头像
const uploadAdminAvatar = async (formData: FormData): Promise<result> => {
    const res: result = await uploadAdminAvatarAPI(formData);

    if (res.code === 1) {
        ElMessage.success("上传成功");
    } else {
        ElMessage.error(res.msg);
    }

    return res;
}

export default function() {
    return {
        uploadAvatar,
        uploadCategory,
        uploadAdminAvatar
    }
}