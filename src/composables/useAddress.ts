import type { iaddress, result } from '@/composables/interfaceType';
import { ref } from 'vue';
import { addNewAddressAPI, deleteAddressAPI, geTAddressAPI, setDefaultAddressAPI, updateAddressAPI } from '@/apis/addressApi';
import { ElMessage } from 'element-plus';

export function useAddress() {
    // 地址数据数据
    const addresses = ref<iaddress[]>([]);

    // 请求地址数据
    const getAddress = async () => {
        const res: result = await geTAddressAPI();

        if (res.code === 0) {
            ElMessage.error(res.msg);
        }

        addresses.value = res.data;
    }

    // 设置默认地址
    const setDefaultAddress = async (id: number) => {
        const res: result = await setDefaultAddressAPI(id);

        if (res.code === 1) {
            ElMessage.success("修改成功");
        } else {
            ElMessage.error(res.msg);
        }
    }

    // 添加新地址
    const addNewAddress = async (newAddress: iaddress) => {
        const res: result = await addNewAddressAPI(newAddress);

        if (res.code === 1) {
            ElMessage.success("添加成功");
        } else {
            ElMessage.error(res.msg);
        }
    }

    // 修改地址
    const updateAddress = async (address: iaddress) => {
        const res: result = await updateAddressAPI(address);

        if (res.code === 1) {
            ElMessage.success("修改成功");
        } else {
            ElMessage.error(res.msg);
        }
    }

    // 删除地址
    const deleteAddress = async (id: number) => {
        const res: result = await deleteAddressAPI(id);

        if (res.code === 1) {
            ElMessage.success("删除成功");
        } else {
            ElMessage.error(res.msg);
        }
    }

    return { addresses, getAddress, setDefaultAddress, addNewAddress, updateAddress, deleteAddress }
}