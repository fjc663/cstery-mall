<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useAddress } from '@/composables/useAddress';
import type { iaddress } from '@/composables/interfaceType';
import type{  FormRules, FormInstance } from 'element-plus'
import { pcaTextArr } from 'element-china-area-data'

// 地址数据
const { addresses, getAddress, setDefaultAddress, addNewAddress, updateAddress, deleteAddress } = useAddress();

// 请求地址数据
onMounted(() => getAddress());

// 用户修改的地址数据暂存处
const selectedOptions = ref<string[]>([]);

// 地址表单校验规则
const rules = ref<FormRules<iaddress>>({
  receiverName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { max: 50, message: '收货人名字字符长度最大为50', trigger: 'blur' },
  ],
  receiverPhone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
    { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: "请输入正确的手机号码" }
  ],
  detailedAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
  ]
});

// 表单实例的引用
const currentAddressRef = ref<FormInstance>();

// 弹窗控制
const addressDialogVisible = ref(false);
const currentAddress = ref<iaddress>({
  receiverName: '',
  receiverPhone: '',
  province: '',
  city: '',
  district: '',
  detailedAddress: '',
  isDefault: false
});
const isEditing = ref(false); // 标识是否是编辑模式

// 打开添加新地址弹窗
const onAddNewAddress = () => {
  isEditing.value = false;
  currentAddress.value = {
    receiverName: '',
    receiverPhone: '',
    province: '',
    city: '',
    district: '',
    detailedAddress: '',
    isDefault: false
  };
  selectedOptions.value = [];
  addressDialogVisible.value = true;
};

// 打开编辑地址弹窗
const editAddress = (address: iaddress) => {
  isEditing.value = true;

  currentAddress.value = { ...address }; // 克隆当前地址数据

  selectedOptions.value = [currentAddress.value.province, currentAddress.value.city, currentAddress.value.district];
  addressDialogVisible.value = true;
};

// 提交地址（添加或编辑）
const submitAddress = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
   formEl.validate(async (valid: boolean) => {
    if (valid) {
      [currentAddress.value.province, currentAddress.value.city, currentAddress.value.district] = selectedOptions.value;
      if (isEditing.value) {
        await updateAddress(currentAddress.value); // 调用更新地址 API
      } else {
        await addNewAddress(currentAddress.value); // 调用添加新地址 API
      }
      getAddress();
      addressDialogVisible.value = false; // 关闭弹窗
    }
  })
};

// 要删除地址的id
const deleteAddressId = ref<number>(-1);
// 控制删除地址确认弹窗的显示
const deleteAddressDialogVisible = ref<boolean>(false);

// 删除地址
const onDeleteAddress = async () => {
  await deleteAddress(deleteAddressId.value)
  deleteAddressDialogVisible.value = false;
  getAddress();
};

// 设置为默认地址
const setAsDefault = async (addressId: number) => {
  await setDefaultAddress(addressId);
  getAddress();
};

</script>

<template>
  <el-card class="address-manager">
    <el-table :data="addresses" highlight-current-row stripe>
      <el-table-column type="index" align="center" label="序号" width="100" />
      <el-table-column align="center" prop="receiverName" label="收货人" />
      <el-table-column align="center" prop="receiverPhone" label="联系电话" />
      <el-table-column align="center" label="收货地址">
        <template #default="scope">
          {{ scope.row.province + scope.row.city + scope.row.district + scope.row.detailedAddress }}
        </template>
      </el-table-column>

      <!-- 默认地址列 -->
      <el-table-column align="center" label="默认地址" width="150">
        <template #default="scope">
          <el-tag v-if="scope.row.isDefault" type="success">默认地址</el-tag>
          <el-button v-else type="primary" size="small" plain @click="setAsDefault(scope.row.id)">设为默认</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template #default="scope">
          <el-button @click="editAddress(scope.row)" type="primary" size="small" link>编辑</el-button>
          <el-button @click="{deleteAddressDialogVisible = true; deleteAddressId = scope.row.id}" type="danger" size="small" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="address-actions">
      <el-button type="primary" @click="onAddNewAddress" plain>添加新地址</el-button>
    </div>

    <!-- 地址表单弹窗 -->
    <el-dialog v-model="addressDialogVisible" title="地址信息" width="500px">
      <el-form :model="currentAddress" label-width="100px" :rules="rules" ref="currentAddressRef">
        <el-form-item label="收货人" prop="receiverName">
          <el-input v-model="currentAddress.receiverName" placeholder="请输入收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="receiverPhone">
          <el-input v-model="currentAddress.receiverPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="省/市/区">
          <el-cascader :options="pcaTextArr" v-model="selectedOptions">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailedAddress">
          <el-input v-model="currentAddress.detailedAddress" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="currentAddress.isDefault">设为默认地址</el-checkbox>
        </el-form-item>
      </el-form>

      <div class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddress(currentAddressRef)">{{ isEditing ? '保存修改' : '添加地址'
          }}</el-button>
      </div>
    </el-dialog>

    <!-- 删除地址确认弹窗 -->
    <el-dialog v-model="deleteAddressDialogVisible" title="温馨提示" width="500" align-center>
      <span>你确定要删除吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteAddressDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onDeleteAddress">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<style scoped>
.address-manager {
  padding: 20px;
}

.address-actions {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  text-align: right;
}
</style>
