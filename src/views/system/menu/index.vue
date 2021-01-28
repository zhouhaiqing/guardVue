<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate({})">{{ $t('page.common.addBtn') }}
      </el-button>
      <refresh />
    </div>
    <el-table v-loading="loading" :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="menu_id" border default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange">
      <el-table-column prop="menu_id" type="" label="ID" sortable="custom" width="100" />
      <el-table-column v-if="showZhMenu" prop="menu_name_zh" :label="$t('page.menu.menuName')">
        <template slot-scope="scope">
          {{ scope.row.menu_name_zh }}
          <i class="el-icon-plus" @click="handleCreate(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column v-else prop="menu_name_en" :label="$t('page.menu.menuName')" />
      <el-table-column prop="menu_code" type="" :label="$t('page.menu.menuCode')" />
      <el-table-column prop="status" type="" :label="$t('page.menu.status')">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" active-color="#13ce66" inactive-color="#ff4949"
            @change="switchStatus($event, scope.row.menu_id)" />
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
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleCreate(scope.row)">{{ $t('page.common.addBtn') }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">{{ $t('page.common.editBtn') }}</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete-solid" @click="handleDelete(scope.row, scope.$index)">
            {{ $t('page.common.deleteBtn') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="menuForm" :rules="rules" ref="menuForm" label-width="180px">
        <el-form-item :label="$t('page.menu.menuNameZh')" prop="menu_name_zh">
          <el-input v-model.trim="menuForm.menu_name_zh" class="width36" />
        </el-form-item>
        <el-form-item :label="$t('page.menu.menuNameEn')" prop="menu_name_en">
          <el-input v-model.trim="menuForm.menu_name_en" class="width36" />
        </el-form-item>
        <el-form-item :label="$t('page.menu.menuCode')" prop="menu_code">
          <el-input v-model.trim="menuForm.menu_code" class="width36" />
        </el-form-item>
        <el-form-item :label="$t('page.menu.parentMenu')" prop="parent_id">
          <el-cascader ref="cascader" :placeholder="$t('page.menu.placeholder')" v-model="selectOptions" :options="options" :props="propOptions"
            clearable class="width30" @change="handleItemChange">
          </el-cascader>
        </el-form-item>
        <el-form-item :label="$t('page.menu.status')" prop="status">
          <el-radio-group v-model="menuForm.status">
            <el-radio :label="enable">{{ $t('page.common.enable') }}</el-radio>
            <el-radio :label="disable">{{ $t('page.common.disabled') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('page.menu.permissions')" prop="permissions">
          <el-input type="textarea" v-model.trim="menuForm.permissions" class="width36" rows="5" style="min-height: 120px;" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{ $t('page.common.cancelBtn') }}</el-button>
        <el-button type="primary" @click="submitForm('menuForm', dialogType)">{{ $t('page.common.confirmBtn') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { menuList, createMenu, menuDetail, updateMenu, deleteMenu, switchMenuStatus } from '@/api/menu'
import { isZh, parseTime } from '@/utils/index'
import refresh from '@/components/Refresh'
import defaultSettings from '@/settings'
const { enable, disable } = defaultSettings

export default {
    name: 'MenuTable',
    components: { refresh },
    inject: ['reload'],
    data() {
        return {
            tableData: [],
            loading: false,
            showZhMenu: isZh(this.$i18n.locale),
            dialogFormVisible: false,
            enable: enable,
            disable: disable,
            dialogType: '',
            formLabelWidth: '120px',
            title: '',
            menuForm: {
                menu_id: undefined,
                parent_id: 0,
                menu_name_zh: '',
                menu_name_en: '',
                menu_code: '',
                permissions: '',
                status: enable
            },
            queryParams: {
                idSort: 'asc'
            },
            rules: {
                menu_name_zh: [
                    { required: true, message: this.$t('page.menu.valid.menuNameZhRe'), trigger: 'blur' },
                    { min: 2, max: 64, message: this.$t('page.menu.valid.menuNameZhLen'), trigger: 'blur' }
                ],
                menu_name_en: [
                    { required: true, message: this.$t('page.menu.valid.menuNameEnRe'), trigger: 'blur' },
                    { min: 2, max: 64, message: this.$t('page.menu.valid.menuNameEnLen'), trigger: 'blur' }
                ]
            },
            options: [],
            selectOptions: [],
            propOptions: {
                checkStrictly: true,
                value: 'menu_id',
                label: isZh(this.$i18n.locale) ? 'menu_name_zh' : 'menu_name_en',
                children: 'children'
            }
        }
    },
    computed: {},
    created() {
        this.getMenuList()
    },
    methods: {
        sortChange(data) {
            const { order } = data
            if (order === 'descending') {
                this.queryParams.idSort = 'desc'
            } else {
                this.queryParams.idSort = 'asc'
            }
            this.getMenuList()
        },
        getMenuList() {
            this.loading = true
            menuList(this.queryParams).then(res => {
                this.tableData = res.data
                this.options = res.data
                setTimeout(() => {
                    this.loading = false
                }, 100)
            })
        },
        resetMenuForm() {
            this.menuForm = {
                menu_id: 0,
                parent_id: 0,
                menu_name_zh: '',
                menu_name_en: '',
                menu_code: '',
                permissions: '',
                status: enable
            }
        },
        handleCreate(val) {
            this.selectOptions = []
            this.dialogType = ''
            this.resetMenuForm()
            if (val) {
                this.menuForm.parent_id = val.menu_id
                if (val.parent_ids) this.selectOptions = this.selectOptions.concat(val.parent_ids)
                this.selectOptions.push(val.menu_id)
            }
            this.title = this.$t('page.menu.addMenu')
            this.dialogType = 'add'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['menuForm'].clearValidate()
            })
        },
        handleUpdate(val) {
            this.selectOptions = []
            this.dialogType = ''
            this.resetMenuForm()
            menuDetail(val.menu_id).then(res => {
                if (val) {
                    if (val.parent_ids) this.selectOptions = this.selectOptions.concat(val.parent_ids)
                    this.selectOptions.push(val.menu_id)
                }
                this.dialogType = 'edit'
                this.dialogFormVisible = true
                this.menuForm = res.data
                this.title = this.$t('page.common.editBtn')
                this.$nextTick(() => {
                    this.$refs['menuForm'].clearValidate()
                })
            })
        },
        closeDialog() {
            this.dialogFormVisible = false
            this.selectOptions = []
        },
        handleItemChange(val) {
            const node = this.$refs['cascader'].getCheckedNodes()
            if (typeof node[0]['data']['menu_id'] !== 'undefined') this.menuForm.parent_id = node[0]['data']['menu_id']
        },
        submitForm(formName, dialogType) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (dialogType === 'add')
                        createMenu(this.menuForm)
                            .then(res => {
                                const { code, msg } = res
                                if (code !== 0) {
                                    this.$message.error(msg)
                                }
                                this.getMenuList()
                                this.dialogFormVisible = false
                                this.$message({
                                    message: this.$t('message.common.createSuccess'),
                                    type: 'success'
                                })
                            })
                            .catch(err => {
                                this.$message.error(this.$t('page.menu.valid.addMenuError'))
                            })
                    else
                        updateMenu(this.menuForm)
                            .then(res => {
                                const { code, msg } = res
                                if (code !== 0) {
                                    this.$message.error(msg)
                                }
                                this.getMenuList()
                                this.dialogFormVisible = false
                                this.$message({
                                    message: this.$t('message.common.updateSuccess'),
                                    type: 'success'
                                })
                            })
                            .catch(err => {
                                this.$message.error(this.$t('page.menu.valid.editMenuError'))
                            })
                } else {
                    this.$message.error(
                        dialogType === 'add'
                            ? this.$t('page.menu.valid.addMenuError')
                            : this.$t('page.menu.valid.editMenuError')
                    )
                    return false
                }
            })
        },
        switchStatus($event, menu_id) {
            switchMenuStatus({ status: $event, menu_id: menu_id }).then(res => {
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
                    deleteMenu({ menu_id: val.menu_id })
                        .then(res => {
                            const { code, msg } = res
                            if (code !== 0) {
                                this.$message.error(msg)
                            }
                            this.getMenuList()
                            this.$message({
                                message: this.$t('message.common.deleteSuccess'),
                                type: 'success'
                            })
                        })
                        .catch(err => {
                            this.$message.error(this.$t('page.menu.valid.deleteMenuError'))
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
<style>
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
