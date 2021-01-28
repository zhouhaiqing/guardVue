<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate({})">{{ $t('page.common.addBtn') }}
      </el-button>
      <refresh />
    </div>
    <el-table v-loading="loading" :data="tableData" style="width: 100%;margin-bottom: 20px;" border @sort-change="sortChange">
      <el-table-column prop="role_id" type="" label="ID" sortable="custom" width="100" />
      <el-table-column prop="role_name" :label="$t('page.role.roleName')" />
      <el-table-column prop="description" type="" :label="$t('page.role.description')" />
      <el-table-column prop="organ_name" type="" :label="$t('page.role.organName')" />
      <el-table-column prop="status" type="" :label="$t('page.role.status')">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" @change="switchStatus($event, scope.row.role_id)"
            active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" type="" :label="$t('page.common.createTime')">
        <template slot-scope="scope">
          {{ scope.row.create_time | parseTime }}
        </template>
      </el-table-column>
      <el-table-column prop="update_time" type="" :label="$t('page.common.updateTime')">
        <template slot-scope="scope">
          {{ scope.row.update_time | parseTime }}
        </template>
      </el-table-column>
      <el-table-column type="" :label="$t('page.common.actions')" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" icon="el-icon-edit">{{ $t('page.common.editBtn') }}</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row, scope.$index)" icon="el-icon-delete-solid">
            {{ $t('page.common.deleteBtn') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="getRoleList" />

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="180px">
        <el-form-item :label="$t('page.role.roleName')" prop="role_name">
          <el-input v-model.trim="roleForm.role_name" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.role.description')" prop="description">
          <el-input v-model.trim="roleForm.description" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.role.organName')" prop="organ_id">
          <el-select v-model="organ_id" clearable filterable placeholder="请选择" ref="organSelected">
            <el-option v-for="item in options" :key="item.organ_id" filterable :label="item.organ_name" :value="item.organ_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('page.role.status')" prop="status">
          <el-radio-group v-model="roleForm.status">
            <el-radio :label="enable">{{ $t('page.common.enable') }}</el-radio>
            <el-radio :label="disable">{{ $t('page.common.disabled' )}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('page.common.cancelBtn') }}</el-button>
        <el-button type="primary" @click="submitForm('roleForm', dialogType)">{{ $t('page.common.confirmBtn') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { roleList, createRole, roleDetail, updateRole, deleteRole, switchRoleStatus } from '@/api/role'
import { organList } from '@/api/organ'
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
            enable: enable,
            disable: disable,
            dialogType: '',
            title: '',
            total: 0,
            organ_id: '',
            queryParams: {
                page: 1,
                limit: 20,
                idSort: 'desc'
            },
            roleForm: {
                role_id: undefined,
                role_name: '',
                description: '',
                organ_id: 0,
                organ_name: '',
                status: enable
            },
            rules: {
                role_name: [
                    { required: true, message: this.$t('page.role.valid.roleName'), trigger: 'blur' },
                    { min: 2, max: 64, message: this.$t('page.role.valid.roleName'), trigger: 'blur' }
                ]
            },
            options: []
        }
    },
    created() {
        this.getRoleList()
    },
    methods: {
        sortChange(data) {
            const { order } = data
            if (order === 'descending') {
                this.queryParams.idSort = 'desc'
            } else {
                this.queryParams.idSort = 'asc'
            }
            this.getRoleList()
        },
        getRoleList() {
            this.loading = true
            roleList(this.queryParams).then(res => {
                this.tableData = res.data.list
                if (typeof res.data.total != 'undefined') {
                    this.total = res.data.total
                }
                setTimeout(() => {
                    this.loading = false
                }, 100)
            })
        },
        getOrganList() {
            const organ_id = this.$store.state.user.organ_id
            organList({ organ_id: organ_id, status: enable }).then(res => {
                this.options = res.data.list
            })
        },
        resetForm() {
            this.roleForm = {
                role_id: 0,
                role_name: '',
                description: '',
                organ_id: 0,
                organ_name: '',
                status: enable
            }
        },
        handleCreate(val) {
            this.resetForm()
            this.getOrganList()
            this.title = this.$t('page.role.addRole')
            this.dialogType = 'add'
            this.organ_id = ''
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['roleForm'].clearValidate()
            })
        },
        handleUpdate(val) {
            this.resetForm()
            this.getOrganList()
            roleDetail(val.role_id).then(res => {
                this.dialogType = 'edit'
                this.dialogFormVisible = true
                this.roleForm = res.data
                this.organ_id = res.data.organ_id || ''
                this.title = this.$t('page.common.editBtn')
                this.$nextTick(() => {
                    this.$refs['roleForm'].clearValidate()
                })
            })
        },
        submitForm(formName, dialogType) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.roleForm.organ_id = this.$refs.organSelected.selected.value
                    this.roleForm.organ_name = this.$refs.organSelected.selected.label
                    if (dialogType === 'add')
                        createRole(this.roleForm)
                            .then(res => {
                                const { code, msg } = res
                                if (code !== 0) {
                                    this.$message.error(msg)
                                }
                                this.getRoleList()
                                this.dialogFormVisible = false
                                this.$message({
                                    message: this.$t('message.common.createSuccess'),
                                    type: 'success'
                                })
                            })
                            .catch(err => {
                                this.$message.error(this.$t('page.role.valid.addRoleError'))
                            })
                    else
                        updateRole(this.roleForm)
                            .then(res => {
                                const { code, msg } = res
                                if (code !== 0) {
                                    this.$message.error(msg)
                                }
                                this.getRoleList()
                                this.dialogFormVisible = false
                                this.$message({
                                    message: this.$t('message.common.updateSuccess'),
                                    type: 'success'
                                })
                            })
                            .catch(err => {
                                this.$message.error(this.$t('page.role.valid.editRoleError'))
                            })
                } else {
                    this.$message.error(
                        dialogType === 'add'
                            ? this.$t('page.role.valid.addRoleError')
                            : this.$t('page.role.valid.editRoleError')
                    )
                    return false
                }
            })
        },
        switchStatus($event, role_id) {
            switchRoleStatus({ status: $event, role_id: role_id }).then(res => {
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
        handleDelete(val, index) {
            this.$confirm(this.$t('message.common.deleteConfirm'), this.$t('message.common.warnMsg'), {
                confirmButtonText: this.$t('page.common.confirmBtn'),
                cancelButtonText: this.$t('page.common.cancelBtn'),
                type: 'warning'
            })
                .then(() => {
                    deleteRole({ role_id: val.role_id })
                        .then(res => {
                            const { code, msg } = res
                            if (code !== 0) {
                                this.$message.error(msg)
                            }
                            this.getRoleList()
                            this.$message({
                                message: this.$t('message.common.deleteSuccess'),
                                type: 'success'
                            })
                        })
                        .catch(err => {
                            this.$message.error(this.$t('page.role.valid.deleteRoleError'))
                            return false
                        })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('message.common.cancelMessage')
                    })
                })
        }
    }
}
</script>
<style scoped>
.width36 {
  width: 360px;
}
.width30 {
  width: 300px;
}
.height18 {
  height: 180px;
}
</style>
