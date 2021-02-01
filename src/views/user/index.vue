<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="queryParams.name" size="mini" clearable :placeholder="$t('page.user.search.name')" style="width: 200px;"
        class="filter-item" />
      <el-input v-model.trim="queryParams.username" size="mini" clearable :placeholder="$t('page.user.search.username')"
        style="width: 200px; margin-left: 10px;" class="filter-item" />
      <el-select v-model="queryParams.organ_id" clearable filterable :placeholder="$t('page.user.search.organName')" size="mini" class="filter-item"
        style="width: 200px; margin-left: 10px;">
        <el-option v-for="item in organOptions" :key="item.organ_id" :label="item.organ_name" :value="item.organ_id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="getUserList" style="margin-left: 10px;">
        {{ $t('page.common.searchBtn') }}
      </el-button>
    </div>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate({})">{{ $t('page.common.addBtn') }}
      </el-button>
      <refresh></refresh>
    </div>
    <el-table :data="tableData" v-loading="loading" style="width: 100%;margin-bottom: 20px;" border @sort-change="sortChange">
      <el-table-column prop="user_id" type="" label="ID" sortable="custom" width="60" />
      <el-table-column prop="organ_name" :label="$t('page.user.organName')" width="170">
        <template slot-scope="scope">{{ scope.row.organ_name || '平台' }}</template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('page.user.name')" width="130" />
      <el-table-column prop="username" type="" :label="$t('page.user.username')" width="130" />
      <el-table-column prop="email" type="" :label="$t('page.user.email')" />
      <el-table-column prop="phone" type="" :label="$t('page.user.phone')" width="130" />
      <el-table-column prop="role_name" type="" :label="$t('page.user.roleName')" width="130" />
      <el-table-column prop="last_time" type="" :label="$t('page.user.lastTime')" width="160">
        <template slot-scope="scope">
          {{ scope.row.last_time | parseTime }}
        </template>
      </el-table-column>
      <el-table-column prop="last_ip" type="" :label="$t('page.user.lastIp')" width="130" />
      <el-table-column prop="status" type="" :label="$t('page.user.status')" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" @change="switchStatus($event, scope.row.user_id)"
            active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column type="" :label="$t('page.common.actions')" :width="localLang === 'zh' ? 220 : 280">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" class="btn" icon="el-icon-edit">{{ $t('page.common.editBtn') }}
          </el-button>
          <el-button type="warning" size="mini" class="btn" @click="handleUpdatePwd(scope.row)">
            <svg-icon icon-class="password" style="margin:0 2px;" />{{ $t('page.common.passwordBtn') }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)" class="btn" icon="el-icon-delete-solid">
            {{ $t('page.common.deleteBtn') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="getUserList" />

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="baseForm" :rules="rules" ref="baseForm" label-width="180px">
        <el-form-item :label="$t('page.user.name')" prop="name">
          <el-input v-model.trim="baseForm.name" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.user.username')" prop="username">
          <el-input v-model.trim="baseForm.username" :disabled="dialogType === 'edit' ? true : false" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.user.roleName')" prop="role_name">
          <el-select v-model="baseForm.role_id" :placeholder="$t('page.user.roleNamePlaceholder')" ref="userSelected">
            <el-option v-for="item in roleOptions" :key="item.role_id" :label="item.role_name" :value="item.role_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('page.user.organName')" prop="organ_id">
          <el-select v-model="baseForm.organ_id" clearable filterable :placeholder="$t('page.user.organNamePlaceholder')">
            <el-option v-for="item in organOptions" :key="item.organ_id" :label="item.organ_name" :value="item.organ_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('page.user.phone')" prop="phone">
          <el-input v-model.trim="baseForm.phone" onkeyup="value=value.replace(/[^\d]/g,'')" class="width36"
            :placeholder="$t('page.user.phonePlaceholder')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.user.email')" prop="email">
          <el-input v-model.trim="baseForm.email" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.user.ipLowerLimit')" prop="ip_lower_limit">
          <el-input v-model.trim="baseForm.ip_lower_limit" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.user.ipUpperLimit')" prop="ip_upper_limit">
          <el-input v-model.trim="baseForm.ip_upper_limit" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.user.status')" prop="status">
          <el-radio-group v-model="baseForm.status">
            <el-radio :label="enable">{{ $t('page.common.enable') }}</el-radio>
            <el-radio :label="disable">{{ $t('page.common.disabled' )}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('page.user.remark')" prop="remark">
          <el-input v-model.trim="baseForm.remark" type="textarea" rows="5" class="width36"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('page.common.cancelBtn') }}</el-button>
        <el-button type="primary" @click="submitForm('baseForm', dialogType)">{{ $t('page.common.confirmBtn') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="dialogPwdFormVisible" width="40%">
      <el-form :model="pwdForm" :rules="pwdRules" ref="pwdForm" label-width="180px">
        <el-form-item :label="$t('page.user.oldPassword')" prop="old_password">
          <el-input v-model.trim="old_password" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.user.newPassword')" prop="password">
          <el-input v-model.trim="password" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.user.confirmPassword')" prop="confirm_password">
          <el-input v-model.trim="confirm_password" class="width36"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPwdFormVisible = false">{{ $t('page.common.cancelBtn') }}</el-button>
        <el-button type="primary" @click="savePassword">{{ $t('page.common.confirmBtn') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userList, userDetail, createUser, updateUser, deleteUser, switchUserStatus } from '@/api/user'
import { organList } from '@/api/organ'
import { roleList } from '@/api/role'
import pagination from '@/components/Pagination'
import refresh from '@/components/Refresh'
import defaultSettings from '@/settings'
const { enable, disable } = defaultSettings

export default {
    components: {
        refresh,
        pagination
    },
    data() {
        return {
            tableData: [],
            loading: false,
            dialogFormVisible: false,
            dialogPwdFormVisible: false,
            enable: enable,
            disable: disable,
            localLang: sessionStorage.getItem('language'),
            dialogType: '',
            password: '',
            old_password: '',
            confirm_password: '',
            title: '',
            total: 0,
            queryParams: {
                page: 1,
                limit: 20,
                user_type: 1,
                organ_id: undefined,
                name: '',
                username: '',
                idSort: 'desc'
            },
            baseForm: {
                organ_id: undefined,
                role_id: undefined,
                username: '',
                name: '',
                user_type: undefined,
                ip_upper_limit: '',
                ip_lower_limit: '',
                status: enable,
                phone: '',
                email: '',
                remark: ''
            },
            rules: {
                name: [
                    { required: true, message: this.$t('page.user.valid.name'), trigger: 'blur' },
                    { min: 2, max: 64, message: this.$t('page.user.valid.nameLen'), trigger: 'blur' }
                ],
                username: [
                    { required: true, message: this.$t('page.user.valid.username'), trigger: 'blur' },
                    { min: 2, max: 64, message: this.$t('page.user.valid.usernameLen'), trigger: 'blur' }
                ],
                email: [
                    { required: true, message: this.$t('page.user.valid.email'), trigger: 'blur' },
                    { type: 'email', message: this.$t('page.user.valid.emailFormat'), trigger: ['blur', 'change'] }
                ]
            },
            pwdForm: {
                old_password: '',
                password: '',
                confirm_password: ''
            },
            pwdRules: {
                old_password: [{ required: true, message: this.$t('page.user.valid.oldPassword'), trigger: 'blur' }],
                password: [
                    { required: true, message: this.$t('page.user.valid.password'), trigger: 'blur' },
                    { min: 6, max: 10, message: this.$t('page.user.valid.passwordLen'), trigger: 'blur' }
                ],
                confirm_password: [
                    { required: true, message: this.$t('page.user.valid.confirmPassword'), trigger: 'blur' },
                    { min: 6, max: 10, message: this.$t('page.user.valid.confirmPasswordLen'), trigger: 'blur' }
                ]
            },
            organOptions: [],
            roleOptions: []
        }
    },
    created() {
        this.getUserList()
        this.getOrganList()
    },
    methods: {
        sortChange(data) {
            const { order } = data
            if (order === 'descending') {
                this.queryParams.idSort = 'desc'
            } else {
                this.queryParams.idSort = 'asc'
            }
            this.getUserList()
        },
        getUserList() {
            this.loading = true
            this.getUserType()
            userList(this.queryParams).then(res => {
                this.tableData = res.data.list
                if (typeof res.data.total != 'undefined') {
                    this.total = res.data.total
                }
                setTimeout(() => {
                    this.loading = false
                }, 100)
            })
        },
        getUserType() {
            const path_name = this.$route.name || ''
            switch (path_name) {
                case 'courier-user':
                    this.queryParams.user_type = this.baseForm.user_type = 2
                    break
                case 'condo-user':
                    this.queryParams.user_type = this.baseForm.user_type = 3
                    break
                default:
                    this.queryParams.user_type = this.baseForm.user_type = 1
                    break
            }
        },
        getOrganList() {
            organList({ organ_id: this.$store.state.user.organ_id, status: enable }).then(res => {
                this.organOptions = res.data.list
            })
        },
        getRoleList() {
            roleList().then(res => {
                res.data.list.forEach(element => {
                    if (element.role_name.indexOf('Super') === -1) {
                        this.roleOptions = this.roleOptions.concat({
                            role_id: element.role_id,
                            role_name: element.role_name
                        })
                    }
                })
            })
        },
        resetForm() {
            this.baseForm = {
                organ_id: undefined,
                role_id: undefined,
                username: '',
                name: '',
                user_type: this.queryParams.user_type,
                ip_upper_limit: '',
                ip_lower_limit: '',
                status: enable,
                phone: '',
                email: '',
                remark: ''
            }
        },
        handleCreate(val) {
            this.resetForm()
            this.title = this.$t('page.user.addUser')
            this.dialogType = 'add'
            this.roleOptions = []
            this.getRoleList()
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['baseForm'].clearValidate()
            })
        },
        handleUpdate(val) {
            this.resetForm()
            this.roleOptions = []
            this.getRoleList()
            userDetail(val.user_id).then(res => {
                this.dialogType = 'edit'
                this.dialogFormVisible = true
                this.baseForm = res.data
                console.log(this.baseForm)
                this.title = this.$t('page.common.editBtn')
                this.$nextTick(() => {
                    this.$refs['baseForm'].clearValidate()
                })
            })
        },
        submitForm(formName, dialogType) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (dialogType === 'add')
                        createUser(this.baseForm)
                            .then(res => {
                                const { code, msg } = res
                                if (code !== 0) {
                                    this.$message.error(msg)
                                }
                                this.getUserList()
                                this.dialogFormVisible = false
                                this.$message({
                                    message: this.$t('message.common.createSuccess'),
                                    type: 'success'
                                })
                            })
                            .catch(err => {
                                this.$message.error(this.$t('page.user.valid.addUserError'))
                            })
                    else
                        updateUser(this.baseForm)
                            .then(res => {
                                const { code, msg } = res
                                if (code !== 0) {
                                    this.$message.error(msg)
                                }
                                this.getUserList()
                                this.dialogFormVisible = false
                                this.$message({
                                    message: this.$t('message.common.updateSuccess'),
                                    type: 'success'
                                })
                            })
                            .catch(err => {
                                this.$message.error(this.$t('page.user.valid.editUserError'))
                            })
                } else {
                    this.$message.error(
                        dialogType === 'add'
                            ? this.$t('page.user.valid.addUserError')
                            : this.$t('page.user.valid.editUserError')
                    )
                    return false
                }
            })
        },
        switchStatus($event, user_id) {
            switchUserStatus({ status: $event, user_id: user_id }).then(res => {
                const { code, msg } = res
                if (code !== 0) {
                    this.$message.error(msg)
                    return false
                }
                this.$message({
                    message: this.$t('message.common.switchSuccess'),
                    type: 'success'
                })
            })
        },
        handleDelete(val) {
            this.$confirm(this.$t('message.common.deleteConfirm'), this.$t('message.common.warnMsg'), {
                confirmButtonText: this.$t('page.common.confirmBtn'),
                cancelButtonText: this.$t('page.common.cancelBtn'),
                type: 'warning'
            })
                .then(() => {
                    deleteUser({ user_id: val.user_id })
                        .then(res => {
                            const { code, msg } = res
                            if (code !== 0) {
                                this.$message.error(msg)
                            }
                            this.getUserList()
                            this.$message({
                                message: this.$t('message.common.deleteSuccess'),
                                type: 'success'
                            })
                        })
                        .catch(err => {
                            this.$message.error(this.$t('page.user.valid.deleteUserError'))
                            return false
                        })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('message.common.cancelMessage')
                    })
                })
        },
        handleUpdatePwd(val) {
            this.dialogPwdFormVisible = true
            console.log(1111)
        },
        savePassword() {
            console.log(2222)
        }
    }
}
</script>
<style>
.btn {
  padding: 5px 5px;
  margin-left: 0px;
}
.el-button + .el-button {
  margin-left: 5px;
}
.el-button [class*='el-icon-'] + span {
  margin-left: 0px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 13px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.width36 {
  width: 360px;
}
</style>
